let profile = load(KEYS.profile, null);
let logs = load(KEYS.logs, []);
let nutritionStore = load(KEYS.nutrition, {});
let habitsStore = load(KEYS.habits, {});
let xp = Number(localStorage.getItem(KEYS.xp) || 0);
let currentView = 'home';
let restInterval = null;
let photoUrls = [];

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function localDate(d=new Date()) {
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function fmtDate(value, opts={day:'numeric',month:'short'}) {
  return new Intl.DateTimeFormat('nb-NO', opts).format(new Date(`${value}T12:00:00`));
}
function startOfWeek(date=new Date()) {
  const d=new Date(date); const day=(d.getDay()+6)%7; d.setHours(0,0,0,0); d.setDate(d.getDate()-day); return d;
}
function endOfWeek(date=new Date()) { const d=startOfWeek(date); d.setDate(d.getDate()+7); return d; }
function weekLogs(date=new Date()) {
  const start=startOfWeek(date), end=endOfWeek(date);
  return logs.filter(l=>{ const d=new Date(l.date+'T12:00:00'); return d>=start && d<end; });
}
function completedToday() { return logs.some(l=>l.date===localDate()); }
function levelInfo() {
  const level=Math.floor(xp/300)+1; const into=xp%300; return {level,into,pct:Math.round(into/300*100)};
}
function addXp(amount) { xp += amount; localStorage.setItem(KEYS.xp, String(xp)); }
function escapeHTML(s='') { return String(s).replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function toast(message) {
  const el=document.getElementById('toast'); el.textContent=message; el.classList.remove('hidden');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.add('hidden'),2300);
}
function vibrate(pattern=20) { if (navigator.vibrate) navigator.vibrate(pattern); }
function getPhase() {
  if (!profile?.startDate) return {week:1,title:'Teknikkfase',text:'Lær bevegelsene og stopp med god kontroll.'};
  const days=Math.max(0,Math.floor((Date.now()-new Date(profile.startDate+'T12:00:00'))/86400000));
  const week=Math.min(12,Math.floor(days/7)+1);
  if (week<=2) return {week,title:'Teknikkfase',text:'Rolige repetisjoner. Finn riktig variant.'};
  if (week<=5) return {week,title:'Byggefase',text:'Prøv én ekstra repetisjon når teknikken er god.'};
  if (week===6) return {week,title:'Lett uke',text:'Gjør ett sett mindre per øvelse og kom sterkere tilbake.'};
  if (week<=10) return {week,title:'Progresjonsfase',text:'Oppgrader variant når du når toppen av rep-området.'};
  return {week,title:'Mestringsfase',text:'Sammenlign med uke 1 uten å ofre teknikken.'};
}
function nextWorkout() { return WORKOUTS[logs.length % WORKOUTS.length]; }
function getNextScheduled() {
  const days=profile?.days || [1,3,6];
  const now=new Date();
  for(let add=0; add<8; add++) {
    const d=new Date(now); d.setDate(now.getDate()+add);
    if(days.includes(d.getDay()) && !(add===0 && completedToday())) return d;
  }
  return new Date(now.getTime()+86400000);
}
function weeklyStreak() {
  let streak=0; const cursor=startOfWeek();
  for(let i=0;i<52;i++) {
    const end=new Date(cursor); end.setDate(end.getDate()+7);
    const count=logs.filter(l=>{const d=new Date(l.date+'T12:00:00'); return d>=cursor&&d<end;}).length;
    if(count>=3) streak++; else if(i>0 || count===0) break;
    cursor.setDate(cursor.getDate()-7);
  }
  return streak;
}
function proteinTarget() {
  const weight=Number(profile?.weight || 0);
  if(!weight) return {low:52, high:75};
  return {low:Math.round(weight*1.2), high:Math.round(weight*1.5)};
}
function getNutrition(date=localDate()) {
  if(!nutritionStore[date]) nutritionStore[date]={protein:0,items:[],checks:{meals:false,carbs:false,produce:false,calcium:false,water:false}};
  return nutritionStore[date];
}
function getHabits(date=localDate()) {
  if(!habitsStore[date]) habitsStore[date]={};
  return habitsStore[date];
}
function isExerciseReady(exId, max) {
  const recent=logs.filter(l=>l.exercises?.[exId]).slice(-2);
  if(recent.length<2) return false;
  return recent.every(l=>l.exercises[exId].sets?.filter(s=>s.done).length && l.exercises[exId].sets.filter(s=>s.done).every(s=>Number(s.value)>=max));
}
function lastBest(exId) {
  let best=0;
  logs.forEach(l=>(l.exercises?.[exId]?.sets||[]).forEach(s=>{if(s.done) best=Math.max(best,Number(s.value)||0);}));
  return best;
}

async function hashPin(pin) {
  if(window.crypto?.subtle) {
    const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('ulrik3x:'+pin));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  let h=0; for(const c of ('ulrik3x:'+pin)) h=((h<<5)-h)+c.charCodeAt(0)|0; return String(h);
}

function showOnboarding() {
  const el=document.getElementById('onboarding'); el.classList.remove('hidden');
  el.innerHTML=`<div class="onboard-wrap">
    <div class="onboard-logo">U3</div>
    <div class="eyebrow">Privat på iPhone</div>
    <h1>Bygg styrke.<br>Se fremgangen.</h1>
    <p class="subtle">Tre kroppsvektøkter i uken, enkel matguide og privat bildeprogresjon. Programmet er laget for en aktiv 14-åring og prioriterer teknikk, vekst og gode vaner.</p>
    <form id="onboardForm">
      <div class="form-group"><label>Navn</label><input class="input" name="name" value="Ulrik" maxlength="30" required></div>
      <div class="form-group"><label>Kroppsvekt i kg <span class="subtle">(brukes bare til et moderat proteinområde)</span></label><input class="input" name="weight" type="number" min="30" max="120" step="0.1" placeholder="Skriv inn vekt" required></div>
      <div class="form-group"><label>Tre treningsdager</label><div class="day-picker">
        ${DAYS.map((d,i)=>`<label><input type="checkbox" name="days" value="${i}" ${[1,3,6].includes(i)?'checked':''}><span>${d}</span></label>`).join('')}
      </div></div>
      <div class="form-group"><label>Vanlig leggetid <span class="subtle">(kan endres)</span></label><input class="input" name="bedtime" type="time" value="22:30"></div>
      <div class="form-group"><label>Valgfri 4-sifret PIN for app og bilder</label><input class="input" name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="For eksempel 2580"></div>
      <label class="consent"><input type="checkbox" name="safe" required><span>Jeg trener smertefritt, bruker riktig teknikk og sier fra til en voksen ved smerte, svimmelhet eller sykdom.</span></label>
      <button class="btn btn-primary btn-block" type="submit">Start Ulrik 3X →</button>
    </form>
    <p class="subtle" style="font-size:11px;margin-top:15px">Ingen kalorislanking, testosteronprodukter eller kosttilskudd inngår. Ved sykdom, skade eller bekymring rundt vekst og pubertet: snakk med forelder og helsepersonell.</p>
  </div>`;
  document.getElementById('onboardForm').addEventListener('submit', async e=>{
    e.preventDefault(); const fd=new FormData(e.target); const days=fd.getAll('days').map(Number);
    if(days.length!==3) return toast('Velg akkurat tre treningsdager.');
    const pin=String(fd.get('pin')||'').trim();
    profile={name:String(fd.get('name')||'Ulrik'),age:14,weight:Number(fd.get('weight')),days,bedtime:String(fd.get('bedtime')||'22:30'),startDate:localDate(),pinHash:pin?await hashPin(pin):'',createdAt:new Date().toISOString()};
    save(KEYS.profile,profile); el.classList.add('hidden'); renderAll(); toast('Klar! Første mål er god teknikk 💪');
  });
}

function showLock() {
  const el=document.getElementById('lockScreen'); el.classList.remove('hidden');
  el.innerHTML=`<div class="onboard-wrap" style="text-align:center">
    <div class="onboard-logo" style="margin-left:auto;margin-right:auto">U3</div>
    <div class="eyebrow">Privat modus</div><h1>Hei, ${escapeHTML(profile.name)}.</h1><p class="subtle">Skriv PIN-koden for å åpne treningsloggen og bildene.</p>
    <form id="unlockForm"><input class="input" name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="••••" style="text-align:center;font-size:25px;letter-spacing:12px" autofocus required>
    <button class="btn btn-primary btn-block" style="margin-top:12px">Lås opp</button></form>
    <button id="forgotPin" class="btn btn-secondary btn-block" style="margin-top:10px">Glemt PIN – nullstill appen</button>
  </div>`;
  document.getElementById('unlockForm').addEventListener('submit',async e=>{e.preventDefault();const pin=new FormData(e.target).get('pin'); if(await hashPin(pin)===profile.pinHash){sessionStorage.setItem('u3_unlocked','1');el.classList.add('hidden');renderAll();} else {toast('Feil PIN. Prøv igjen.');e.target.reset();}});
  document.getElementById('forgotPin').onclick=()=>{ if(confirm('Dette sletter treningslogg, matlogg og lokale bilder. Fortsette?')) resetAll(); };
}

function navigate(view) {
  currentView=view;
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===view));
  document.querySelectorAll('.nav-item').forEach(v=>v.classList.toggle('active',v.dataset.nav===view));
  window.scrollTo({top:0,behavior:'smooth'});
  if(view==='progress') renderProgress();
}
