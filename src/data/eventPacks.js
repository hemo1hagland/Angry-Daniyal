/**
 * @typedef {Object} PartyCard
 * @property {string} id Stable ID used by saves and future analytics.
 * @property {string} text
 * @property {string} category
 * @property {"mild"|"medium"|"wild"} [intensity]
 * @property {boolean} [premium]
 * @property {string} [alcoholFreeText]
 * @property {number} [minPlayers]
 * @property {number} [maxPlayers]
 * @property {"player"|"group"} [target]
 */

/**
 * @typedef {Object} EventPack
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} [logo]
 * @property {{primary?: string, secondary?: string, surface?: string}} theme
 * @property {string} introduction
 * @property {string[]} games
 * @property {PartyCard[]} cards
 * @property {{name: string, logo?: string}} [sponsor]
 * @property {string} [shareUrl]
 */

/** @type {EventPack[]} */
export const EVENT_PACKS = [
  {
    id: "default",
    name: "Vors",
    description: "Den originale partyspillpakken.",
    introduction: "Samle gjengen, velg et spill og kom i gang på under ett minutt.",
    theme: {
      primary: "#151515",
      secondary: "#ef5b45",
      surface: "#f5f3ef",
    },
    games: ["face", "questions", "wheel", "busroute", "horse", "pubgolf"],
    cards: [
      {
        id: "default-impression-001",
        text: "Gjør din beste kjendisimitasjon i 15 sekunder.",
        category: "challenge",
        intensity: "mild",
        target: "player",
        minPlayers: 2,
      },
      {
        id: "default-point-001",
        text: "Gi ut to slurker til en valgfri spiller.",
        alcoholFreeText: "Gi en valgfri spiller to bonuspoeng.",
        category: "points",
        intensity: "mild",
        target: "player",
        minPlayers: 2,
      },
      {
        id: "default-group-001",
        text: "Gruppen velger kveldens morsomste øyeblikk så langt.",
        category: "group",
        intensity: "mild",
        target: "group",
        minPlayers: 3,
      },
    ],
  },
  {
    id: "student",
    name: "Studentkveld",
    description: "En eksempelpakke for fadderuke eller studentforening.",
    introduction: "Bli kjent, skap lagfølelse og la alle delta på sin måte.",
    theme: {
      primary: "#153a36",
      secondary: "#f2b84b",
      surface: "#f3f5ef",
    },
    games: ["face", "questions", "wheel", "busroute"],
    cards: [
      {
        id: "student-intro-001",
        text: "Finn én ting alle i gruppen har til felles.",
        category: "icebreaker",
        intensity: "mild",
        target: "group",
        minPlayers: 3,
      },
    ],
  },
];

export function getActiveEventPack() {
  if (typeof window === "undefined") return EVENT_PACKS[0];
  const requestedId = new URLSearchParams(window.location.search).get("event");
  return EVENT_PACKS.find((pack) => pack.id === requestedId) || EVENT_PACKS[0];
}

export function resolveCardText(card, alcoholFree) {
  return alcoholFree && card.alcoholFreeText ? card.alcoholFreeText : card.text;
}
