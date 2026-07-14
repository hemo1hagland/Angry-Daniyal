export const STARTING_CURRENCY = 10;
export const MAX_CURRENCY = 10;
export const PURCHASES_PER_TURN = 1;
export const WINNING_NEIGHBORHOODS = 2;
export const MAX_BUILDINGS = 5;

export const NEIGHBORHOODS = {
  brown: { name: "Første stopp", color: "#9a6a45" },
  lightBlue: { name: "Studentgata", color: "#68a9d6" },
  pink: { name: "Sentrum", color: "#cf6a9e" },
  orange: { name: "Byrunden", color: "#de7b36" },
  red: { name: "Takterrassen", color: "#c94b4b" },
  yellow: { name: "Sene timer", color: "#d8ae26" },
  green: { name: "Grønn løper", color: "#23845f" },
  navy: { name: "Toppetasjen", color: "#243b70" },
  transport: { name: "Transport", color: "#64748b", countsForWin: false },
  utility: { name: "Vors-fasiliteter", color: "#2f8f83", countsForWin: false },
};

export const BOARD_SPACES = [
  { id: "start", type: "start", name: "Start" },
  { id: "skipperstuen", type: "property", name: "Skipperstuen", shortName: "Skipper", group: "brown", cost: 1 },
  { id: "water-break-1", type: "pause", name: "Vannpause", shortName: "Vann" },
  { id: "heidis", type: "property", name: "Heidi's", shortName: "Heidi's", group: "brown", cost: 1 },
  { id: "bar-tab", type: "tax", name: "Barregning", penalty: 2 },
  { id: "night-bus", type: "property", name: "Nattbussen", shortName: "Nattbuss", group: "transport", cost: 2, buildable: false, rent: 1 },
  { id: "old-irish", type: "property", name: "The Old Irish Pub", shortName: "Old Irish", group: "lightBlue", cost: 2 },
  { id: "bonus-1", type: "bonus", name: "Bonusfelt" },
  { id: "kulturhuset", type: "property", name: "Kulturhuset", shortName: "Kultur", group: "lightBlue", cost: 2 },
  { id: "youngs", type: "property", name: "Youngs", shortName: "Youngs", group: "lightBlue", cost: 2 },
  { id: "jail", type: "jail", name: "Fyllarresten" },
  { id: "jaeger", type: "property", name: "Jæger", shortName: "Jæger", group: "pink", cost: 2 },
  { id: "sound-system", type: "property", name: "Musikkanlegget", shortName: "Musikk", group: "utility", cost: 2, buildable: false, rent: 1 },
  { id: "the-villa", type: "property", name: "The Villa", shortName: "The Villa", group: "pink", cost: 2 },
  { id: "blaa", type: "property", name: "Blå", shortName: "Blå", group: "pink", cost: 2 },
  { id: "subway", type: "property", name: "T-banen", shortName: "T-banen", group: "transport", cost: 2, buildable: false, rent: 1 },
  { id: "justisen", type: "property", name: "Justisen", shortName: "Justisen", group: "orange", cost: 3 },
  { id: "toilet-line", type: "pause", name: "Toalettkø", shortName: "Toalettkø" },
  { id: "horgans", type: "property", name: "Horgans", shortName: "Horgans", group: "orange", cost: 3 },
  { id: "lawo", type: "property", name: "Lawo", shortName: "Lawo", group: "orange", cost: 3 },
  { id: "parking", type: "parking", name: "Gratis parkering" },
  { id: "ba3", type: "property", name: "BA3", shortName: "BA3", group: "red", cost: 3 },
  { id: "bonus-2", type: "bonus", name: "Bonusfelt" },
  { id: "stratos", type: "property", name: "Stratos", shortName: "Stratos", group: "red", cost: 3 },
  { id: "taket", type: "property", name: "Taket Steen & Strøm", shortName: "Taket", group: "red", cost: 3 },
  { id: "taxi", type: "property", name: "Taxi", shortName: "Taxi", group: "transport", cost: 2, buildable: false, rent: 1 },
  { id: "kj10", type: "property", name: "KJ10", shortName: "KJ10", group: "yellow", cost: 3 },
  { id: "grand-cafe", type: "property", name: "Grand Café", shortName: "Grand Café", group: "yellow", cost: 3 },
  { id: "vors-kitchen", type: "property", name: "Vors-kjøkkenet", shortName: "Kjøkken", group: "utility", cost: 2, buildable: false, rent: 1 },
  { id: "michaels", type: "property", name: "Michaels", shortName: "Michaels", group: "yellow", cost: 3 },
  { id: "go-to-jail", type: "goJail", name: "Gå til Fyllarresten" },
  { id: "loulou", type: "property", name: "LouLou", shortName: "LouLou", group: "green", cost: 4 },
  { id: "sommerro", type: "property", name: "Sommerro", shortName: "Sommerro", group: "green", cost: 4 },
  { id: "water-break-2", type: "pause", name: "Vannpause", shortName: "Vann" },
  { id: "grand-hotel", type: "property", name: "Grand Hotel Oslo", shortName: "Grand", group: "green", cost: 4 },
  { id: "party-bus", type: "property", name: "Nachspielbussen", shortName: "Nachbuss", group: "transport", cost: 2, buildable: false, rent: 1 },
  { id: "last-call", type: "pause", name: "Siste runde", shortName: "Siste runde" },
  { id: "the-thief", type: "property", name: "The Thief", shortName: "The Thief", group: "navy", cost: 5 },
  { id: "night-food", type: "tax", name: "Nattmat", penalty: 1 },
  { id: "theatercafeen", type: "property", name: "Theatercaféen", shortName: "Theater", group: "navy", cost: 5 },
];

export const CHALLENGE_CARDS = [
  { title: "Nynn en sang", text: "Nynn en sang. Resten skal gjette tittelen innen 20 sekunder." },
  { title: "Få rommet til å le", text: "Fortell en vits. Minst én annen spiller må le." },
  { title: "To fakta og én løgn", text: "Velg en spiller som skal finne løgnen. Gjetter de riktig, taper du challengen." },
  { title: "Kategorier", text: "Velg en kategori. Gå rundt bordet uten gjentakelser eller fem sekunders pause." },
  { title: "Spørsmålsmester", text: "Få noen til å svare på et spørsmål uten at de sier ordet ja eller nei." },
  { title: "Medusa", text: "Alle ser ned. På tre ser alle på én person. Øyekontakt betyr én slurk hver." },
  { title: "Historien", text: "Start en historie med én setning. Alle legger til én setning uten å nøle." },
  { title: "Imitasjon", text: "Imiter en kjent person til noen gjetter hvem det er." },
  { title: "Alfabetet", text: "Si et festrelatert ord for hver bokstav fra A til F uten hjelp." },
  { title: "Regelmester", text: "Lag en enkel regel som gjelder frem til din neste tur." },
];

export const BONUS_CARDS = [
  { title: "Breezer Race", text: "Velg en motspiller. Først til 20 raske trykk på bordet vinner. Taperen tar 2 slurker." },
  { title: "Del ut", text: "Del ut 2 slurker til én eller to spillere." },
  { title: "To til deg", text: "Ta 2 slurker, eller stå over og gå til Fyllarresten." },
  { title: "Rett til Start", text: "Flytt direkte til Start og fyll to nivåer tilbake i glasset.", effect: "start" },
  { title: "Åpen regning", text: "Fyll ett nivå tilbake i glasset.", effect: "currency" },
  { title: "Random drink", text: "Gruppen velger tre vanlige ingredienser. Lag en liten, tilfeldig drink eller gå til Fyllarresten." },
  { title: "Nynn en sang", text: "Nynn en sang. Første spiller som gjetter riktig deler ut 2 slurker." },
  { title: "Vits eller arrest", text: "Fortell en vits. Ler ingen, går du til Fyllarresten." },
  { title: "Tommelmester", text: "Du er tommelmester frem til neste tur. Sistemann som kopierer deg tar 1 slurk." },
  { title: "Bytt plass", text: "Velg en spiller og bytt fysisk sitteplass rundt bordet." },
];

export const PIECES = [
  { id: "beer", name: "Øl", color: "#e4a11b" },
  { id: "wine", name: "Vin", color: "#a33b57" },
  { id: "spirit", name: "Sprit", color: "#667085" },
  { id: "gin", name: "Gin", color: "#338f78" },
  { id: "cider", name: "Cider", color: "#df7c45" },
  { id: "breezer", name: "Breezer", color: "#c65a9c" },
];
