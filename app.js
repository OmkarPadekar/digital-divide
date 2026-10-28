const C=['#287cf2','#29b56f','#f5a623','#e45a55'];
const N=['Infrastructure','Digital literacy','Affordability','Outcomes'];
const D={'Metro area':[92,81,78,74],'Small town':[78,62,60,52],'Rural village':[55,41,45,33],'Low-income ward':[85,48,32,35]};
const NAT=[72,56,52,44];
const state={profile:'Metro area',values:[...D['Metro area']],selected:2};
const $=s=>document.querySelector(s);
const avg=a=>Math.round(a.reduce((x,y)=>x+y,0)/a.length);
const page=document.body.dataset.page;

function nav(){
  const current=page==='home'?'index.html':`${page}.html`;
  $('#site-nav').innerHTML=`<nav class="site-nav"><div class="page-shell nav-inner"><a class="brand" href="index.html"><span class="brand-mark">DD</span><span>Digital Divide</span></a><div class="nav-links"><a class="${page==='home'?'active':''}" href="index.html">Overview</a><a class="${page==='explore'?'active':''}" href="explore.html">Explore</a><a class="${page==='compare'?'active':''}" href="compare.html">Compare</a><a class="${page==='method'?'active':''}" href="method.html">Method</a></div><div class="nav-cta"><a class="nav-login" href="login.html">${localStorage.getItem('ddUser')?'Signed in':'Sign in'}</a><a class="button button-primary" href="explore.html">Try the tool</a><button class="nav-menu" type="button" aria-label="Open navigation">☰</button></div></div></nav>`;
}
function footer(){if(!$('#site-footer'))return;$('#site-footer').innerHTML=`<footer><div class="page-shell footer-inner"><span>Digital Divide · A layered way to measure connection.</span><div class="footer-links"><a href="method.html">Method</a><a href="login.html">Sign in</a></div></div></footer>`}
function profileTabs(){
  const el=$('#profile-tabs'); if(!el)return;
  el.innerHTML=Object.keys(D).map(n=>`<button type="button" aria-pressed="${n===state.profile}">${n}</button>`).join('');
  el.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{state.profile=btn.textContent;state.values=[...D[state.profile]];state.selected=2;profileTabs();renderExplore()}));
}
function setupRings(){
  const svg=$('#rings');if(!svg)return;
  const radii=[148,116,84,52];
  svg.innerHTML=radii.map((r,i)=>{const circumference=2*Math.PI*r;return `<circle class="ring-track" cx="180" cy="180" r="${r}" fill="none" stroke-width="18"/><circle class="ring-hit" id="ring-${i}" data-index="${i}" cx="180" cy="180" r="${r}" fill="none" stroke="${C[i]}" stroke-width="18" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" transform="rotate(-90 180 180)" tabindex="0" role="button" aria-label="${N[i]} score"/>`}).join('');
  $('#legend').innerHTML=N.map((n,i)=>`<li id="lg-${i}"><i style="background:${C[i]}"></i><span>${n}</span><b>0</b></li>`).join('');
  svg.insertAdjacentHTML('beforeend','<g id="ring-label" class="ring-number" pointer-events="none"></g>');
  svg.querySelectorAll('.ring-hit').forEach(r=>{const select=()=>{state.selected=+r.dataset.index;renderExplore()};r.addEventListener('click',select);r.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}})});
}
function setupControls(){
  const el=$('#controls');if(!el)return;
  el.innerHTML=N.map((n,i)=>`<div class="control-row"><label for="range-${i}">${n}</label><output id="output-${i}">0</output><input id="range-${i}" type="range" min="0" max="100" value="0" aria-label="${n} score"></div>`).join('');
  N.forEach((_,i)=>$('#range-'+i).addEventListener('input',e=>{state.values[i]=+e.target.value;state.profile='Custom profile';profileTabs();renderExplore()}));
  $('#reset-calc').addEventListener('click',()=>{state.profile='Metro area';state.values=[...D['Metro area']];state.selected=2;profileTabs();renderExplore()});
}
function renderExplore(){
  if(!$('#rings'))return;
  const values=state.values,m=avg(values),selected=state.selected;
  values.forEach((v,i)=>{const ring=$('#ring-'+i);const r=[148,116,84,52][i],circ=2*Math.PI*r;ring.style.strokeDashoffset=circ*(1-v/100);ring.classList.toggle('selected',i===selected);ring.setAttribute('aria-label',`${N[i]} score ${v}`);$('#output-'+i).textContent=v;$('#range-'+i).value=v;$('#lg-'+i).innerHTML=`<i style="background:${C[i]}"></i><span>${N[i]}</span><b>${v}</b>`});
  const labelRadius=[148,116,84,52][selected],labelX=180+labelRadius*.71,labelY=180-labelRadius*.71;
  $('#ring-label').innerHTML=`<rect x="${labelX-23}" y="${labelY-18}" width="46" height="36" rx="12" fill="${C[selected]}"/><text x="${labelX}" y="${labelY+7}" text-anchor="middle" fill="#fff" font-size="16" font-weight="800">${values[selected]}</text>`;
  $('#cnum').textContent=m;$('#sSingle').textContent=values[0];$('#sMulti').textContent=m;$('#center-label').textContent=selected===null?'Overall score':`${N[selected]} selected`;
  $('#detail-value').textContent=values[selected];$('#detail-name').textContent=N[selected];
  const gap=values[0]-m,weakest=values.indexOf(Math.min(...values));
  $('#gapnote').textContent=gap>=15?`Access overstates progress by ${gap} points. The weakest layer is ${N[weakest].toLowerCase()}.`:gap>=5?`There is a ${gap}-point gap between access and the layered picture.`:`The layers are relatively balanced. Keep an eye on ${N[weakest].toLowerCase()}.`;
  radar(values);
}
function radar(values){
  const svg=$('#radar');if(!svg)return;const cx=275,cy=185,r=135,pt=(i,v)=>{const a=-Math.PI/2+i*Math.PI/2;return[cx+r*v/100*Math.cos(a),cy+r*v/100*Math.sin(a)]},poly=a=>a.map((v,i)=>pt(i,v).join(',')).join('');
  let s=[25,50,75,100].map(v=>`<polygon class="grid" points="${poly([v,v,v,v])}"/>`).join('');s+=[0,1,2,3].map(i=>{const[x,y]=pt(i,100);return`<line class="grid" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`}).join('');
  const labels=[[cx,cy-r-20,'middle'],[cx+r+18,cy+4,'start'],[cx,cy+r+28,'middle'],[cx-r-18,cy+4,'end']];
  s+=labels.map((p,i)=>`<text class="strong" x="${p[0]}" y="${p[1]}" text-anchor="${p[2]}">${N[i]}</text>`).join('');
  s+=`<polygon points="${poly(NAT)}" fill="none" stroke="#8f99a6" stroke-width="2.5" stroke-dasharray="7 6"/><polygon points="${poly(values)}" fill="#287cf2" fill-opacity=".16" stroke="#287cf2" stroke-width="3" stroke-linejoin="round"/>`;
  s+=values.map((v,i)=>{const[x,y]=pt(i,v);return`<circle cx="${x}" cy="${y}" r="6" fill="${C[i]}" stroke="#fff" stroke-width="3"/>`}).join('');s+=`<text x="20" y="365">Dashed line: national average</text>`;svg.innerHTML=s;
}
function bars(){
  const svg=$('#bars');if(!svg)return;const names=Object.keys(D),W=860,H=400,l=55,r=28,b=68,top=30,plotH=H-b-top,groupW=(W-l-r)/names.length;let s='';[0,25,50,75,100].forEach(v=>{const y=H-b-plotH*v/100;s+=`<line class="grid" x1="${l}" x2="${W-r}" y1="${y}" y2="${y}"/><text x="${l-12}" y="${y+4}" text-anchor="end">${v}</text>`});names.forEach((n,i)=>{const x=l+i*groupW+groupW/2;[[D[n][0],'#8f99a6',-29],[avg(D[n]),'#287cf2',5]].forEach(([v,c,dx])=>{const h=plotH*v/100;s+=`<rect x="${x+dx}" y="${H-b-h}" width="34" height="${h}" rx="8" fill="${c}"/><text class="bar-value" x="${x+dx+17}" y="${H-b-h-9}" text-anchor="middle">${v}</text>`});s+=`<text x="${x}" y="${H-29}" text-anchor="middle" class="strong">${n}</text>`});svg.innerHTML=s;
}
function funnel(){const el=$('#funnel');if(!el)return;const F=[['Live in a coverage area',88],['Can afford a connection',61],['Have the skills to use it',44],['Gain a measurable benefit',29]];el.innerHTML=F.map(([label,v],i)=>`<div class="funnel-row"><span>${label}</span><div class="funnel-track"><div class="funnel-fill" style="width:${v}%;background:${C[i]}">${v}%</div></div></div>`).join('')}
function trend(){
  const svg=$('#trendsvg');if(!svg)return;const Y=[2018,2019,2020,2021,2022,2023,2024,2025],T=[[52,57,63,68,72,76,79,81],[38,41,45,49,52,55,57,58],[35,37,40,43,46,48,50,51],[24,27,31,34,37,40,42,44]],W=860,H=420,l=55,r=155,b=48,top=24,x=i=>l+(W-l-r)*i/7,y=v=>H-b-(H-b-top)*v/100;let s='';[0,25,50,75,100].forEach(v=>s+=`<line class="grid" x1="${l}" x2="${W-r+30}" y1="${y(v)}" y2="${y(v)}"/><text x="${l-12}" y="${y(v)+4}" text-anchor="end">${v}</text>`);Y.forEach((v,i)=>s+=`<text x="${x(i)}" y="${H-17}" text-anchor="middle">${v}</text>`);T.forEach((a,k)=>{s+=`<path d="${a.map((v,i)=>(i?'L':'M')+x(i)+','+y(v)).join('')}" fill="none" stroke="${C[k]}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x(7)}" cy="${y(a[7])}" r="6" fill="${C[k]}"/><text class="strong" x="${x(7)+13}" y="${y(a[7])+4}">${N[k]} ${a[7]}</text>`});svg.innerHTML=s;
}
function auth(){
  const form=$('#login-form');if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();const email=$('#email').value.trim();localStorage.setItem('ddUser',email);$('#form-message').textContent='You’re signed in. Taking you to the explorer…';setTimeout(()=>location.href='explore.html',500)});$('#continue-guest').addEventListener('click',()=>location.href='explore.html');
}
nav();footer();
if(page==='explore'){profileTabs();setupRings();setupControls();renderExplore()}
if(page==='compare'){bars();funnel();trend()}
auth();
