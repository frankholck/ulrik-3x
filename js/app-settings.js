function showSettings() {
  openModal(`<button class="modal-close" data-close>✕</button><div class="eyebrow">Ulrik 3X v${APP_VERSION}</div><h2>Innstillinger</h2>
    <div class="form-group"><label>Navn</label><input id="setName" class="input" value="${escapeHTML(profile.name)}"></div>
    <div class="form-group"><label>Kroppsvekt i kg</label><input id="setWeight" class="input" type="number" min="30" max="120" step="0.1" value="${profile.weight}"></div>
    <div class="form-group"><label>Vanlig leggetid</label><input id="setBedtime" class="input" type="time" value="${profile.bedtime||'22:30'}"></div>
    <div class="form-group"><label>Tre treningsdager</label><div class="day-picker">${DAYS.map((d,i)=>`<label><input type="checkbox" name="setDays" value="${i}" ${(profile.days||[]).includes(i)?'checked':''}><span>${d}</span></label>`).join('')}</div></div>
    <div class="form-group"><label>Ny PIN (la stå tomt for ingen endring)</label><input id="setPin" class="input" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="4 siffer"></div>
    <button id="saveSettings" class="btn btn-primary btn-block">Lagre innstillinger</button>
    ${profile.pinHash?'<button id="lockNow" class="btn btn-secondary btn-block" style="margin-top:9px">Lås appen nå</button>':''}
    <div class="section-head"><h2>iPhone</h2></div>
    <div class="card"><h3>Legg appen på hjemskjermen</h3><ol class="cue-list"><li>Åpne app-lenken i Safari.</li><li>Trykk Del-knappen.</li><li>Velg «Legg til på Hjem-skjermen».</li><li>Åpne Ulrik 3X fra ikonet.</li></ol><button id="workoutCalendar" class="btn btn-secondary btn-block">Legg treningsdager i kalender</button></div>
    <div class="section-head"><h2>Programgrunnlag</h2></div>
    <div class="card"><ul class="cue-list"><li>Ungdom 13–18 år bør vanligvis få 8–10 timer søvn.</li><li>Tre muskelstyrkende dager passer inn i aktivitetsrådene for ungdom.</li><li>Regelmessige, varierte måltider og nok energi prioriteres foran kalorikutt og kosttilskudd.</li></ul><p class="subtle" style="font-size:11px;margin:10px 0 0">Generell veiledning – ikke medisinsk behandling. Forelder eller helsepersonell bør involveres ved smerte, sykdom, vekstbekymring eller spørsmål om pubertet.</p></div>
    <div class="section-head"><h2>Data og personvern</h2></div>
    <button id="exportData" class="btn btn-secondary btn-block">Eksporter treningsdata</button>
    <p class="subtle" style="font-size:11px">Eksporten inneholder trenings-, mat- og vanelogger, men ikke bilder. Bildene ligger bare lokalt på telefonen.</p>
    <button id="resetData" class="btn btn-danger btn-block">Slett all lokal appdata</button>`);
  document.getElementById('saveSettings').onclick=async()=>{
    const days=[...document.querySelectorAll('input[name="setDays"]:checked')].map(x=>Number(x.value));if(days.length!==3)return toast('Velg akkurat tre treningsdager.');
    profile.name=document.getElementById('setName').value||'Ulrik';profile.weight=Number(document.getElementById('setWeight').value)||profile.weight;profile.bedtime=document.getElementById('setBedtime').value||profile.bedtime;profile.days=days;
    const pin=document.getElementById('setPin').value;if(pin){if(!/^\d{4}$/.test(pin))return toast('PIN må være fire siffer.');profile.pinHash=await hashPin(pin);sessionStorage.setItem('u3_unlocked','1');}
    save(KEYS.profile,profile);closeModal();renderAll();toast('Innstillingene er lagret.');
  };
  const lockBtn=document.getElementById('lockNow'); if(lockBtn) lockBtn.onclick=()=>{sessionStorage.removeItem('u3_unlocked');closeModal();showLock();};
  document.getElementById('exportData').onclick=exportData;
  document.getElementById('resetData').onclick=()=>{if(confirm('Slette alle logger, innstillinger og lokale bilder?'))resetAll();};
  document.getElementById('workoutCalendar').onclick=downloadWorkoutCalendar;
}
function exportData() {
  const data={app:'Ulrik 3X',version:APP_VERSION,exportedAt:new Date().toISOString(),profile:{...profile,pinHash:profile.pinHash?'[PIN BESKYTTET]':''},logs,nutrition:nutritionStore,habits:habitsStore,xp};
  downloadBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),`ulrik-3x-backup-${localDate()}.json`);
}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
function downloadWorkoutCalendar() {
  const byday=(profile.days||[1,3,6]).map(d=>DAY_CODES[d]).join(',');
  const start=getNextScheduled();start.setHours(17,0,0,0);const dt=icalDate(start);
  const ics=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Ulrik 3X//NO\r\nBEGIN:VEVENT\r\nUID:u3-workout-${Date.now()}@ulrik3x\r\nDTSTART:${dt}\r\nDURATION:PT45M\r\nRRULE:FREQ=WEEKLY;BYDAY=${byday}\r\nSUMMARY:Ulrik 3X – styrkeøkt\r\nDESCRIPTION:Kroppsvektøkt. God teknikk og ca. to repetisjoner igjen.\r\nBEGIN:VALARM\r\nTRIGGER:-PT30M\r\nACTION:DISPLAY\r\nDESCRIPTION:Trening om 30 minutter\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  downloadBlob(new Blob([ics],{type:'text/calendar'}),'ulrik-3x-treningsdager.ics');toast('Kalenderfil er laget. Tid kan endres i Kalender.');
}
function downloadSleepCalendar() {
  const [hh,mm]=(profile.bedtime||'22:30').split(':').map(Number);const d=new Date();d.setDate(d.getDate()+1);d.setHours(hh,mm,0,0);const dt=icalDate(d);
  const ics=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Ulrik 3X//NO\r\nBEGIN:VEVENT\r\nUID:u3-sleep-${Date.now()}@ulrik3x\r\nDTSTART:${dt}\r\nDURATION:PT15M\r\nRRULE:FREQ=DAILY\r\nSUMMARY:Skjerm av – gjør deg klar for søvn\r\nDESCRIPTION:Sikt mot 8–10 timer søvn. Rolig kveld støtter restitusjon og vekst.\r\nBEGIN:VALARM\r\nTRIGGER:-PT30M\r\nACTION:DISPLAY\r\nDESCRIPTION:Legg bort skjermen og gjør deg klar for søvn\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  downloadBlob(new Blob([ics],{type:'text/calendar'}),'ulrik-3x-sovn.ics');toast('Søvnpåminnelsen er klar for Kalender.');
}
function icalDate(d){return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';}
async function resetAll(){Object.values(KEYS).forEach(k=>localStorage.removeItem(k));sessionStorage.clear();try{await clearPhotos();}catch{}location.reload();}

function renderAll() { if(!profile)return; renderHome();renderWorkouts();renderNutrition();renderHabits();if(currentView==='progress')renderProgress();bindDynamicButtons(document); }
function eveningNudge() {
  if(!profile?.bedtime)return; const [h,m]=profile.bedtime.split(':').map(Number);const now=new Date();const bed=new Date();bed.setHours(h,m,0,0);const diff=(bed-now)/60000;
  if(diff>0&&diff<=60&&!sessionStorage.getItem('u3_evening')){sessionStorage.setItem('u3_evening','1');setTimeout(()=>toast('🌙 Snart leggetid: avslutt skjermen og gjør kroppen klar for søvn.'),900);}
}

function init() {
  document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>navigate(b.dataset.nav));
  document.getElementById('settingsBtn').onclick=showSettings;
  if(!profile){showOnboarding();return;}
  if(profile.pinHash&&!sessionStorage.getItem('u3_unlocked')){showLock();return;}
  renderAll(); eveningNudge();
  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
}

document.addEventListener('DOMContentLoaded',init);
