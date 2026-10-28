const C=['#0A84FF','#30D158','#FF9F0A','#FF453A'];
const N=['Infrastructure','Digital literacy','Affordability','Outcomes'];
const D={'Metro area':[92,81,78,74],'Small town':[78,62,60,52],'Rural village':[55,41,45,33],'Low-income ward':[85,48,32,35]};
const NAT=[72,56,52,44];
const st={p:'Metro area',v:[...D['Metro area']]};
const $=s=>document.querySelector(s);
const avg=a=>Math.round(a.reduce((x,y)=>x+y,0)/a.length);

/* rings */
const R=[128,100,72,44],CI=R.map(r=>2*Math.PI*r);
$('#rings').innerHTML=R.map((r,i)=>`<circle cx="150" cy="150" r="${r}" fill="none" stroke="${C[i]}" stroke-opacity=".18" stroke-width="20"/><circle class="arc" id="a${i}" cx="150" cy="150" r="${r}" fill="none" stroke="${C[i]}" stroke-width="20" stroke-linecap="round" stroke-dasharray="${CI[i]}" stroke-dashoffset="${CI[i]}" transform="rotate(-90 150 150)"/>`).join('');
$('#legend').innerHTML=N.map((n,i)=>`<li><i style="background:${C[i]}"></i>${n} <b id="lg${i}"></b></li>`).join('');

/* controls */
function segs(){const s=$('#seg1');s.innerHTML=Object.keys(D).map(n=>`<button aria-pressed="${n===st.p}">${n}</button>`).join('');
 s.querySelectorAll('button').forEach(b=>b.onclick=()=>{st.p=b.textContent;st.v=[...D[st.p]];segs();sync()})}
$('#ctl').innerHTML=N.map((n,i)=>`<label style="--c:${C[i]}"><span>${n}</span><output id="o${i}"></output><input type="range" min="0" max="100" id="r${i}" aria-label="${n} score"></label>`).join('');
N.forEach((n,i)=>$('#r'+i).oninput=e=>{st.v[i]=+e.target.value;st.p=null;segs();render()});

/* radar */
function radar(){const cx=180,cy=170,r=118,pt=(i,v)=>{const a=-Math.PI/2+i*Math.PI/2;return[cx+r*v/100*Math.cos(a),cy+r*v/100*Math.sin(a)]};
 const poly=(a)=>a.map((v,i)=>pt(i,v).join(',')).join(' ');
 let g=[25,50,75,100].map(v=>`<polygon class="grid" points="${poly([v,v,v,v])}"/>`).join('');
 g+=[0,1,2,3].map(i=>{const[x,y]=pt(i,100);return`<line class="grid" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`}).join('');
 const lb=[[cx,cy-r-14,'middle'],[cx+r+12,cy+4,'start'],[cx,cy+r+22,'middle'],[cx-r-12,cy+4,'end']].map((p,i)=>`<text class="strong" x="${p[0]}" y="${p[1]}" text-anchor="${p[2]}">${N[i]}</text>`).join('');
 $('#radar').innerHTML=g+`<polygon points="${poly(NAT)}" fill="none" stroke="#8E8E93" stroke-width="2" stroke-dasharray="5 4"/><polygon points="${poly(st.v)}" fill="#0A84FF" fill-opacity=".22" stroke="#0A84FF" stroke-width="2.5" stroke-linejoin="round"/>`+st.v.map((v,i)=>{const[x,y]=pt(i,v);return`<circle cx="${x}" cy="${y}" r="5.5" fill="${C[i]}" stroke="#fff" stroke-width="2"/>`}).join('')+lb+`<text x="14" y="326">Dashed line: national average</text>`}

/* grouped bars */
function bars(){const names=Object.keys(D),W=720,H=320,b=40,l=40,gw=(W-l-10)/names.length;let s='';
 [0,25,50,75,100].forEach(v=>{const y=H-b-(H-b-20)*v/100;s+=`<line class="grid" x1="${l}" x2="${W}" y1="${y}" y2="${y}"/><text x="${l-8}" y="${y+4}" text-anchor="end">${v}</text>`});
 names.forEach((n,i)=>{const x0=l+i*gw+gw/2,a=D[n][0],m=avg(D[n]);
  [[a,'#8E8E93',-34],[m,'#0A84FF',2]].forEach(([v,c,dx])=>{const h=(H-b-20)*v/100;s+=`<rect x="${x0+dx}" y="${H-b-h}" width="32" height="${h}" rx="8" fill="${c}"/><text class="strong" x="${x0+dx+16}" y="${H-b-h-7}" text-anchor="middle">${v}</text>`});
  s+=`<text x="${x0}" y="${H-12}" text-anchor="middle" class="strong">${n}</text>`});
 $('#bars').innerHTML=s}

/* funnel */
const F=[['Live in a coverage area',88],['Can afford a connection',61],['Have the skills to use it',44],['Gain a measurable benefit',29]];
$('#funnel').innerHTML=F.map(([l,v],i)=>`<div class="fr"><span>${l}</span><div class="ft"><div class="ff" data-w="${v}" style="background:${C[i]}">${v}</div></div></div>`).join('');

/* trend */
function trend(){const Y=[2018,2019,2020,2021,2022,2023,2024,2025],T=[[52,57,63,68,72,76,79,81],[38,41,45,49,52,55,57,58],[35,37,40,43,46,48,50,51],[24,27,31,34,37,40,42,44]];
 const W=720,H=340,l=40,r=110,b=36,t=14,x=i=>l+(W-l-r)*i/7,y=v=>H-b-(H-b-t)*v/100;let s='';
 [0,25,50,75,100].forEach(v=>s+=`<line class="grid" x1="${l}" x2="${W-r+10}" y1="${y(v)}" y2="${y(v)}"/><text x="${l-8}" y="${y(v)+4}" text-anchor="end">${v}</text>`);
 Y.forEach((v,i)=>s+=`<text x="${x(i)}" y="${H-10}" text-anchor="middle">${v}</text>`);
 T.forEach((a,k)=>{s+=`<path class="line" pathLength="1" d="${a.map((v,i)=>(i?'L':'M')+x(i)+','+y(v)).join('')}" fill="none" stroke="${C[k]}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x(7)}" cy="${y(a[7])}" r="5" fill="${C[k]}"/><text class="strong" x="${x(7)+12}" y="${y(a[7])+4}">${N[k]} ${a[7]}</text>`});
 $('#trendsvg').innerHTML=s}

/* render */
function render(){const v=st.v,m=avg(v),w=v.indexOf(Math.min(...v)),g=v[0]-m;
 v.forEach((x,i)=>{$('#a'+i).style.strokeDashoffset=CI[i]*(1-x/100);$('#lg'+i).textContent=x;$('#o'+i).textContent=x;$('#r'+i).value=x});
 $('#cnum').textContent=m;$('#sSingle').textContent=v[0];$('#sMulti').textContent=m;
 $('#gapnote').textContent=g>=15?`Access-only overstates progress by ${g} points. Weakest layer: ${N[w].toLowerCase()} (${v[w]}).`:g>=5?`A moderate gap of ${g} points. Weakest layer: ${N[w].toLowerCase()} (${v[w]}).`:`The layers are fairly balanced. Weakest layer: ${N[w].toLowerCase()} (${v[w]}).`;
 radar()}
function sync(){render()}
segs();bars();trend();
setTimeout(render,150);

/* one scroll reveal per chart */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.ff').forEach(f=>f.style.width=f.dataset.w+'%');io.unobserve(e.target)}}),{threshold:.3});
document.querySelectorAll('#dropoff .card,#trend .card').forEach(el=>io.observe(el));
