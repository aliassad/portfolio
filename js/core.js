/* core: helpers, boot, cursor, progress, reveal, counters, magnetic buttons, toast */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer: fine)').matches;
const store={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
const EMAIL='ali.n.assad@gmail.com';

/* one rAF-throttled scroll/resize bus shared by every effect */
const scrollFns=[],resizeFns=[];
let ticking=false,lastY=scrollY,vel=0;
function runScroll(){ticking=false;const y=scrollY;vel=y-lastY;lastY=y;const vh=innerHeight;scrollFns.forEach(f=>f(y,vh,vel))}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(runScroll)}},{passive:true});
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{resizeFns.forEach(f=>f());runScroll()},120)});

const P=window.P={$,$$,clamp,reduce,fine,store,EMAIL,
  onScroll:f=>scrollFns.push(f),onResize:f=>resizeFns.push(f),
  get vel(){return vel},
  ease:t=>1-Math.pow(1-t,3),
  toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(P._tt);P._tt=setTimeout(()=>t.classList.remove('on'),2300)},
  async copyEmail(){try{await navigator.clipboard.writeText(EMAIL);P.toast('Email copied: '+EMAIL)}catch(e){P.toast(EMAIL)}}
};
$('#yr').textContent=new Date().getFullYear();

/* ---------- boot sequence (once per session, skippable) ---------- */
const boot=$('#boot');
function endBoot(){
  if(!boot||boot.classList.contains('done'))return;
  boot.classList.add('done');document.body.classList.remove('booting');
  
  setTimeout(()=>boot.remove(),700);
}
if(reduce||store.get('booted')){boot.remove();document.body.classList.remove('booting')}
else{
  store.set('booted','1');
  addEventListener('keydown',e=>{if(boot.isConnected&&!boot.classList.contains('done')){e.preventDefault();endBoot()}});boot.addEventListener('click',endBoot,{once:true});
  const lines=['<b>$ deploy ali-assad --env=production</b>','pulling 10 years of experience   <i>ok</i>','linking laravel · django · react   <i>ok</i>','warming redis cache   <i>ok</i>','health check calgary-1   <i>passing</i>','<b>live.</b>'];
  const log=$('#bootLog'),bar=$('#bootBar');let i=0;
  (function next(){if(boot.classList.contains('done'))return;
    if(i<lines.length){log.innerHTML+=lines[i]+'\n';i++;bar.style.width=(i/lines.length*100)+'%';setTimeout(next,i===1?320:220)}
    else setTimeout(endBoot,320)})();
  setTimeout(endBoot,4000); // safety net
}

/* ---------- scroll progress + nav state ---------- */
const prog=$('#progress'),nav=$('#nav');
const navSecs=['skills','experience','projects','awards','contact'].map(id=>[id,document.getElementById(id)]);
const navLinks=$$('.nl');
P.onScroll(y=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  prog.style.transform=`scaleX(${max>0?y/max:0})`;
  nav.classList.toggle('solid',y>40);
  let cur=null;navSecs.forEach(([id,el])=>{if(el&&el.getBoundingClientRect().top<innerHeight*.4)cur=id});
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
});

/* ---------- reveal on scroll ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.sr').forEach(el=>io.observe(el));

/* ---------- count-up numbers ---------- */
function countUp(el){
  const target=parseFloat(el.dataset.count),dec=+el.dataset.dec||0;
  if(reduce){el.textContent=target.toFixed(dec);return}
  const t0=performance.now(),dur=1800;
  (function step(t){const p=clamp((t-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=(target*e).toFixed(dec);if(p<1)requestAnimationFrame(step);else el.textContent=target.toFixed(dec)})(t0);
}
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target)}}),{threshold:.5});
$$('[data-count]').forEach(el=>cio.observe(el));

/* ---------- cursor, magnetic buttons, spotlight ---------- */
if(fine&&!reduce){
  const cur=$('#cur'),ring=$('#ring');let mx=0,my=0,rx=0,ry=0,seen=false;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(!seen){seen=true;rx=mx;ry=my;document.body.classList.add('has-cursor')}
    cur.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
    document.body.classList.toggle('cur-hover',!!e.target.closest('a,button,input,.pc,.logo-pill'))},{passive:true});
  (function loop(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop)})();
  $$('.mag').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.32}px)`});
    b.addEventListener('pointerleave',()=>{b.style.transition='transform .5s cubic-bezier(.16,1,.3,1)';b.style.transform='';setTimeout(()=>b.style.transition='',500)});
  });
}else{$('#cur')?.remove();$('#ring')?.remove()}
/* cursor-following glow on tiles */
$$('.num,.bc,.pc').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')}));

$('#copyEmail').addEventListener('click',P.copyEmail);
})();
