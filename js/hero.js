/* hero: letter reveal, typed role, particle network, tilt, scroll parallax, marquee */
(()=>{
'use strict';
const {$,$$,clamp,reduce,fine}=window.P;

/* split the headline into letters for the blur-in sequence */
const h=$('#heroName');
h.innerHTML=[...'Ali Assad.'].map((c,i)=>c===' '?`<span class="ch sp" style="--i:${i}" aria-hidden="true">&nbsp;</span>`:`<span class="ch${c==='.'?' dot':''}" style="--i:${i}" aria-hidden="true">${c}</span>`).join('');

/* typed role line */
const typed=$('#typed');
const roles=['Principal','Team Lead','Cloud Architect','Full-Stack Engineer','Laravel + Django'];
if(reduce){typed.textContent=roles[0]}
else{
  let ri=0,ci=0,del=false;
  (function tick(){
    const w=roles[ri];
    typed.textContent=w.slice(0,ci);
    let d=del?32:70;
    if(!del&&ci===w.length){d=1700;del=true}
    else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;d=380}
    else ci+=del?-1:1;
    setTimeout(tick,d);
  })();
}

/* ---------- particle network (pauses when off-screen) ---------- */
const hero=$('#hero'),cv=$('#net'),ctx=cv.getContext('2d');
let W=0,H=0,DPR=1,pts=[],mouse={x:-999,y:-999},visible=true;
function size(){
  const r=cv.getBoundingClientRect();DPR=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;
  cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
  const n=Math.round(Math.min(96,W*H/15000));
  pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.3+.6,c:Math.random()}));
  if(reduce)draw();
}
function draw(){
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<pts.length;i++){
    const p=pts[i];
    if(!reduce){
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);
      if(d<140&&d>0){p.x+=dx/d*1.1;p.y+=dy/d*1.1}
    }
    for(let j=i+1;j<pts.length;j++){
      const q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);
      if(d<125){ctx.strokeStyle=`rgba(77,159,255,${(1-d/125)*.2})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}
    }
    const md=Math.hypot(p.x-mouse.x,p.y-mouse.y);
    if(md<170){ctx.strokeStyle=`rgba(167,139,250,${(1-md/170)*.5})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke()}
    ctx.fillStyle=p.c>.66?'rgba(167,139,250,.7)':p.c>.33?'rgba(52,211,153,.6)':'rgba(77,159,255,.7)';
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
  }
}
(function loop(){if(visible&&!reduce&&!document.hidden)draw();requestAnimationFrame(loop)})();
new IntersectionObserver(([e])=>{visible=e.isIntersecting},{threshold:0}).observe(hero);
size();window.P.onResize(size);
if(fine){hero.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top},{passive:true});
  hero.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-999})}

/* ---------- portrait tilt ---------- */
const frame=$('#pFrame');
if(fine&&!reduce){
  frame.addEventListener('pointermove',e=>{const r=frame.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    frame.style.transform=`perspective(900px) rotateY(${(x-.5)*14}deg) rotateX(${(.5-y)*14}deg) scale(1.02)`;
    frame.style.setProperty('--gx',x*100+'%');frame.style.setProperty('--gy',y*100+'%')});
  frame.addEventListener('pointerleave',()=>frame.style.transform='');
}

/* ---------- scroll: hero fades and drifts as you leave it ---------- */
window.P.onScroll(y=>{hero.style.setProperty('--hp',reduce?0:clamp(y/(hero.offsetHeight*.75)).toFixed(3))});

/* ---------- marquee: runs faster when you scroll faster ---------- */
const tracks=$$('.mq-track');
const mq=tracks.map(tr=>{
  const item=tr.firstElementChild;for(let i=0;i<5;i++)tr.appendChild(item.cloneNode(true));
  return {tr,item,dir:+tr.dataset.dir,w:1,x:0};
});
function measure(){mq.forEach(m=>{m.w=m.item.getBoundingClientRect().width||1;m.x=m.dir>0?-m.w:0})}
measure();window.P.onResize(measure);addEventListener('load',measure);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
let boost=0,lastY=scrollY;
if(!reduce)(function loop(){
  const v=scrollY-lastY;lastY=scrollY;
  boost+=(Math.min(Math.abs(v),60)*.12-boost)*.08;
  mq.forEach(m=>{
    const s=.55+boost;
    if(m.dir<0){m.x-=s;if(m.x<=-m.w)m.x+=m.w}else{m.x+=s;if(m.x>=0)m.x-=m.w}
    m.tr.style.transform=`translate3d(${m.x}px,0,0)`;
  });
  requestAnimationFrame(loop);
})();
})();
