
var jobs=[
{id:1,t:"Frontend Developer",c:"PixelWorks",l:"Bengaluru",type:"Full-time",min:1,max:3,pay:"₹5.0 – 10.0 LPA",cat:"tech",sk:["html","css","javascript","git","react"],d:"Build responsive user interfaces and work with designers on a fast-moving product.",n:0},
{id:2,t:"Node.js Developer",c:"TechNova",l:"Hyderabad",type:"Full-time",min:1,max:5,pay:"₹6.0 – 12.0 LPA",cat:"tech",sk:["node.js","express","mysql","git","rest api"],d:"Build and maintain REST APIs that power our mobile and web apps.",n:0},
{id:3,t:"QA Engineer",c:"QualityFirst",l:"Pune",type:"Full-time",min:2,max:6,pay:"₹4.0 – 8.0 LPA",cat:"tech",sk:["manual testing","selenium","jira","test cases"],d:"Own test cycles from planning to release sign-off.",n:0},
{id:4,t:"AI Intern",c:"DataLeaf",l:"Hyderabad",type:"Internship",min:0,max:0,pay:"₹1.2 – 2.4 LPA",cat:"tech",sk:["python","numpy","machine learning","git"],d:"Help our data team clean datasets and train small models.",n:0},
{id:5,t:"Software Architect",c:"CloudBridge",l:"Bengaluru",type:"Full-time",min:12,max:20,pay:"₹35 – 55 LPA",cat:"tech",sk:["java","aws","system design","microservices","docker"],d:"Define architecture for large distributed systems and mentor senior engineers.",n:0},
{id:6,t:"HR Executive",c:"PeopleFirst",l:"Mumbai",type:"Full-time",min:0,max:2,pay:"₹3.0 – 5.0 LPA",cat:"non",sk:["communication","recruitment","excel","interviewing"],d:"Handle campus hiring, screening calls and onboarding of new joiners.",n:0},
{id:7,t:"Sales Manager",c:"MarketMint",l:"Delhi",type:"Full-time",min:5,max:10,pay:"₹10 – 18 LPA",cat:"non",sk:["negotiation","crm","communication","leadership"],d:"Lead a regional sales team and own the quarterly revenue target.",n:0},
{id:8,t:"Content Writer",c:"WordCraft",l:"Remote",type:"Full-time",min:0,max:3,pay:"₹3.0 – 6.0 LPA",cat:"non",sk:["writing","seo","research","communication"],d:"Write blogs, product pages and email campaigns for B2B clients.",n:0},
{id:9,t:"Finance Head",c:"LedgerLine",l:"Chennai",type:"Full-time",min:15,max:30,pay:"₹40 – 70 LPA",cat:"non",sk:["accounting","budgeting","excel","leadership","compliance"],d:"Run the finance function, audits and long-term financial planning.",n:0},
{id:10,t:"Full Stack Developer",c:"StackHouse",l:"Hyderabad",type:"Full-time",min:3,max:8,pay:"₹12 – 22 LPA",cat:"tech",sk:["react","node.js","mysql","git","docker"],d:"Ship features end to end across React front ends and Node services.",n:0}
];
var S={view:"auth",tab:"in",user:"",role:"",skills:["html","css","javascript","git","node.js","express","mysql","communication","excel"],applied:{},sel:null,
f:{lvl:"all",from:1,to:30,cat:"all",q:""}};
var $=function(i){return document.getElementById(i)};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function go(v){S.view=v;S.sel=null;render()}
 
function login(){
  var n=$("nm")?$("nm").value.trim():"";var e=$("em").value.trim();
  S.user=n||(e?e.split("@")[0]:"Demo User");
  go("role");
}
function pickRole(r){S.role=r;go(r==="seeker"?"seeker":"recruiter")}
function logout(){S.user="";S.role="";S.applied={};go("auth")}
function switchRole(){go("role")}
 
function match(j){
  var have=j.sk.filter(function(s){return S.skills.indexOf(s)>-1}).length;
  return {p:Math.round(have/j.sk.length*100),have:have}
}
function filtered(){
  var f=S.f,q=f.q.toLowerCase();
  return jobs.filter(function(j){
    if(f.cat!=="all"&&j.cat!==f.cat)return false;
    if(f.lvl==="fresher"&&j.min>0)return false;
    if(f.lvl==="exp"&&(j.max<f.from||j.min>f.to||j.max<1))return false;
    if(q&&(j.t+" "+j.c+" "+j.sk.join(" ")).toLowerCase().indexOf(q)<0)return false;
    return true;
  }).sort(function(a,b){return match(b).p-match(a).p});
}
function setF(k,v){S.f[k]=v;render()}
 
function nav(){
  return '<nav><div class="logo">Smart<b>Skill</b> Opportunity</div><span class="who">'+esc(S.user)+' · '+(S.role==="seeker"?"Job Seeker":"Recruiter")+'</span>'
  +'<button class="btn o" onclick="switchRole()">Switch role</button><button class="btn" onclick="logout()">Logout</button></nav>';
}
 
function render(){
  var a=$("app"),h="";
  if(S.view==="auth"){
    h='<div class="center"><div class="box"><div class="logo" style="margin-bottom:14px">Smart<b>Skill</b> Opportunity</div>'
    +'<h2>'+(S.tab==="in"?"Welcome back":"Create your account")+'</h2><p class="sub">Get hired for what you can do, not just what you wrote.</p>'
    +'<div class="tabs"><button class="'+(S.tab==="in"?"on":"")+'" onclick="S.tab=\'in\';render()">Log in</button><button class="'+(S.tab==="up"?"on":"")+'" onclick="S.tab=\'up\';render()">Sign up</button></div>'
    +'<div class="f">'+(S.tab==="up"?'<input id="nm" placeholder="Full name" aria-label="Full name">':'')
    +'<input id="em" placeholder="Email (anything works)" aria-label="Email"><input id="pw" type="password" placeholder="Password (anything works)" aria-label="Password"></div>'
    +'<button class="btn" style="width:100%" onclick="login()">'+(S.tab==="in"?"Log in":"Sign up")+'</button>'
    +'<p class="note">Demo mode: no verification. Any email and password will work, even empty.</p></div></div>';
  }else if(S.view==="role"){
    h='<div class="center"><div class="box"><h2>Hi '+esc(S.user)+', who are you?</h2><p class="sub">Pick how you want to use SmartSkill.</p>'
    +'<div class="roles"><button class="role" onclick="pickRole(\'seeker\')">Job Seeker<span>Find and apply to jobs</span></button>'
    +'<button class="role" onclick="pickRole(\'recruiter\')">Recruiter<span>Post jobs, get applicants</span></button></div></div></div>';
  }else if(S.view==="seeker"){
    var L=filtered();
    h=nav()+'<div class="layout"><aside>'
    +'<div><h4>Search</h4><input id="q" value="'+esc(S.f.q)+'" placeholder="Title, company or skill" oninput="S.f.q=this.value;list()"></div>'
    +'<div><h4>Experience level</h4>'
    +[["all","All"],["fresher","Fresher"],["exp","Experienced"]].map(function(o){return '<label class="opt"><input type="radio" name="lvl" '+(S.f.lvl===o[0]?"checked":"")+' onchange="setF(\'lvl\',\''+o[0]+'\')">'+o[1]+'</label>'}).join("")
    +(S.f.lvl==="exp"?'<div class="range" style="margin-top:8px"><input type="number" min="1" max="30" value="'+S.f.from+'" aria-label="From years" onchange="S.f.from=Math.max(1,Math.min(30,+this.value||1));render()"> to <input type="number" min="1" max="30" value="'+S.f.to+'" aria-label="To years" onchange="S.f.to=Math.max(1,Math.min(30,+this.value||30));render()"></div><div class="note">Years of experience (1 to 30)</div>':'')
    +'</div><div><h4>Job type</h4>'
    +[["all","All"],["tech","Technical"],["non","Non-technical"]].map(function(o){return '<label class="opt"><input type="radio" name="cat" '+(S.f.cat===o[0]?"checked":"")+' onchange="setF(\'cat\',\''+o[0]+'\')">'+o[1]+'</label>'}).join("")
    +'</div><div><h4>My skills</h4><input value="'+esc(S.skills.join(", "))+'" onchange="S.skills=this.value.toLowerCase().split(\',\').map(function(s){return s.trim()}).filter(Boolean);render()"><div class="note">Comma separated. Match % updates instantly.</div></div></aside>'
    +'<main><div id="jl" class="list"></div></main></div>';
  }else{
    h=nav()+'<div class="layout" style="grid-template-columns:1fr;max-width:760px"><div class="box" style="width:100%"><h2>Post a job</h2><p class="sub">It appears for job seekers right away.</p>'
    +'<div class="f"><input id="pt" placeholder="Job title"><div class="row"><input id="pc" placeholder="Company"><input id="pl" placeholder="City"></div>'
    +'<div class="row"><input id="pmin" type="number" min="0" max="30" placeholder="Min years"><input id="pmax" type="number" min="0" max="30" placeholder="Max years"></div>'
    +'<select id="pcat"><option value="tech">Technical</option><option value="non">Non-technical</option></select>'
    +'<input id="psk" placeholder="Required skills, comma separated"><input id="pd" placeholder="Short description"></div>'
    +'<button class="btn" onclick="post()">Post job</button></div>'
    +'<h3 style="margin:22px 0 10px">Your jobs and applicants</h3><div class="list">'
    +jobs.filter(function(j){return j.mine}).map(function(j){return '<div class="job" style="cursor:default"><div><h3>'+esc(j.t)+'</h3><div class="meta">'+esc(j.c)+' · '+esc(j.l)+'</div></div><div class="pct"><b>'+j.n+'</b><small>applicants</small></div></div>'}).join("")
    +(jobs.some(function(j){return j.mine})?"":'<div class="empty">You have not posted any jobs yet.</div>')+'</div></div>';
  }
  a.innerHTML=h;
  if(S.view==="seeker")list();
  panel();
}
 
function list(){
  var L=filtered(),el=$("jl");if(!el)return;
  el.innerHTML=L.length?L.map(function(j){
    var m=match(j),col=m.p>=60?"var(--ok)":m.p>0?"var(--mute)":"var(--bad)";
    return '<div class="job" tabindex="0" onclick="openJob('+j.id+')" onkeydown="if(event.key===\'Enter\')openJob('+j.id+')"><div><h3>'+esc(j.t)+'<span class="tag">'+(j.cat==="tech"?"Technical":"Non-technical")+'</span></h3>'
    +'<div class="meta">'+esc(j.c)+' · '+esc(j.l)+' · '+j.type+' · '+(j.max===0?"Fresher":j.min+"–"+j.max+" yrs")+' · '+j.pay+'</div>'
    +'<div class="chips">'+j.sk.map(function(s){return '<span class="chip'+(S.skills.indexOf(s)>-1?"":" m")+'">'+esc(s)+'</span>'}).join("")+'</div></div>'
    +'<div class="pct"><b style="color:'+col+'">'+m.p+'%</b><small>skill match</small>'+(S.applied[j.id]?'<div class="applied">Applied</div>':'')+'</div></div>';
  }).join(""):'<div class="empty">No jobs match these filters. Try widening the experience range.</div>';
}
 
function openJob(id){S.sel=id;panel()}
function closeJob(){S.sel=null;panel()}
function panel(){
  var j=jobs.filter(function(x){return x.id===S.sel})[0],L=$("layer");
  if(!j){L.innerHTML='<div class="ov"></div><div class="slide"></div>';return}
  var m=match(j),miss=j.sk.filter(function(s){return S.skills.indexOf(s)<0});
  L.innerHTML='<div class="ov on" onclick="closeJob()"></div><div class="slide on" role="dialog" aria-label="Job details"><button class="x" onclick="closeJob()" aria-label="Close">×</button>'
  +'<h2 style="margin:0">'+esc(j.t)+'</h2><div class="meta">'+esc(j.c)+' · '+esc(j.l)+'</div>'
  +'<div class="row" style="margin:16px 0"><div><b>Type</b><div class="meta">'+j.type+'</div></div><div><b>Experience</b><div class="meta">'+(j.max===0?"Fresher":j.min+"–"+j.max+" years")+'</div></div><div><b>Salary</b><div class="meta">'+j.pay+'</div></div></div>'
  +'<h4 style="margin:0 0 4px">About the role</h4><p style="margin-top:0">'+esc(j.d)+'</p>'
  +'<h4 style="margin:0 0 4px">Your match: '+m.p+'%</h4><div class="chips" style="margin-top:4px">'+j.sk.map(function(s){return '<span class="chip'+(S.skills.indexOf(s)>-1?"":" m")+'">'+esc(s)+'</span>'}).join("")+'</div>'
  +'<p class="note">'+(miss.length?"Missing: "+esc(miss.join(", ")):"You have every required skill.")+'</p>'
  +(S.applied[j.id]?'<p class="applied">You applied with '+esc(S.applied[j.id])+'</p>':'<button class="btn" style="width:100%;margin-top:14px" onclick="askResume()">Apply</button>')
  +'</div>';
}
 
function askResume(){
  var d=document.createElement("div");d.id="rm";
  d.innerHTML='<div class="ov on" style="z-index:29"></div><div class="box modal"><h3 style="margin:0 0 4px">Upload your resume</h3><p class="sub">PDF or Word file.</p>'
  +'<input id="rf" type="file" accept=".pdf,.doc,.docx" onchange="$(\'rok\').disabled=!this.files.length">'
  +'<div class="row" style="margin-top:16px"><button class="btn o" onclick="$(\'rm\').remove()">Cancel</button><button id="rok" class="btn" disabled onclick="submitApp()">OK</button></div></div>';
  document.body.appendChild(d);
}
function submitApp(){
  var f=$("rf").files[0];if(!f)return;
  var j=jobs.filter(function(x){return x.id===S.sel})[0];
  S.applied[j.id]=f.name;j.n++;
  $("rm").remove();S.sel=null;panel();list();
  var t=document.createElement("div");t.className="toast";t.textContent="Applied to "+j.t;document.body.appendChild(t);
  setTimeout(function(){t.remove()},2600);
}
function post(){
  var t=$("pt").value.trim();if(!t){$("pt").focus();return}
  jobs.unshift({id:Date.now(),t:t,c:$("pc").value||"Your company",l:$("pl").value||"Remote",type:"Full-time",min:+$("pmin").value||0,max:+$("pmax").value||0,pay:"Not disclosed",cat:$("pcat").value,
    sk:$("psk").value.toLowerCase().split(",").map(function(s){return s.trim()}).filter(Boolean),d:$("pd").value||"No description added.",n:0,mine:true});
  render();
}
render();
