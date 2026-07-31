'use strict';

const APP_VERSION = '1.2.0';
const KEYS = {
  profile: 'ulrik3x_profile',
  logs: 'ulrik3x_logs',
  nutrition: 'ulrik3x_nutrition',
  habits: 'ulrik3x_habits',
  xp: 'ulrik3x_xp',
  draft: 'ulrik3x_draft'
};

const DAYS = ['Søn','Man','Tir','Ons','Tor','Fre','Lør'];
const DAY_CODES = ['SU','MO','TU','WE','TH','FR','SA'];

const EXERCISES = {
  pushup: {
    name:'Push-up', youtubeId:'WDIpL0pjun0', youtube:'https://www.youtube.com/watch?v=WDIpL0pjun0', source:'NASM', videoTitle:'How to do a Push-Up – Proper Form & Technique', muscle:'Bryst • skuldre • triceps', unit:'reps', rest:75,
    description:'Hold kroppen i en rett linje. Senk brystet kontrollert mot gulvet og press opp uten å miste spennet i magen.',
    cues:['Hender litt bredere enn skuldrene','Stram mage og sete','Albuer omtrent 30–45° ut fra kroppen','Stopp mens du fortsatt kunne gjort 2 pene repetisjoner'],
    mistakes:['Hofte som synker','Halve repetisjoner','Albuer rett ut til siden'],
    levels:['Mot vegg','Mot sofa eller benk','På knær','Vanlig push-up','Føtter hevet']
  },
  squat: {
    name:'Knebøy', youtubeId:'UYbsgiiZgao', youtube:'https://www.youtube.com/watch?v=UYbsgiiZgao', source:'NASM', videoTitle:'How to do a Bodyweight Squat – Proper Form & Technique', muscle:'Lår • sete • kjerne', unit:'reps', rest:75,
    description:'Stå omtrent skulderbredt. Sett hoften litt bak og bøy knærne mens hele foten holder kontakt med gulvet.',
    cues:['Knær følger samme retning som tær','Brystet stolt og ryggen lang','Press gulvet fra deg på vei opp','Rolig ned – kontrollert opp'],
    mistakes:['Knær faller innover','Hælene løfter seg','Faller raskt ned'],
    levels:['Til stol','Vanlig knebøy','3 sekunder ned','Pause i bunnen','1½ repetisjon']
  },
  'reverse-lunge': {
    name:'Bakoverutfall', youtubeId:'HXs8u1251ss', youtube:'https://www.youtube.com/watch?v=HXs8u1251ss', source:'Runna', videoTitle:'Reverse Lunge Exercise Tutorial', muscle:'Lår • sete • balanse', unit:'reps/side', rest:75,
    description:'Ta et rolig steg bakover og senk bakre kne mot gulvet. Press gjennom den fremre foten tilbake til stående.',
    cues:['Hold overkroppen høy','Fremre kne følger tærne','Kontrollert steg – ingen hast','Samme antall på begge sider'],
    mistakes:['For smal fotstilling','Fremre kne kollapser innover','Dytter fra med bakre fot'],
    levels:['Hold i vegg','Kort bevegelse','Vanlig bakoverutfall','3 sekunder ned','Kneløft på toppen']
  },
  'pike-pushup': {
    name:'Pike push-up', youtubeId:'2b5t0Cu2nQI', youtube:'https://www.youtube.com/watch?v=2b5t0Cu2nQI', source:'NASM', videoTitle:'How to do a Pike Push-Up – Proper Form & Technique', muscle:'Skuldre • triceps', unit:'reps', rest:90,
    description:'Start med hoften høyt som en omvendt V. Bøy albuene og før hodet rolig ned mellom hendene før du presser opp.',
    cues:['Hoften forblir høy','Se mot føttene','Hodet går litt frem og ned','Bruk kortere bevegelse først'],
    mistakes:['Blir en vanlig push-up','Albuer helt ut','Dunker hodet ned'],
    levels:['Kort bevegelse','Vanlig pike','Føtter på lav sofa','Større bevegelse']
  },
  'glute-bridge': {
    name:'Seteløft', youtubeId:'Z3cY3d3BBo4', youtube:'https://www.youtube.com/watch?v=Z3cY3d3BBo4', source:'NASM', videoTitle:'How to do a Floor Bridge – Proper Form & Technique', muscle:'Sete • bakside lår', unit:'reps', rest:60,
    description:'Ligg på ryggen med føttene nær setet. Press hoften opp ved å stramme setet, hold kort, og senk rolig.',
    cues:['Press gjennom hele foten','Ribbein rolig ned','Stram setet på toppen','Unngå å overdrive svai i ryggen'],
    mistakes:['Skyver fra med korsryggen','Føttene for langt unna','Ingen kontroll ned'],
    levels:['Vanlig','2 sekunder hold','Føtter lenger ut','Ett bein']
  },
  'dead-bug': {
    name:'Dead bug', youtubeId:'bxn9FBrt4-A', youtube:'https://www.youtube.com/watch?v=bxn9FBrt4-A', source:'NASM', videoTitle:'How to do a Dead Bug – Proper Form & Technique', muscle:'Mage • kontroll', unit:'reps/side', rest:45,
    description:'Ligg på ryggen med hofter og knær bøyd. Strekk motsatt arm og bein uten at korsryggen løfter seg.',
    cues:['Pust ut når arm og bein strekkes','Korsryggen rolig mot gulvet','Beveg sakte','Kort ned bevegelsen ved behov'],
    mistakes:['Ryggen løfter seg','For raskt tempo','Holder pusten'],
    levels:['Kun hæltouch','Kun armer','Motsatt arm og bein','Nærmere gulvet']
  },
  plank: {
    name:'Planke', youtubeId:'mwlp75MS6Rg', youtube:'https://www.youtube.com/watch?v=mwlp75MS6Rg', source:'NASM', videoTitle:'How to do a Plank – Proper Form & Technique', muscle:'Kjerne • skuldre', unit:'sek', rest:60,
    description:'Støtt på underarmer og tær. Lag en rett linje fra hode til hæl og hold mens du puster rolig.',
    cues:['Stram mage og sete','Press underarmene ned','Se ned i gulvet','Avslutt før hoften synker'],
    mistakes:['Hofte for høyt eller lavt','Holder pusten','Skuldre opp mot ørene'],
    levels:['På knær','Kort planke','Vanlig planke','Lengre armstilling']
  },
  'table-row': {
    name:'Bordroing', youtubeId:'hXTc1mDnZCw', youtube:'https://www.youtube.com/watch?v=hXTc1mDnZCw', source:'BarBend', videoTitle:'Inverted Row Guide', muscle:'Rygg • bakside skuldre • armer', unit:'reps', rest:90,
    description:'Ligg under et tungt, solid bord og hold i kanten. Trekk brystet mot bordet med kroppen samlet. Må kontrolleres av en voksen først.',
    cues:['Bruk aldri glassbord eller sammenleggbart bord','Voksen tester bordet før første økt','Trekk skulderbladene sammen','Kroppen holder en rett linje'],
    mistakes:['Utrygt eller lett bord','Hofte faller','Rykker kroppen opp'],
    levels:['Knær bøyd','Føtter lenger frem','Strake bein','Føtter litt hevet'], safety:true
  },
  'split-squat': {
    name:'Splittknebøy', youtubeId:'JyMiO1iQzEY', youtube:'https://www.youtube.com/watch?v=JyMiO1iQzEY', source:'Runna', videoTitle:'Split Squat Exercise Tutorial', muscle:'Lår • sete', unit:'reps/side', rest:75,
    description:'Stå i delt fotstilling. Senk kroppen rett ned og press opp igjen med mest arbeid i fremre bein.',
    cues:['Føttene som på to togskinner','Bakre kne går ned','Fremre fot står stabilt','Hold i vegg for balanse'],
    mistakes:['Føttene på én linje','Lener seg mye frem','Fremre hæl løfter seg'],
    levels:['Hold i vegg','Kort bevegelse','Full bevegelse','3 sekunder ned']
  },
  'prone-pulldown': {
    name:'Liggende nedtrekk', youtubeId:'EXv43gku-wQ', youtube:'https://www.youtube.com/watch?v=EXv43gku-wQ', source:'FITTR', videoTitle:'Lat Pull-Down Movement Guide', muscle:'Øvre rygg • bakside skuldre', unit:'reps', rest:60,
    description:'Ligg på magen med armene strukket frem. Løft brystet svakt og trekk albuene ned mot siden før du strekker ut igjen.',
    cues:['Bare liten løft av brystet','Skuldre vekk fra ørene','Trekk albuene mot baklommene','Hold ett sekund i trukket posisjon'],
    mistakes:['Kaster hodet bakover','For stor svai','Raske repetisjoner'],
    levels:['Armene langs gulvet','Kort løft','Full rekkevidde','2 sekunder hold']
  },
  'single-leg-hinge': {
    name:'Ettbeins hoftebøy', youtubeId:'UZeF5ZPlY1E', youtube:'https://www.youtube.com/watch?v=UZeF5ZPlY1E', source:'Runna', videoTitle:'Single-Leg Romanian Deadlift Tutorial', muscle:'Bakside lår • sete • balanse', unit:'reps/side', rest:60,
    description:'Stå på ett bein, send hoften bak og la det andre beinet gå bakover. Reis deg ved å stramme setet.',
    cues:['Mykt kne på standbeinet','Hoftene peker ned','Lang rygg','Hold lett i veggen først'],
    mistakes:['Åpner hoften til siden','Runder ryggen','Jager dybde fremfor kontroll'],
    levels:['To hender i vegg','Én hånd i vegg','Uten støtte','3 sekunder ned']
  },
  'side-plank': {
    name:'Sideplanke', youtubeId:'44ND4bOB-T0', youtube:'https://www.youtube.com/watch?v=44ND4bOB-T0', source:'NASM', videoTitle:'How to do a Side Plank – Proper Form & Technique', muscle:'Sidemage • skulder', unit:'sek/side', rest:60,
    description:'Støtt på underarmen og løft hoften slik at kroppen blir lang og rett. Hold samme tid på begge sider.',
    cues:['Albue under skulder','Hofte høyt','Brystet peker frem','Kortere hold med god form slår lengre dårlig hold'],
    mistakes:['Hofte synker','Skulder kollapser','Ruller fremover'],
    levels:['Knær bøyd','Full sideplanke','Øvre bein løftet']
  },
  'calf-raise': {
    name:'Tåhev', youtubeId:'ix9LRCNb38U', youtube:'https://www.youtube.com/watch?v=ix9LRCNb38U', source:'FITTR', videoTitle:'Bodyweight Calf Raises', muscle:'Legger • ankler', unit:'reps', rest:45,
    description:'Stå høyt, løft hælene kontrollert og hold kort på toppen før du senker helt ned.',
    cues:['Hold lett i veggen','Full kontroll','Pause på toppen','Begge sider likt'],
    mistakes:['Spretter opp og ned','Ruller ankelen ut','Halv bevegelse'],
    levels:['Begge bein','Sakte tempo','Ett bein','Ett bein med pause']
  },
  'close-pushup': {
    name:'Smal push-up', youtubeId:'iGBnvy8_47I', youtube:'https://www.youtube.com/watch?v=iGBnvy8_47I', source:'FITTR', videoTitle:'Close-Grip Push-Up Progression', muscle:'Triceps • bryst', unit:'reps', rest:75,
    description:'Gjør push-up med hendene litt smalere enn vanlig og albuene nærmere kroppen. Bruk skrå variant eller knær ved behov.',
    cues:['Hender under eller litt innenfor skuldrene','Albuer nær kroppen','Kroppen samlet','Velg en variant du kontrollerer'],
    mistakes:['Hender helt sammen og håndledd vondt','Hofte synker','Albuer spriker'],
    levels:['Mot sofa','På knær','Vanlig smal','Føtter hevet']
  },
  'pause-squat': {
    name:'Knebøy med pause', youtubeId:'UYbsgiiZgao', youtube:'https://www.youtube.com/watch?v=UYbsgiiZgao', source:'NASM', videoTitle:'Bodyweight Squat – use the pause cues in the app', muscle:'Lår • sete • kontroll', unit:'reps', rest:75,
    description:'Gjør en rolig knebøy, stopp ett sekund i den dypeste gode posisjonen og reis deg kontrollert.',
    cues:['Behold spennet i pausen','Hele foten i gulvet','Knær følger tær','Ingen sprett i bunnen'],
    mistakes:['Slapper av i bunnen','Hæler opp','Knær inn'],
    levels:['Pause til stol','Kort pause','2 sekunder pause','1½ repetisjon']
  },
  'shoulder-tap': {
    name:'Skuldertouch', youtubeId:'-mrG8c0JhGM', youtube:'https://www.youtube.com/watch?v=-mrG8c0JhGM', source:'FITTR', videoTitle:'Shoulder Taps', muscle:'Kjerne • skuldre', unit:'reps/side', rest:60,
    description:'Fra høy planke løfter du én hånd og berører motsatt skulder. Hold hoften så rolig som mulig.',
    cues:['Føttene litt bredere','Press gulvet vekk','Rolige skift','Gjør på knær ved behov'],
    mistakes:['Hoften roterer mye','Skynder seg','Hodet faller ned'],
    levels:['På knær','Bred fotstilling','Smalere fotstilling','Pause ved skulder']
  },
  'hollow-hold': {
    name:'Hollow hold', youtubeId:'u6vuP12rdJY', youtube:'https://www.youtube.com/watch?v=u6vuP12rdJY', source:'FITTR', videoTitle:'Hollow Hold', muscle:'Mage • kroppskontroll', unit:'sek', rest:60,
    description:'Ligg på ryggen og løft skuldre og bein mens korsryggen holdes mot gulvet. Bøy knærne dersom ryggen løfter seg.',
    cues:['Korsryggen ned','Se mot knærne','Pust rolig','Velg tuck først'],
    mistakes:['Korsryggen får luft','Holder pusten','Bein for lavt for nivået'],
    levels:['Tuck hold','Én fot ut','Begge bein bøyd','Full hollow']
  }
};

function exerciseImage(ex) {
  return `https://img.youtube.com/vi/${ex.youtubeId}/hqdefault.jpg`;
}

function exerciseMedia(ex, compact=false) {
  const label=`Åpne ${ex.name}-video på YouTube`;
  return `<a class="${compact?'exercise-thumb-link':'tech-media'}" href="${ex.youtube}" target="_blank" rel="noopener noreferrer" aria-label="${label}">
    <img class="${compact?'exercise-thumb':'tech-image'}" src="${exerciseImage(ex)}" alt="Teknikkbilde for ${ex.name}" loading="lazy" referrerpolicy="no-referrer">
    ${compact?'<span class="thumb-play">▶</span>':`<span class="tech-play"><strong>▶ Se teknikkvideo på YouTube</strong><small>${ex.source} • åpnes i ny fane</small></span>`}
  </a>`;
}

const WORKOUTS = [
  {
    id:'A', title:'Økt A', subtitle:'Press + bein + mage', duration:'35–45 min', accent:'⚡',
    exercises:[
      {id:'pushup', sets:3, min:6, max:12},
      {id:'squat', sets:3, min:10, max:20},
      {id:'reverse-lunge', sets:3, min:8, max:12},
      {id:'pike-pushup', sets:2, min:6, max:12},
      {id:'glute-bridge', sets:3, min:12, max:20},
      {id:'dead-bug', sets:2, min:8, max:12}
    ]
  },
  {
    id:'B', title:'Økt B', subtitle:'Rygg + bakside + kjerne', duration:'35–45 min', accent:'🛡️',
    exercises:[
      {id:'table-row', sets:3, min:6, max:12},
      {id:'split-squat', sets:3, min:8, max:12},
      {id:'prone-pulldown', sets:3, min:10, max:15},
      {id:'single-leg-hinge', sets:3, min:8, max:12},
      {id:'side-plank', sets:2, min:20, max:40},
      {id:'calf-raise', sets:3, min:12, max:25}
    ]
  },
  {
    id:'C', title:'Økt C', subtitle:'Full kropp + kontroll', duration:'35–45 min', accent:'🔥',
    exercises:[
      {id:'close-pushup', sets:3, min:6, max:12},
      {id:'pause-squat', sets:3, min:10, max:15},
      {id:'table-row', sets:3, min:6, max:12},
      {id:'reverse-lunge', sets:2, min:10, max:15},
      {id:'shoulder-tap', sets:3, min:8, max:16},
      {id:'hollow-hold', sets:3, min:15, max:30}
    ]
  }
];

const FOODS = [
  {name:'2 egg', grams:13, icon:'🥚'},
  {name:'Kylling 100 g', grams:30, icon:'🍗'},
  {name:'Karbonadedeig 100 g', grams:26, icon:'🥩'},
  {name:'Laks 100 g', grams:22, icon:'🐟'},
  {name:'Gresk yoghurt 200 g', grams:18, icon:'🥣'},
  {name:'Melk 250 ml', grams:9, icon:'🥛'},
  {name:'Bønner 150 g', grams:12, icon:'🫘'},
  {name:'Ostesmørbrød', grams:15, icon:'🧀'}
];

const HABITS = [
  {id:'sleep', icon:'🌙', title:'8–10 timer søvn', text:'Søvn støtter vekst, læring, restitusjon og normal hormonbalanse.'},
  {id:'screen', icon:'📵', title:'Skjerm av før leggetid', text:'Legg bort skjermen 30–60 minutter før søvn.'},
  {id:'food', icon:'🍽️', title:'Spist nok og variert', text:'Protein, karbohydrater, frukt/grønt og sunt fett – ingen ekstrem slanking.'},
  {id:'daylight', icon:'☀️', title:'Dagslys og bevegelse', text:'Kom deg ut og vær aktiv også på hviledager.'},
  {id:'recovery', icon:'🧘', title:'Rolig restitusjon', text:'Hviledager bygger kroppen; mer er ikke alltid bedre.'},
  {id:'noBoosters', icon:'🛑', title:'Ingen raske løsninger', text:'Ingen SARMs, steroider, testosteronprodukter eller tilfeldige pre-workouts. Unngå energidrikker.'}
];
