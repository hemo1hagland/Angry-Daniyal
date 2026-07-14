/** Product switches are kept away from the game screens. */
export const PREMIUM_ENABLED = false;

export const PRODUCT = {
  name: "Vors",
  shortName: "Vors",
  publicUrl: "https://angry-daniyal.vercel.app/",
  tagline: "Partyspill for hele gjengen",
  responsibleUse:
    "Spill ansvarlig. Aldri press noen til å delta.",
  oneTimePriceNok: 49,
  packPriceRangeNok: [19, 29],
};

/**
 * @typedef {Object} GameDefinition
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {"quick"|"cards"|"teams"|"choice"} category
 * @property {string} icon
 * @property {string} accent
 * @property {boolean} premium
 * @property {number} minPlayers
 * @property {string[]} highlights
 */

/** @type {GameDefinition[]} */
export const GAMES = [
  {
    id: "face",
    name: "Angry-Daniyal",
    description: "Send mobilen rundt. Ett ansikt avslører taperen.",
    category: "quick",
    icon: "faces",
    accent: "#ef5b45",
    premium: false,
    minPlayers: 2,
    highlights: ["2-12 spillere", "Rask runde", "Poeng eller utfordringer"],
  },
  {
    id: "wheel",
    name: "Snurrehjulet",
    description: "La hjulet velge person, lag eller neste utfordring.",
    category: "choice",
    icon: "wheel",
    accent: "#6657d9",
    premium: false,
    minPlayers: 2,
    highlights: ["Egne valg", "Ubegrensede runder", "Fungerer uten alkohol"],
  },
  {
    id: "busroute",
    name: "Bussruta",
    description: "Finn veien opp pyramiden uten å trekke samme symbol.",
    category: "cards",
    icon: "cards",
    accent: "#168b68",
    premium: false,
    minPlayers: 2,
    highlights: ["Kortspill", "Poengmodus", "Rask omkamp"],
  },
  {
    id: "horse",
    name: "Hesteløp",
    description: "Velg hest, legg inn poeng og se løpet avgjøres.",
    category: "cards",
    icon: "horse",
    accent: "#e8a317",
    premium: false,
    minPlayers: 2,
    highlights: ["Animasjon", "Lydkontroll", "Automatisk løp"],
  },
  {
    id: "questions",
    name: "100 spørsmål",
    description: "Pek på den som passer best. 100 spørsmål uten gjentakelser.",
    category: "quick",
    icon: "questions",
    accent: "#151515",
    premium: false,
    minPlayers: 3,
    highlights: ["100 spørsmål", "Ingen oppsett", "Ingen gjentakelser"],
  },
  {
    id: "pubgolf",
    name: "Torbjørn sin pubgolf",
    description: "Bygg en bane med 3, 6 eller 9 hull og velg utfordringene selv.",
    category: "teams",
    icon: "golf",
    accent: "#168b68",
    premium: false,
    minPlayers: 2,
    highlights: ["3-9 hull", "20 utfordringer", "Bygg egen bane"],
  },
  {
    id: "world",
    name: "Haglands drikkelek",
    description: "Velg land og prøv kjente drikkeleker fra andre deler av verden.",
    category: "choice",
    icon: "globe",
    accent: "#151515",
    premium: false,
    minPlayers: 2,
    highlights: ["8 land", "17 spill", "Automatiske straffer"],
  },
];

export const PREMIUM_PACKS = [
  {
    id: "after-dark",
    name: "Etter midnatt",
    description: "25 drøyere spørsmål om dating, hemmeligheter og pinlige valg.",
    priceNok: 0,
    preview: ["Direkte dating-spørsmål", "Pinlige meldinger", "Hemmeligheter i gruppen"],
  },
  {
    id: "event-maker",
    name: "Lag egne kort",
    description: "Bygg og lagre deres egne utfordringer til neste kveld.",
    priceNok: 0,
    preview: ["Egne spørsmål", "Egne regler", "Delbar eventpakke"],
  },
];

export const getGame = (gameId) => GAMES.find((game) => game.id === gameId);
