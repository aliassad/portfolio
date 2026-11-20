/* sections: about scene, skill bars, tech filter, experience stage, projects */
(()=>{
'use strict';
const {$,$$,clamp,reduce,fine,onScroll,onResize}=window.P;
const P=window.P;

/* ---------- about scene: photo expands, words light up ---------- */
const scene=$('#about'),sticky=$('#sceneSticky'),media=$('#sceneMedia'),words=$$('#stmt .w');
function sceneUpdate(){
  if(reduce){media.style.setProperty('--p',1);sticky.style.setProperty('--tp',1);words.forEach(w=>w.style.opacity=1);return}
  const r=scene.getBoundingClientRect(),total=scene.offsetHeight-innerHeight;
  const p=clamp(-r.top/total);
  media.style.setProperty('--p',P.ease(clamp(p/.5)).toFixed(4));
  sticky.style.setProperty('--tp',clamp((p-.3)/.35).toFixed(3));
  const p2=clamp((p-.42)/.5),n=words.length;
  words.forEach((w,i)=>{w.style.opacity=(.12+.88*clamp(p2*(n+2)-i)).toFixed(3)});
}
onScroll(sceneUpdate);sceneUpdate();

/* ---------- skill bars ---------- */
new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){$$('.sk-fill',e.target).forEach(b=>b.style.transform=`scaleX(${b.dataset.w||1})`);o.unobserve(e.target)}}),{threshold:.3}).observe($('.bento'));

/* ---------- tech filter: click a skill to light up where it was used ---------- */
const pills=$$('.logo-pill'),items=[...$$('.ex'),...$$('.pc')];
/* front-end work implies the web basics, so link JS/HTML/CSS to every React or Angular item */
items.forEach(el=>{const st=el.dataset.stack.split(',');if(st.includes('React')||st.includes('Angular'))el.dataset.stack=[...new Set([...st,'JavaScript','HTML5','CSS3'])].join(',')});
const has=(el,t)=>(el.dataset.stack||'').split(',').includes(t);
pills.forEach(p=>{const n=items.filter(el=>has(el,p.dataset.tech)).length;p.dataset.n=n;if(n)p.insertAdjacentHTML('beforeend',`<span class="n">${n}</span>`);else p.classList.add('core')});
let active=null;
const readout=$('#readoutText'),clearBtn=$('#clearTech');
function setTech(t){
  active=active===t?null:t;
  pills.forEach(p=>p.setAttribute('aria-pressed',p.dataset.tech===active));
  const linked=active&&items.some(el=>has(el,active));
  items.forEach(el=>{const h=linked&&has(el,active);el.classList.toggle('dim',!!linked&&!h);el.classList.toggle('lit',!!h&&el.classList.contains('pc'))});
  $$('.e-tag,.tag').forEach(tag=>tag.classList.toggle('hit',!!linked&&tag.textContent.toLowerCase().includes(active.toLowerCase())));
  clearBtn.hidden=!active;
  if(!active){readout.textContent='// select a technology to filter experience and projects';return}
  if(!linked){readout.innerHTML=`<b>${active}</b> → part of my everyday toolkit across every role, so there is no single project to highlight.`;return}
  const roles=$$('.ex').filter(e=>has(e,active)).map(e=>$('.e-co',e).textContent);
  const projs=$$('.pc').filter(e=>has(e,active)).length;
  readout.innerHTML=`<b>${active}</b> → ${roles.length?roles.join(', '):'no listed role'} · ${projs} project${projs===1?'':'s'}. Highlighted below.`;
}
pills.forEach(p=>p.addEventListener('click',()=>setTech(p.dataset.tech)));
clearBtn.addEventListener('click',()=>setTech(active));
P.setTech=t=>{if(active!==t)setTech(t)};

/* ---------- experience: sticky stage swaps logo plate as you scroll ---------- */
const exs=$$('.ex'),panes=$$('.pane'),sdots=$$('.sd'),stage=$('#stage'),list=$('#expList');
let cur=-1;
function setActive(i){
  if(i===cur)return;cur=i;
  exs.forEach((e,j)=>e.classList.toggle('on',j===i));
  panes.forEach((p,j)=>p.classList.toggle('on',j===i));
  sdots.forEach((d,j)=>d.classList.toggle('on',j===i));
  stage.style.setProperty('--brand',panes[i].dataset.brand);
}
const eio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(exs.indexOf(e.target))}),{rootMargin:'-42% 0px -42% 0px'});
exs.forEach(e=>eio.observe(e));
setActive(0);
sdots.forEach(d=>d.addEventListener('click',()=>exs[+d.dataset.i].scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})));
onScroll(()=>{
  const r=list.getBoundingClientRect();
  list.style.setProperty('--prog',clamp((innerHeight*.5-r.top)/r.height).toFixed(3));
});

/* ---------- projects: detail dialog + tilt ---------- */
const cards=$$('.pc'),dlg=$('#projDlg');
function openProject(i){
  const c=cards[i];if(!c)return;
  $('#dlgTitle').textContent=c.dataset.title;$('#dlgWhere').textContent=c.dataset.where;
  const art=$('.art svg',c).cloneNode(true);
  // unique ids so cloned clip paths and gradients do not clash with the card behind
  art.innerHTML=art.innerHTML.replace(/id="([^"]+)"/g,'id="d-$1"').replace(/url\(#([^)]+)\)/g,'url(#d-$1)');
  art.setAttribute('preserveAspectRatio','xMidYMid slice');
  const wrap=$('#dlgArt');wrap.replaceChildren(art);
  $('#dlgBody').innerHTML=$('template.more',c).innerHTML;
  $('#dlgTags').innerHTML=$$('.tag',c).map(t=>`<span class="tag${t.classList.contains('hit')?' hit':''}">${t.textContent}</span>`).join('');
  dlg.showModal();
}
P.openProject=openProject;
cards.forEach((c,i)=>c.addEventListener('click',()=>openProject(i)));
$('#dlgClose').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
if(fine&&!reduce){
  cards.forEach(c=>{
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.transform=`rotateY(${(x-.5)*8}deg) rotateX(${(.5-y)*8}deg) translateY(-4px)`});
    c.addEventListener('pointerleave',()=>c.style.transform='');
  });
}
})();
