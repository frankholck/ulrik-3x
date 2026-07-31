# Ulrik 3X v1.3

En installérbar treningsapp for iPhone 14, laget for en 14-åring som vil bygge styrke og tydeligere muskler med tre trygge kroppsvektøkter i uken.

## Dette er inkludert

- Tre helkroppsøkter per uke i et 12-ukers progresjonssystem
- Tydelig teknikkbilde og YouTube-knapp for hver øvelse
- Norske teknikkpunkter og vanlige feil direkte i appen
- Logging av sett, repetisjoner/sekunder, pauser, XP, nivåer og merker
- Progresjon først når toppen av repetisjonsområdet nås med god teknikk i to økter
- Maks én styrkeøkt per dag og tre per uke
- Fem enkle daglige matspørsmål, blant annet banan/frukt, yoghurt/meieri, kylling/kjøtt/fisk/egg/bønner, karbohydrat og vann
- Positive og varierte tilbakemeldinger etter matinnsjekk, gode vaner og fullført trening
- Valgfri mer detaljert proteinoversikt med et moderat område på ca. 1,2–1,5 g/kg kroppsvekt
- Måltidsforslag uten kalorislanking eller krav om proteinpulver
- «Sterk hverdag» med søvn, mat, dagslys, skjermvaner og tydelig advarsel mot SARMs, steroider, testosteronprodukter, nikotin/vape, alkohol, energidrikker og pre-workout
- Progresjonsbilder lagret lokalt i IndexedDB, med før/etter-sammenligning
- Valgfri 4-sifret app-lås og manuell «Lås appen nå»-knapp
- Kalenderfiler for treningsdager og søvnpåminnelse
- Offline appskall uten annonser, analyseverktøy eller backend

Teknikkbildene hentes fra de valgte YouTube-videoene. YouTube-videoene krever internett og åpnes i en ny fane/app.

## Installere på iPhone

Full installasjon og offline-støtte krever at repositoryet publiseres på en HTTPS-adresse, for eksempel med GitHub Pages, Cloudflare Pages, Netlify eller Vercel.

1. Åpne den publiserte adressen i Safari på iPhone 14.
2. Trykk **Del** → **Legg til på Hjem-skjermen**.
3. Åpne **Ulrik 3X** fra ikonet.
4. Legg inn kroppsvekt, tre treningsdager, vanlig leggetid og eventuelt PIN.

## Personvern

Treningslogg, matlogg og vaner lagres bare lokalt i nettleseren på telefonen. Progresjonsbilder sendes ikke til en server. PIN-koden er en enkel app-lås; den erstatter ikke iPhone-kode, Face ID eller kryptert lagring.

Sletting av Safari-/appdata sletter også lokale bilder. Eksporter treningsdata jevnlig dersom loggen er viktig. Ikke bruk intime eller delte bilder som progresjonsbilder.

## Sikkerhet

Programmet er generell treningsveiledning, ikke medisinsk behandling. Øvelsene skal være smertefrie og utføres kontrollert. Bordroing krever et tungt, solid bord som er testet av en voksen; bruk aldri glassbord eller sammenleggbart bord.

Ved smerte, svimmelhet, sykdom, pustevansker eller bekymring rundt vekst/pubertet skal en forelder og relevant helsepersonell involveres.

## Lokal test

```bash
python3 -m http.server 8080
```

Åpne `http://localhost:8080` i en nettleser.

## Filer

- `index.html` – appskall
- `styles.css` – mobiltilpasset design
- `js/app-data.js` – treningsprogram, øvelser, YouTube-lenker og bilder
- `js/app-core.js` – lokal lagring, onboarding og PIN
- `js/app-workouts.js` – treningslogging og progresjon
- `js/app-nutrition-progress.js` – enkel matinnsjekk, matguide og bilder
- `js/app-settings.js` – innstillinger, eksport og kalender
- `js/app-motivation.js` – positive treningsfeiringer
- `manifest.webmanifest` – PWA-oppsett
- `sw.js` – offline-cache
- `icons/` – appikon
- `SOURCES.md` – faglig grunnlag og teknikkvideoer
