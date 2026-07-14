# Vors Partyspill

Vors er en mobil-først partyspill-PWA for vennegjenger, studentarrangementer, bursdager og lag. Appen krever ingen konto og lagrer spillerlisten lokalt.

## Dette finnes nå

- Fem eksisterende spill er bevart: Ansiktsspillet, Bussruta, Hesteløp, Festgolf og Snurrehjulet.
- Rask flyt: start, velg spill, legg til navn, spill.
- Lokal lagring av spillernavn og innstillinger for Ansiktsspillet.
- QR-kode, kopierbar lenke og systemdeling når mobilen støtter det.
- Installerbar PWA med manifest, appikoner, stående fullskjerm og offline-cache.
- Lazy-loading av spill og QR-generator, pluss lettere mobilbilder.
- Eventpakker, premium-konfigurasjon og personvernvennlig analytics-abstraksjon.
- Tastaturfokus, semantiske dialoger, redusert bevegelse og iPhone safe areas.

## Lokal kjøring

Prosjektet bruker Node 22. Node 24 låser dagens Vite-verktøykjede under lokal transformering, så `.nvmrc` og `engines` holder utvikling og Vercel på en testet versjon.

```bash
nvm use
npm ci
npm run dev
```

Åpne `http://localhost:5173`. Kvalitetssjekker:

```bash
npm run lint
npm run build
npm run preview
```

## Deploy med Vercel

Repoet er koblet til Vercel. Push en egen branch for å få en Preview Deployment. Produksjonsadressen endres først når branchen merges til `main`, forutsatt at Vercel fortsatt bruker `main` som Production Branch.

Byggekommando: `npm run build`

Output-mappe: `dist`

Anbefalt Node-versjon: `22.x`

## Lage en eventpakke

Åpne `src/data/eventPacks.js`, kopier `student`-pakken og gi den en unik `id`. Der kan du endre navn, introduksjon, logo, temafarger, spillutvalg, kort, sponsor og egen delingsadresse. Start pakken med `?event=din-id`, for eksempel:

```text
https://angry-daniyal.vercel.app/?event=fadderuke-2026
```

Logoer legges i `public/events/din-id/` og refereres som `/events/din-id/logo.png`. Kort må ha stabile ID-er og `text`. Typene og et komplett eksempel ligger i samme fil.

## Premium og betaling senere

Produktflagg, pakker og planlagte engangspriser ligger i `src/config/product.js`. `PREMIUM_ENABLED` er `false`; låste pakker kan forhåndsvises, men ingen betaling eller falsk paywall er aktiv.

En fremtidig betalingsadapter bør legges i `src/lib/payments.js` og eksponere noe som `purchasePack(packId)` og `restorePurchases()`. Web kan bruke en engangsbetaling fra en valgt leverandør. En Capacitor-app må bruke StoreKit på iOS og Google Play Billing på Android. Spillkomponentene skal bare spørre et tilgangslag om en pakke er låst, aldri importere betalingsleverandøren direkte.

## Analytics og personvern

Alle events går gjennom `src/lib/analytics.js`. Koble Plausible eller PostHog til `provider.track` senere. Abstraksjonen filtrerer feltnavn som kan inneholde navn, svar eller korttekst. Ikke send spillerlisten, fritekstsvar eller andre personopplysninger.

## Capacitor senere

Webappen unngår backendkrav og har fallbacks for deling, lagring og vibrasjon. Før App Store/Google Play:

1. Legg til Capacitor og generer iOS-/Android-prosjekter fra `dist`.
2. Generer native ikoner og splash screens fra 1024 px masterikon.
3. Bytt webdeling til Capacitor Share der det gir bedre resultat.
4. Implementer engangskjøp med StoreKit og Play Billing.
5. Lag personvernerklæring og fyll ut platformenes datadeklarasjoner.
6. Velg aldersmerking ut fra faktisk kortinnhold i den publiserte pakken.

## Bevisste avgrensninger

- Ingen registrering, backend eller sanntidsflerspiller.
- Ingen ekte betaling eller abonnement.
- iOS viser ikke en egen installasjonsforklaring ennå; appen kan likevel legges til på hjemskjermen via Del-menyen.
- Lyd til Hesteløp caches ikke offline og lastes først når spillet trenger den.

Copyright (c) 2026 Torbjørn Hagland og Daniyal Chaudhry. Alle rettigheter reservert. Se `LICENSE`.
