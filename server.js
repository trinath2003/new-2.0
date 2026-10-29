const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SECRET = process.env.JWT_SECRET || 'dev-secret';
const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'smart_skill',
  port: +(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  waitForConnections: true, connectionLimit: 10
});

// ---------- helpers ----------
const norm = s => String(s || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
const auth = (role) => (req, res, next) => {
  try {
    const t = (req.headers.authorization || '').replace('Bearer ', '');
    req.user = jwt.verify(t, SECRET);
    if (role && req.user.role !== role) return res.status(403).json({ error: 'Not allowed' });
    next();
  } catch { res.status(401).json({ error: 'Login required' }); }
};
// The "smart" part: skill-match score + gap
function match(seekerSkills, jobSkills) {
  const have = new Set(norm(seekerSkills));
  const need = norm(jobSkills);
  if (!need.length) return { score: 0, matched: [], missing: [] };
  const matched = need.filter(s => have.has(s));
  const missing = need.filter(s => !have.has(s));
  return { score: Math.round(matched.length / need.length * 100), matched, missing };
}

// ---------- schema + seed ----------
async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(150) UNIQUE,
    password VARCHAR(100), role ENUM('seeker','employer'), skills TEXT, city VARCHAR(80),
    company VARCHAR(120), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS jobs(
    id INT AUTO_INCREMENT PRIMARY KEY, employer_id INT, title VARCHAR(150), company VARCHAR(120),
    city VARCHAR(80), job_type VARCHAR(30), salary_min INT, salary_max INT, exp_min INT DEFAULT 0,
    skills TEXT, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS applications(
    id INT AUTO_INCREMENT PRIMARY KEY, job_id INT, seeker_id INT, score INT,
    status VARCHAR(20) DEFAULT 'Applied', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq(job_id, seeker_id))`);
  const [[{ c }]] = await pool.query('SELECT COUNT(*) c FROM jobs');
  if (!c) {
    const seed = [
      ['Node.js Developer', 'TechNova', 'Hyderabad', 'Full-time', 600000, 1200000, 1, 'node.js,express,mysql,rest api,git', 'Build and maintain REST APIs.'],
      ['Frontend Developer', 'PixelWorks', 'Bengaluru', 'Full-time', 500000, 1000000, 1, 'html,css,javascript,react,git', 'Build responsive UIs.'],
      ['AI Intern', 'DataLeaf', 'Hyderabad', 'Internship', 120000, 240000, 0, 'python,machine learning,sql', 'Work on ML prototypes.'],
      ['QA Engineer', 'QualityFirst', 'Pune', 'Full-time', 400000, 800000, 2, 'manual testing,selenium,jira,test cases', 'Own test cycles.']
    ];
    for (const s of seed) await pool.query(
      'INSERT INTO jobs(title,company,city,job_type,salary_min,salary_max,exp_min,skills,description) VALUES(?,?,?,?,?,?,?,?,?)', s);
  }
}

// ---------- auth ----------
app.post('/api/register', async (req, res) => {
  const { name, email, password, role, skills, city, company } = req.body;
  if (!name || !email || !password || !['seeker', 'employer'].includes(role))
    return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users(name,email,password,role,skills,city,company) VALUES(?,?,?,?,?,?,?)',
      [name, email.toLowerCase(), hash, role, norm(skills).join(','), city || '', company || '']);
    const token = jwt.sign({ id: r.insertId, role, name }, SECRET, { expiresIn: '7d' });
    res.json({ token, role, name });
  } catch (e) {
    res.status(400).json({ error: e.code === 'ER_DUP_ENTRY' ? 'Email already registered' : 'Could not register' });
  }
});
app.post('/api/login', async (req, res) => {
  const [[u]] = await pool.query('SELECT * FROM users WHERE email=?', [(req.body.email || '').toLowerCase()]);
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password)))
    return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ token: jwt.sign({ id: u.id, role: u.role, name: u.name }, SECRET, { expiresIn: '7d' }), role: u.role, name: u.name });
});
app.get('/api/me', auth(), async (req, res) => {
  const [[u]] = await pool.query('SELECT id,name,email,role,skills,city,company FROM users WHERE id=?', [req.user.id]);
  res.json(u);
});
app.put('/api/me', auth(), async (req, res) => {
  const { skills, city, company } = req.body;
  await pool.query('UPDATE users SET skills=?, city=?, company=? WHERE id=?',
    [norm(skills).join(','), city || '', company || '', req.user.id]);
  res.json({ ok: true });
});

// ---------- jobs ----------
app.get('/api/jobs', async (req, res) => {
  const { q, city, type, skills } = req.query;
  let sql = 'SELECT * FROM jobs WHERE 1=1'; const p = [];
  if (q) { sql += ' AND (title LIKE ? OR company LIKE ? OR skills LIKE ?)'; p.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  if (city) { sql += ' AND city LIKE ?'; p.push(`%${city}%`); }
  if (type) { sql += ' AND job_type=?'; p.push(type); }
  sql += ' ORDER BY created_at DESC LIMIT 100';
  const [rows] = await pool.query(sql, p);
  let mine = skills || '';
  try { // logged-in seekers get matched against their saved profile
    const t = (req.headers.authorization || '').replace('Bearer ', '');
    const u = jwt.verify(t, SECRET);
    if (u.role === 'seeker' && !mine) {
      const [[s]] = await pool.query('SELECT skills FROM users WHERE id=?', [u.id]); mine = s.skills;
    }
  } catch {}
  const out = rows.map(j => ({ ...j, ...(mine ? { match: match(mine, j.skills) } : {}) }));
  if (mine) out.sort((a, b) => b.match.score - a.match.score);
  res.json(out);
});
app.post('/api/jobs', auth('employer'), async (req, res) => {
  const j = req.body;
  if (!j.title || !j.skills) return res.status(400).json({ error: 'Title and skills required' });
  const [[u]] = await pool.query('SELECT company FROM users WHERE id=?', [req.user.id]);
  const [r] = await pool.query(
    'INSERT INTO jobs(employer_id,title,company,city,job_type,salary_min,salary_max,exp_min,skills,description) VALUES(?,?,?,?,?,?,?,?,?,?)',
    [req.user.id, j.title, u.company || req.user.name, j.city || '', j.job_type || 'Full-time',
     +j.salary_min || 0, +j.salary_max || 0, +j.exp_min || 0, norm(j.skills).join(','), j.description || '']);
  res.json({ id: r.insertId });
});
app.get('/api/my-jobs', auth('employer'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id=j.id) applicants
     FROM jobs j WHERE employer_id=? ORDER BY created_at DESC`, [req.user.id]);
  res.json(rows);
});
app.get('/api/jobs/:id/applicants', auth('employer'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.id, a.score, a.status, u.name, u.email, u.skills, u.city
     FROM applications a JOIN users u ON u.id=a.seeker_id
     JOIN jobs j ON j.id=a.job_id WHERE a.job_id=? AND j.employer_id=? ORDER BY a.score DESC`,
    [req.params.id, req.user.id]);
  res.json(rows);
});
app.put('/api/applications/:id', auth('employer'), async (req, res) => {
  await pool.query(
    `UPDATE applications a JOIN jobs j ON j.id=a.job_id SET a.status=? WHERE a.id=? AND j.employer_id=?`,
    [req.body.status, req.params.id, req.user.id]);
  res.json({ ok: true });
});

// ---------- applications ----------
app.post('/api/jobs/:id/apply', auth('seeker'), async (req, res) => {
  const [[j]] = await pool.query('SELECT skills FROM jobs WHERE id=?', [req.params.id]);
  const [[u]] = await pool.query('SELECT skills FROM users WHERE id=?', [req.user.id]);
  if (!j) return res.status(404).json({ error: 'Job not found' });
  try {
    await pool.query('INSERT INTO applications(job_id,seeker_id,score) VALUES(?,?,?)',
      [req.params.id, req.user.id, match(u.skills, j.skills).score]);
    res.json({ ok: true });
  } catch { res.status(400).json({ error: 'Already applied' }); }
});
app.get('/api/my-applications', auth('seeker'), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.status, a.score, a.created_at, j.title, j.company, j.city
     FROM applications a JOIN jobs j ON j.id=a.job_id WHERE a.seeker_id=? ORDER BY a.created_at DESC`, [req.user.id]);
  res.json(rows);
});

init().then(() => app.listen(process.env.PORT || 3000, () => console.log('Smart Skill Opportunity running')))
  .catch(e => { console.error('DB init failed:', e.message); process.exit(1); });
