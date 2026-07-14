export const STARTING_CURRENCY = 5;
export const MAX_CURRENCY = 8;
export const PURCHASES_PER_TURN = 1;
export const WINNING_NEIGHBORHOODS = 2;

export const NEIGHBORHOODS = {
  brown: { name: "Første stopp", color: "#9a6a45" },
  blue: { name: "Studentgata", color: "#68a9d6" },
  pink: { name: "Sentrum", color: "#cf6a9e" },
  green: { name: "Grønn løper", color: "#23845f" },
  navy: { name: "Toppetasjen", color: "#243b70" },
};

export const BOARD_SPACES = [
  { id: "start", type: "start", name: "Start" },
  { id: "skipperstuen", type: "property", name: "Skipperstuen", shortName: "Skipper", group: "brown", cost: 1 },
  { id: "bonus-0", type: "bonus", name: "Bonusfelt" },
  { id: "heidis", type: "property", name: "Heidi's", shortName: "Heidi's", group: "brown", cost: 1 },
  { id: "bonus-1", type: "bonus", name: "Bonusfelt" },
  { id: "old-irish", type: "property", name: "The Old Irish Pub", shortName: "Old Irish", group: "blue", cost: 2 },
  { id: "kulturhuset", type: "property", name: "Kulturhuset", shortName: "Kulturhuset", group: "blue", cost: 2 },
  { id: "bonus-2", type: "bonus", name: "Bonusfelt" },
  { id: "jail", type: "jail", name: "Fyllarresten" },
  { id: "jaeger", type: "property", name: "Jæger", shortName: "Jæger", group: "pink", cost: 2 },
  { id: "the-villa", type: "property", name: "The Villa", shortName: "The Villa", group: "pink", cost: 2 },
  { id: "bonus-3", type: "bonus", name: "Bonusfelt" },
  { id: "water", type: "pause", name: "Vannpause" },
  { id: "loulou", type: "property", name: "LouLou", shortName: "LouLou", group: "green", cost: 3 },
  { id: "sommerro", type: "property", name: "Sommerro", shortName: "Sommerro", group: "green", cost: 3 },
  { id: "bonus-4", type: "bonus", name: "Bonusfelt" },
  { id: "taxi", type: "taxi", name: "Taxi til Start" },
  { id: "grand-hotel", type: "property", name: "Grand Hotel Oslo", shortName: "Grand", group: "navy", cost: 4 },
  { id: "bonus-5", type: "bonus", name: "Bonusfelt" },
  { id: "the-thief", type: "property", name: "The Thief", shortName: "The Thief", group: "navy", cost: 4 },
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
  { title: "Rett til Start", text: "Flytt direkte til Start og få 1 slurkmynt.", effect: "start" },
  { title: "Åpen regning", text: "Du får 1 ekstra slurkmynt.", effect: "currency" },
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
