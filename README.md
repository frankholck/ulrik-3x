# Ulrik 3X v1.1

Privat, installérbar treningsapp laget for iPhone 14 og tilpasset en 14-åring som vil bygge styrke og synlige muskler med tre kroppsvektøkter i uken.

## Dette er inkludert

- Tre helkroppsøkter per uke i et 12-ukers progresjonssystem
- 17 korte, lokale teknikkvideoer som også virker offline
- Logging av sett, repetisjoner/sekunder, pauser, XP, nivåer og merker
- Progresjonsregel: øk først når toppen av repetisjonsområdet er nådd med god teknikk i to økter
- Maks én styrkeøkt per dag og tre per uke i appen
- Daglig matguide med et moderat proteinområde på ca. 1,2–1,5 g/kg kroppsvekt
- Måltidsforslag, proteinregistrering, vann, frukt/grønt, karbohydrat og kalsium
- Ingen kalorislanking, proteinpulverkrav eller kosttilskuddsopplegg
- «Sterk hverdag» med søvn, mat, dagslys, skjermvaner og advarsel mot SARMs, steroider, testosteronprodukter, nikotin/vape, alkohol og pre-workout/energidrikk
- Progresjonsbilder lagret lokalt i IndexedDB, med før/etter-sammenligning
- Valgfri 4-sifret app-lås og manuell «Lås appen nå»-knapp
- Kalenderfiler for treningsdager og søvnpåminnelse
- Offline PWA uten annonser, analyseverktøy eller backend

## Installere på iPhone

Full installasjon og offline-støtte krever at mappen ligger på en HTTPS-adresse.

1. Publiser innholdet i denne mappen på en statisk HTTPS-tjeneste, for eksempel Cloudflare Workers/Pages, GitHub Pages, Netlify eller Vercel.
2. Åpne adressen i Safari på iPhone 14.
3. Trykk **Del** → **Legg til på Hjem-skjermen**.
4. Åpne **Ulrik 3X** fra ikonet.
5. Legg inn kroppsvekt, tre treningsdager, vanlig leggetid og eventuelt PIN.

## Personvern

Treningslogg, matlogg og vaner lagres bare lokalt i nettleseren på telefonen. Progresjonsbilder sendes ikke til en server. PIN-koden er en enkel app-lås; den er ikke en erstatning for iPhone-kode/Face ID eller kryptert skylagring. Sletting av Safari-/appdata sletter også lokale bilder. Eksporter treningsdata jevnlig dersom loggen er viktig.

Ikke bruk intime eller delte bilder som progresjonsbilder.

## Sikkerhet

Programmet er generell treningsveiledning, ikke medisinsk behandling. Øvelsene skal være smertefrie og utføres kontrollert. Bordroing krever et tungt, solid bord som er testet av en voksen; bruk aldri glassbord eller sammenleggbart bord. Ved smerte, svimmelhet, sykdom, pustevansker eller bekymring rundt vekst/pubertet skal en forelder og relevant helsepersonell involveres.

## Lokal test

Fra denne mappen:

```bash
python3 -m http.server 8080
```

Åpne `http://localhost:8080` i en nettleser.

## Filer

- `index.html` – appskall
- `styles.css` – mobiltilpasset design
- `app.js` – treningsprogram, logging, matguide, bilder og kalender
- `manifest.webmanifest` – PWA-oppsett
- `sw.js` – offline-cache
- `icons/` – appikoner
- `videos/` – lokale teknikkvideoer
- `SOURCES.md` – faglig grunnlag
