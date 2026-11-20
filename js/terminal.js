/* terminal + command palette + easter egg. Content is read from the page itself so it never drifts. */
(()=>{
'use strict';
const {$,$$,reduce,EMAIL}=window.P,P=window.P;
const CV='Ali%20Assad%20CV.pdf';
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const pad=(s,n)=>s+' '.repeat(Math.max(1,n-s.length));

/* data pulled from the DOM */
const roles=$$('.ex').map(e=>({when:$('.e-period',e).textContent.split(' · ')[0].replace(' — ',' → '),co:$('.e-co',e).textContent,role:$('.e-role',e).textContent.replace(/^role: "|"$/g,'')}));
const groups=$$('.logos-cat').map(c=>[c.textContent.replace(/_/g,' '),$$('.logo-pill',c.nextElementSibling).map(p=>p.dataset.tech)]);
const projects=$$('.pc').map(c=>({name:c.dataset.title,where:c.dataset.where}));

const out=$('#termOut'),tin=$('#termIn');
const CMDS={
  help:{d:'List every command',f:()=>Object.entries(CMDS).filter(([,v])=>!v.hide).map(([k,v])=>`<span class="c">${pad(k,12)}</span><span class="m">${v.d}</span>`).join('\n')},
  whoami:{d:'Who is Ali',f:()=>`<span class="b">Ali Assad</span>, principal software engineer in Calgary, Alberta.\n10+ years building multi-tenant platforms and leading distributed teams of up to 20 engineers.\nCurrently at <span class="g">Saturn Experts</span>.`},
  experience:{d:'Career history',f:()=>roles.map(r=>`<span class="c">${pad(r.when,24)}</span>${r.co}  <span class="m">${esc(r.role)}</span>`).join('\n')},
  stack:{d:'Technologies by area',f:()=>groups.map(([g,l])=>`<span class="b">${g}</span>\n  ${l.join(', ')}`).join('\n')},
  projects:{d:'Notable projects',f:()=>projects.map((p,i)=>`<span class="c">[${i+1}]</span> ${p.name}  <span class="m">${p.where}</span>`).join('\n')+'\n<span class="m">Run "open 1" to read about a project.</span>'},
  open:{d:'open <n>: project details',f:a=>{const i=(+a[0]||0)-1;if(!projects[i])return 'Usage: open <number>. Run "projects" to see the numbers.';setTimeout(()=>P.openProject(i),250);return `Opening ${projects[i].name}...`}},
  impact:{d:'Numbers I have moved',f:()=>[['40%','faster API responses at AutoCenter'],['50+','dealerships on one multi-tenant platform'],['1M+','documents secured in Azure Blob'],['99.9%','uptime at VFairs'],['100+','engineers trained in Clean Code'],['50%','less setup time with Docker']].map(([a,b])=>`<span class="g">${pad(a,7)}</span>${b}`).join('\n')},
  awards:{d:'Awards and education',f:()=>`NASCON'16 Web Programming, winner\nNASCON'15 Speed Programming, winner\nSoftech'15 Speed Programming, winner\nTop Performer of the Quarter, VFairs (Q2 2018)\n<span class="m">BSc Computer Science, GIFT University (2016)</span>`},
  contact:{d:'How to reach me',f:()=>`email     <a href="mailto:${EMAIL}">${EMAIL}</a>\nphone     +1 (403) 613-8920\nlinkedin  <a href="https://linkedin.com/in/ali-assad-336019133" target="_blank" rel="noopener">ali-assad-336019133</a>\ngithub    <a href="https://github.com/aliassad" target="_blank" rel="noopener">aliassad</a>`},
  email:{d:'Copy my email',f:()=>{P.copyEmail();return 'Copied '+EMAIL}},
  cv:{d:'Get my CV',f:()=>`<a href="${CV}" target="_blank" rel="noopener">Ali Assad CV.pdf</a>`},
  ping:{d:'Check that I am up',f:()=>[1,2,3].map(i=>`64 bytes from calgary-1: seq=${i} time=${(30+Math.random()*12).toFixed(1)} ms`).join('\n')+'\n<span class="g">Ali is online and replying to messages.</span>'},
  clear:{d:'Clear the screen',f:()=>{out.innerHTML='';return null}},
  sudo:{hide:true,f:a=>/hire/.test(a.join(' '))?`<span class="g">Permission granted.</span> Drafting an email to ${EMAIL}...\n<a href="mailto:${EMAIL}?subject=Let's%20work%20together">Open your mail app</a>`:'Nice try. Try "sudo hire ali".'},
  ls:{hide:true,f:()=>'experience/  projects/  stack/  awards/  contact.txt  cv.pdf'},
  exit:{hide:true,f:()=>'There is no exit. Only shipping.'}
};
const hist=[];let hi=0;
const print=html=>{out.insertAdjacentHTML('beforeend',html+'\n');out.scrollTop=out.scrollHeight};
function run(raw){
  const line=raw.trim();print(`<span class="g">ali@calgary ~ $</span> ${esc(line)}`);if(!line)return;
  hist.push(line);hi=hist.length;
  const [c,...a]=line.split(/\s+/),cmd=CMDS[c.toLowerCase()];
  if(cmd){const r=cmd.f(a);if(r!==null)print(r)}else print(`command not found: ${esc(c)}. Type <span class="c">help</span> to see what works.`);
}
print('<span class="m">Welcome. This shell knows about my work.</span>\nType <span class="c">help</span> to begin.');
$('#termForm').addEventListener('submit',e=>{e.preventDefault();run(tin.value);tin.value=''});
tin.addEventListener('keydown',e=>{
  if(e.key==='ArrowUp'&&hi>0){tin.value=hist[--hi];e.preventDefault()}
  else if(e.key==='ArrowDown'){hi=Math.min(hist.length,hi+1);tin.value=hist[hi]||''}
  else if(e.key==='Tab'){const m=Object.keys(CMDS).filter(k=>!CMDS[k].hide&&k.startsWith(tin.value));if(m.length===1){tin.value=m[0];e.preventDefault()}}
});
$('#termBox').addEventListener('click',e=>{if(!e.target.closest('a'))tin.focus({preventScroll:true})});
$('#sugg').innerHTML=['whoami','experience','impact','projects','contact','sudo hire ali'].map(c=>`<button data-c="${c}">${c}</button>`).join('');
$('#sugg').addEventListener('click',e=>{const b=e.target.closest('button');if(b)run(b.dataset.c)});

/* ---------- command palette (Ctrl/Cmd+K or /) ---------- */
const pal=$('#palette'),palIn=$('#palIn'),palList=$('#palList');
const go=id=>()=>document.getElementById(id).scrollIntoView({behavior:reduce?'auto':'smooth'});
const ACTIONS=[
  ['Go to skills','Section',go('skills')],['Go to experience','Section',go('experience')],['Go to projects','Section',go('projects')],
  ['Go to terminal','Section',()=>{go('terminal')();setTimeout(()=>tin.focus({preventScroll:true}),700)}],['Go to awards','Section',go('awards')],['Go to contact','Section',go('contact')],
  ['Copy email address','Action',P.copyEmail],['Open CV (PDF)','Action',()=>{window.open(CV,'_blank')}],
  ['Open LinkedIn','Link',()=>{window.open('https://linkedin.com/in/ali-assad-336019133','_blank')}],['Open GitHub','Link',()=>{window.open('https://github.com/aliassad','_blank')}],
  ...projects.map((p,i)=>['Project: '+p.name,'Project',()=>{go('projects')();setTimeout(()=>P.openProject(i),600)}]),
  ...groups.flatMap(g=>g[1]).map(t=>['Filter by '+t,'Skill',()=>{go('skills')();P.setTech(t)}])
];
let filtered=ACTIONS,sel=0;
function renderPal(){
  const q=palIn.value.toLowerCase().trim();filtered=ACTIONS.filter(a=>a[0].toLowerCase().includes(q));
  sel=Math.min(sel,Math.max(0,filtered.length-1));
  palList.innerHTML=filtered.length?filtered.slice(0,40).map((a,i)=>`<li role="option" id="po${i}" aria-selected="${i===sel}" data-i="${i}"><span>${a[0]}</span><small>${a[1]}</small></li>`).join(''):'<li class="pal-empty">No matches. Try "projects" or "email".</li>';
  palIn.setAttribute('aria-activedescendant','po'+sel);
  const s=palList.children[sel];if(s&&s.scrollIntoView)s.scrollIntoView({block:'nearest'});
}
function openPal(){palIn.value='';sel=0;renderPal();pal.showModal();palIn.focus()}
function runPal(i){const a=filtered[i];if(!a)return;pal.close();setTimeout(a[2],60)}
palIn.addEventListener('input',()=>{sel=0;renderPal()});
palIn.addEventListener('keydown',e=>{
  const n=Math.max(1,filtered.length);
  if(e.key==='ArrowDown'){sel=(sel+1)%n;renderPal();e.preventDefault()}
  else if(e.key==='ArrowUp'){sel=(sel-1+n)%n;renderPal();e.preventDefault()}
  else if(e.key==='Enter'){runPal(sel);e.preventDefault()}
});
palList.addEventListener('click',e=>{const li=e.target.closest('li[data-i]');if(li)runPal(+li.dataset.i)});
pal.addEventListener('click',e=>{if(e.target===pal)pal.close()});
$('#openPal').addEventListener('click',openPal);
$('#kHint').textContent=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?'⌘K':'Ctrl K';
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.open?pal.close():openPal()}
  else if(e.key==='/'&&!/input|textarea/i.test(document.activeElement.tagName)&&!pal.open){e.preventDefault();openPal()}
});

/* ---------- easter egg: Konami code ---------- */
const K=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let kp=0;
document.addEventListener('keydown',e=>{
  kp=e.key===K[kp]?kp+1:(e.key===K[0]?1:0);
  if(kp===K.length){kp=0;P.toast('Load test passed. All systems healthy.');
    if(!reduce)document.documentElement.animate([{filter:'hue-rotate(0deg)'},{filter:'hue-rotate(360deg)'}],{duration:2200,iterations:2});
    scrollTo({top:0,behavior:'smooth'})}
});
})();
