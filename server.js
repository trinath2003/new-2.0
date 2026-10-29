<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SmartSkill Opportunity - Job Portal</title>
<style>
  :root {
    --bg: #0f172a;
    --card-bg: #1e293b;
    --border: #334155;
    --text: #f8fafc;
    --mute: #94a3b8;
    --primary: #3b82f6;
    --primary-hover: #2563eb;
    --ok: #22c55e;
    --bad: #ef4444;
  }
  * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
  body { margin: 0; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; }
  
  nav { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; background: var(--card-bg); border-bottom: 1px solid var(--border); }
  .logo { font-size: 1.15rem; font-weight: 500; letter-spacing: -0.5px; }
  .logo b { color: var(--primary); font-weight: 700; }
  .who { color: var(--mute); font-size: 0.9rem; margin-right: 12px; }
  
  .btn { background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
  .btn:hover { background: var(--primary-hover); }
  .btn.o { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn.o:hover { background: rgba(255,255,255,0.05); }
  
  .center { display: flex; justify-content: center; align-items: center; flex: 1; padding: 24px; }
  .box { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 32px; width: 100%; max-width: 440px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
  .box h2 { margin-top: 0; margin-bottom: 8px; }
  .sub { color: var(--mute); font-size: 0.95rem; margin-bottom: 24px; }
  
  .tabs { display: flex; background: var(--bg); border-radius: 6px; padding: 4px; margin-bottom: 20px; border: 1px solid var(--border); }
  .tabs button { flex: 1; background: transparent; border: none; color: var(--mute); padding: 8px; font-weight: 500; border-radius: 4px; cursor: pointer; }
  .tabs button.on { background: var(--card-bg); color: var(--text); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
  
  .f { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
  input, select { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; border-radius: 6px; font-size: 0.95krem; outline: none; width: 100%; }
  input:focus, select:focus { border-color: var(--primary); }
  
  .roles { display: flex; flex-direction: column; gap: 12px; }
  .role { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 16px; border-radius: 8px; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 4px; transition: border-color 0.2s; }
  .role:hover { border-color: var(--primary); }
  .role span { color: var(--mute); font-size: 0.85rem; }
  
  .layout { display: grid; grid-template-columns: 280px 1fr; gap: 24px; padding: 24px; max-width: 1300px; margin: 0 auto; width: 100%; flex: 1; }
  aside { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 20px; height: fit-content; display: flex; flex-direction: column; gap: 20px; }
  aside h4 { margin: 0 0 8px 0; font-size: 0.9rem; color: var(--mute); text-transform: uppercase; letter-spacing: 0.5px; }
  
  .opt { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; margin-bottom: 6px; color: var(--text); }
  .range { display: flex; align-items: center; gap: 8px; }
  .note { font-size: 0.8rem; color: var(--mute); margin-top: 4px; }
  
  .list { display: flex; flex-direction: column; gap: 12px; }
  .job { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 20px; display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; transition: border-color 0.2s; outline: none; }
  .job:hover, .job:focus { border-color: var(--primary); }
  .job h3 { margin: 0 0 6px 0; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; }
  
  .tag { background: rgba(59, 130, 246, 0.15); color: var(--primary); font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; font-weight: 500; }
  .meta { color: var(--mute); font-size: 0.9rem; margin-bottom: 12px; }
  
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { background: rgba(255, 255, 255, 0.08); font-size: 0.8rem; padding: 3px 8px; border-radius: 4px; color: var(--text); }
  .chip.m { opacity: 0.4; }
  
  .pct { display: flex; flex-direction: column; align-items: flex-end; min-width: 90px; }
  .pct b { font-size: 1.25rem; }
  .pct small { color: var(--mute); font-size: 0.75rem; }
  .applied { color: var(--ok); font-size: 0.8rem; margin-top: 6px; font-weight: 500; }
  
  .empty { text-align: center; color: var(--mute); padding: 40px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; }
  
  /* Sliding Drawer / Panels */
  .ov { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); z-index: 20; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
  .ov.on { opacity: 1; pointer-events: auto; }
  .slide { position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 500px; background: var(--card-bg); border-left: 1px solid var(--border); z-index: 21; padding: 32px; overflow-y: auto; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  .slide.on { transform: translateX(0); }
  .x { position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: var(--mute); font-size: 1.5rem; cursor: pointer; }
  
  .modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 30; max-width: 400px; }
  .toast { position: fixed; bottom: 24px; right: 24px; background: var(--ok); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: 600; z-index: 40; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: pop 0.3s ease; }
  @keyframes pop { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  
  .row { display: flex; gap: 12px; }
  .row > * { flex: 1; }
</style>
</head>
<body>

<div id="app" style="display:flex; flex-direction:column; flex:1;"></div>
<div id="layer"></div>

<script>
/* --- Dataset Generator (1,000 realistic roles spanning 14 departments) --- */
var DEPT_INFO = {
  "Software Development": { cat: "tech", roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer", "Java Developer", "Python Developer", "Node.js Developer", "React Developer"], sk: ["html", "css", "javascript", "react", "node.js", "express", "mysql", "git", "rest api", "java", "python", "typescript", "mongodb", "docker"] },
  "Data & AI": { cat: "tech", roles: ["Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Engineer", "BI Developer", "Data Engineer"], sk: ["python", "sql", "numpy", "pandas", "machine learning", "statistics", "tableau", "power bi", "deep learning", "git", "excel", "spark"] },
  "Testing & QA": { cat: "tech", roles: ["QA Engineer", "Automation Tester", "Test Analyst", "SDET", "Performance Tester"], sk: ["manual testing", "selenium", "jira", "test cases", "api testing", "postman", "java", "git", "sql", "cypress"] },
  "DevOps & Cloud": { cat: "tech", roles: ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Systems Administrator", "Cloud Architect"], sk: ["aws", "docker", "kubernetes", "linux", "git", "jenkins", "terraform", "ci/cd", "python", "networking", "azure"] },
  "Cyber Security": { cat: "tech", roles: ["Security Analyst", "Penetration Tester", "SOC Analyst", "Security Engineer"], sk: ["networking", "linux", "siem", "ethical hacking", "firewalls", "python", "risk analysis", "cryptography", "incident response"] },
  "UI/UX Design": { cat: "tech", roles: ["UI Designer", "UX Designer", "Product Designer", "Visual Designer"], sk: ["figma", "wireframing", "prototyping", "user research", "html", "css", "adobe xd", "design systems", "communication"] },
  "Human Resources": { cat: "non", roles: ["HR Executive", "Recruiter", "Talent Acquisition Specialist", "HR Business Partner", "Payroll Executive"], sk: ["communication", "recruitment", "excel", "interviewing", "onboarding", "payroll", "employee engagement", "labour law"] },
  "Sales": { cat: "non", roles: ["Sales Executive", "Business Development Executive", "Account Manager", "Inside Sales Representative", "Sales Manager"], sk: ["negotiation", "crm", "communication", "lead generation", "cold calling", "presentation", "leadership", "excel"] },
  "Marketing": { cat: "non", roles: ["Digital Marketing Executive", "SEO Specialist", "Social Media Manager", "Brand Manager", "Performance Marketer"], sk: ["seo", "google ads", "social media", "content strategy", "analytics", "communication", "email marketing", "excel"] },
  "Finance & Accounts": { cat: "non", roles: ["Accountant", "Financial Analyst", "Auditor", "Accounts Executive", "Tax Consultant"], sk: ["accounting", "tally", "excel", "budgeting", "gst", "compliance", "financial reporting", "auditing"] },
  "Operations": { cat: "non", roles: ["Operations Executive", "Supply Chain Coordinator", "Logistics Manager", "Project Coordinator", "Process Analyst"], sk: ["planning", "excel", "vendor management", "communication", "inventory", "leadership", "reporting", "problem solving"] },
  "Customer Support": { cat: "non", roles: ["Customer Support Executive", "Technical Support Associate", "Customer Success Manager", "Call Center Agent"], sk: ["communication", "crm", "problem solving", "typing", "empathy", "ticketing", "english", "excel"] },
  "Content & Writing": { cat: "non", roles: ["Content Writer", "Copywriter", "Technical Writer", "Editor", "Video Script Writer"], sk: ["writing", "seo", "research", "editing", "communication", "storytelling", "wordpress", "grammar"] },
  "Legal": { cat: "non", roles: ["Legal Associate", "Compliance Officer", "Contract Manager", "Corporate Lawyer"], sk: ["legal research", "contract drafting", "compliance", "communication", "negotiation", "corporate law", "documentation"] }
};
var DEPARTMENTS = Object.keys(DEPT_INFO);
var CITIES = ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi", "Chennai", "Kolkata", "Ahmedabad", "Noida", "Gurugram", "Remote"];

var jobs = (function(){
  var seed = 20260;
  function rnd(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function pick(a){ return a[Math.floor(rnd() * a.length)]; }
  function sample(a, n){ var c = a.slice(), o = []; while(o.length < n && c.length) o.push(c.splice(Math.floor(rnd() * c.length), 1)[0]); return o; }
  var pre = ["Tech", "Pixel", "Cloud", "Data", "Blue", "Nova", "Bright", "Quantum", "Swift", "Green", "Urban", "Apex", "Zen", "Orbit", "Maple", "Vertex"];
  var suf = ["Works", "Labs", "Soft", "Systems", "Hub", "Logic", "Bridge", "Minds", "Solutions", "Networks"];
  var out = [];
  for(var i = 1; i <= 1000; i++){
    var dept = pick(DEPARTMENTS), info = DEPT_INFO[dept], role = pick(info.roles);
    var min, max;
    if(rnd() < 0.25){ min = 0; max = pick([0, 0, 1, 2]); }
    else { min = 1 + Math.floor(Math.pow(rnd(), 1.6) * 20); max = Math.min(30, min + 2 + Math.floor(rnd() * 5)); }
    var type = "Full-time", r = rnd();
    if(min === 0 && r < 0.4){ type = "Internship"; max = 0; }
    else if(r > 0.92) type = "Contract"; else if(r > 0.85) type = "Part-time";
    var title = role;
    if(type === "Internship") title = role + " Intern";
    else if(!/Manager|Architect|Officer|Lawyer/.test(role)){ if(min >= 10) title = "Lead " + role; else if(min >= 5) title = "Senior " + role; }
    var base = (type === "Internship" ? 1 : 2.5 + min * 1.7) * (info.cat === "tech" ? 1.25 : 1) * (0.85 + rnd() * 0.3);
    var lo = Math.round(base * 10) / 10, hi = Math.round(lo * (type === "Internship" ? 2 : 1.4 + rnd() * 0.6) * 10) / 10;
    var sk = sample(info.sk, 4 + Math.floor(rnd() * 3)), co = pick(pre) + pick(suf), days = Math.floor(rnd() * 30);
    out.push({
      id: i, t: title, c: co, l: pick(CITIES), type: type, min: min, max: max,
      pay: "₹" + lo.toFixed(1) + " – " + hi.toFixed(1) + " LPA", cat: info.cat, dept: dept, sk: sk,
      mode: pick(["On-site", "Hybrid", "Remote"]), open: 1 + Math.floor(rnd() * 10),
      posted: days === 0 ? "Today" : days === 1 ? "1 day ago" : days + " days ago",
      d: "Work on " + sk[0] + " and " + sk[1] + " as a " + title + " in the " + dept + " team at " + co + ". You will collaborate with your team, hit project milestones, and drive impactful deliverables.", n: 0
    });
  }
  return out;
})();

/* --- Application State --- */
var S = {
  view: "auth", tab: "in", user: "", role: "",
  skills: ["html", "css", "javascript", "git", "node.js", "express", "mysql", "communication", "excel"],
  applied: {}, sel: null,
  f: { lvl: "all", from: 1, to: 30, cat: "all", dept: "all", q: "" }
};

var $ = function(i){ return document.getElementById(i); };
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function go(v){ S.view = v; S.sel = null; render(); }

function login(){
  var n = $("nm") ? $("nm").value.trim() : "";
  var e = $("em").value.trim();
  S.user = n || (e ? e.split("@")[0] : "Demo User");
  go("role");
}
function pickRole(r){ S.role = r; go(r === "seeker" ? "seeker" : "recruiter"); }
function logout(){ S.user = ""; S.role = ""; S.applied = {}; go("auth"); }
function switchRole(){ go("role"); }

function match(j){
  var have = j.sk.filter(function(s){ return S.skills.indexOf(s) > -1; }).length;
  return { p: Math.round(have / j.sk.length * 100), have: have };
}

function filtered(){
  var f = S.f, q = f.q.toLowerCase();
  return jobs.filter(function(j){
    if(f.cat !== "all" && j.cat !== f.cat) return false;
    if(f.dept !== "all" && j.dept !== f.dept) return false;
    if(f.lvl === "fresher" && j.min > 0) return false;
    if(f.lvl === "exp" && (j.max < f.from || j.min > f.to || j.max < 1)) return false;
    if(q && (j.t + " " + j.c + " " + j.dept + " " + j.sk.join(" ")).toLowerCase().indexOf(q) < 0) return false;
    return true;
  }).sort(function(a, b){ return match(b).p - match(a).p; });
}
function setF(k, v){ S.f[k] = v; render(); }

function nav(){
  return '<nav><div class="logo">Smart<b>Skill</b> Opportunity</div><span class="who">' + esc(S.user) + ' · ' + (S.role === "seeker" ? "Job Seeker" : "Recruiter") + '</span>'
  + '<div><button class="btn o" onclick="switchRole()" style="margin-right:8px">Switch role</button><button class="btn o" onclick="logout()">Logout</button></div></nav>';
}

function render(){
  var a = $("app"), h = "";
  if(S.view === "auth"){
    h = '<div class="center"><div class="box"><div class="logo" style="margin-bottom:14px">Smart<b>Skill</b> Opportunity</div>'
    + '<h2>' + (S.tab === "in" ? "Welcome back" : "Create your account") + '</h2><p class="sub">Get hired for what you can do, not just what you wrote.</p>'
    + '<div class="tabs"><button class="' + (S.tab === "in" ? "on" : "") + '" onclick="S.tab=\'in\';render()">Log in</button><button class="' + (S.tab === "up" ? "on" : "") + '" onclick="S.tab=\'up\';render()">Sign up</button></div>'
    + '<div class="f">' + (S.tab === "up" ? '<input id="nm" placeholder="Full name" aria-label="Full name">' : '')
    + '<input id="em" placeholder="Email (anything works)" aria-label="Email"><input id="pw" type="password" placeholder="Password (anything works)" aria-label="Password"></div>'
    + '<button class="btn" style="width:100%" onclick="login()">' + (S.tab === "in" ? "Log in" : "Sign up") + '</button>'
    + '<p class="note">Demo mode: no verification required. Any credentials work instantly.</p></div></div>';
  } else if(S.view === "role"){
    h = '<div class="center"><div class="box"><h2>Hi ' + esc(S.user) + ', who are you?</h2><p class="sub">Pick how you want to use SmartSkill.</p>'
    + '<div class="roles"><button class="role" onclick="pickRole(\'seeker\')">Job Seeker<span>Search through 1,000+ listings</span></button>'
    + '<button class="role" onclick="pickRole(\'recruiter\')">Recruiter<span>Post new jobs & track applicants</span></button></div></div></div>';
  } else if(S.view === "seeker"){
    h = nav() + '<div class="layout"><aside>'
    + '<div><h4>Search</h4><input id="q" value="' + esc(S.f.q) + '" placeholder="Title, company, or skill" oninput="S.f.q=this.value;list()"></div>'
    + '<div><h4>Department</h4><select onchange="setF(\'dept\',this.value)"><option value="all">All Departments</option>' + DEPARTMENTS.map(function(d){ return '<option value="' + d + '" ' + (S.f.dept === d ? 'selected' : '') + '>' + d + '</option>'; }).join('') + '</select></div>'
    + '<div><h4>Experience level</h4>'
    + [["all", "All"], ["fresher", "Fresher"], ["exp", "Experienced"]].map(function(o){ return '<label class="opt"><input type="radio" name="lvl" ' + (S.f.lvl === o[0] ? "checked" : "") + ' onchange="setF(\'lvl\',\'' + o[0] + '\')">' + o[1] + '</label>'; }).join("")
    + (S.f.lvl === "exp" ? '<div class="range" style="margin-top:8px"><input type="number" min="1" max="30" value="' + S.f.from + '" aria-label="From years" onchange="S.f.from=Math.max(1,Math.min(30,+this.value||1));render()"> to <input type="number" min="1" max="30" value="' + S.f.to + '" aria-label="To years" onchange="S.f.to=Math.max(1,Math.min(30,+this.value||30));render()"></div><div class="note">Years of experience</div>' : '')
    + '</div><div><h4>Job type</h4>'
    + [["all", "All"], ["tech", "Technical"], ["non", "Non-technical"]].map(function(o){ return '<label class="opt"><input type="radio" name="cat" ' + (S.f.cat === o[0] ? "checked" : "") + ' onchange="setF(\'cat\',\'' + o[0] + '\')">' + o[1] + '</label>'; }).join("")
    + '</div><div><h4>My skills</h4><input value="' + esc(S.skills.join(", ")) + '" onchange="S.skills=this.value.toLowerCase().split(\',\').map(function(s){return s.trim()}).filter(Boolean);render()"><div class="note">Comma-separated. Match score updates live.</div></div></aside>'
    + '<main><div id="jl" class="list"></div></main></div>';
  } else {
    h = nav() + '<div class="layout" style="grid-template-columns:1fr;max-width:760px"><div class="box" style="width:100%"><h2>Post a job</h2><p class="sub">Appears instantly for job seekers across the platform.</p>'
    + '<div class="f"><input id="pt" placeholder="Job title"><div class="row"><input id="pc" placeholder="Company"><input id="pl" placeholder="City"></div>'
    + '<div class="row"><input id="pmin" type="number" min="0" max="30" placeholder="Min years"><input id="pmax" type="number" min="0" max="30" placeholder="Max years"></div>'
    + '<select id="pcat"><option value="tech">Technical</option><option value="non">Non-technical</option></select>'
    + '<input id="psk" placeholder="Required skills, comma separated"><input id="pd" placeholder="Short description"></div>'
    + '<button class="btn" onclick="post()">Post job</button></div>'
    + '<h3 style="margin:22px 0 10px">Your posted jobs</h3><div class="list">'
    + jobs.filter(function(j){ return j.mine; }).map(function(j){ return '<div class="job" style="cursor:default"><div><h3>' + esc(j.t) + '</h3><div class="meta">' + esc(j.c) + ' · ' + esc(j.l) + '</div></div><div class="pct"><b>' + j.n + '</b><small>applicants</small></div></div>'; }).join("")
    + (jobs.some(function(j){ return j.mine; }) ? "" : '<div class="empty">You have not posted any jobs yet.</div>') + '</div></div>';
  }
  a.innerHTML = h;
  if(S.view === "seeker") list();
  panel();
}

function list(){
  var L = filtered(), el = $("jl"); if(!el) return;
  el.innerHTML = L.length ? L.slice(0, 50).map(function(j){
    var m = match(j), col = m.p >= 60 ? "var(--ok)" : m.p > 0 ? "var(--mute)" : "var(--bad)";
    return '<div class="job" tabindex="0" onclick="openJob(' + j.id + ')" onkeydown="if(event.key===\'Enter\')openJob(' + j.id + ')"><div><h3>' + esc(j.t) + '<span class="tag">' + (j.cat === "tech" ? "Technical" : "Non-tech") + '</span></h3>'
    + '<div class="meta">' + esc(j.c) + ' · ' + esc(j.l) + ' · ' + j.type + ' · ' + (j.max === 0 ? "Fresher" : j.min + "–" + j.max + " yrs") + ' · ' + j.pay + '</div>'
    + '<div class="chips">' + j.sk.map(function(s){ return '<span class="chip' + (S.skills.indexOf(s) > -1 ? "" : " m") + '">' + esc(s) + '</span>'; }).join("") + '</div></div>'
    + '<div class="pct"><b style="color:' + col + '">' + m.p + '%</b><small>match</small>' + (S.applied[j.id] ? '<div class="applied">Applied</div>' : '') + '</div></div>';
  }).join("") + (L.length > 50 ? '<div class="empty">Showing top 50 matches. Refine your query to narrow results.</div>' : '') : '<div class="empty">No jobs match these filters. Try widening your filters or search terms.</div>';
}

function openJob(id){ S.sel = id; panel(); }
function closeJob(){ S.sel = null; panel(); }
function panel(){
  var j = jobs.filter(function(x){ return x.id === S.sel; })[0], L = $("layer");
  if(!j){ L.innerHTML = '<div class="ov"></div><div class="slide"></div>'; return; }
  var m = match(j), miss = j.sk.filter(function(s){ return S.skills.indexOf(s) < 0; });
  L.innerHTML = '<div class="ov on" onclick="closeJob()"></div><div class="slide on" role="dialog" aria-label="Job details"><button class="x" onclick="closeJob()" aria-label="Close">×</button>'
  + '<h2 style="margin:0">' + esc(j.t) + '</h2><div class="meta">' + esc(j.c) + ' · ' + esc(j.l) + ' (' + j.mode + ')</div>'
  + '<div class="row" style="margin:16px 0"><div><b>Type</b><div class="meta">' + j.type + '</div></div><div><b>Experience</b><div class="meta">' + (j.max === 0 ? "Fresher" : j.min + "–" + j.max + " years") + '</div></div><div><b>Salary</b><div class="meta">' + j.pay + '</div></div></div>'
  + '<h4 style="margin:0 0 4px">About the role</h4><p style="margin-top:0">' + esc(j.d) + '</p>'
  + '<h4 style="margin:0 0 4px">Your match: ' + m.p + '%</h4><div class="chips" style="margin-top:4px">' + j.sk.map(function(s){ return '<span class="chip' + (S.skills.indexOf(s) > -1 ? "" : " m") + '">' + esc(s) + '</span>'; }).join("") + '</div>'
  + '<p class="note">' + (miss.length ? "Missing skills: " + esc(miss.join(", ")) : "You have every required skill!") + '</p>'
  + (S.applied[j.id] ? '<p class="applied">Applied with ' + esc(S.applied[j.id]) + '</p>' : '<button class="btn" style="width:100%;margin-top:14px" onclick="askResume()">Apply Now</button>')
  + '</div>';
}

function askResume(){
  var d = document.createElement("div"); d.id = "rm";
  d.innerHTML = '<div class="ov on" style="z-index:29"></div><div class="box modal"><h3 style="margin:0 0 4px">Upload your resume</h3><p class="sub">PDF or Word format accepted.</p>'
  + '<input id="rf" type="file" accept=".pdf,.doc,.docx" onchange="$(\'rok\').disabled=!this.files.length">'
  + '<div class="row" style="margin-top:16px"><button class="btn o" onclick="$(\'rm\').remove()">Cancel</button><button id="rok" class="btn" disabled onclick="submitApp()">Submit</button></div></div>';
  document.body.appendChild(d);
}

function submitApp(){
  var f = $("rf").files[0]; if(!f) return;
  var j = jobs.filter(function(x){ return x.id === S.sel; })[0];
  S.applied[j.id] = f.name; j.n++;
  $("rm").remove(); S.sel = null; panel(); list();
  var t = document.createElement("div"); t.className = "toast"; t.textContent = "Successfully applied to " + j.t; document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 2600);
}

function post(){
  var t = $("pt").value.trim(); if(!t){ $("pt").focus(); return; }
  jobs.unshift({
    id: Date.now(), t: t, c: $("pc").value || "Your company", l: $("pl").value || "Remote",
    type: "Full-time", min: +$("pmin").value || 0, max: +$("pmax").value || 0, pay: "Not disclosed",
    cat: $("pcat").value, dept: "Software Development", mode: "Remote",
    sk: $("psk").value.toLowerCase().split(",").map(function(s){ return s.trim(); }).filter(Boolean),
    d: $("pd").value || "No description added.", n: 0, mine: true
  });
  render();
}

render();
</script>
</body>
</html>
