'use strict';

const WORKOUT_PRAISE = [
  'Sterkt jobbet, Ulrik! Du møtte opp og gjorde jobben.',
  'Bra gjennomført! Jevne økter bygger mer enn én perfekt økt.',
  'Kjempebra! Du bygger både styrke og en sterk vane.',
  'Solid økt! God teknikk og tålmodighet gir resultater.',
  'Dagens seier er i boks. Nå får kroppen bygge seg sterkere.'
];

function showWorkoutCelebration(log, xpEarned, flags={}) {
  let headline=WORKOUT_PRAISE[Math.floor(Math.random()*WORKOUT_PRAISE.length)];
  let icon='💪';
  let special='Du fullførte planen for i dag.';

  if(flags.first) {
    headline='Første økt i boks, Ulrik!';
    icon='🚀';
    special='Den viktigste repetisjonen var å starte.';
  } else if(flags.fullWeek) {
    headline='Tre av tre denne uken!';
    icon='🏆';
    special='Du fulgte planen. Nå fortjener kroppen hvile og god mat.';
  } else if(flags.newBest) {
    headline='Ny personlig beste!';
    icon='⭐';
    special='Fremgang med kontroll er akkurat det vi ønsker.';
  }

  openModal(`<button class="modal-close" data-close>✕</button>
    <div style="text-align:center;padding:9px 2px 3px">
      <div style="font-size:64px">${icon}</div>
      <div class="eyebrow">Økt fullført • +${xpEarned} XP</div>
      <h2 style="font-size:29px;margin-top:8px">${headline}</h2>
      <p class="subtle">${special}</p>
      <div class="stat-grid" style="margin-top:14px">
        <div class="stat"><strong>${log.completedSets}</strong><small>sett gjennomført</small></div>
        <div class="stat"><strong>${log.duration}</strong><small>minutter</small></div>
        <div class="stat"><strong>${weekLogs().length}/3</strong><small>denne uken</small></div>
      </div>
      <div class="notice safe"><strong>Neste gode valg:</strong> Drikk vann, spis et vanlig måltid og la kroppen hvile. Muskler bygges også etter økten.</div>
      <button class="btn btn-primary btn-block" style="margin-top:13px" data-close>Ferdig – bra jobbet!</button>
    </div>`);
}

function finishWorkout(workout,draft) {
  const sets=Object.values(draft.exercises).flatMap(e=>e.sets);
  const done=sets.filter(s=>s.done);
  if(done.length===0) return toast('Logg minst ett sett før du fullfører.');
  if(done.length<Math.ceil(sets.length/2)) return toast('Fullfør minst halvparten av settene, eller velg Lagre og gå ut.');

  const duration=Math.max(1,Math.round((Date.now()-draft.startTime)/60000));
  const totalValue=done.reduce((a,s)=>a+(Number(s.value)||0),0);
  const earlierSame=logs.filter(l=>l.workoutId===workout.id);
  const previousBest=earlierSame.length?Math.max(...earlierSame.map(l=>l.totalValue||0)):0;
  const log={
    id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
    date:draft.date,
    workoutId:workout.id,
    title:workout.title,
    duration,
    exercises:draft.exercises,
    completedSets:done.length,
    totalValue,
    createdAt:new Date().toISOString()
  };

  logs.push(log);
  save(KEYS.logs,logs);
  localStorage.removeItem(KEYS.draft);
  const xpEarned=50+done.length*8;
  addXp(xpEarned);

  const flags={
    first:logs.length===1,
    fullWeek:weekLogs().length===3,
    newBest:previousBest>0&&totalValue>previousBest
  };

  document.getElementById('workoutSession').classList.add('hidden');
  confetti();
  vibrate([70,45,70]);
  renderAll();
  navigate('home');
  setTimeout(()=>showWorkoutCelebration(log,xpEarned,flags),180);
}
