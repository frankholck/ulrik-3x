function renderHome() {
  const w=weekLogs().length; const next=nextWorkout(); const nextDate=getNextScheduled(); const phase=getPhase(); const lv=levelInfo(); const n=getNutrition(); const pt=proteinTarget();
  const todayTraining=(profile.days||[]).includes(new Date().getDay());
  const targetText=todayTraining&&!completedToday()?'Treningsdag':'Neste økt';
  const habit=getDailyReminder(); const doneToday=completedToday(); const weekDone=w>=3; const canTrain=!doneToday&&!weekDone;
  document.getElementById('homeView').innerHTML=`
    <div class="hero">
      <div class="eyebrow">Uke ${phase.week} • ${phase.title}</div>
      <h1>${doneToday?'Sterk økt gjennomført.':todayTraining?'I dag bygger vi.':'Hvile bygger også.'}</h1>
      <p>${doneToday?'Spis godt, drikk vann og la kroppen hente seg inn.':phase.text}</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-start="${next.id}" ${!canTrain?'disabled style="opacity:.58"':''}>${doneToday?'Dagens økt ferdig ✓':weekDone?'Uken fullført ✓':`Start ${next.title}`}</button>
        <button class="btn btn-secondary" data-nav="nutrition">Dagens mat</button>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><strong>${w}/3</strong><small>økter denne uken</small></div>
      <div class="stat"><strong>${weeklyStreak()}</strong><small>uker på rad</small></div>
      <div class="stat"><strong>${lv.level}</strong><small>styrkenivå</small></div>
    </div>
    <div class="card">
      <div class="card-row"><div class="icon-bubble">${next.accent}</div><div><div class="mini-label">${targetText} • ${fmtDate(localDate(nextDate),{weekday:'short',day:'numeric',month:'short'})}</div><h3 style="margin:3px 0">${next.title}: ${next.subtitle}</h3><small class="subtle">${next.duration} • stopp med ca. 2 gode reps igjen</small></div><button class="btn btn-secondary btn-small" data-nav="workouts">Se</button></div>
    </div>
    <div class="section-head"><h2>Dagens mål</h2><small>enkelt er effektivt</small></div>
    <div class="card-row card">
      <div class="nutrition-ring" style="--pct:${Math.min(100,Math.round(n.protein/pt.low*100))}%"><span><strong>${n.protein} g</strong><small>av ${pt.low}–${pt.high} g</small></span></div>
      <div><div class="mini-label">Protein fra vanlig mat</div><h3 style="margin:4px 0 7px">Fordel det gjennom dagen</h3><p class="subtle" style="font-size:12px;margin:0">Egg, kylling, kjøtt, fisk, yoghurt, melk eller bønner – sammen med nok karbohydrater og frukt/grønt.</p></div>
    </div>
    <div class="card tip-card" style="margin-top:11px"><div class="mini-label">Sterk påminnelse</div><h3 style="margin:6px 0">${habit.title}</h3><p class="subtle" style="margin:0">${habit.text}</p></div>
    <div class="section-head"><h2>Nivå ${lv.level}</h2><small>${lv.into}/300 XP</small></div>
    <div class="card"><div class="xp-bar" style="--xp:${lv.pct}%"><i></i></div><p class="subtle" style="font-size:12px;margin:10px 0 0">XP belønner gjennomførte sett og gode vaner – ikke ekstra trening. Tre styrkeøkter er planen.</p></div>
    <div class="section-head"><h2>Merker</h2><small>mestring, ikke perfeksjon</small></div>
    ${renderBadges()}`;
  bindDynamicButtons(document.getElementById('homeView'));
}

function renderBadges() {
  const badges=[
    {icon:'🚀',name:'Første økt',on:logs.length>=1},
    {icon:'3️⃣',name:'Full uke',on:weekLogs().length>=3||logs.some((_,i)=>i>=2)},
    {icon:'🔥',name:'10 økter',on:logs.length>=10},
    {icon:'🌙',name:'Søvnhelt',on:habitStreak('sleep')>=5},
    {icon:'🥗',name:'Matmotor',on:nutritionDays()>=5},
    {icon:'📈',name:'20 økter',on:logs.length>=20}
  ];
  return `<div class="badge-grid">${badges.map(b=>`<div class="badge ${b.on?'unlocked':''}"><span>${b.icon}</span><small>${b.name}</small></div>`).join('')}</div>`;
}
function nutritionDays() { return Object.values(nutritionStore).filter(n=>n.protein>0).length; }
function habitStreak(id) {
  let s=0; const d=new Date();
  for(let i=0;i<30;i++){const k=localDate(d);if(habitsStore[k]?.[id])s++;else if(i>0)break;d.setDate(d.getDate()-1);}return s;
}
function getDailyReminder() {
  const reminders=[
    {title:'Søvn er superkraften',text:'Sikt mot 8–10 timer. Det hjelper kroppen å vokse, lære og hente seg inn.'},
    {title:'Skjermen kan vente',text:'Sen skjermtid påvirker først og fremst søvnen. Legg den bort 30–60 minutter før leggetid.'},
    {title:'Spis nok til å vokse',text:'Ekstrem slanking jobber mot trening, vekst og normal hormonbalanse.'},
    {title:'Protein + energi',text:'Kylling, kjøtt, fisk, egg, melk eller bønner fungerer best sammen med ris, potet, brød, havre og frukt.'},
    {title:'Hvile er en del av planen',text:'Muskler bygges mellom øktene. Tre gode økter slår mange halvgode.'},
    {title:'Ingen raske hormonløsninger',text:'Kroppen styrer puberteten selv. Ingen testosteronboostere, SARMs eller steroider.'}
  ];
  const day=Math.floor(Date.now()/86400000); return reminders[day%reminders.length];
}

function renderWorkouts() {
  const w=weekLogs().length; const phase=getPhase(); const doneToday=completedToday(); const locked=doneToday||w>=3; const lockLabel=doneToday?'Dagens økt ferdig ✓':'Uken fullført ✓';
  document.getElementById('workoutsView').innerHTML=`
    <div class="section-head" style="margin-top:5px"><div><div class="eyebrow">12-ukers program</div><h2 style="margin-top:6px">Tre økter. Hele kroppen.</h2></div><small>${w}/3 denne uken</small></div>
    <div class="notice safe"><strong>Progresjonsregelen:</strong> Nå toppen av rep-området med pen teknikk i to økter. Gå deretter til neste variant – ikke tren til full stopp.</div>
    <div class="card" style="margin-top:11px"><div class="mini-label">Uke ${phase.week} • ${phase.title}</div><p class="subtle" style="margin:6px 0 0">${phase.text} Oppvarming og nedtrapping gir totalt omtrent 10 minutter rundt hver økt.</p></div>
    <div class="section-head"><h2>Øktene</h2><small>60–90 sek pause</small></div>
    <div class="workout-list">${WORKOUTS.map(workout=>`
      <article class="card workout-card">
        <div class="workout-card-top"><div class="eyebrow">${workout.accent} ${workout.duration}</div><h2 style="margin:7px 0 0">${workout.title}</h2><p class="subtle" style="margin:5px 0">${workout.subtitle}</p>
          <div class="workout-meta"><span class="pill lime">${workout.exercises.length} øvelser</span><span class="pill">Kroppsvekt</span><span class="pill">Hjemme</span></div>
          <button class="btn btn-primary btn-block" data-start="${workout.id}" ${locked?'disabled style="opacity:.58"':''}>${locked?lockLabel:'Start økten'}</button></div>
        <div class="exercise-preview"><ol>${workout.exercises.map(x=>`<li><button style="border:0;background:none;color:inherit;padding:2px;text-align:left" data-exercise="${x.id}">${EXERCISES[x.id].name} • ${x.sets} × ${x.min}–${x.max} ${EXERCISES[x.id].unit}</button></li>`).join('')}</ol></div>
      </article>`).join('')}</div>
    <div class="section-head"><h2>Oppvarming</h2><small>5 minutter</small></div>
    <div class="card"><div class="meal-plan">
      <div class="meal"><strong>1 min</strong><small>Rask gange på stedet eller lett jogging</small></div>
      <div class="meal"><strong>1 min</strong><small>Armsirkler og skulderblad-bevegelser</small></div>
      <div class="meal"><strong>1 min</strong><small>Rolige knebøy uten å presse dybde</small></div>
      <div class="meal"><strong>1 min</strong><small>Utfall bakover med støtte</small></div>
      <div class="meal"><strong>1 min</strong><small>En lett runde av første øvelse</small></div>
    </div></div>
    <div class="card notice warn" style="margin-top:11px"><strong>Stopp og si fra:</strong> Skarp smerte, svimmelhet, uvanlig tung pust eller smerter som øker er ikke «god treningssmerte».</div>`;
  bindDynamicButtons(document.getElementById('workoutsView'));
}

function bindDynamicButtons(root=document) {
  root.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>navigate(b.dataset.nav));
  root.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startWorkout(b.dataset.start));
  root.querySelectorAll('[data-exercise]').forEach(b=>b.onclick=()=>showExercise(b.dataset.exercise));
}

function showExercise(id) {
  const ex=EXERCISES[id]; if(!ex)return;
  openModal(`<button class="modal-close" data-close>✕</button><div class="eyebrow">Bilde + faglig video</div><h2>${ex.name}</h2>
    ${exerciseMedia(ex)}
    <p class="media-note">YouTube krever internett. Les punktene under først, og bruk videoen til å kontrollere bevegelsen.</p>
    ${ex.safety?'<div class="notice warn" style="margin-top:11px"><strong>Sikkerhet:</strong> Bordet må være tungt, solid og kontrollert av en voksen. Aldri glassbord eller sammenleggbart bord. YouTube-videoen viser en trygg stangvariant; bruk samme trekketeknikk.</div>':''}
    <p class="subtle" style="margin-top:13px">${ex.description}</p>
    <h3>Gjør dette</h3><ul class="cue-list">${ex.cues.map(c=>`<li>${c}</li>`).join('')}</ul>
    <h3>Vanlige feil</h3><ul class="cue-list">${ex.mistakes.map(c=>`<li>${c}</li>`).join('')}</ul>
    <h3>Bygg nivå for nivå</h3><div style="display:flex;gap:6px;flex-wrap:wrap">${ex.levels.map((x,i)=>`<span class="pill ${i===0?'lime':''}">${i+1}. ${x}</span>`).join('')}</div>
    <div class="notice safe" style="margin-top:14px">Kvalitet først: avslutt settet når du har omtrent to pene repetisjoner igjen.</div>`);
}

function startWorkout(id) {
  const workout=WORKOUTS.find(w=>w.id===id); if(!workout)return;
  const existing=load(KEYS.draft,null);
  const canResume=existing?.workoutId===id&&existing?.date===localDate();
  if(!canResume&&completedToday()) return toast('Dagens styrkeøkt er ferdig. Restitusjon bygger muskler.');
  if(!canResume&&weekLogs().length>=3) return toast('Tre økter denne uken er fullført. Nå er hvile en del av planen.');
  const draft=existing?.workoutId===id&&existing?.date===localDate()?existing:{workoutId:id,date:localDate(),startTime:Date.now(),exercises:{}};
  workout.exercises.forEach(item=>{
    if(!draft.exercises[item.id]) draft.exercises[item.id]={sets:Array.from({length:item.sets},()=>({value:'',done:false}))};
  });
  save(KEYS.draft,draft); renderWorkoutSession(workout,draft);
}

function renderWorkoutSession(workout,draft) {
  const el=document.getElementById('workoutSession'); el.classList.remove('hidden');
  const completedSets=Object.values(draft.exercises).flatMap(e=>e.sets).filter(s=>s.done).length;
  const totalSets=workout.exercises.reduce((a,x)=>a+x.sets,0);
  el.innerHTML=`
    <header class="session-head"><button class="icon-btn" id="closeSession">←</button><div class="session-title"><strong>${workout.title}: ${workout.subtitle}</strong><small>${completedSets}/${totalSets} sett • god teknikk først</small></div><button class="icon-btn" id="sessionHelp">?</button></header>
    <div class="session-body">
      <div class="notice safe"><strong>Før du starter:</strong> 5 minutter oppvarming. Stopp hvert sett med omtrent 2 gode repetisjoner igjen.</div>
      ${workout.exercises.map((item,index)=>{
        const ex=EXERCISES[item.id]; const ready=isExerciseReady(item.id,item.max); const best=lastBest(item.id);
        return `<article class="exercise-card" data-ex-card="${item.id}">
          <div class="exercise-header"><div class="exercise-number">${index+1}</div><div class="exercise-header-main"><h3>${ex.name}</h3><small>${item.sets} × ${item.min}–${item.max} ${ex.unit}${best?` • best ${best}`:''}</small></div>${exerciseMedia(ex,true)}</div>
          ${ready?'<div class="notice safe" style="margin:0 14px 10px">⭐ Klar for en litt vanskeligere variant neste gang.</div>':''}
          <div class="set-table">${draft.exercises[item.id].sets.map((set,si)=>`
            <div class="set-row"><span class="set-label">${si+1}</span><input class="input set-value" data-ex="${item.id}" data-set="${si}" type="number" min="1" max="99" inputmode="numeric" placeholder="${item.min}–${item.max}" value="${escapeHTML(set.value)}"><span class="set-label">${ex.unit}</span><button class="check-btn ${set.done?'done':''}" data-check="${item.id}" data-set="${si}">${set.done?'✓':'○'}</button></div>`).join('')}</div>
          <div class="exercise-foot"><button data-exercise="${item.id}">▣ Bilde og video</button><button data-rest="${ex.rest}">⏱ ${ex.rest} sek pause</button></div>
        </article>`;
      }).join('')}
      <div class="card"><h3>Rolig nedtrapping • 5 min</h3><p class="subtle" style="margin:0">Gå rolig rundt, rist løs armer og bein, og ta noen rolige pust. Ingen hard tøying er nødvendig.</p></div>
    </div>
    <footer class="session-footer"><button class="btn btn-secondary" id="saveExit">Lagre og gå ut</button><button class="btn btn-primary" id="finishWorkout" style="flex:1">Fullfør økten</button></footer>`;
  el.querySelector('#closeSession').onclick=()=>el.classList.add('hidden');
  el.querySelector('#saveExit').onclick=()=>{el.classList.add('hidden');toast('Økten er lagret på telefonen.');};
  el.querySelector('#sessionHelp').onclick=()=>openModal(`<button class="modal-close" data-close>✕</button><h2>Slik logger du</h2><ul class="cue-list"><li>Skriv repetisjoner eller sekunder.</li><li>Trykk sirkelen når settet er ferdig.</li><li>Bruk pausetimeren.</li><li>Avslutt med god teknikk – ikke jag full utmattelse.</li></ul>`);
  el.querySelectorAll('.set-value').forEach(input=>input.oninput=()=>{draft.exercises[input.dataset.ex].sets[Number(input.dataset.set)].value=input.value;save(KEYS.draft,draft);});
  el.querySelectorAll('[data-check]').forEach(btn=>btn.onclick=()=>{
    const set=draft.exercises[btn.dataset.check].sets[Number(btn.dataset.set)];
    const input=el.querySelector(`.set-value[data-ex="${btn.dataset.check}"][data-set="${btn.dataset.set}"]`);
    if(!set.done && (!input.value || Number(input.value)<=0)) { input.focus(); return toast('Fyll inn repetisjoner eller sekunder først.'); }
    set.value=input.value; set.done=!set.done; save(KEYS.draft,draft); vibrate(set.done?[20,30,20]:10);
    if(set.done) startRest(EXERCISES[btn.dataset.check].rest);
    renderWorkoutSession(workout,draft);
  });
  el.querySelectorAll('[data-rest]').forEach(b=>b.onclick=()=>startRest(Number(b.dataset.rest)));
  el.querySelectorAll('[data-exercise]').forEach(b=>b.onclick=()=>showExercise(b.dataset.exercise));
  el.querySelector('#finishWorkout').onclick=()=>finishWorkout(workout,draft);
}

function startRest(seconds) {
  clearInterval(restInterval); document.querySelector('.rest-timer')?.remove();
  const timer=document.createElement('button');timer.className='rest-timer';timer.textContent=seconds;timer.title='Trykk for å stoppe';document.body.appendChild(timer);
  let left=seconds; timer.onclick=()=>{clearInterval(restInterval);timer.remove();};
  restInterval=setInterval(()=>{left--;timer.textContent=left;if(left<=0){clearInterval(restInterval);timer.textContent='Klar!';vibrate([100,80,100]);setTimeout(()=>timer.remove(),1600);}},1000);
}

function finishWorkout(workout,draft) {
  const sets=Object.values(draft.exercises).flatMap(e=>e.sets); const done=sets.filter(s=>s.done);
  if(done.length===0) return toast('Logg minst ett sett før du fullfører.');
  if(done.length<Math.ceil(sets.length/2)) return toast('Fullfør minst halvparten av settene, eller velg Lagre og gå ut.');
  const duration=Math.max(1,Math.round((Date.now()-draft.startTime)/60000));
  const log={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:draft.date,workoutId:workout.id,title:workout.title,duration,exercises:draft.exercises,completedSets:done.length,totalValue:done.reduce((a,s)=>a+(Number(s.value)||0),0),createdAt:new Date().toISOString()};
  logs.push(log);save(KEYS.logs,logs);localStorage.removeItem(KEYS.draft);addXp(50+done.length*8);
  document.getElementById('workoutSession').classList.add('hidden');confetti();toast(`Sterkt jobbet! +${50+done.length*8} XP`);renderAll();navigate('home');
}
function confetti() {
  const layer=document.getElementById('confetti'); const colors=['#b7ff4a','#6ec7ff','#ffca69','#ff7f83','#ffffff'];
  for(let i=0;i<45;i++){const p=document.createElement('i');p.className='confetti';p.style.left=Math.random()*100+'%';p.style.background=colors[i%colors.length];p.style.setProperty('--drift',(Math.random()*160-80)+'px');p.style.animationDelay=Math.random()*.35+'s';layer.appendChild(p);setTimeout(()=>p.remove(),2200);}
}
