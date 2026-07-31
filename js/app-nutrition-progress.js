function renderNutrition() {
  const date=localDate(), n=getNutrition(date), t=proteinTarget(); const pct=Math.min(100,Math.round(n.protein/t.low*100)); const training=(profile.days||[]).includes(new Date().getDay());
  document.getElementById('nutritionView').innerHTML=`
    <div class="section-head" style="margin-top:5px"><div><div class="eyebrow">Vanlig mat først</div><h2 style="margin-top:6px">Dagens drivstoff</h2></div><small>${fmtDate(date,{weekday:'short',day:'numeric',month:'short'})}</small></div>
    <div class="card card-row"><div class="nutrition-ring" style="--pct:${pct}%"><span><strong>${n.protein} g</strong><small>${t.low}–${t.high} g</small></span></div><div><h3 style="margin:0 0 5px">Moderat proteinområde</h3><p class="subtle" style="font-size:12px;margin:0">Basert på ${profile.weight} kg og tre økter i uken. Dette er en praktisk guide, ikke et krav om å treffe perfekt.</p></div></div>
    <div class="notice safe" style="margin-top:11px"><strong>Viktig:</strong> Muskelvekst krever også nok total mat, karbohydrater, sunt fett, vitaminer og mineraler. Ikke kutt mat for å bli «mer definert» mens kroppen vokser.</div>
    <div class="section-head"><h2>Legg til protein</h2><small>omtrentlige verdier</small></div>
    <div class="food-grid">${FOODS.map((f,i)=>`<button class="food-chip" data-food="${i}"><strong>${f.icon} ${f.name}</strong><small>+ ca. ${f.grams} g</small></button>`).join('')}</div>
    <div class="card" style="margin-top:10px"><div class="card-row"><input id="manualProtein" class="input" type="number" min="1" max="100" inputmode="numeric" placeholder="Annet, gram protein"><button id="addManualProtein" class="btn btn-primary btn-small">Legg til</button></div>${n.items.length?`<div style="margin-top:12px">${n.items.map((x,i)=>`<span class="pill" style="display:inline-flex;margin:3px">${escapeHTML(x.name)} +${x.grams} g <button data-remove-food="${i}" style="border:0;background:none;color:var(--red);padding:0 0 0 6px">×</button></span>`).join('')}</div>`:''}</div>
    <div class="section-head"><h2>Dagens sjekkliste</h2><small>mer enn bare protein</small></div>
    <div class="card checklist">${[
      ['meals','3–4 hovedmåltider og 1–2 mellommåltider ved behov'],['carbs',training?'Karbohydrater før/etter trening':'Karbohydrater til energi og vekst'],['produce','Frukt eller grønnsaker flere ganger'],['calcium','Melk, yoghurt, ost eller annet kalsiumrikt'],['water','Vann til måltider og jevnlig gjennom dagen']
    ].map(([id,label])=>`<label class="check-item"><input type="checkbox" data-nut-check="${id}" ${n.checks[id]?'checked':''}><span>${label}</span></label>`).join('')}</div>
    <div class="section-head"><h2>${training?'Forslag på treningsdag':'Forslag på hviledag'}</h2><small>bytt med mat han liker</small></div>
    <div class="card meal-plan">${renderMealPlan(training)}</div>
    <div class="card notice" style="margin-top:11px"><strong>Etter trening:</strong> Et vanlig måltid eller mellommåltid med både protein og karbohydrat er nok. Proteinpulver er ikke nødvendig.</div>`;
  const root=document.getElementById('nutritionView');
  root.querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{const f=FOODS[Number(b.dataset.food)];n.protein+=f.grams;n.items.push({name:f.name,grams:f.grams});save(KEYS.nutrition,nutritionStore);addXp(2);renderNutrition();renderHome();toast(`+${f.grams} g registrert`);});
  root.querySelector('#addManualProtein').onclick=()=>{const v=Number(root.querySelector('#manualProtein').value);if(!v)return toast('Skriv inn antall gram.');n.protein+=v;n.items.push({name:'Annet',grams:v});save(KEYS.nutrition,nutritionStore);renderNutrition();renderHome();};
  root.querySelectorAll('[data-remove-food]').forEach(b=>b.onclick=()=>{const item=n.items.splice(Number(b.dataset.removeFood),1)[0];n.protein=Math.max(0,n.protein-item.grams);save(KEYS.nutrition,nutritionStore);renderNutrition();renderHome();});
  root.querySelectorAll('[data-nut-check]').forEach(c=>c.onchange=()=>{n.checks[c.dataset.nutCheck]=c.checked;save(KEYS.nutrition,nutritionStore);if(c.checked)addXp(2);renderHome();});
}
function renderMealPlan(training) {
  const meals=training?[
    ['Frokost','Havregrøt med melk + 2 egg eller yoghurt + frukt'],
    ['Lunsj','Kylling/kjøtt/fisk + brød, ris eller potet + grønt'],
    ['Før trening','Banan og yoghurt, brødskive med ost, eller et vanlig lite måltid'],
    ['Etter trening','Middag eller melk/yoghurt + brød/frukt innen det passer'],
    ['Kveldsmat','Grovbrød med egg/ost, yoghurt eller melk']
  ]:[
    ['Frokost','Egg eller yoghurt + havre/brød + frukt'],
    ['Lunsj','Proteinrik mat + brød/ris/potet + grønt'],
    ['Mellommåltid','Frukt + melk/yoghurt eller brødmat'],
    ['Middag','Kylling, kjøtt, fisk eller bønner + rikelig tilbehør'],
    ['Kveldsmat','Et enkelt måltid som gjør at han ikke legger seg sulten']
  ];
  return meals.map(m=>`<div class="meal"><strong>${m[0]}</strong><small>${m[1]}</small></div>`).join('');
}

function renderHabits() {
  const h=getHabits(); const done=Object.values(h).filter(Boolean).length; const reminder=getDailyReminder();
  document.getElementById('habitsView').innerHTML=`
    <div class="card habit-hero" style="margin-top:5px"><div class="eyebrow">Sterk hverdag</div><h1 style="font-size:34px;margin-top:8px">Støtt kroppen.<br>Ikke jag hormoner.</h1><p class="subtle">I puberteten regulerer kroppen testosteron selv. Gode vaner støtter normal vekst, hormonbalanse, søvn og restitusjon – de garanterer ikke et bestemt testosteronnivå.</p></div>
    <div class="section-head"><h2>Dagens vaner</h2><small>${done}/${HABITS.length}</small></div>
    <div class="habit-grid">${HABITS.map(x=>`<div class="habit-card ${h[x.id]?'done':''}"><div class="habit-icon">${x.icon}</div><main><strong>${x.title}</strong><small>${x.text}</small></main><button data-habit="${x.id}">${h[x.id]?'✓':'○'}</button></div>`).join('')}</div>
    <div class="section-head"><h2>Dagens påminnelse</h2><small>positiv, ikke press</small></div>
    <div class="card tip-card"><h3>${reminder.title}</h3><p class="subtle" style="margin:0">${reminder.text}</p></div>
    <div class="section-head"><h2>Hva hjelper?</h2><small>enkle valg</small></div>
    <div class="good-bad">
      <div class="card"><div class="eyebrow">Bra</div><ul><li>8–10 t søvn</li><li>Fast døgnrytme</li><li>Nok vanlig mat</li><li>Kylling, kjøtt, fisk, egg, meieri og bønner</li><li>Ris, potet, havre, brød og frukt</li><li>Dagslys, trening og hvile</li></ul></div>
      <div class="card"><div class="eyebrow" style="color:var(--red)">Jobber mot målet</div><ul><li>For lite søvn</li><li>Skjerm sent i sengen</li><li>Ekstrem slanking</li><li>For mange harde økter</li><li>Nikotin/vape og alkohol</li><li>Energidrikk eller pre-workout</li><li>SARMs, steroider og «test-boostere»</li></ul></div>
    </div>
    <div class="notice" style="margin-top:11px"><strong>Om skjermtid:</strong> Det er mest presist å si at sen skjermbruk kan forstyrre søvn. God søvn er viktig for restitusjon og normal hormonbalanse.</div>
    <div class="card" style="margin-top:11px"><h3>Leggetid: ${profile.bedtime||'ikke satt'}</h3><p class="subtle" style="font-size:12px">Appen viser en påminnelse når den åpnes på kvelden. Du kan også legge en søvnpåminnelse i iPhone-kalenderen.</p><button id="sleepCalendar" class="btn btn-secondary btn-block">Legg søvnpåminnelse i kalender</button></div>`;
  const root=document.getElementById('habitsView');
  root.querySelectorAll('[data-habit]').forEach(b=>b.onclick=()=>{h[b.dataset.habit]=!h[b.dataset.habit];save(KEYS.habits,habitsStore);if(h[b.dataset.habit])addXp(5);renderHabits();renderHome();vibrate(15);});
  root.querySelector('#sleepCalendar').onclick=downloadSleepCalendar;
}

function progressSeries() {
  return logs.slice(-10).map(l=>({label:fmtDate(l.date,{day:'numeric',month:'short'}),value:l.totalValue||0,title:l.title}));
}
function renderChart() {
  const data=progressSeries(); if(!data.length) return '<div class="empty">Fullfør en økt for å starte grafen.</div>';
  const width=520,height=220,pad=32,max=Math.max(...data.map(d=>d.value),1); const step=(width-pad*2)/Math.max(1,data.length-1);
  const pts=data.map((d,i)=>({x:pad+i*step,y:height-pad-(d.value/max)*(height-pad*2)}));
  const path=pts.map((p,i)=>(i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1)).join(' ');
  return `<div class="chart-wrap"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Progresjonsgraf">
    <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7ff4a" stop-opacity=".28"/><stop offset="1" stop-color="#b7ff4a" stop-opacity="0"/></linearGradient></defs>
    ${[0,.25,.5,.75,1].map(r=>`<line x1="${pad}" y1="${pad+r*(height-pad*2)}" x2="${width-pad}" y2="${pad+r*(height-pad*2)}" stroke="rgba(166,190,222,.12)"/>`).join('')}
    <path d="${path} L ${pts.at(-1).x} ${height-pad} L ${pts[0].x} ${height-pad} Z" fill="url(#area)"/>
    <path d="${path}" fill="none" stroke="#b7ff4a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="5" fill="#09101d" stroke="#b7ff4a" stroke-width="3"/><text x="${p.x}" y="${height-8}" text-anchor="middle" fill="#98aac2" font-size="10">${data[i].label}</text>`).join('')}
  </svg></div>`;
}

async function renderProgress() {
  const root=document.getElementById('progressView');
  root.innerHTML=`<div class="section-head" style="margin-top:5px"><div><div class="eyebrow">Privat progresjon</div><h2 style="margin-top:6px">Se hva du faktisk gjør</h2></div><small>${logs.length} økter</small></div>
    <div class="card"><div class="mini-label">Treningsvolum per økt</div><p class="subtle" style="font-size:12px">Summen av registrerte repetisjoner/sekunder. Se etter en rolig trend, ikke rekord hver gang.</p>${renderChart()}</div>
    <div class="stat-grid"><div class="stat"><strong>${logs.reduce((a,l)=>a+l.completedSets,0)}</strong><small>sett fullført</small></div><div class="stat"><strong>${lastBest('pushup')||'–'}</strong><small>beste push-up-sett</small></div><div class="stat"><strong>${logs.reduce((a,l)=>a+l.duration,0)}</strong><small>minutter logget</small></div></div>
    <div class="section-head"><h2>Progresjonsbilder</h2><small>lagres lokalt</small></div>
    <label class="photo-upload"><input id="photoInput" type="file" accept="image/*" capture="user"><strong>📷 Legg til privat bilde</strong><p class="subtle" style="font-size:12px;margin:6px 0 0">Samme lys, avstand og positur gir best sammenligning.</p></label>
    <div class="notice warn" style="margin-top:10px"><strong>Personvern:</strong> Bildene sendes ikke til en server. De ligger i nettleserlagringen på denne telefonen og forsvinner hvis appdata slettes. Bruk aldri delte eller intime bilder.</div>
    <div id="photoArea"><div class="empty" style="margin-top:11px">Laster bilder …</div></div>
    <div class="section-head"><h2>Logg</h2><small>siste 10 økter</small></div>
    ${logs.length?logs.slice(-10).reverse().map(l=>`<div class="card card-row"><div class="icon-bubble">${WORKOUTS.find(w=>w.id===l.workoutId)?.accent||'⚡'}</div><div><strong>${l.title}</strong><small class="subtle">${fmtDate(l.date,{weekday:'short',day:'numeric',month:'short'})} • ${l.completedSets} sett • ${l.duration} min</small></div><button class="btn btn-secondary btn-small" data-log="${l.id}">Se</button></div>`).join(''):'<div class="empty">Ingen økter logget ennå.</div>'}`;
  root.querySelector('#photoInput').onchange=e=>preparePhoto(e.target.files[0]);
  root.querySelectorAll('[data-log]').forEach(b=>b.onclick=()=>showLog(b.dataset.log));
  await renderPhotos();
}
function showLog(id) {
  const l=logs.find(x=>x.id===id);if(!l)return; const w=WORKOUTS.find(x=>x.id===l.workoutId);
  openModal(`<button class="modal-close" data-close>✕</button><div class="eyebrow">${fmtDate(l.date,{weekday:'long',day:'numeric',month:'long'})}</div><h2>${l.title}</h2><p class="subtle">${l.duration} min • ${l.completedSets} sett</p>${w.exercises.map(i=>{const sets=l.exercises[i.id]?.sets.filter(s=>s.done)||[];return sets.length?`<div class="card" style="margin-top:8px"><strong>${EXERCISES[i.id].name}</strong><p class="subtle" style="margin:5px 0 0">${sets.map(s=>s.value).join(' • ')} ${EXERCISES[i.id].unit}</p></div>`:''}).join('')}`);
}

function openDB() {
  return new Promise((resolve,reject)=>{const req=indexedDB.open('ulrik3x',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('photos'))req.result.createObjectStore('photos',{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
}
async function getPhotos(){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction('photos','readonly').objectStore('photos').getAll();r.onsuccess=()=>res(r.result.sort((a,b)=>a.date.localeCompare(b.date)));r.onerror=()=>rej(r.error);});}
async function putPhoto(p){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction('photos','readwrite').objectStore('photos').put(p);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
async function deletePhoto(id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction('photos','readwrite').objectStore('photos').delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
async function clearPhotos(){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction('photos','readwrite').objectStore('photos').clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
function compressImage(file) {
  return new Promise((resolve,reject)=>{const img=new Image();const url=URL.createObjectURL(file);img.onload=()=>{let w=img.width,h=img.height;const max=1440;if(Math.max(w,h)>max){const s=max/Math.max(w,h);w=Math.round(w*s);h=Math.round(h*s);}const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);c.toBlob(blob=>{URL.revokeObjectURL(url);blob?resolve(blob):reject(new Error('Komprimering feilet'));},'image/jpeg',.82);};img.onerror=reject;img.src=url;});
}
async function preparePhoto(file) {
  if(!file)return; if(!file.type.startsWith('image/'))return toast('Velg et bilde.');
  openModal(`<button class="modal-close" data-close>✕</button><div class="eyebrow">Nytt progresjonsbilde</div><h2>Legg til detaljer</h2>
    <div class="form-group"><label>Dato</label><input id="photoDate" class="input" type="date" value="${localDate()}"></div>
    <div class="form-group"><label>Vinkel</label><select id="photoPose" class="input"><option>Forfra</option><option>Fra siden</option><option>Bakfra</option></select></div>
    <div class="form-group"><label>Notat (valgfritt)</label><input id="photoNote" class="input" maxlength="80" placeholder="Uke 1, samme lys …"></div>
    <button id="savePhoto" class="btn btn-primary btn-block">Lagre bare på telefonen</button>`);
  document.getElementById('savePhoto').onclick=async()=>{
    try{const btn=document.getElementById('savePhoto');btn.disabled=true;btn.textContent='Lagrer …';const blob=await compressImage(file);await putPhoto({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:document.getElementById('photoDate').value||localDate(),pose:document.getElementById('photoPose').value,note:document.getElementById('photoNote').value,blob,createdAt:new Date().toISOString()});closeModal();toast('Bildet er lagret lokalt.');renderProgress();}catch(e){toast('Kunne ikke lagre bildet.');}
  };
}
async function renderPhotos() {
  const area=document.getElementById('photoArea');if(!area)return;
  photoUrls.forEach(URL.revokeObjectURL);photoUrls=[];
  let photos=[];try{photos=await getPhotos();}catch{area.innerHTML='<div class="empty">Bilder er ikke tilgjengelige i denne nettleseren.</div>';return;}
  if(!photos.length){area.innerHTML='<div class="empty" style="margin-top:11px">Ingen bilder ennå. Ett bilde hver 4. uke er mer enn nok.</div>';return;}
  const urlFor=p=>{const u=URL.createObjectURL(p.blob);photoUrls.push(u);return u;};
  const mapped=photos.map(p=>({...p,url:urlFor(p)}));
  area.innerHTML=`<div class="card" style="margin-top:11px"><h3>Sammenlign to bilder</h3><div class="card-row"><select id="compareA" class="input">${mapped.map((p,i)=>`<option value="${i}">${fmtDate(p.date)} • ${p.pose}</option>`).join('')}</select><select id="compareB" class="input">${mapped.map((p,i)=>`<option value="${i}" ${i===mapped.length-1?'selected':''}>${fmtDate(p.date)} • ${p.pose}</option>`).join('')}</select></div><div id="compareImages" class="compare-grid" style="margin-top:9px"></div></div>
    <div class="photo-grid">${mapped.slice().reverse().map(p=>`<article class="photo-card"><img src="${p.url}" alt="Progresjonsbilde ${p.pose}"><button class="delete-photo" data-delete-photo="${p.id}">✕</button><div class="photo-meta"><strong>${fmtDate(p.date)} • ${p.pose}</strong>${p.note?`<br>${escapeHTML(p.note)}`:''}</div></article>`).join('')}</div>`;
  const updateCompare=()=>{const a=mapped[Number(area.querySelector('#compareA').value)],b=mapped[Number(area.querySelector('#compareB').value)];area.querySelector('#compareImages').innerHTML=`<img src="${a.url}" alt="Før"><img src="${b.url}" alt="Etter">`;};
  area.querySelector('#compareA').onchange=updateCompare;area.querySelector('#compareB').onchange=updateCompare;updateCompare();
  area.querySelectorAll('[data-delete-photo]').forEach(b=>b.onclick=async()=>{if(confirm('Slette dette lokale bildet?')){await deletePhoto(b.dataset.deletePhoto);renderProgress();}});
}

function openModal(html) { const overlay=document.getElementById('modal');document.getElementById('modalCard').innerHTML=html;overlay.classList.remove('hidden');overlay.onclick=e=>{if(e.target===overlay)closeModal();};overlay.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal); }
function closeModal(){document.getElementById('modal').classList.add('hidden');document.getElementById('modalCard').innerHTML='';}
