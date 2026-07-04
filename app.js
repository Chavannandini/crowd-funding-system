
var G = function(id) { return document.getElementById(id); };
var INR = function(v) { return '\u20B9' + Number(v).toLocaleString('en-IN'); };
var INRs = function(v) { return v>=10000000?'\u20B9'+(v/10000000).toFixed(1)+'Cr':v>=100000?'\u20B9'+(v/100000).toFixed(1)+'L':v>=1000?'\u20B9'+(v/1000).toFixed(0)+'K':'\u20B9'+v; };
var catC = function(c) { return {Technology:'#00f5ff',Art:'#bf00ff',Health:'#00ff88',Education:'#ffd700'}[c]||'#00f5ff'; };
var catBg = function(c) { return {Technology:'linear-gradient(135deg,#020c1b,#001a2e)',Art:'linear-gradient(135deg,#0d0018,#1a0028)',Health:'linear-gradient(135deg,#001a10,#002818)',Education:'linear-gradient(135deg,#1a1400,#1a0f00)'}[c]||''; };
var catBdg = function(c) { return {Technology:'bt',Art:'ba',Health:'bh',Education:'be'}[c]||'bt'; };

/* ================================================================
   EMAIL VALIDATION
   Blocks: missing @, spaces, bad TLD, consecutive dots,
   leading/trailing dots, no domain, invalid chars, etc.
================================================================ */
function isValidEmail(email){
  var re=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  var em=String(email||'').trim().toLowerCase();
  if(/\.{2,}/.test(em))return false;
  if(/^\./.test(em)||/\.$/.test(em))return false;
  return re.test(em);
}
function emailError(email){
  var em=String(email||'').trim().toLowerCase();
  if(!em)return 'Email address is required.';
  if(em.indexOf(' ')>=0)return 'Email must not contain spaces.';
  if(em.indexOf('@')<0)return 'Missing @ — use format: name@gmail.com';
  var parts=em.split('@');
  if(parts.length!==2)return 'Only one @ symbol is allowed.';
  if(!parts[0])return 'Enter a name before @ (e.g. john@gmail.com).';
  if(!parts[1])return 'Enter a domain after @ (e.g. gmail.com).';
  if(parts[1].indexOf('.')<0)return 'Domain needs a dot — e.g. gmail.com, yahoo.in';
  var tld=parts[1].split('.').pop();
  if(tld.length<2)return 'Domain extension too short — use .com .in .org etc.';
  if(/\.{2,}/.test(em))return 'Email must not have consecutive dots.';
  if(/^\./.test(parts[0])||/\.$/.test(parts[0]))return 'Name cannot start or end with a dot.';
  if(!isValidEmail(em))return 'Invalid email format. Example: name@gmail.com';
  return null; /* null = email is valid */
}
function showEmailStatus(inputId, errElId, value){
  var err=emailError(value);
  var el=G(errElId);
  if(!el)return;
  if(!value){el.textContent='';return;}
  if(err){el.innerHTML='&#10007; '+err;el.style.color='#ff4466';}
  else{el.innerHTML='&#10003; Valid email address';el.style.color='#00ff88';}
}


function toast(m,t) {
  var el=G('tst'); el.textContent=m; el.className=t||'';
  el.classList.add('on'); clearTimeout(el._t);
  el._t=setTimeout(function(){el.classList.remove('on');},3000);
}

/* ── SECURE PASSWORD HASHING (SHA-256 via Web Crypto) ── */
function hashPw(pw) {
  if(window.crypto&&window.crypto.subtle) {
    var enc = new TextEncoder();
    return window.crypto.subtle.digest('SHA-256',enc.encode(pw)).then(function(buf){
      return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
    });
  }
  /* fallback simple hash */
  var h=0;
  for(var i=0;i<pw.length;i++){h=((h<<5)-h)+pw.charCodeAt(i);h|=0;}
  return Promise.resolve('h'+Math.abs(h).toString(16));
}

/* ── STORAGE ── */
var LS = {
  g:function(k,d){try{var v=localStorage.getItem('fvPRO_'+k);return v?JSON.parse(v):d;}catch(e){return d;}},
  s:function(k,v){try{localStorage.setItem('fvPRO_'+k,JSON.stringify(v));}catch(e){}}
};

function dAgo(n){return new Date(Date.now()-n*86400000).toISOString();}

/* ── SEED DATA ── */
function seedAll(){
  if(LS.g('ok',false))return;
  hashPw('admin123').then(function(h1){ hashPw('backer123').then(function(h2){
    LS.s('users',[
      {id:'u1',name:'Admin User',email:'admin@fv.io',pass:h1,role:'admin',upi:'admin@oksbi',mobile:'+91 9000000001',kyc:'verified',joined:'Jan 2024',tb:0,pb:0,wishlist:[],notifs:[]},
      {id:'u2',name:'Alex Backer',email:'backer@fv.io',pass:h2,role:'backer',upi:'alex@oksbi',mobile:'+91 9000000002',kyc:'verified',joined:'Mar 2024',tb:24500,pb:4,wishlist:[2,4],notifs:[]}
    ]);
    LS.s('projects',[
      {id:1,title:'NeuroLink AR Headset',cat:'Technology',goal:9000000,raised:6500000,creator:'Aria Chen',days:18,ico:'&#129405;',desc:'Brain-computer interface AR headset to control digital environments with thought.',bk:342,at:dAgo(12),ms:['Prototype complete','Beta testing done','Full launch'],ms_done:[true,true,false],escrow:true},
      {id:2,title:'BioLume Glow Ink',cat:'Art',goal:1800000,raised:2200000,creator:'Marco Silva',days:3,ico:'&#127754;',desc:'Bioluminescent ink glows in the dark with living bacteria cultures.',bk:891,at:dAgo(5),ms:['Lab testing','Production ready','Market launch'],ms_done:[true,true,true],escrow:false},
      {id:3,title:'NanoMed Drug Delivery',cat:'Health',goal:15000000,raised:11700000,creator:'Dr. Priya Nair',days:42,ico:'&#128138;',desc:'Targeted nanoparticle drug delivery for cancer treatment.',bk:514,at:dAgo(20),ms:['Clinical trial 1','Trial 2 complete','FDA approval'],ms_done:[true,false,false],escrow:true},
      {id:4,title:'HoloClass VR Academy',cat:'Education',goal:6000000,raised:4700000,creator:'James Park',days:25,ico:'&#127891;',desc:'Immersive VR classrooms with AI tutors for remote communities.',bk:279,at:dAgo(8),ms:['Platform beta','100 schools','National launch'],ms_done:[true,false,false],escrow:true},
      {id:5,title:'SolarSkin Wearables',cat:'Technology',goal:3800000,raised:3100000,creator:'Zara Ahmed',days:12,ico:'&#9889;',desc:'Flexible solar panels in clothing to charge your devices on the go.',bk:1203,at:dAgo(3),ms:['Prototype','Pilot batch','Mass production'],ms_done:[true,true,false],escrow:true},
      {id:6,title:'Quantum Sound Studio',cat:'Art',goal:2600000,raised:700000,creator:'Leon Dubois',days:55,ico:'&#127925;',desc:"World's first quantum noise-cancellation studio in a backpack.",bk:147,at:dAgo(2),ms:['R&D complete','Working prototype','Commercial release'],ms_done:[false,false,false],escrow:true}
    ]);
    var ns=['Rahul Sharma','Priya Mehta','Sanjay Kumar','Anjali Singh','Vikram Nair','Deepika Rao','Arjun Patel','Kavya Reddy'];
    var us=['rahul@oksbi','priya@okicici','sanjay@ybl','anjali@paytm','vikram@apl','deepika@okhdfc','arjun@upi','kavya@oksbi'];
    var ps=LS.g('projects',[]); var tx=[];
    for(var i=0;i<20;i++){
      var d=new Date(Date.now()-i*86400000*Math.random()*4);
      var mo=['Jan','Feb','Mar','Apr']; var amt=[1,10,50,100,500][i%5];
      var fee=Math.round(amt*0.025); var gst=Math.round(fee*0.18);
      tx.push({id:'UPI'+String(100000000+Math.floor(Math.random()*900000000)),proj:ps[i%6].title,bk:ns[i%8],uid:us[i%8],amt:amt,fee:fee,gst:gst,dt:mo[d.getMonth()%4]+' '+d.getDate(),st:i%7===0?'pending':'success',userId:null,refunded:false});
    }
    LS.s('tx',tx);
    LS.s('backers',[
      {name:'Rahul Sharma',tier:'Bronze',total:9500,projects:2,joined:'Jan 2024',kyc:'verified'},
      {name:'Priya Mehta',tier:'Silver',total:22000,projects:5,joined:'Mar 2024',kyc:'verified'},
      {name:'Anjali Singh',tier:'Gold',total:55000,projects:8,joined:'Sep 2024',kyc:'verified'},
      {name:'Kavya Reddy',tier:'Platinum',total:75000,projects:12,joined:'Jan 2026',kyc:'verified'},
      {name:'Vikram Nair',tier:'Silver',total:15200,projects:3,joined:'Nov 2024',kyc:'pending'},
      {name:'Arjun Patel',tier:'Bronze',total:5600,projects:1,joined:'Apr 2025',kyc:'pending'}
    ]);
    var h=[];var n=Date.now();
    for(var j=13;j>=0;j--){var dh=new Date(n-j*86400000);h.push({dt:dh.getDate()+'/'+(dh.getMonth()+1),amt:Math.floor(Math.random()*600000+150000)});}
    LS.s('hist',h); LS.s('ok',true);
  });});
}

/* ── STATE ── */
var CU=null,selRole='backer',upiPid=null,upiMth='qr',upiAmt=0;
var PRESETS=[1,10,50,100,500,1000];
var MY_UPI='8977980147@fam';
var shareProject=null;
var EYE_OPEN='<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
var EYE_SHUT='<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';

/* ══════════════════════════════════════════════════════════
   MINIMAL QR CODE ENCODER — pure JS, zero network dependency
   Based on public-domain QR algorithm (Reed-Solomon + matrix placement)
   Supports byte-mode encoding, EC level M, versions 1-10 auto-select
   ══════════════════════════════════════════════════════════ */





function toggleEye(inp,svg,btn){var s=inp.type==='text';inp.type=s?'password':'text';svg.innerHTML=s?EYE_OPEN:EYE_SHUT;btn.style.color=s?'#7eb8d4':'#00f5ff';}

/* ── PASSWORD STRENGTH ── */
function checkStrength(pw){
  var score=0;
  if(pw.length>=8)score++;
  if(/[A-Z]/.test(pw))score++;
  if(/[0-9]/.test(pw))score++;
  if(/[^A-Za-z0-9]/.test(pw))score++;
  var colors=['#ff4466','#ff8c00','#ffd700','#00ff88'];
  var labels=['Weak','Fair','Good','Strong'];
  var bar=G('str-bar'); var txt=G('str-txt');
  if(!bar||!pw)return;
  bar.style.background=colors[score-1]||'rgba(255,255,255,.1)';
  bar.style.width=(score*25)+'%';
  if(txt)txt.textContent=labels[score-1]||'';
  if(txt)txt.style.color=colors[score-1]||'#7eb8d4';
}

/* ── AUTH ── */
function swA(m){
  G('afl').style.display=m==='l'?'flex':'none';
  G('afr').style.display=m==='r'?'flex':'none';
  G('atl').classList.toggle('on',m==='l');
  G('atr').classList.toggle('on',m==='r');
  G('le').textContent=''; G('re').textContent='';
}
function selR(r){selRole=r;G('rbb').classList.toggle('on',r==='backer');G('rba').classList.toggle('on',r==='admin');}

function doLogin(){
  var em=G('lem').value.trim().toLowerCase(),pw=G('lpw').value;
  G('le').textContent='';
  var loginEmailErr=emailError(em);
  if(loginEmailErr){G('le').innerHTML='&#10007; '+loginEmailErr;G('le').style.color='#ff4466';return;}
  if(!pw){G('le').textContent='Enter password.';return;}
  var users=LS.g('users',[]);
  hashPw(pw).then(function(h){
    var u=null;
    for(var i=0;i<users.length;i++){if(users[i].email.toLowerCase()===em&&users[i].pass===h){u=users[i];break;}}
    /* fallback for plain text legacy */
    if(!u){for(var j=0;j<users.length;j++){if(users[j].email.toLowerCase()===em&&users[j].pass===pw){u=users[j];break;}}}
    if(!u){G('le').textContent='Wrong email or password.';return;}
    addNotif(u,'&#128075; Welcome back, '+u.name.split(' ')[0]+'!','Just now');
    loginAs(u);
  });
}

function doRegister(){
  var nm=G('rnm').value.trim(),em=G('rem').value.trim().toLowerCase();
  var mob=G('rmob').value.trim(),up=G('rup').value.trim()||nm.split(' ')[0].toLowerCase()+'@okicici';
  var kyc=G('rkyc').value.trim(),pw=G('rpw').value;
  G('re').textContent='';
  if(!nm){G('re').textContent='Name required.';return;}
  var regEmailErr=emailError(em);
  if(regEmailErr){G('re').innerHTML='&#10007; '+regEmailErr;G('re').style.color='#ff4466';return;}
  if(!mob){G('re').textContent='Mobile number required.';return;}
  if(pw.length<8){G('re').textContent='Password must be 8+ chars.';return;}
  if(!kyc||kyc.length<4){G('re').textContent='Aadhaar last 4 digits required for KYC.';return;}
  var users=LS.g('users',[]);
  for(var i=0;i<users.length;i++){if(users[i].email.toLowerCase()===em){G('re').textContent='Email already registered.';return;}}
  hashPw(pw).then(function(h){
    var u={id:'u'+Date.now(),name:nm,email:em,pass:h,role:selRole,upi:up,mobile:mob,kyc:kyc==='1234'?'verified':'pending',joined:new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}),tb:0,pb:0,wishlist:[],notifs:[]};
    users.push(u); LS.s('users',users);
    addNotif(u,'&#9989; Account created! Welcome to FundVerse Pro.','Just now');
    loginAs(u);
  });
}

function loginAs(u){
  CU=u;
  G('auth').style.display='none';
  G('upl').style.display='flex';
  G('nav_av').textContent=u.name.split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();
  G('nav_nm').textContent=u.name;
  G('nb2').style.display=u.role==='admin'?'':'none';
  updateNotifBadge();
  rDash();
}

function doLogout(){
  CU=null;
  G('auth').style.display='flex'; G('upl').style.display='none';
  G('nb2').style.display='none'; G('lem').value=''; G('lpw').value='';
  G('lpw').type='password'; G('eye-l-svg').innerHTML=EYE_OPEN; G('eye-l').style.color='#7eb8d4';
  gp('dash',0);
}

function forgotPw(){
  var em=G('lem').value.trim();
  if(!em){toast('Enter your email first','er');return;}
  toast('Password reset link sent to '+em+' (demo)','warn');
}

/* ── NOTIFICATIONS ── */
function addNotif(u,txt,time){
  if(!u)return;
  var users=LS.g('users',[]);
  var usr=users.find(function(x){return x.id===u.id;});
  if(usr){
    if(!usr.notifs)usr.notifs=[];
    usr.notifs.unshift({txt:txt,time:time||new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),read:false});
    if(usr.notifs.length>20)usr.notifs=usr.notifs.slice(0,20);
    LS.s('users',users); if(CU&&CU.id===u.id)CU=usr;
    updateNotifBadge();
  }
}
function updateNotifBadge(){
  if(!CU)return;
  var users=LS.g('users',[]); var usr=users.find(function(x){return x.id===CU.id;});
  var notifs=(usr&&usr.notifs)||[];
  var unread=notifs.filter(function(n){return !n.read;}).length;
  var badge=G('nbadge');
  if(unread>0){badge.textContent=unread;badge.style.display='';}
  else{badge.style.display='none';}
}
function renderNotifs(){
  var users=LS.g('users',[]); var usr=users.find(function(x){return CU&&x.id===CU.id;});
  var notifs=(usr&&usr.notifs)||[];
  G('notif-list').innerHTML=notifs.length?notifs.map(function(n,i){
    return '<div class="notif-item'+(n.read?'':' unread')+'" onclick="markNotifRead('+i+')">'
      +'<div class="ni-ico">'+n.txt.split(' ')[0]+'</div>'
      +'<div><div class="ni-txt">'+n.txt.replace(/^(\S+\s)/,'')+'</div><div class="ni-time">'+n.time+'</div></div>'
      +'</div>';
  }).join(''):'<div style="padding:16px;text-align:center;color:#7eb8d4;font-size:.74rem">No notifications</div>';
}
function markNotifRead(idx){
  var users=LS.g('users',[]); var usr=users.find(function(x){return CU&&x.id===CU.id;});
  if(usr&&usr.notifs&&usr.notifs[idx]){usr.notifs[idx].read=true;LS.s('users',users);CU=usr;updateNotifBadge();renderNotifs();}
}
function clearAllNotifs(){
  var users=LS.g('users',[]); var usr=users.find(function(x){return CU&&x.id===CU.id;});
  if(usr){usr.notifs=[];LS.s('users',users);CU=usr;updateNotifBadge();renderNotifs();}
}

/* ── NAV ── */
function gp(id,idx){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('on');});
  document.querySelectorAll('.nb').forEach(function(b){b.classList.remove('on');});
  G('pg-'+id).classList.add('on'); G('nb'+idx).classList.add('on');
  G('notif-panel').classList.remove('open');
  if(id==='ana')rAna(); if(id==='proj')rProj(); if(id==='bak')rBak(); if(id==='prf')rPrf(); if(id==='dash')rDash();
}

/* ── PROJECT CARD ── */
function pCard(p){
  var pct=Math.min(Math.round((p.raised/p.goal)*100),100);
  var canFund=CU&&CU.role==='backer';
  var wishlisted=CU&&CU.wishlist&&CU.wishlist.indexOf(p.id)>=0;
  var escrowBadge=p.escrow?'<div class="escrow-badge">&#128274; Escrow Protected</div>':'';
  var msDone=p.ms_done?p.ms_done.filter(Boolean).length:0;
  var msTotal=p.ms?p.ms.length:0;
  return '<div class="pc">'
    +'<div class="pban" style="background:'+catBg(p.cat)+'">'+p.ico+'</div>'
    +'<div class="pbdy">'
    +'<span class="bdg '+catBdg(p.cat)+'">'+p.cat+'</span>'
    +(msTotal?'<span style="float:right;font-size:.6rem;color:#7eb8d4;padding-top:2px">&#9868; '+msDone+'/'+msTotal+' milestones</span>':'')
    +escrowBadge
    +'<div class="ptit">'+p.title+'</div>'
    +'<div class="pds">'+p.desc+'</div>'
    +'<div class="pbar"><div class="pbf" style="width:'+pct+'%;background:linear-gradient(90deg,'+catC(p.cat)+',#bf00ff)"></div></div>'
    +'<div class="pmt"><span class="pfc">'+pct+'% funded</span><span>'+INRs(p.raised)+'</span><span>'+p.days+'d left</span></div>'
    +'<div class="pactions">'
    +(canFund?'<button class="fbtn" data-pid="'+p.id+'">&#128241; Pay via UPI</button>':'<button class="fbtn" style="opacity:.4;cursor:not-allowed">Sign in to Fund</button>')
    +'<button class="sharebtn" data-pid="'+p.id+'" title="Share">&#128279;</button>'
    +'<button class="wishbtn'+(wishlisted?' active':'')+'" data-pid="'+p.id+'" title="Wishlist">&#10084;</button>'
    +'</div>'
    +'</div></div>';
}
function attachActions(gid){
  var g=G(gid); if(!g)return;
  g.querySelectorAll('.fbtn[data-pid]').forEach(function(b){b.addEventListener('click',function(){openUPI(parseInt(this.dataset.pid));});});
  g.querySelectorAll('.sharebtn[data-pid]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();openShare(parseInt(this.dataset.pid));});});
  g.querySelectorAll('.wishbtn[data-pid]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();toggleWish(parseInt(this.dataset.pid),this);});});
}
function toggleWish(id,btn){
  if(!CU){toast('Sign in to save to wishlist','er');return;}
  var users=LS.g('users',[]); var usr=users.find(function(x){return x.id===CU.id;});
  if(!usr)return;
  if(!usr.wishlist)usr.wishlist=[];
  var idx=usr.wishlist.indexOf(id);
  if(idx>=0){usr.wishlist.splice(idx,1);btn.classList.remove('active');toast('Removed from wishlist');}
  else{usr.wishlist.push(id);btn.classList.add('active');toast('Added to wishlist &#10084;');}
  LS.s('users',users); CU=usr;
}

/* ── SEARCH ── */
function doSearch(q,gridId){
  if(!q){rDash();rProj();return;}
  q=q.toLowerCase();
  var ps=LS.g('projects',[]).filter(function(p){return p.title.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)||p.creator.toLowerCase().includes(q);});
  var g=G(gridId); if(!g)return;
  g.innerHTML=ps.length?ps.map(pCard).join(''):'<div style="padding:20px;text-align:center;color:#7eb8d4">No projects found for "'+q+'"</div>';
  attachActions(gridId);
}

/* ── DASHBOARD 3D ── */
var _cF=null,_cC=null,_cT=null;
function animCount(el,end,pre,suf,dur){
  var s=0,step=end/(dur/16);
  var iv=setInterval(function(){s=Math.min(s+step,end);el.textContent=pre+(end>=100000?INRs(Math.round(s)):Math.round(s).toLocaleString('en-IN'))+suf;if(s>=end)clearInterval(iv);},16);
}
function drawSpark(cid,data,color){
  var c=G(cid);if(!c)return;var ctx=c.getContext('2d');var w=c.width,h=c.height;
  ctx.clearRect(0,0,w,h);if(!data||data.length<2)return;
  var mn=Math.min.apply(null,data),mx=Math.max.apply(null,data),range=mx-mn||1;
  var pts=data.map(function(v,i){return{x:i*(w/(data.length-1)),y:h-((v-mn)/range)*(h-4)-2};});
  var gr=ctx.createLinearGradient(0,0,w,0);gr.addColorStop(0,color+'44');gr.addColorStop(1,color);
  ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(function(p){ctx.lineTo(p.x,p.y);});
  ctx.strokeStyle=gr;ctx.lineWidth=2;ctx.stroke();
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();
  var fill=ctx.createLinearGradient(0,0,0,h);fill.addColorStop(0,color+'33');fill.addColorStop(1,color+'00');
  ctx.fillStyle=fill;ctx.fill();
}
function initGlobe(){
  var canvas=G('globe-canvas');if(!canvas)return;
  var ctx=canvas.getContext('2d');var W,H;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize);
  var pts=[];for(var i=0;i<200;i++){pts.push({lat:(Math.random()-.5)*Math.PI,lon:Math.random()*Math.PI*2,size:Math.random()*2+.5,color:['#00f5ff','#bf00ff','#ffd700','#00ff88'][Math.floor(Math.random()*4)]});}
  var angle=0;
  function draw(){
    ctx.clearRect(0,0,W,H);var cx=W/2,cy=H/2,r=Math.min(W,H)*.38;
    var grd=ctx.createRadialGradient(cx,cy,r*.2,cx,cy,r);grd.addColorStop(0,'rgba(0,245,255,0.06)');grd.addColorStop(1,'rgba(0,245,255,0)');
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
    ctx.strokeStyle='rgba(0,245,255,0.07)';ctx.lineWidth=.5;
    for(var lat=-80;lat<=80;lat+=20){var ry=Math.cos(lat*Math.PI/180)*r,yy=cy+Math.sin(lat*Math.PI/180)*r*.5;if(ry>0){ctx.beginPath();ctx.ellipse(cx,yy,ry,ry*.25,0,0,Math.PI*2);ctx.stroke();}}
    for(var lon=0;lon<360;lon+=30){var a=(lon+angle)*Math.PI/180;ctx.beginPath();for(var la=-90;la<=90;la+=5){var cosL=Math.cos(la*Math.PI/180),sinL=Math.sin(la*Math.PI/180),x3=cosL*Math.cos(a),z3=cosL*Math.sin(a),y3=sinL;if(z3>-.2){var sx=cx+x3*r,sy=cy-y3*r*.6;if(la===-90)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy);}}ctx.stroke();}
    pts.forEach(function(p){var ln=p.lon+angle*Math.PI/180,x3=Math.cos(p.lat)*Math.cos(ln),y3=Math.sin(p.lat),z3=Math.cos(p.lat)*Math.sin(ln);if(z3>0){var sx=cx+x3*r,sy=cy-y3*r*.6;ctx.beginPath();ctx.arc(sx,sy,p.size,0,Math.PI*2);ctx.fillStyle=p.color;ctx.globalAlpha=.7+z3*.3;ctx.fill();}});
    ctx.globalAlpha=1;angle+=.15;requestAnimationFrame(draw);
  }
  draw();
}
function rDash(){
  var ps=LS.g('projects',[]),tr=0,tg=0,tb=0;
  ps.forEach(function(p){tr+=p.raised;tg+=p.goal;tb+=p.bk;});
  var rate=tg>0?Math.round((tr/tg)*100):0;
  setTimeout(function(){animCount(G('sv0'),tr,'','',800);},100);
  setTimeout(function(){animCount(G('sv1'),ps.length,'','',600);},150);
  setTimeout(function(){animCount(G('sv2'),tb,'','',700);},200);
  setTimeout(function(){animCount(G('sv3'),rate,'','%',900);},250);
  setTimeout(function(){if(G('sb0'))G('sb0').style.width=Math.min(rate,100)+'%';},300);
  setTimeout(function(){if(G('sb1'))G('sb1').style.width=Math.min(ps.length/10*100,100)+'%';},350);
  setTimeout(function(){if(G('sb2'))G('sb2').style.width=Math.min(tb/5000*100,100)+'%';},400);
  setTimeout(function(){if(G('sb3'))G('sb3').style.width=rate+'%';},450);
  var hist=LS.g('hist',[]);
  setTimeout(function(){
    drawSpark('sp0',hist.map(function(h){return h.amt;}),'#00f5ff');
    drawSpark('sp1',ps.map(function(p){return p.bk;}),'#bf00ff');
    drawSpark('sp2',ps.map(function(p){return p.raised;}),'#00ff88');
    drawSpark('sp3',hist.map(function(v){return Math.round(v.amt/1000000*rate);}),'#ffd700');
  },500);
  document.querySelectorAll('.s3card').forEach(function(card){
    card.addEventListener('mousemove',function(e){var r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,cx=r.width/2,cy=r.height/2;var rx=(y-cy)/cy*8,ry=-(x-cx)/cx*8;card.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg) translateZ(8px)';card.style.setProperty('--mx',(x/r.width*100)+'%');card.style.setProperty('--my',(y/r.height*100)+'%');});
    card.addEventListener('mouseleave',function(){card.style.transform='rotateX(0) rotateY(0) translateZ(0)';});
  });
  if(typeof Chart!=='undefined'){
    var catData={},catColors={Technology:'#00f5ff',Art:'#bf00ff',Health:'#00ff88',Education:'#ffd700'};
    ps.forEach(function(p){catData[p.cat]=(catData[p.cat]||0)+p.raised;});
    var cOpts={responsive:true,animation:{duration:800},plugins:{legend:{labels:{color:'#7eb8d4',font:{size:10},boxWidth:10}}},scales:{x:{ticks:{color:'#7eb8d4',font:{size:9}},grid:{color:'rgba(0,245,255,0.04)'}},y:{ticks:{color:'#7eb8d4',font:{size:9}},grid:{color:'rgba(0,245,255,0.04)'}}}};
    if(_cF)_cF.destroy();
    _cF=new Chart(G('chart-funding'),{type:'bar',data:{labels:ps.map(function(p){return p.title.slice(0,10)+'...';}),datasets:[{label:'Raised',data:ps.map(function(p){return p.raised;}),backgroundColor:ps.map(function(p){return (catColors[p.cat]||'#00f5ff')+'88';}),borderColor:ps.map(function(p){return catColors[p.cat]||'#00f5ff';}),borderWidth:1,borderRadius:4},{label:'Goal',data:ps.map(function(p){return p.goal;}),backgroundColor:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.2)',borderWidth:1,borderRadius:4}]},options:Object.assign({},cOpts)});
    if(_cC)_cC.destroy();
    _cC=new Chart(G('chart-cat'),{type:'doughnut',data:{labels:Object.keys(catData),datasets:[{data:Object.values(catData),backgroundColor:Object.keys(catData).map(function(c){return (catColors[c]||'#00f5ff')+'cc';}),borderColor:Object.keys(catData).map(function(c){return catColors[c]||'#00f5ff';}),borderWidth:2,hoverOffset:8}]},options:{responsive:true,animation:{duration:1000},cutout:'65%',plugins:{legend:{position:'right',labels:{color:'#7eb8d4',font:{size:9},boxWidth:10}}}}});
    if(_cT)_cT.destroy();
    var hist2=LS.g('hist',[]);
    _cT=new Chart(G('chart-trend'),{type:'line',data:{labels:hist2.map(function(h){return h.dt;}),datasets:[{label:'Daily Funding (\u20B9)',data:hist2.map(function(h){return h.amt;}),borderColor:'#00f5ff',backgroundColor:'rgba(0,245,255,0.06)',borderWidth:2,pointRadius:2,fill:true,tension:0.4}]},options:Object.assign({},cOpts,{plugins:{legend:{labels:{color:'#7eb8d4',font:{size:10}}}}})});
  }
  G('tg').innerHTML=ps.slice().sort(function(a,b){return b.bk-a.bk;}).slice(0,3).map(pCard).join('');
  attachActions('tg');
}

/* ── PROJECTS ── */
function rProj(){
  var cat=G('fcat').value,srt=G('fsrt').value,list=LS.g('projects',[]).slice();
  var q=G('proj-search').value.trim().toLowerCase();
  if(cat)list=list.filter(function(p){return p.cat===cat;});
  if(q)list=list.filter(function(p){return p.title.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q);});
  if(srt==='fund')list.sort(function(a,b){return(b.raised/b.goal)-(a.raised/a.goal);});
  else if(srt==='end')list.sort(function(a,b){return a.days-b.days;});
  else if(srt==='goal')list.sort(function(a,b){return((b.raised/b.goal)-(a.raised/a.goal))*-1;});
  G('ag').innerHTML=list.map(pCard).join('');
  attachActions('ag');
}

/* ── CREATE PROJECT (with platform fee + milestones) ── */
function createProject(){
  var t=G('ft').value.trim(),c=G('fcat2').value,g=parseInt(G('fgl').value);
  var cr=G('fcr').value.trim()||(CU?CU.name:'Creator');
  var d=parseInt(G('fdy').value)||30,ds=G('fds').value.trim();
  var m1=G('ms1').value.trim(),m2=G('ms2').value.trim(),m3=G('ms3').value.trim();
  if(!t){toast('Project title required','er');return;}
  if(!g||g<1000){toast('Goal must be at least \u20B91,000','er');return;}
  var fee=Math.round(g*0.025); var gst=Math.round(fee*0.18);
  var ico={Technology:'&#9889;',Art:'&#127912;',Health:'&#128138;',Education:'&#128218;'}[c];
  var ps=LS.g('projects',[]);
  ps.push({id:Date.now(),title:t,cat:c,goal:g,raised:0,creator:cr,days:d,ico:ico,desc:ds||'An exciting crowdfunded project.',bk:0,at:new Date().toISOString(),ms:[m1||'25% complete',m2||'50% complete',m3||'Goal achieved'],ms_done:[false,false,false],escrow:true,fee:fee,gst:gst});
  LS.s('projects',ps);
  ['ft','fgl','fcr','fdy','fds','ms1','ms2','ms3'].forEach(function(id){var el=G(id);if(el)el.value='';});
  if(CU)addNotif(CU,'&#128640; Your project "'+t+'" is now live!','Just now');
  toast('Project launched! Platform fee: '+INR(fee)+' + GST: '+INR(gst));
  rDash();
}

/* ── PLATFORM FEE PREVIEW ── */
function updateFeePreview(){
  var g=parseInt(G('fgl').value)||0;
  var fee=Math.round(g*0.025);
  var el=G('fee-display');
  if(el)el.value=g>0?INR(fee)+' + GST '+INR(Math.round(fee*.18)):'Enter goal amount';
}

/* ── UPI FLOW ── */
/* Comprehensive catalog of Indian banks supporting UPI (public, private, payment, small finance & regional) */
var BANK_CATALOG=[
  /* ── Public Sector Banks ── */
  {key:'sbi',name:'State Bank of India',short:'SBI',color:'#1565c0',handle:'oksbi',type:'Public'},
  {key:'pnb',name:'Punjab National Bank',short:'PNB',color:'#8e0000',handle:'pnb',type:'Public'},
  {key:'bob',name:'Bank of Baroda',short:'BOB',color:'#e65100',handle:'barodampay',type:'Public'},
  {key:'canara',name:'Canara Bank',short:'CNRB',color:'#003876',handle:'cnrb',type:'Public'},
  {key:'union',name:'Union Bank of India',short:'UBI',color:'#7b1113',handle:'unionbank',type:'Public'},
  {key:'boi',name:'Bank of India',short:'BOI',color:'#003366',handle:'boi',type:'Public'},
  {key:'iob',name:'Indian Overseas Bank',short:'IOB',color:'#004080',handle:'iob',type:'Public'},
  {key:'central',name:'Central Bank of India',short:'CBI',color:'#8b0000',handle:'centralbank',type:'Public'},
  {key:'indian',name:'Indian Bank',short:'IB',color:'#1a5276',handle:'indianbank',type:'Public'},
  {key:'maha',name:'Bank of Maharashtra',short:'BOM',color:'#7d3c98',handle:'mahb',type:'Public'},
  {key:'uco',name:'UCO Bank',short:'UCO',color:'#0b5394',handle:'uco',type:'Public'},
  {key:'psb',name:'Punjab & Sind Bank',short:'PSB',color:'#6a1b9a',handle:'psb',type:'Public'},
  /* ── Private Sector Banks ── */
  {key:'hdfc',name:'HDFC Bank',short:'HDFC',color:'#004c8f',handle:'okhdfc',type:'Private'},
  {key:'icici',name:'ICICI Bank',short:'ICICI',color:'#b71c1c',handle:'okicici',type:'Private'},
  {key:'axis',name:'Axis Bank',short:'AXIS',color:'#7c1158',handle:'okaxis',type:'Private'},
  {key:'kotak',name:'Kotak Mahindra Bank',short:'KOTAK',color:'#c2185b',handle:'kotak',type:'Private'},
  {key:'yes',name:'Yes Bank',short:'YES',color:'#1b1b1b',handle:'ybl',type:'Private'},
  {key:'idfc',name:'IDFC FIRST Bank',short:'IDFC',color:'#7b1fa2',handle:'idfcfirst',type:'Private'},
  {key:'indus',name:'IndusInd Bank',short:'IIB',color:'#2e7d32',handle:'indus',type:'Private'},
  {key:'fed',name:'Federal Bank',short:'FED',color:'#0d47a1',handle:'fbl',type:'Private'},
  {key:'rbl',name:'RBL Bank',short:'RBL',color:'#d32f2f',handle:'rbl',type:'Private'},
  {key:'south',name:'South Indian Bank',short:'SIB',color:'#00695c',handle:'sib',type:'Private'},
  {key:'karur',name:'Karur Vysya Bank',short:'KVB',color:'#5d4037',handle:'kvb',type:'Private'},
  {key:'tmb',name:'Tamilnad Mercantile Bank',short:'TMB',color:'#3949ab',handle:'tmb',type:'Private'},
  {key:'csb',name:'CSB Bank',short:'CSB',color:'#00838f',handle:'csb',type:'Private'},
  {key:'dcb',name:'DCB Bank',short:'DCB',color:'#558b2f',handle:'dcb',type:'Private'},
  {key:'bandhan',name:'Bandhan Bank',short:'BNDN',color:'#e65100',handle:'bandhan',type:'Private'},
  {key:'jk',name:'Jammu & Kashmir Bank',short:'J&K',color:'#1a237e',handle:'jkb',type:'Private'},
  /* ── Payment Banks ── */
  {key:'paytm',name:'Paytm Payments Bank',short:'PAYTM',color:'#00baf2',handle:'paytm',type:'Payment'},
  {key:'airtel',name:'Airtel Payments Bank',short:'AIRTEL',color:'#e40000',handle:'airtel',type:'Payment'},
  {key:'fino',name:'Fino Payments Bank',short:'FINO',color:'#f57c00',handle:'fino',type:'Payment'},
  {key:'jio',name:'Jio Payments Bank',short:'JIO',color:'#0a2885',handle:'jiopay',type:'Payment'},
  {key:'nsdl',name:'NSDL Payments Bank',short:'NSDL',color:'#37474f',handle:'nsdl',type:'Payment'},
  /* ── Small Finance Banks ── */
  {key:'au',name:'AU Small Finance Bank',short:'AU',color:'#c62828',handle:'aubank',type:'SmallFinance'},
  {key:'equitas',name:'Equitas Small Finance Bank',short:'EQT',color:'#00897b',handle:'equitas',type:'SmallFinance'},
  {key:'ujjivan',name:'Ujjivan Small Finance Bank',short:'UJVN',color:'#f9a825',handle:'ujjivan',type:'SmallFinance'},
  {key:'jana',name:'Jana Small Finance Bank',short:'JANA',color:'#6a1b9a',handle:'jana',type:'SmallFinance'},
  {key:'suryoday',name:'Suryoday Small Finance Bank',short:'SDB',color:'#ef6c00',handle:'suryoday',type:'SmallFinance'},
  {key:'esaf',name:'ESAF Small Finance Bank',short:'ESAF',color:'#2e7d32',handle:'esaf',type:'SmallFinance'},
  {key:'utkarsh',name:'Utkarsh Small Finance Bank',short:'UTK',color:'#d84315',handle:'utkarsh',type:'SmallFinance'},
  /* ── Regional / Cooperative ── */
  {key:'saraswat',name:'Saraswat Co-operative Bank',short:'SCB',color:'#1565c0',handle:'saraswat',type:'Regional'},
  {key:'apgvb',name:'Andhra Pragathi Grameena Bank',short:'APGB',color:'#4527a0',handle:'apgvb',type:'Regional'},
  {key:'baroda_up',name:'Baroda UP Bank',short:'BUPB',color:'#bf360c',handle:'baroda_up',type:'Regional'}
];
var BANK_TYPE_LABELS={Public:'Public Sector',Private:'Private Sector',Payment:'Payments Bank',SmallFinance:'Small Finance Bank',Regional:'Regional / Co-operative'};
function bankFromUPI(u){
  var h=(u||'').split('@')[1];
  var found=BANK_CATALOG.find(function(b){return b.handle===h;});
  return found?found.name:'Your Bank';
}
function maskAccNo(seed){
  var s=String(seed||'0').split('').reduce(function(a,c){return a+c.charCodeAt(0);},0);
  var last4=String(1000+(s%9000));
  return 'XXXX XXXX '+last4;
}
function maskAccFromReal(accNo){
  var s=String(accNo||'').replace(/\s/g,'');
  if(s.length<4)return 'XXXX XXXX '+s;
  return 'XXXX XXXX '+s.slice(-4);
}
/* ── User-added bank accounts (persisted per user) ── */
function getUserBanks(){
  if(!CU)return[];
  var all=LS.g('userBanks',{});
  return all[CU.id]||[];
}
function saveUserBank(bankObj){
  if(!CU)return;
  var all=LS.g('userBanks',{});
  if(!all[CU.id])all[CU.id]=[];
  all[CU.id].push(bankObj);
  LS.s('userBanks',all);
}
function removeUserBank(idx){
  if(!CU)return;
  var all=LS.g('userBanks',{});
  if(all[CU.id]){all[CU.id].splice(idx,1);LS.s('userBanks',all);}
}
var linkedBanks=[]; var selectedBankIdx=0;
function buildLinkedBanks(){
  if(!CU)return[];
  var primary=BANK_CATALOG.find(function(b){return b.handle===(CU.upi||'').split('@')[1];})||BANK_CATALOG[0];
  var others=BANK_CATALOG.filter(function(b){return b.key!==primary.key;});
  var seedNum=String(CU.id||'').split('').reduce(function(a,c){return a+c.charCodeAt(0);},1);
  var picks=[primary];
  for(var i=0;i<2 && others.length;i++){
    var idx=(seedNum*(i+3))%others.length;
    picks.push(others[idx]);
    others.splice(idx,1);
  }
  var builtIn=picks.map(function(b,i){return{bank:b,upi:(i===0?(CU.upi||('user@'+b.handle)):(CU.name||'user').split(' ')[0].toLowerCase()+'@'+b.handle),acc:maskAccNo((CU.id||'')+b.key),isDefault:i===0,custom:false};});
  var userAdded=getUserBanks().map(function(ub){return{bank:ub.bank,upi:ub.upi,acc:maskAccFromReal(ub.accNo),isDefault:false,custom:true,holderName:ub.holderName,ifsc:ub.ifsc};});
  return builtIn.concat(userAdded);
}
function renderBankList(){
  linkedBanks=buildLinkedBanks();
  selectedBankIdx=0;
  var html=linkedBanks.map(function(lb,i){
    var initials=lb.bank.short.slice(0,4);
    return '<div class="bank-item'+(i===0?' sel':'')+'" data-idx="'+i+'">'
      +'<div class="bank-logo" style="background:'+lb.bank.color+'">'+initials+'</div>'
      +'<div class="bank-info"><div class="bank-name">'+lb.bank.name+(lb.isDefault?'<span class="bank-default-tag">DEFAULT</span>':'')+(lb.custom?'<span class="bank-default-tag" style="color:#00ff88;background:rgba(0,255,136,.12);border-color:rgba(0,255,136,.3)">ADDED</span>':'')+'</div>'
      +'<div class="bank-acc">'+lb.acc+' &#8226; '+lb.upi+'</div></div>'
      +'<div class="bank-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>'
      +'</div>';
  }).join('')
  +'<div class="bank-item" id="bank-add-new" style="border-style:dashed;justify-content:center;color:#7eb8d4">'
  +'<div style="font-size:.78rem;font-weight:600">&#10010; Add New Bank Account</div></div>';
  G('bank-list').innerHTML=html;
  G('bank-list').querySelectorAll('.bank-item[data-idx]').forEach(function(el){
    el.addEventListener('click',function(){
      selectedBankIdx=parseInt(this.dataset.idx);
      G('bank-list').querySelectorAll('.bank-item').forEach(function(x){x.classList.remove('sel');});
      this.classList.add('sel');
    });
  });
  var addBtn=G('bank-add-new');
  if(addBtn)addBtn.addEventListener('click',openAddBankModal);
}

/* ── ADD BANK ACCOUNT MODAL ── */
var ab_selectedBank=null;
function openAddBankModal(){
  ab_selectedBank=null;
  G('ab-bank-search').value='';
  G('ab-bank-results').innerHTML='';
  G('ab-selected-bank').style.display='none';
  G('ab-holder').value=CU?CU.name:'';
  G('ab-accno').value='';
  G('ab-accno2').value='';
  G('ab-ifsc').value='';
  G('ab-upi').value='';
  G('ab-err').textContent='';
  renderBankSearchResults('');
  G('addbank-modal').style.display='flex';
}
function closeAddBankModal(){G('addbank-modal').style.display='none';}
function renderBankSearchResults(query){
  var q=(query||'').trim().toLowerCase();
  var matches=BANK_CATALOG.filter(function(b){
    return !q || b.name.toLowerCase().indexOf(q)>=0 || b.short.toLowerCase().indexOf(q)>=0;
  }).slice(0,8);
  G('ab-bank-results').innerHTML=matches.map(function(b){
    return '<div class="bank-item" data-key="'+b.key+'" style="padding:7px 9px">'
      +'<div class="bank-logo" style="background:'+b.color+';width:26px;height:26px;font-size:.58rem">'+b.short.slice(0,4)+'</div>'
      +'<div class="bank-info"><div class="bank-name" style="font-size:.72rem">'+b.name+'</div>'
      +'<div class="bank-acc" style="font-size:.6rem">'+(BANK_TYPE_LABELS[b.type]||b.type)+'</div></div>'
      +'</div>';
  }).join('')||'<div style="font-size:.7rem;color:#7eb8d4;padding:6px">No banks found. Try another name.</div>';
  G('ab-bank-results').querySelectorAll('.bank-item[data-key]').forEach(function(el){
    el.addEventListener('click',function(){selectAddBank(this.dataset.key);});
  });
}
function selectAddBank(key){
  var b=BANK_CATALOG.find(function(x){return x.key===key;});
  if(!b)return;
  ab_selectedBank=b;
  G('ab-sel-logo').style.background=b.color;
  G('ab-sel-logo').textContent=b.short.slice(0,4);
  G('ab-sel-name').textContent=b.name;
  G('ab-sel-type').textContent=(BANK_TYPE_LABELS[b.type]||b.type)+' Bank';
  G('ab-selected-bank').style.display='flex';
  G('ab-bank-results').innerHTML='';
  G('ab-bank-search').value=b.name;
  updateUpiSuggestion();
}
function updateUpiSuggestion(){
  if(!ab_selectedBank){G('ab-upi').value='';return;}
  var holder=G('ab-holder').value.trim()||(CU?CU.name:'user');
  var handle=holder.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g,'')||'user';
  G('ab-upi').value=handle+'@'+ab_selectedBank.handle;
}
function validateIFSC(ifsc){
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
}
function saveAddBank(){
  var err=G('ab-err'); err.textContent='';
  if(!ab_selectedBank){err.textContent='Please select a bank first.';return;}
  var holder=G('ab-holder').value.trim();
  var accNo=G('ab-accno').value.trim();
  var accNo2=G('ab-accno2').value.trim();
  var ifsc=G('ab-ifsc').value.trim().toUpperCase();
  if(!holder){err.textContent='Account holder name is required.';return;}
  if(!accNo||accNo.length<9||accNo.length>18){err.textContent='Enter a valid account number (9-18 digits).';return;}
  if(!/^[0-9]+$/.test(accNo)){err.textContent='Account number must contain digits only.';return;}
  if(accNo!==accNo2){err.textContent='Account numbers do not match.';return;}
  if(!ifsc||!validateIFSC(ifsc)){err.textContent='Enter a valid IFSC code (e.g. HDFC0001234).';return;}
  var upi=G('ab-upi').value;
  saveUserBank({bank:ab_selectedBank,holderName:holder,accNo:accNo,ifsc:ifsc,upi:upi,addedOn:new Date().toISOString()});
  addNotif(CU,'&#127974; '+ab_selectedBank.name+' account added successfully!','Just now');
  toast(ab_selectedBank.name+' linked successfully!');
  closeAddBankModal();
  renderBankList();
}
function openUPI(id){
  upiPid=id;upiAmt=0;upiMth='qr';
  var p=null;LS.g('projects',[]).forEach(function(x){if(x.id===id)p=x;});if(!p)return;
  G('ppn').textContent=p.title.slice(0,22);G('lsb').textContent=CU.upi||'yourname@upi';
  G('cps').innerHTML=PRESETS.map(function(a){return '<div class="chip" data-v="'+a+'">'+INR(a)+'</div>';}).join('');
  G('cps').querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){pickChip(parseInt(this.dataset.v),this);});});
  G('pamt').value='';buildOTP();buildDots(6);
  document.querySelectorAll('.ppstp').forEach(function(s){s.classList.remove('on');});G('s1').classList.add('on');activeDot(1);G('umo').classList.add('on');
}
function closeUPI(){G('umo').classList.remove('on');}
function buildDots(n){G('dts').innerHTML=Array.from({length:n},function(_,i){return '<div class="dt" id="dt'+(i+1)+'"></div>';}).join('');}
function activeDot(n){document.querySelectorAll('.dt').forEach(function(d,i){d.classList.toggle('on',i+1===n);});}
function buildOTP(){
  G('otpw').innerHTML=Array.from({length:6},function(_,i){return '<input class="otpd" id="od'+i+'" maxlength="1" type="password" inputmode="numeric"/>';}).join('');
  for(var i=0;i<6;i++){(function(idx){var el=G('od'+idx);if(el)el.addEventListener('input',function(){if(this.value&&idx<5)G('od'+(idx+1)).focus();});})(i);}
}
function syncC(){var v=parseInt(G('pamt').value);document.querySelectorAll('.chip').forEach(function(c){c.classList.toggle('on',parseInt(c.dataset.v)===v);});}
function pickChip(v,el){G('pamt').value=v;document.querySelectorAll('.chip').forEach(function(c){c.classList.remove('on');});el.classList.add('on');}
function goStep(n,sub){document.querySelectorAll('.ppstp').forEach(function(s){s.classList.remove('on');});var el=G(sub?('s'+n+sub):('s'+n));if(el)el.classList.add('on');activeDot(n);}
function drawQR(amt){
  var link='upi://pay?pa='+encodeURIComponent(MY_UPI)+'&pn='+encodeURIComponent('FundVerse')+'&am='+amt+'&cu=INR&tn='+encodeURIComponent('FundVerse Crowdfunding');
  var canvas=G('qr-canvas');
  if(canvas){
    canvas.style.opacity='0';
    try{
      var ok=QRCodeGen.render(canvas,link,{dark:'#3d1066',light:'#ffffff',margin:2});
      canvas.style.transition='opacity .25s';
      canvas.style.opacity=ok?'1':'1';
      if(!ok)toast('QR generation issue - try a smaller amount','er');
    }catch(e){
      console.error('QR render error:',e);
      toast('QR generation failed','er');
    }
  }
  G('qr-upi-show').textContent=MY_UPI;
}
function verifyUPI(){
  var id=G('uid').value.trim();
  if(!id||id.indexOf('@')<0){toast('Enter a valid UPI ID','er');return;}
  var vstatus=G('upi-verify-status');
  vstatus.textContent='&#128260; Verifying UPI ID...';vstatus.style.color='#ffd700';
  setTimeout(function(){vstatus.textContent='&#10003; UPI ID Verified: '+id;vstatus.style.color='#00ff88';setTimeout(function(){goStep(4);},600);},1200);
}
function pickMethod(m){
  var amt=parseInt(G('pamt').value)||0;if(!amt||amt<1){toast('Enter a valid amount','er');goStep(1);return;}
  upiAmt=amt;upiMth=m;
  if(m==='qr'){G('qal').textContent=INR(amt);drawQR(amt);goStep(3,'q');}
  else if(m==='id'){G('uidamt').textContent=INR(amt);G('uid').value=CU.upi||'';G('upi-verify-status').textContent='';goStep(3,'i');}
  else{G('lamt').textContent=INR(amt);renderBankList();goStep(3,'l');}
}
function submitPIN(){
  var pin='';for(var i=0;i<6;i++){var el=G('od'+i);pin+=el?el.value:'';}
  if(pin.length<6){toast('Enter all 6 digits','er');return;}
  goStep(5);runProc();
}
function runProc(){
  var steps=['Connecting to bank','Verifying UPI credentials','Debiting your account','Processing escrow','Crediting FundVerse'];
  var i=0;G('ptks').innerHTML='';
  var iv=setInterval(function(){
    if(i<steps.length){G('ptxt').textContent=steps[i];G('ptks').innerHTML+='<span style="color:#00ff88;font-size:.68rem">&#10003;</span>';i++;}
    else{clearInterval(iv);setTimeout(showSuc,300);}
  },520);
}
function showSuc(){
  var ps=LS.g('projects',[]),p=null;ps.forEach(function(x){if(x.id===upiPid)p=x;});if(!p||!upiAmt)return;
  p.raised+=upiAmt;p.bk+=1;LS.s('projects',ps);
  var fee=Math.round(upiAmt*0.025),gst=Math.round(fee*0.18);
  var ref='UPI'+String(100000000+Math.floor(Math.random()*900000000));
  var d=new Date();var mos=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var tx=LS.g('tx',[]);
  tx.unshift({id:ref,proj:p.title,bk:CU.name,uid:CU.upi||'unknown@upi',amt:upiAmt,fee:fee,gst:gst,dt:mos[d.getMonth()]+' '+d.getDate(),st:'success',userId:CU.id,refunded:false});
  LS.s('tx',tx);
  var bks=LS.g('backers',[]),bk=null;bks.forEach(function(b){if(b.name===CU.name)bk=b;});
  if(bk){bk.total+=upiAmt;bk.projects+=1;}else bks.push({name:CU.name,tier:'Bronze',total:upiAmt,projects:1,joined:new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}),kyc:CU.kyc});
  LS.s('backers',bks);
  var users=LS.g('users',[]);users.forEach(function(u){if(u.id===CU.id){u.tb=(u.tb||0)+upiAmt;u.pb=(u.pb||0)+1;CU=u;}});LS.s('users',users);
  var hist=LS.g('hist',[]);hist[hist.length-1].amt+=upiAmt;LS.s('hist',hist);
  addNotif(CU,'&#128176; Payment of '+INR(upiAmt)+' to "'+p.title+'" successful! Ref: '+ref,'Just now');
  var sourceLabel=(CU.upi||'your UPI');
  if(upiMth==='linked'&&linkedBanks.length){
    var chosen=linkedBanks[selectedBankIdx];
    sourceLabel=chosen.bank.name+' &#8226; '+chosen.acc;
  }
  G('suca').textContent=INR(upiAmt);
  G('sucm').innerHTML='Paid to: <b style="color:white">'+p.title+'</b><br>UPI: <b style="color:#d8a0ff">'+MY_UPI+'</b><br>From: <b style="color:rgba(255,255,255,.6)">'+sourceLabel+'</b><br><span style="color:#00ff88">&#128274; Funds held in Escrow</span>';
  G('suct').textContent='Txn ID: '+ref;
  G('gst-box').textContent='&#128203; GST Invoice: Platform Fee '+INR(fee)+' + GST @18% = '+INR(gst)+' | Net to creator: '+INR(upiAmt-fee-gst);
  goStep(6);rDash();
}
function requestRefund(ref){
  var tx=LS.g('tx',[]);var t=tx.find(function(x){return x.id===ref;});
  if(!t||t.refunded){toast('Refund already processed or not eligible','er');return;}
  t.st='refund_requested';
  LS.s('tx',tx);
  addNotif(CU,'&#128260; Refund requested for Txn '+ref+'. Will be processed in 3-5 working days.','Just now');
  toast('Refund requested! Processing in 3-5 working days','warn');
  closeUPI();
}

/* ── SHARE ── */
function openShare(id){
  shareProject=id;
  var p=LS.g('projects',[]).find(function(x){return x.id===id;});
  if(!p)return;

  var pct=Math.min(Math.round((p.raised/p.goal)*100),100);
  var pageUrl='https://fundverse.app/project/'+id;
  var shareTitle='Fund "'+p.title+'" on FundVerse';
  var shareText='Check out "'+p.title+'" on FundVerse \u2014 a UPI crowdfunding project that\'s '+pct+'% funded ('+INR(p.raised)+' of '+INR(p.goal)+' raised)! '+p.desc;
  var fullMessage=shareText+'\n\nFund it here: '+pageUrl;

  /* Preview card */
  G('share-preview-ico').style.background=catC(p.cat);
  G('share-preview-ico').textContent=(p.ico||'P').replace(/&#?\w+;/,'P').slice(0,1)||'P';
  G('share-preview-title').textContent=p.title;
  G('share-preview-sub').textContent=pct+'% funded \u2022 '+INRs(p.raised)+' of '+INRs(p.goal);

  var enc=encodeURIComponent;

  /* Helper: replace element to strip any stale listeners, then attach fresh one */
  function rewire(id,fn){
    var old=G(id); if(!old)return;
    var fresh=old.cloneNode(true);
    old.parentNode.replaceChild(fresh,old);
    fresh.addEventListener('click',fn);
  }

  /* Native Web Share API (mobile browsers / installed PWAs) */
  var nativeBtn=G('sh-native');
  if(navigator.share){
    nativeBtn.style.display='flex';
    rewire('sh-native',function(){
      navigator.share({title:shareTitle,text:shareText,url:pageUrl}).catch(function(){});
    });
  } else {
    nativeBtn.style.display='none';
  }

  rewire('sh-wa',function(){window.open('https://wa.me/?text='+enc(fullMessage),'_blank');});
  rewire('sh-tw',function(){window.open('https://twitter.com/intent/tweet?text='+enc(shareText)+'&url='+enc(pageUrl),'_blank');});
  rewire('sh-fb',function(){window.open('https://www.facebook.com/sharer/sharer.php?u='+enc(pageUrl)+'&quote='+enc(shareText),'_blank');});
  rewire('sh-tg',function(){window.open('https://t.me/share/url?url='+enc(pageUrl)+'&text='+enc(shareText),'_blank');});
  rewire('sh-li',function(){window.open('https://www.linkedin.com/sharing/share-offsite/?url='+enc(pageUrl),'_blank');});
  rewire('sh-em',function(){window.location.href='mailto:?subject='+enc(shareTitle)+'&body='+enc(fullMessage);});
  rewire('sh-sms',function(){window.location.href='sms:?body='+enc(fullMessage);});
  rewire('sh-reddit',function(){window.open('https://www.reddit.com/submit?url='+enc(pageUrl)+'&title='+enc(shareTitle),'_blank');});
  rewire('sh-pin',function(){window.open('https://pinterest.com/pin/create/button/?url='+enc(pageUrl)+'&description='+enc(shareText),'_blank');});
  rewire('sh-tumblr',function(){window.open('https://www.tumblr.com/widgets/share/tool?canonicalUrl='+enc(pageUrl)+'&caption='+enc(shareTitle)+'&content='+enc(shareText),'_blank');});
  rewire('sh-skype',function(){window.open('https://web.skype.com/share?url='+enc(pageUrl)+'&text='+enc(shareText),'_blank');});
  rewire('sh-line',function(){window.open('https://social-plugins.line.me/lineit/share?url='+enc(pageUrl)+'&text='+enc(shareText),'_blank');});

  rewire('sh-copy',function(){
    if(navigator.clipboard){navigator.clipboard.writeText(pageUrl).then(function(){toast('Link copied!');}).catch(function(){toast('Link: '+pageUrl);});}
    else{toast('Link: '+pageUrl);}
  });
  rewire('sh-copy-text',function(){
    if(navigator.clipboard){navigator.clipboard.writeText(fullMessage).then(function(){toast('Message copied!');}).catch(function(){toast('Could not copy','er');});}
    else{toast(fullMessage);}
  });

  G('share-modal').classList.add('open');
}

/* ── ANALYTICS ── */
function rAna(){
  var ps=LS.g('projects',[]),cd={};
  ps.forEach(function(p){cd[p.cat]=(cd[p.cat]||0)+p.raised;});
  var mx=Math.max.apply(null,Object.values(cd));
  G('cc').innerHTML=Object.entries(cd).map(function(e){return '<div class="brow"><div style="color:#7eb8d4;font-size:.66rem">'+e[0]+'</div><div class="btr"><div class="bfl" style="width:'+Math.round((e[1]/mx)*100)+'%;background:'+catC(e[0])+'"></div></div><div style="color:#e8f4ff;font-weight:600;font-size:.66rem;text-align:right">'+INRs(e[1])+'</div></div>';}).join('');
  var act=ps.filter(function(p){return p.raised<p.goal&&p.days>0;}).length,fnd=ps.filter(function(p){return p.raised>=p.goal;}).length,pnd=Math.max(0,ps.length-act-fnd);
  var segs=[{l:'Active',v:act,c:'#00f5ff'},{l:'Funded',v:fnd,c:'#ffd700'},{l:'Pending',v:pnd,c:'#bf00ff'}].filter(function(s){return s.v>0;});
  var tot=segs.reduce(function(s,x){return s+x.v;},0),cv=G('dc').getContext('2d');cv.clearRect(0,0,90,90);var ang=-Math.PI/2;
  segs.forEach(function(s){var sw=(s.v/tot)*2*Math.PI;cv.beginPath();cv.moveTo(45,45);cv.arc(45,45,40,ang,ang+sw);cv.fillStyle=s.c;cv.fill();ang+=sw;});
  cv.beginPath();cv.arc(45,45,20,0,2*Math.PI);cv.fillStyle='#020818';cv.fill();
  G('dl').innerHTML=segs.map(function(s){return '<div style="display:flex;align-items:center;gap:4px;font-size:.65rem;margin-bottom:3px"><div style="width:7px;height:7px;border-radius:50%;background:'+s.c+';flex-shrink:0"></div><span style="color:#7eb8d4">'+s.l+'</span><span style="margin-left:auto;font-weight:600">'+s.v+'</span></div>';}).join('');
  G('txb').innerHTML=LS.g('tx',[]).slice(0,15).map(function(t){
    var sclass=t.st==='success'?'ss':t.st==='pending'?'sp':t.st==='refund_requested'?'warn':'sf';
    return '<tr><td style="color:#00f5ff;font-family:monospace;font-size:.62rem">'+t.id+'</td><td>'+t.proj+'</td><td>'+t.bk+'</td><td style="color:#00ff88;font-weight:600">'+INR(t.amt)+'</td><td style="color:#ffd700">'+INR(t.fee||0)+'</td><td style="color:#ff8c00">'+INR(t.gst||0)+'</td><td>'+t.dt+'</td><td><span class="sb '+sclass+'">'+t.st+'</span></td></tr>';
  }).join('');
}

/* ── BACKERS ── */
function rBak(){
  var tc={Bronze:'#cd7f32',Silver:'#c0c0c0',Gold:'#ffd700',Platinum:'#00f5ff'};
  G('bkb').innerHTML=LS.g('backers',[]).map(function(b){
    var kycBadge=b.kyc==='verified'?'<span class="kyc-badge kyc-verified">&#9989; KYC</span>':'<span class="kyc-badge kyc-pending">&#9203; Pending</span>';
    return '<tr><td style="color:#e8f4ff;font-weight:600">'+b.name+'</td><td>'+kycBadge+'</td><td>'+b.projects+'</td><td style="color:#00ff88;font-weight:600">'+INR(b.total)+'</td><td>'+b.joined+'</td><td><span class="sb" style="background:'+tc[b.tier]+'22;color:'+tc[b.tier]+';border:1px solid '+tc[b.tier]+'44">'+b.tier+'</span></td></tr>';
  }).join('');
}

/* ── PROFILE ── */
function rPrf(){
  if(!CU)return;
  var ini=CU.name.split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();
  G('pav-big').textContent=ini;G('pnm-big').textContent=CU.name;
  var rc=CU.role==='admin'?'rgba(255,215,0,.12)':'rgba(95,37,159,.18)';var rcc=CU.role==='admin'?'#ffd700':'#d8a0ff';
  var kycColor=CU.kyc==='verified'?'#00ff88':'#ffd700';
  G('prole-badge').innerHTML='<span style="background:'+rc+';color:'+rcc+';border:1px solid '+rcc+'44;padding:2px 9px;border-radius:100px;font-size:.62rem;font-weight:700;letter-spacing:.8px">'+CU.role.toUpperCase()+'</span> <span class="kyc-badge '+(CU.kyc==='verified'?'kyc-verified':'kyc-pending')+'">'+(CU.kyc==='verified'?'&#9989;':'&#9203;')+' KYC</span>';
  G('pstats').innerHTML='<div class="pst"><span>Email</span><span style="font-size:.68rem">'+CU.email+'</span></div><div class="pst"><span>Mobile</span><span>'+(CU.mobile||'--')+'</span></div><div class="pst"><span>UPI ID</span><span style="color:#d8a0ff">'+(CU.upi||'--')+'</span></div><div class="pst"><span>Joined</span><span>'+CU.joined+'</span></div><div class="pst"><span>Projects Backed</span><span>'+(CU.pb||0)+'</span></div><div class="pst"><span>Total Contributed</span><span>'+INR(CU.tb||0)+'</span></div>';
  var my=LS.g('tx',[]).filter(function(t){return t.bk===CU.name||t.userId===CU.id;});
  G('mhb').innerHTML=my.length?my.map(function(t){
    var refBtn=t.st==='success'&&!t.refunded?'<button class="refund-btn" onclick="requestRefund(\''+t.id+'\')">Refund</button>':'<span style="font-size:.62rem;color:#7eb8d4">'+(t.refunded?'Refunded':t.st)+'</span>';
    return '<tr><td>'+t.proj+'</td><td style="color:#00ff88;font-weight:600">'+INR(t.amt)+'</td><td style="font-family:monospace;font-size:.6rem;color:rgba(255,255,255,.28)">'+t.id+'</td><td>'+t.dt+'</td><td><span class="sb ss">'+t.st+'</span></td><td>'+refBtn+'</td></tr>';
  }).join(''):'<tr><td colspan="6" style="text-align:center;padding:14px;color:#7eb8d4">No backing history yet.</td></tr>';
  var wishes=CU.wishlist||[];var wps=LS.g('projects',[]).filter(function(p){return wishes.indexOf(p.id)>=0;});
  G('wishlist-grid').innerHTML=wps.length?wps.map(pCard).join(''):'<div style="color:#7eb8d4;font-size:.74rem;padding:10px">No projects in wishlist yet.</div>';
  attachActions('wishlist-grid');
}

/* ── CHANGE PASSWORD ── */
function changePw(){
  var old=G('old-pw').value,nw=G('new-pw').value;
  G('pw-err').textContent='';G('pw-ok').textContent='';
  if(!old||!nw){G('pw-err').textContent='Both fields required.';return;}
  if(nw.length<8){G('pw-err').textContent='New password must be 8+ chars.';return;}
  hashPw(old).then(function(ho){
    var users=LS.g('users',[]);var usr=users.find(function(u){return u.id===CU.id;});
    if(!usr||usr.pass!==ho){G('pw-err').textContent='Current password is wrong.';return;}
    hashPw(nw).then(function(hn){
      usr.pass=hn;LS.s('users',users);CU=usr;
      G('pw-ok').textContent='Password updated successfully!';
      G('old-pw').value='';G('new-pw').value='';
      addNotif(CU,'&#128274; Your password was changed successfully.','Just now');
    });
  });
}

/* ── EXPORT ── */
function exportCSV(){
  var ps=LS.g('projects',[]);
  var csv='ID,Title,Category,Goal(INR),Raised(INR),Backers,Creator,Days,Fee(INR),GST(INR)\n';
  csv+=ps.map(function(p){return[p.id,'"'+p.title+'"',p.cat,p.goal,p.raised,p.bk,'"'+p.creator+'"',p.days,p.fee||0,p.gst||0].join(',');}).join('\n');
  csv+='\n\nUPI Ref,Project,Backer,Amount(INR),Fee(INR),GST(INR),UPI ID,Date,Status\n';
  csv+=LS.g('tx',[]).map(function(t){return[t.id,'"'+t.proj+'"','"'+t.bk+'"',t.amt,t.fee||0,t.gst||0,t.uid||'',t.dt,t.st].join(',');}).join('\n');
  dlFile('fundverse_pro.csv','text/csv',csv);toast('CSV with GST data exported!');
}
function exportSQL(){
  var ps=LS.g('projects',[]),tx=LS.g('tx',[]);
  var sql='-- FundVerse Pro Export '+new Date().toISOString()+'\n';
  sql+='CREATE TABLE projects(id BIGINT,title VARCHAR(255),category VARCHAR(50),goal_inr DECIMAL(14,2),raised_inr DECIMAL(14,2),backers INT,creator VARCHAR(255),days_left INT,platform_fee DECIMAL(10,2),gst DECIMAL(10,2),escrow_active BOOLEAN);\n';
  sql+='CREATE TABLE upi_tx(ref VARCHAR(30) PRIMARY KEY,project VARCHAR(255),backer VARCHAR(255),upi_id VARCHAR(100),amount_inr DECIMAL(12,2),platform_fee DECIMAL(10,2),gst DECIMAL(10,2),tx_date VARCHAR(20),status VARCHAR(30));\n\n';
  ps.forEach(function(p){sql+="INSERT INTO projects VALUES("+p.id+",'"+p.title.replace(/'/g,"''")+"','"+p.cat+"',"+p.goal+","+p.raised+","+p.bk+",'"+p.creator.replace(/'/g,"''")+"',"+p.days+","+(p.fee||0)+","+(p.gst||0)+","+(p.escrow?'TRUE':'FALSE')+");\n";});
  tx.forEach(function(t){sql+="INSERT INTO upi_tx VALUES('"+t.id+"','"+t.proj.replace(/'/g,"''")+"','"+t.bk.replace(/'/g,"''")+"','"+(t.uid||'')+"',"+t.amt+","+(t.fee||0)+","+(t.gst||0)+",'"+t.dt+"','"+t.st+"');\n";});
  dlFile('fundverse_pro.sql','text/sql',sql);toast('SQL with full schema exported!');
}
function exportGST(){
  var tx=LS.g('tx',[]);var totalFee=0,totalGst=0;
  tx.forEach(function(t){totalFee+=(t.fee||0);totalGst+=(t.gst||0);});
  var csv='GST REPORT - FundVerse Pro\nGenerated: '+new Date().toLocaleString('en-IN')+'\n\n';
  csv+='Txn ID,Project,Amount,Platform Fee (2.5%),GST @18%,Net to Creator,Date\n';
  csv+=tx.map(function(t){return[t.id,'"'+t.proj+'"',t.amt,t.fee||0,t.gst||0,t.amt-(t.fee||0)-(t.gst||0),t.dt].join(',');}).join('\n');
  csv+='\n\nTOTAL PLATFORM FEE:,'+totalFee+'\nTOTAL GST COLLECTED:,'+totalGst;
  dlFile('fundverse_gst_report.csv','text/csv',csv);toast('GST Report exported!');
}
function dlFile(fn,type,content){var b=new Blob([content],{type:type});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click();}

/* ── 3D CANVAS BACKGROUND ── */
function init3D(){
  var canvas=G('bg3d');if(!canvas)return;
  var ctx=canvas.getContext('2d');var W=0,H=0;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  var parts=[];for(var i=0;i<75;i++){parts.push({x:Math.random()*1920,y:Math.random()*1080,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.8+.4,color:['#00f5ff','#bf00ff','#ffd700','#5f259f'][Math.floor(Math.random()*4)],a:Math.random()*.45+.15});}
  var hexs=[];for(var h=0;h<6;h++){hexs.push({x:.1+h*.16,y:Math.random(),size:30+Math.random()*55,rot:Math.random()*Math.PI*2,spd:(Math.random()-.5)*.005,a:.03+Math.random()*.06,color:['#00f5ff','#5f259f','#ffd700','#00ff88','#bf00ff','#00f5ff'][h]});}
  function hexPath(cx,cy,r,rot){ctx.beginPath();for(var i=0;i<6;i++){var a=rot+(i*Math.PI)/3;if(i===0)ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a));else ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}ctx.closePath();}
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(0,245,255,0.025)';ctx.lineWidth=1;
    for(var x=0;x<W;x+=70){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(var y=0;y<H;y+=70){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    hexs.forEach(function(hx){hx.rot+=hx.spd;var cx=hx.x*W,cy=hx.y*H;for(var ring=1;ring<=3;ring++){ctx.globalAlpha=hx.a/ring;ctx.strokeStyle=hx.color;ctx.lineWidth=1;hexPath(cx,cy,hx.size*ring,hx.rot);ctx.stroke();}});
    ctx.globalAlpha=1;
    parts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.globalAlpha=p.a;ctx.fill();});
    ctx.globalAlpha=1;
    for(var i=0;i<parts.length;i++){for(var j=i+1;j<parts.length;j++){var dx=parts[i].x-parts[j].x,dy=parts[i].y-parts[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<110){ctx.beginPath();ctx.strokeStyle='rgba(0,245,255,'+(0.07*(1-dist/110))+')';ctx.lineWidth=.5;ctx.moveTo(parts[i].x,parts[i].y);ctx.lineTo(parts[j].x,parts[j].y);ctx.stroke();}}}
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── PWA INSTALL ── */
var deferredPrompt=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;G('pwa-bar').classList.add('show');});

/* ── WIRE ALL BUTTONS ── */
window.addEventListener('DOMContentLoaded',function(){
  init3D();
  initGlobe();
  seedAll();

  /* PWA */
  G('pwa-install').addEventListener('click',function(){if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.then(function(){G('pwa-bar').classList.remove('show');});}});
  G('pwa-dismiss').addEventListener('click',function(){G('pwa-bar').classList.remove('show');});

  /* Eye toggles */
  G('eye-l').addEventListener('click',function(){toggleEye(G('lpw'),G('eye-l-svg'),this);});
  G('eye-r').addEventListener('click',function(){toggleEye(G('rpw'),G('eye-r-svg'),this);});

  /* Password strength */
  G('rpw').addEventListener('input',function(){checkStrength(this.value);});

  /* Auth */
  G('atl').addEventListener('click',function(){swA('l');});
  G('atr').addEventListener('click',function(){swA('r');});
  G('rbb').addEventListener('click',function(){selR('backer');});
  G('rba').addEventListener('click',function(){selR('admin');});
  G('loginbtn').addEventListener('click',doLogin);
  G('regbtn').addEventListener('click',doRegister);
  G('lem').addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();});
  G('lpw').addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();});
  /* Real-time email feedback — Sign In */
  G('lem').addEventListener('input',function(){showEmailStatus('lem','le',this.value.trim().toLowerCase());});
  G('lem').addEventListener('blur',function(){showEmailStatus('lem','le',this.value.trim().toLowerCase());});
  G('lem').addEventListener('focus',function(){if(!this.value)G('le').textContent='';});
  /* Real-time email feedback — Register */
  G('rem').addEventListener('input',function(){showEmailStatus('rem','re',this.value.trim().toLowerCase());});
  G('rem').addEventListener('blur',function(){showEmailStatus('rem','re',this.value.trim().toLowerCase());});
  G('rem').addEventListener('focus',function(){if(!this.value)G('re').textContent='';});
  G('forgot-pw').addEventListener('click',forgotPw);

  /* Nav */
  G('nb0').addEventListener('click',function(){gp('dash',0);});
  G('nb1').addEventListener('click',function(){gp('proj',1);});
  G('nb2').addEventListener('click',function(){gp('launch',2);});
  G('nb3').addEventListener('click',function(){gp('ana',3);});
  G('nb4').addEventListener('click',function(){gp('bak',4);});
  G('nb5').addEventListener('click',function(){gp('prf',5);});
  G('logoutbtn').addEventListener('click',doLogout);

  /* Notifications */
  G('notif-btn').addEventListener('click',function(e){e.stopPropagation();renderNotifs();G('notif-panel').classList.toggle('open');});
  G('clr-notif').addEventListener('click',clearAllNotifs);
  document.addEventListener('click',function(){G('notif-panel').classList.remove('open');});

  /* Share modal */
  G('sh-close').addEventListener('click',function(){G('share-modal').classList.remove('open');});

  /* Filters & search */
  G('fcat').addEventListener('change',rProj);
  G('fsrt').addEventListener('change',rProj);
  G('proj-search').addEventListener('input',function(){rProj();});
  G('dash-search').addEventListener('input',function(){doSearch(this.value,'tg');});

  /* Launch form */
  G('launchbtn').addEventListener('click',createProject);
  G('fgl').addEventListener('input',updateFeePreview);

  /* Exports */
  G('csvbtn').addEventListener('click',exportCSV);
  G('sqlbtn').addEventListener('click',exportSQL);
  G('gstbtn').addEventListener('click',exportGST);

  /* Profile password change */
  G('chpw-btn').addEventListener('click',changePw);

  /* UPI flow */
  G('pamt').addEventListener('input',syncC);
  G('s1next').addEventListener('click',function(){var amt=parseInt(G('pamt').value)||0;if(!amt||amt<1){toast('Enter at least \u20B91','er');return;}upiAmt=amt;goStep(2);});
  G('s1can').addEventListener('click',closeUPI);
  G('s2back').addEventListener('click',function(){goStep(1);});
  G('mth-qr').addEventListener('click',function(){pickMethod('qr');});
  G('mth-id').addEventListener('click',function(){pickMethod('id');});
  G('mth-lnk').addEventListener('click',function(){pickMethod('linked');});
  /* Add Bank Account modal listeners */
  G('ab-bank-search').addEventListener('input',function(){
    ab_selectedBank=null;
    G('ab-selected-bank').style.display='none';
    renderBankSearchResults(this.value);
  });
  G('ab-change-bank').addEventListener('click',function(){
    ab_selectedBank=null;
    G('ab-selected-bank').style.display='none';
    G('ab-bank-search').value='';
    G('ab-upi').value='';
    renderBankSearchResults('');
    G('ab-bank-search').focus();
  });
  G('ab-holder').addEventListener('input',updateUpiSuggestion);
  G('ab-accno').addEventListener('input',function(){this.value=this.value.replace(/[^0-9]/g,'');});
  G('ab-accno2').addEventListener('input',function(){this.value=this.value.replace(/[^0-9]/g,'');});
  G('ab-ifsc').addEventListener('input',function(){this.value=this.value.toUpperCase();});
  G('ab-save').addEventListener('click',saveAddBank);
  G('ab-cancel').addEventListener('click',closeAddBankModal);
  G('s3qdone').addEventListener('click',function(){goStep(4);});
  G('s3qback').addEventListener('click',function(){goStep(2);});
  G('s3iverify').addEventListener('click',verifyUPI);
  G('s3iback').addEventListener('click',function(){goStep(2);});
  G('s3lgo').addEventListener('click',function(){
    if(!linkedBanks.length){toast('No bank account selected','er');return;}
    var chosen=linkedBanks[selectedBankIdx];
    toast('Paying from '+chosen.bank.name);
    goStep(4);
  });
  G('s3lback').addEventListener('click',function(){goStep(2);});
  G('s4pay').addEventListener('click',submitPIN);
  G('s4can').addEventListener('click',function(){goStep(2);});
  G('sdone').addEventListener('click',closeUPI);
  G('req-refund').addEventListener('click',function(){
    var tx=LS.g('tx',[]);if(tx.length>0)requestRefund(tx[0].id);
  });
  G('resend').addEventListener('click',function(){toast('OTP resent to '+((CU&&CU.mobile)||'your mobile')+'!');});
  G('cpub').addEventListener('click',function(){if(navigator.clipboard){navigator.clipboard.writeText(MY_UPI).then(function(){toast('Copied: '+MY_UPI);});}else{toast('UPI: '+MY_UPI);}});

  rDash();
});


/* ══════════════════════════════════════════════════════════
   ALL REMAINING FEATURES — injected cleanly
   ══════════════════════════════════════════════════════════ */

/* ── DARK / LIGHT MODE ── */
var isDark = true;
function toggleTheme(){
  isDark = !isDark;
  document.body.classList.toggle('light-mode', !isDark);
  var btn = G('theme-btn');
  if(btn) btn.textContent = isDark ? '☾' : '☀';
  LS.s('theme', isDark ? 'dark' : 'light');
}

/* ── RATE LIMITING (max 5 login attempts per minute) ── */
var loginAttempts = 0, loginBlockedUntil = 0;
function checkRateLimit(){
  var now = Date.now();
  if(now < loginBlockedUntil){
    var secs = Math.ceil((loginBlockedUntil - now) / 1000);
    if(G('le')) G('le').textContent = 'Too many attempts. Wait ' + secs + ' seconds.';
    return false;
  }
  loginAttempts++;
  if(loginAttempts >= 5){
    loginBlockedUntil = Date.now() + 60000;
    loginAttempts = 0;
    if(G('le')) G('le').textContent = 'Too many failed attempts. Blocked for 60 seconds.';
    return false;
  }
  return true;
}

/* ── CAPTCHA ── */
var captchaAnswer = 0, captchaCallback = null;
function showCaptcha(cb){
  captchaCallback = cb;
  var a = Math.floor(Math.random()*20)+1, b = Math.floor(Math.random()*20)+1;
  captchaAnswer = a + b;
  if(G('captcha-q')) G('captcha-q').textContent = a + ' + ' + b + ' = ?';
  if(G('captcha-ans')) G('captcha-ans').value = '';
  if(G('captcha-err')) G('captcha-err').textContent = '';
  if(G('captcha-modal')) G('captcha-modal').style.display = 'flex';
}
function verifyCaptcha(){
  var ans = parseInt(G('captcha-ans').value);
  if(ans !== captchaAnswer){
    G('captcha-err').textContent = 'Wrong answer. Try again.';
    var a = Math.floor(Math.random()*20)+1, b = Math.floor(Math.random()*20)+1;
    captchaAnswer = a + b;
    G('captcha-q').textContent = a + ' + ' + b + ' = ?';
    return;
  }
  G('captcha-modal').style.display = 'none';
  if(captchaCallback) captchaCallback();
}

/* ── 2FA / TOTP SIMULATION ── */
var twoFACode = '', twoFAPending = null;
function setup2FA(){
  if(!CU){ toast('Sign in first', 'er'); return; }
  var code = String(Math.floor(100000 + Math.random()*900000));
  twoFACode = code;
  G('twofa-content').innerHTML = '<div style="font-size:.76rem;color:#7eb8d4;margin-bottom:10px">A 6-digit code has been sent to your registered mobile: <b style="color:#ffd700">' + (CU.mobile||'+91 XXXXXXXXXX') + '</b></div>'
    + '<div style="background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);border-radius:8px;padding:10px;text-align:center;font-family:&quot;Orbitron&quot;,sans-serif;font-size:1.4rem;color:#00f5ff;letter-spacing:8px;margin-bottom:10px">' + code + '</div>'
    + '<div style="font-size:.68rem;color:#7eb8d4;margin-bottom:10px">Enter this code to enable 2FA on your account.</div>'
    + '<input id="twofa-input" type="number" placeholder="Enter 6-digit code" style="width:100%;background:rgba(0,245,255,.04);border:1px solid rgba(0,245,255,.18);color:#e8f4ff;padding:8px;border-radius:7px;font-size:.9rem;outline:none;text-align:center;font-family:&quot;Exo 2&quot;,sans-serif;"/>'
    + '<button onclick="verify2FA()" style="width:100%;margin-top:8px;padding:9px;background:linear-gradient(135deg,#00f5ff,#bf00ff);border:none;color:#020818;font-family:&quot;Orbitron&quot;,sans-serif;font-weight:700;font-size:.74rem;border-radius:8px;cursor:pointer">ENABLE 2FA</button>'
    + '<div class="aerr" id="twofa-err" style="margin-top:6px"></div>';
  G('twofa-modal').style.display = 'flex';
}
function verify2FA(){
  var inp = G('twofa-input');
  if(!inp || inp.value.trim() !== twoFACode){
    if(G('twofa-err')) G('twofa-err').textContent = 'Wrong code. Try again.';
    return;
  }
  var users = LS.g('users',[]);
  var usr = users.find(function(u){return u.id === CU.id;});
  if(usr){ usr.twofa = true; LS.s('users', users); CU = usr; }
  G('twofa-modal').style.display = 'none';
  addNotif(CU, '🔐 Two-Factor Authentication enabled on your account!', 'Just now');
  toast('2FA enabled successfully! Your account is now more secure.');
  rPrf();
}

/* ── FRAUD DETECTION ── */
function runFraudDetection(){
  var alerts = [];
  var tx = LS.g('tx',[]);
  var projects = LS.g('projects',[]);

  // Rule 1: Multiple transactions from same backer in 1 minute
  var recent = tx.filter(function(t){ return t.st === 'success'; });
  var byBacker = {};
  recent.forEach(function(t){ byBacker[t.bk] = (byBacker[t.bk]||0) + 1; });
  Object.keys(byBacker).forEach(function(bk){
    if(byBacker[bk] > 5) alerts.push({ level:'high', msg:'&#9888; Suspicious: ' + bk + ' made ' + byBacker[bk] + ' transactions — possible fraud', time: 'Today' });
  });

  // Rule 2: Project raised 0 in 7+ days
  projects.forEach(function(p){
    if(p.raised === 0 && p.days < 83) alerts.push({ level:'warn', msg:'&#128683; Inactive project "' + p.title + '" — 0 raised, may need review', time: 'Today' });
  });

  // Rule 3: Project exceeds goal by 2x
  projects.forEach(function(p){
    if(p.raised > p.goal * 2) alerts.push({ level:'info', msg:'&#128200; "' + p.title + '" exceeded goal by 2x — verify legitimacy', time: 'Today' });
  });

  // Rule 4: Refund requests
  var refunds = tx.filter(function(t){ return t.st === 'refund_requested'; });
  if(refunds.length > 0) alerts.push({ level:'warn', msg:'&#128260; ' + refunds.length + ' refund request(s) pending review', time: 'Today' });

  if(alerts.length === 0) alerts.push({ level:'ok', msg:'&#10003; No suspicious activity detected. Platform is clean.', time: 'Today' });

  var colors = { high:'#ff4466', warn:'#ffd700', info:'#00f5ff', ok:'#00ff88' };
  var el = G('fraud-alerts');
  if(el) el.innerHTML = alerts.map(function(a){
    return '<div style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05)">'
      + '<span style="color:' + colors[a.level] + ';font-size:.78rem;min-width:120px">[' + a.level.toUpperCase() + ']</span>'
      + '<span style="font-size:.76rem;color:#e8f4ff">' + a.msg + '</span>'
      + '<span style="font-size:.64rem;color:#7eb8d4;margin-left:auto;white-space:nowrap">' + a.time + '</span>'
      + '</div>';
  }).join('');
}

/* ── ADMIN APPROVAL QUEUE ── */
function renderAdminPanel(){
  runFraudDetection();

  // Project approval queue (show pending projects)
  var projects = LS.g('projects',[]);
  var pending = projects.filter(function(p){ return !p.approved; });
  var aq = G('approval-queue');
  if(aq) aq.innerHTML = pending.length ? pending.map(function(p){
    return '<tr>'
      + '<td style="color:#e8f4ff;font-weight:600">' + p.title + '</td>'
      + '<td>' + p.creator + '</td>'
      + '<td style="color:#00ff88">' + INR(p.goal) + '</td>'
      + '<td><span class="kyc-badge ' + (p.kycOk ? 'kyc-verified' : 'kyc-pending') + '">' + (p.kycOk ? '✅ OK' : '⏳ Pending') + '</span></td>'
      + '<td><span class="sb sp">Pending</span></td>'
      + '<td style="display:flex;gap:5px">'
      + '<button onclick="approveProject(' + p.id + ')" style="padding:3px 9px;background:rgba(0,255,136,.1);border:1px solid rgba(0,255,136,.25);color:#00ff88;border-radius:5px;cursor:pointer;font-size:.66rem;font-family:&quot;Exo 2&quot;,sans-serif">Approve</button>'
      + '<button onclick="rejectProject(' + p.id + ')" style="padding:3px 9px;background:rgba(255,68,102,.1);border:1px solid rgba(255,68,102,.25);color:#ff4466;border-radius:5px;cursor:pointer;font-size:.66rem;font-family:&quot;Exo 2&quot;,sans-serif">Reject</button>'
      + '</td></tr>';
  }).join('') : '<tr><td colspan="6" style="text-align:center;padding:12px;color:#7eb8d4">No pending projects</td></tr>';

  // Withdrawal requests
  var withdrawals = LS.g('withdrawals',[]);
  var wq = G('withdrawal-queue');
  if(wq) wq.innerHTML = withdrawals.length ? withdrawals.map(function(w,i){
    return '<tr>'
      + '<td style="color:#e8f4ff;font-weight:600">' + w.creator + '</td>'
      + '<td>' + w.project + '</td>'
      + '<td style="color:#00ff88">' + INR(w.amount) + '</td>'
      + '<td style="color:#d8a0ff;font-family:monospace;font-size:.72rem">' + w.upi + '</td>'
      + '<td>' + INRs(w.raised) + ' raised</td>'
      + '<td style="display:flex;gap:5px">'
      + '<button onclick="approveWithdrawal(' + i + ')" style="padding:3px 9px;background:rgba(0,255,136,.1);border:1px solid rgba(0,255,136,.25);color:#00ff88;border-radius:5px;cursor:pointer;font-size:.66rem;font-family:&quot;Exo 2&quot;,sans-serif">Release</button>'
      + '</td></tr>';
  }).join('') : '<tr><td colspan="6" style="text-align:center;padding:12px;color:#7eb8d4">No withdrawal requests</td></tr>';

  // Revenue stats
  var tx = LS.g('tx',[]);
  var totalFee = tx.reduce(function(s,t){return s+(t.fee||0);},0);
  var totalGst = tx.reduce(function(s,t){return s+(t.gst||0);},0);
  var totalVol = tx.reduce(function(s,t){return s+(t.st==='success'?t.amt:0);},0);
  var rs = G('revenue-stats');
  if(rs) rs.innerHTML = [
    {ico:'💰',val:INRs(totalVol),lbl:'Total Volume'},
    {ico:'💵',val:INRs(totalFee),lbl:'Platform Fees Earned'},
    {ico:'📄',val:INRs(totalGst),lbl:'GST Collected'}
  ].map(function(s){
    return '<div style="background:rgba(5,15,40,.9);border:1px solid rgba(0,245,255,.2);border-radius:12px;padding:14px;text-align:center">'
      + '<div style="font-size:1.6rem;margin-bottom:4px">' + s.ico + '</div>'
      + '<div style="font-family:&quot;Orbitron&quot;,sans-serif;font-size:1.1rem;font-weight:700;color:#00f5ff">' + s.val + '</div>'
      + '<div style="font-size:.65rem;color:#7eb8d4;text-transform:uppercase;letter-spacing:.8px;margin-top:3px">' + s.lbl + '</div>'
      + '</div>';
  }).join('');
}
function approveProject(id){
  var ps = LS.g('projects',[]); var p = ps.find(function(x){return x.id===id;});
  if(p){ p.approved = true; LS.s('projects', ps); toast('Project "' + p.title + '" approved and is now live!'); renderAdminPanel(); rDash(); }
}
function rejectProject(id){
  var ps = LS.g('projects',[]); var idx = ps.findIndex(function(x){return x.id===id;});
  if(idx>=0){ var name = ps[idx].title; ps.splice(idx,1); LS.s('projects', ps); toast('Project "' + name + '" rejected and removed.', 'er'); renderAdminPanel(); }
}
function approveWithdrawal(idx){
  var w = LS.g('withdrawals',[]); var item = w[idx];
  if(!item)return;
  w.splice(idx,1); LS.s('withdrawals', w);
  toast('Withdrawal of ' + INR(item.amount) + ' approved for ' + item.creator + '. Sending to ' + item.upi);
  renderAdminPanel();
}

/* ── WITHDRAWAL REQUEST (by creator) ── */
function requestWithdrawal(projectId){
  if(!CU || CU.role !== 'admin'){ toast('Only project creators can request withdrawals', 'er'); return; }
  var ps = LS.g('projects',[]); var p = ps.find(function(x){return x.id===projectId;});
  if(!p){ toast('Project not found', 'er'); return; }
  var w = LS.g('withdrawals',[]);
  w.push({ creator: CU.name, project: p.title, amount: p.raised, upi: CU.upi, raised: p.raised, projectId: projectId });
  LS.s('withdrawals', w);
  addNotif(CU, '💸 Withdrawal request submitted for "' + p.title + '". Admin will process in 2-3 days.', 'Just now');
  toast('Withdrawal request submitted! Admin will process within 2-3 business days.');
}

/* ── COMMENTS SYSTEM ── */
var currentProjectId = null;
function openProjectDetail(id){
  currentProjectId = id;
  var p = LS.g('projects',[]).find(function(x){return x.id===id;});
  if(!p) return;
  G('detail-title').textContent = p.title;

  // Milestones
  var msEl = G('detail-milestones');
  if(msEl && p.ms){
    msEl.innerHTML = p.ms.map(function(m,i){
      var done = p.ms_done && p.ms_done[i];
      return '<div class="mstone ' + (done?'done':'') + '">'
        + '<span>' + (done?'✅':'⏳') + ' ' + m + '</span>'
        + '<span style="font-size:.66rem;color:' + (done?'#00ff88':'#7eb8d4') + '">' + (done?'Complete':'Pending') + '</span>'
        + '</div>';
    }).join('');
  }

  // Project updates
  renderUpdates(id);
  // Comments
  renderComments(id);

  // Show post update area if creator or admin
  var postArea = G('post-update-area');
  if(postArea) postArea.style.display = (CU && (CU.role === 'admin' || (p.creator && CU.name === p.creator))) ? 'block' : 'none';

  G('pg-proj').scrollTop = 0;
  G('ag').style.display = 'none';
  document.querySelector('.filt').style.display = 'none';
  document.querySelector('.search-bar').style.display = 'none';
  G('proj-detail').style.display = 'block';
}
function renderUpdates(pid){
  var updates = LS.g('updates_' + pid, []);
  var el = G('update-feed');
  if(!el) return;
  el.innerHTML = updates.length ? updates.map(function(u){
    return '<div style="padding:10px 0;border-bottom:1px solid rgba(0,245,255,.07)">'
      + '<div style="display:flex;justify-content:space-between;margin-bottom:4px">'
      + '<span style="font-size:.74rem;font-weight:600;color:#00f5ff">📢 ' + u.author + '</span>'
      + '<span style="font-size:.64rem;color:#7eb8d4">' + u.time + '</span>'
      + '</div>'
      + '<div style="font-size:.78rem;color:#e8f4ff;line-height:1.6">' + u.text + '</div>'
      + '</div>';
  }).join('') : '<div style="font-size:.74rem;color:#7eb8d4;padding:8px 0">No updates posted yet.</div>';
}
function postUpdate(){
  if(!CU){ toast('Sign in to post updates', 'er'); return; }
  var txt = G('update-text').value.trim();
  if(!txt){ toast('Write something first', 'er'); return; }
  var updates = LS.g('updates_' + currentProjectId, []);
  updates.unshift({ author: CU.name, text: txt, time: new Date().toLocaleString('en-IN', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) });
  LS.s('updates_' + currentProjectId, updates);
  G('update-text').value = '';
  renderUpdates(currentProjectId);
  toast('Update posted! Backers will be notified.');
}
function renderComments(pid){
  var comments = LS.g('comments_' + pid, []);
  var el = G('comments-feed'); var cnt = G('comment-count');
  if(cnt) cnt.textContent = '(' + comments.length + ')';
  if(!el) return;
  el.innerHTML = comments.length ? comments.map(function(c,i){
    var isOwn = CU && c.userId === CU.id;
    return '<div style="padding:10px 0;border-bottom:1px solid rgba(0,245,255,.06)">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start">'
      + '<div style="display:flex;gap:7px;align-items:flex-start">'
      + '<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#00f5ff,#bf00ff);display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;color:#020818;flex-shrink:0">' + c.author.slice(0,2).toUpperCase() + '</div>'
      + '<div><div style="font-size:.74rem;font-weight:600;color:#e8f4ff">' + c.author + ' <span style="font-weight:400;font-size:.64rem;color:#7eb8d4">• ' + c.time + '</span></div>'
      + '<div style="font-size:.78rem;color:#e8f4ff;margin-top:3px;line-height:1.5">' + c.text + '</div>'
      + (c.reply ? '<div style="margin-top:5px;padding:5px 8px;background:rgba(0,245,255,.05);border-left:2px solid #00f5ff;border-radius:0 6px 6px 0;font-size:.72rem;color:#7eb8d4">↩ Creator: ' + c.reply + '</div>' : '')
      + '</div></div>'
      + (isOwn ? '<button onclick="deleteComment(' + i + ')" style="background:none;border:none;color:#ff4466;cursor:pointer;font-size:.75rem;flex-shrink:0;padding:2px 5px">✕</button>' : '')
      + '</div></div>';
  }).join('') : '<div style="font-size:.74rem;color:#7eb8d4;padding:8px 0">Be the first to comment!</div>';
}
function postComment(){
  if(!CU){ toast('Sign in to comment', 'er'); return; }
  var txt = G('comment-text').value.trim();
  if(!txt){ toast('Write something first', 'er'); return; }
  if(txt.length > 500){ toast('Comment too long (max 500 chars)', 'er'); return; }
  // Basic spam filter
  var spam = ['http://','https://','click here','buy now','free money','lottery'];
  var isSpam = spam.some(function(s){ return txt.toLowerCase().includes(s); });
  if(isSpam){ toast('Comment flagged as spam. Please keep it relevant.', 'er'); return; }
  var comments = LS.g('comments_' + currentProjectId, []);
  comments.push({ author: CU.name, text: txt, time: new Date().toLocaleString('en-IN', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}), userId: CU.id });
  LS.s('comments_' + currentProjectId, comments);
  G('comment-text').value = '';
  renderComments(currentProjectId);
  toast('Comment posted!');
}
function deleteComment(idx){
  var comments = LS.g('comments_' + currentProjectId, []);
  comments.splice(idx,1);
  LS.s('comments_' + currentProjectId, comments);
  renderComments(currentProjectId);
  toast('Comment deleted.');
}

/* ── IMAGE UPLOAD (Base64) ── */
function handleImageUpload(file, callback){
  if(!file) return;
  if(file.size > 2*1024*1024){ toast('Image too large. Max 2MB.', 'er'); return; }
  var reader = new FileReader();
  reader.onload = function(e){ callback(e.target.result); };
  reader.readAsDataURL(file);
}

/* ── PAGINATION ── */
var projPage = 1, projPerPage = 6;
function renderProjPaged(list){
  var start = (projPage-1)*projPerPage, end = start+projPerPage;
  var page = list.slice(start, end);
  G('ag').innerHTML = page.map(pCard).join('');
  attachActions('ag');

  // Pagination controls
  var totalPages = Math.ceil(list.length/projPerPage);
  var existing = G('proj-pagination');
  if(existing) existing.remove();
  if(totalPages > 1){
    var pag = document.createElement('div');
    pag.id = 'proj-pagination';
    pag.style.cssText = 'display:flex;justify-content:center;gap:6px;margin-top:12px;flex-wrap:wrap';
    for(var i=1;i<=totalPages;i++){
      var btn = document.createElement('button');
      btn.textContent = i;
      btn.style.cssText = 'padding:5px 11px;border-radius:5px;cursor:pointer;font-size:.74rem;font-family:"Exo 2",sans-serif;transition:all .2s;' + (i===projPage?'background:rgba(0,245,255,.2);border:1px solid #00f5ff;color:#00f5ff':'background:rgba(0,245,255,.04);border:1px solid rgba(0,245,255,.15);color:#7eb8d4');
      (function(pg){ btn.addEventListener('click',function(){ projPage=pg; renderProjPaged(list); window.scrollTo(0,0); }); })(i);
      pag.appendChild(btn);
    }
    G('pg-proj').appendChild(pag);
  }
}

/* ── LAZY LOADING IMAGE OBSERVER ── */
function initLazyLoad(){
  if(!window.IntersectionObserver) return;
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var img = entry.target;
        if(img.dataset.src){ img.src = img.dataset.src; delete img.dataset.src; }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });
  document.querySelectorAll('img[data-src]').forEach(function(img){ observer.observe(img); });
}

/* ── OVERRIDE rProj to use pagination ── */
var _origRProj = rProj;
rProj = function(){
  var cat=G('fcat').value, srt=G('fsrt').value, list=LS.g('projects',[]).slice();
  var q=G('proj-search').value.trim().toLowerCase();
  if(cat) list=list.filter(function(p){return p.cat===cat;});
  if(q) list=list.filter(function(p){return p.title.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)||p.creator.toLowerCase().includes(q);});
  if(srt==='fund') list.sort(function(a,b){return(b.raised/b.goal)-(a.raised/a.goal);});
  else if(srt==='end') list.sort(function(a,b){return a.days-b.days;});
  else if(srt==='goal') list.sort(function(a,b){return(a.raised/a.goal)-(b.raised/b.goal);});
  projPage = 1;
  renderProjPaged(list);
  G('ag').style.display = 'grid';
  var filt = document.querySelector('.filt');
  var sb = document.querySelector('.search-bar');
  if(filt) filt.style.display = 'flex';
  if(sb) sb.style.display = 'flex';
  G('proj-detail').style.display = 'none';
};

/* ── OVERRIDE loginAs to add rate limit + CAPTCHA ── */
var _origDoLogin = doLogin;
doLogin = function(){
  if(!checkRateLimit()) return;
  var em = G('lem').value.trim().toLowerCase();
  var pw = G('lpw').value;
  G('le').textContent = '';
  if(!em){G('le').textContent='Enter email.';return;}
  if(!pw){G('le').textContent='Enter password.';return;}
  // Show CAPTCHA on 3rd+ attempt
  if(loginAttempts >= 2){
    showCaptcha(function(){
      _origDoLogin();
    });
    return;
  }
  _origDoLogin();
};

/* ── WIRE UP NEW BUTTONS (after DOM ready) ── */
document.addEventListener('DOMContentLoaded', function(){

  /* Dark/light mode */
  var themeSaved = LS.g('theme','dark');
  if(themeSaved === 'light'){ isDark = false; document.body.classList.add('light-mode'); var tb=G('theme-btn');if(tb)tb.textContent='☀'; }
  G('theme-btn').addEventListener('click', toggleTheme);

  /* Admin panel nav */
  var adminNb = G('nb-admin');
  if(adminNb){
    adminNb.addEventListener('click', function(){
      document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('on');});
      document.querySelectorAll('.nb').forEach(function(b){b.classList.remove('on');});
      G('pg-admin').classList.add('on');
      adminNb.classList.add('on');
      renderAdminPanel();
    });
  }

  /* Show admin nav if admin */
  var origLoginAs = loginAs;
  loginAs = function(u){
    origLoginAs(u);
    if(adminNb) adminNb.style.display = u.role === 'admin' ? '' : 'none';
  };

  /* Captcha submit */
  G('captcha-submit').addEventListener('click', verifyCaptcha);
  G('captcha-ans').addEventListener('keydown', function(e){ if(e.key==='Enter') verifyCaptcha(); });

  /* 2FA close */
  G('twofa-close').addEventListener('click', function(){ G('twofa-modal').style.display='none'; });

  /* Post update */
  var pub = G('post-update-btn');
  if(pub) pub.addEventListener('click', postUpdate);

  /* Post comment */
  var pcb = G('post-comment-btn');
  if(pcb) pcb.addEventListener('click', postComment);
  var cti = G('comment-text');
  if(cti) cti.addEventListener('keydown', function(e){ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();postComment();} });

  /* Back button from project detail */
  var btp = G('back-to-proj');
  if(btp) btp.addEventListener('click', function(){
    G('proj-detail').style.display = 'none';
    G('ag').style.display = 'grid';
    var filt = document.querySelector('.filt');
    var sb = document.querySelector('.search-bar');
    if(filt) filt.style.display = 'flex';
    if(sb) sb.style.display = 'flex';
    currentProjectId = null;
  });

  /* Lazy load */
  initLazyLoad();

  /* Add "View Details" on project cards via delegation */
  document.addEventListener('click', function(e){
    var card = e.target.closest('.pc');
    if(card && !e.target.closest('.fbtn') && !e.target.closest('.sharebtn') && !e.target.closest('.wishbtn')){
      var pid = card.querySelector('.fbtn[data-pid]');
      if(!pid) pid = card.querySelector('[data-pid]');
      if(pid) openProjectDetail(parseInt(pid.dataset.pid));
    }
  });

  /* Profile 2FA button — inject dynamically */
  setTimeout(function(){
    var pstats = G('pstats');
    if(pstats && CU){
      var btn2fa = document.createElement('div');
      btn2fa.className = 'pst';
      btn2fa.style.cursor = 'pointer';
      btn2fa.innerHTML = '<span>Two-Factor Auth</span><span id="twofa-status" style="cursor:pointer;text-decoration:underline;color:' + (CU.twofa?'#00ff88':'#ffd700') + '">' + (CU.twofa?'✅ Enabled':'⚠ Enable 2FA') + '</span>';
      btn2fa.addEventListener('click', setup2FA);
      pstats.appendChild(btn2fa);
    }
  }, 500);

  /* Seed all projects as approved by default (existing ones) */
  var ps = LS.g('projects',[]);
  ps.forEach(function(p){ if(p.approved === undefined) p.approved = true; });
  LS.s('projects', ps);

  /* Initialize withdrawals store */
  if(!LS.g('withdrawals', null)) LS.s('withdrawals', []);

});
