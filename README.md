# Vors 🍻

En mobil-first drikkeleke-app. Trykk på ansiktene – ett av dem er hemmelig
sint. Treffer du det, tapte du og får en oppgave fra valgt spillmodus.

## Funksjoner
- Rutenett av ansikter (9 / 16 / 25 / 36) med ett skjult "sint" ansikt
- 4 spillmoduser med 25+ kort hver: Klassisk, Sannhet eller Drikk, Pekeleken, Kaos
- Legg til spillere (lagres lokalt)
- Lag egne kort per kategori (lagres lokalt)
- Mørkt, premium festdesign med animasjoner og haptisk feedback

## Kjør lokalt
```bash
npm install
npm run dev
```
Åpne adressen som vises (vanligvis http://localhost:5173).

## Bygg for produksjon
```bash
npm run build      # bygger til dist/
npm run preview    # forhåndsvis bygget
```

## Deploy
Last opp `dist/`-mappa til Netlify, Vercel eller Lovable.

## Struktur
```
src/
  App.jsx                 navigasjon mellom skjermer (state-styrt)
  data/cards.js           4 kategorier × 25+ kort
  hooks/useLocalStorage.js
  components/
    Button.jsx            gjenbrukbar knapp
    Face.jsx              eget SVG-ansikt (neutral / angry)
  screens/
    Landing.jsx
    Players.jsx
    ModeSelect.jsx
    FaceGame.jsx          hovedspillet
    ResultView.jsx
    CustomCards.jsx
```

## Utvide senere
- Lyd på tap / trykk
- Økende sjanse per trykk (mer spenning utover i runden)
- Flere mekanikker (hjul, finger-roulette)
- Vis hvem sin tur det er (turbasert spillerlogikk)
