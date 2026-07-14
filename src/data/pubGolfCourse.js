export const OPENING_HOLE = {
  id: "torbjorn-hole-01",
  title: "Halvliteren",
  par: 1,
  task: "Fullfør en halvliter i eget tempo før dere går videre. Vann eller alkoholfritt teller også.",
  rule: "Ingen tidtaking. Laget velger selv når hullet er fullført.",
};

export const PUB_GOLF_CHALLENGES = [
  {
    id: "paper-putt",
    title: "Papirputt",
    par: 2,
    task: "Lag en papirball og treff et tomt glass fra omtrent én meter.",
    rule: "Tre forsøk. Bom på alle gir ett ekstra slag.",
  },
  {
    id: "wrong-hand",
    title: "Feil hånd",
    par: 3,
    task: "Alle på laget bruker feil hånd frem til neste hull.",
    rule: "Glemmer noen regelen, får laget ett ekstra slag.",
  },
  {
    id: "commentator",
    title: "Golfkommentator",
    par: 3,
    task: "Én på laget kommenterer neste minutt som en seriøs golfkommentator.",
    rule: "Fullfør uten å bryte karakter for å klare par.",
  },
  {
    id: "team-chant",
    title: "Lagrop",
    par: 2,
    task: "Finn på og fremfør et kort lagrop sammen.",
    rule: "Hele laget må delta for å klare par.",
  },
  {
    id: "quiz-duel",
    title: "Quizduell",
    par: 3,
    task: "Laget etter dere stiller ett valgfritt quizspørsmål.",
    rule: "Riktig svar er par. Feil svar gir ett ekstra slag.",
  },
  {
    id: "silent-hole",
    title: "Stille hull",
    par: 4,
    task: "Hele laget skal være helt stille frem til neste hull.",
    rule: "Hver som snakker gir laget ett ekstra slag, maks to.",
  },
  {
    id: "photo-finish",
    title: "Photo finish",
    par: 2,
    task: "Ta kveldens mest dramatiske lagbilde.",
    rule: "Alle på laget må være med i bildet for å klare par.",
  },
  {
    id: "caddie",
    title: "Caddie",
    par: 3,
    task: "Velg én caddie som skal omtale lagkameratene med golfnavn.",
    rule: "Glemmer caddien et golfnavn, får laget ett ekstra slag.",
  },
  {
    id: "coin-edge",
    title: "Presisjon",
    par: 2,
    task: "Skyv en mynt så nær bordkanten som mulig uten at den faller ned.",
    rule: "Faller mynten ned, får laget ett ekstra slag.",
  },
  {
    id: "phone-ban",
    title: "Ingen mobil",
    par: 4,
    task: "Ingen på laget bruker mobilen frem til neste hull.",
    rule: "Mobilen oppe gir laget ett ekstra slag.",
  },
  {
    id: "mime",
    title: "Mimegolf",
    par: 3,
    task: "Én spiller mimer en aktivitet som resten av laget skal gjette.",
    rule: "Gjett innen 30 sekunder for å klare par.",
  },
  {
    id: "compliment",
    title: "Komplimentrunden",
    par: 2,
    task: "Gi et ekte kompliment til laget på venstre side.",
    rule: "Alle på laget bidrar for å klare par.",
  },
  {
    id: "balance",
    title: "Balanse",
    par: 3,
    task: "Én på laget står på ett ben i 20 sekunder.",
    rule: "Berører den andre foten gulvet, får laget ett ekstra slag.",
  },
  {
    id: "story-chain",
    title: "Historien",
    par: 4,
    task: "Lag en historie der alle sier én setning hver.",
    rule: "Historien må få en tydelig slutt for å klare par.",
  },
  {
    id: "accent",
    title: "Dialekten",
    par: 3,
    task: "Laget velger en dialekt alle må bruke frem til neste hull.",
    rule: "Den som glemmer dialekten gir laget ett ekstra slag.",
  },
  {
    id: "statue",
    title: "Frys",
    par: 2,
    task: "Når noen sier «fore», må hele laget fryse i fem sekunder.",
    rule: "Sistemann til å fryse gir laget ett ekstra slag.",
  },
  {
    id: "ring-toss",
    title: "Ringkast",
    par: 3,
    task: "Kast en hårstrikk eller papirring rundt en flaske fra én meter.",
    rule: "Tre forsøk. Treff gir ett slag under par.",
  },
  {
    id: "hum-song",
    title: "Nynn låten",
    par: 3,
    task: "Én nynner en kjent låt som laget skal gjette.",
    rule: "Gjett innen 20 sekunder for å klare par.",
  },
  {
    id: "memory",
    title: "Hukommelsen",
    par: 4,
    task: "Nevn alle hullene dere allerede har spilt, i riktig rekkefølge.",
    rule: "Hver feil gir ett ekstra slag, maks to.",
  },
  {
    id: "final-guess",
    title: "Finalegjetting",
    par: 2,
    task: "Gjett hvilket lag som leder før resultatlisten åpnes.",
    rule: "Riktig gjetting gir ett slag under par.",
  },
];

export const PUB_GOLF_PRESETS = [
  {
    id: "torbjorn",
    name: "Torbjørn",
    description: "Originalen",
    challengeIds: ["paper-putt", "wrong-hand", "commentator", "team-chant", "quiz-duel", "silent-hole", "photo-finish", "caddie"],
  },
  {
    id: "chaos",
    name: "Kaos",
    description: "Mest latter",
    challengeIds: ["mime", "story-chain", "accent", "statue", "team-chant", "photo-finish", "phone-ban", "hum-song"],
  },
  {
    id: "precision",
    name: "Presisjon",
    description: "Små dueller",
    challengeIds: ["paper-putt", "coin-edge", "balance", "ring-toss", "quiz-duel", "mime", "hum-song", "final-guess"],
  },
  {
    id: "mix",
    name: "Mix",
    description: "Ny hver gang",
    challengeIds: [],
  },
];

const shuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

export function buildPubGolfCourse(presetId, holeCount) {
  const preset = PUB_GOLF_PRESETS.find((item) => item.id === presetId) || PUB_GOLF_PRESETS[0];
  const ordered = preset.id === "mix"
    ? shuffle(PUB_GOLF_CHALLENGES)
    : preset.challengeIds.map((id) => PUB_GOLF_CHALLENGES.find((challenge) => challenge.id === id)).filter(Boolean);
  const selectedIds = new Set(ordered.map((challenge) => challenge.id));
  const fillers = PUB_GOLF_CHALLENGES.filter((challenge) => !selectedIds.has(challenge.id));
  return [OPENING_HOLE, ...ordered, ...fillers].slice(0, holeCount).map((hole) => ({ ...hole }));
}
