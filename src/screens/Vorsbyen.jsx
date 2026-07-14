import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Beer from "lucide-react/dist/esm/icons/beer.js";
import BusFront from "lucide-react/dist/esm/icons/bus-front.js";
import CarFront from "lucide-react/dist/esm/icons/car-front.js";
import CircleHelp from "lucide-react/dist/esm/icons/circle-help.js";
import Citrus from "lucide-react/dist/esm/icons/citrus.js";
import CupSoda from "lucide-react/dist/esm/icons/cup-soda.js";
import Dice5 from "lucide-react/dist/esm/icons/dice-5.js";
import GlassWater from "lucide-react/dist/esm/icons/glass-water.js";
import Gift from "lucide-react/dist/esm/icons/gift.js";
import Flag from "lucide-react/dist/esm/icons/flag.js";
import House from "lucide-react/dist/esm/icons/house.js";
import Info from "lucide-react/dist/esm/icons/info.js";
import Martini from "lucide-react/dist/esm/icons/martini.js";
import LockKeyhole from "lucide-react/dist/esm/icons/lock-keyhole.js";
import Maximize2 from "lucide-react/dist/esm/icons/maximize-2.js";
import MonitorUp from "lucide-react/dist/esm/icons/monitor-up.js";
import Share2 from "lucide-react/dist/esm/icons/share-2.js";
import Shield from "lucide-react/dist/esm/icons/shield.js";
import Ticket from "lucide-react/dist/esm/icons/ticket.js";
import Wine from "lucide-react/dist/esm/icons/wine.js";
import { useState } from "react";
import Button from "../components/Button";
import {
  BOARD_SPACES,
  BONUS_CARDS,
  CHALLENGE_CARDS,
  MAX_CURRENCY,
  NEIGHBORHOODS,
  PIECES,
  PURCHASES_PER_TURN,
  STARTING_CURRENCY,
  WINNING_NEIGHBORHOODS,
} from "../data/vorsbyen";

const PIECE_ICONS = {
  beer: Beer,
  wine: Wine,
  spirit: GlassWater,
  gin: Martini,
  cider: Citrus,
  breezer: CupSoda,
};

const PROPERTY_SPACES = BOARD_SPACES.filter((space) => space.type === "property");
const PARTY_CARDS = [...CHALLENGE_CARDS, ...BONUS_CARDS];
const JAIL_INDEX = BOARD_SPACES.findIndex((space) => space.type === "jail");
const CORNER_INDEXES = new Set([0, 5, 10, 15]);
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const getBoardPosition = (index) => {
  if (index === 0) return { gridRow: "7 / 9", gridColumn: "7 / 9" };
  if (index <= 4) return { gridRow: 7 - index, gridColumn: "7 / 9" };
  if (index === 5) return { gridRow: "1 / 3", gridColumn: "7 / 9" };
  if (index <= 9) return { gridRow: "1 / 3", gridColumn: 12 - index };
  if (index === 10) return { gridRow: "1 / 3", gridColumn: "1 / 3" };
  if (index <= 14) return { gridRow: index - 8, gridColumn: "1 / 3" };
  if (index === 15) return { gridRow: "7 / 9", gridColumn: "1 / 3" };
  return { gridRow: "7 / 9", gridColumn: index - 13 };
};

const getColorBarClass = (index) => {
  if (index >= 1 && index <= 4) return "inset-y-0 left-0 w-1.5";
  if (index >= 6 && index <= 9) return "inset-x-0 bottom-0 h-1.5";
  if (index >= 11 && index <= 14) return "inset-y-0 right-0 w-1.5";
  return "inset-x-0 top-0 h-1.5";
};

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

function PieceIcon({ piece, size = 15 }) {
  const Icon = PIECE_ICONS[piece.id] || Beer;
  return <Icon size={size} strokeWidth={2.4} aria-hidden="true" />;
}

function DiceFace({ value, rolling }) {
  const pips = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  return (
    <span className={`grid h-12 w-12 grid-cols-3 grid-rows-3 gap-1 rounded-xl border-2 border-gray-900 bg-white p-1.5 shadow-md ${rolling ? "dice-rolling" : ""}`} aria-label={value ? `Terningen viser ${value}` : "Terning"}>
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} className={`m-auto h-1.5 w-1.5 rounded-full ${pips[value]?.includes(index) ? "bg-gray-900" : "bg-transparent"}`} />
      ))}
    </span>
  );
}

function SpaceIcon({ type, size = 14 }) {
  const icons = {
    start: Flag,
    bonus: Gift,
    jail: LockKeyhole,
    goJail: LockKeyhole,
    parking: CarFront,
    pause: BusFront,
    tax: Ticket,
  };
  const Icon = icons[type] || CircleHelp;
  return <Icon size={size} strokeWidth={2.2} aria-hidden="true" />;
}

function GameSheet({ eyebrow, title, text, children }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/45 p-3" role="presentation">
      <section className="sheet-enter max-h-[88%] w-full overflow-y-auto rounded-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center" role="dialog" aria-modal="true">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
        {text && <p className="mx-auto mt-3 max-w-xs text-sm font-medium leading-relaxed text-gray-500">{text}</p>}
        <div className="mt-6 space-y-2">{children}</div>
      </section>
    </div>
  );
}

export default function Vorsbyen({ players, onBack, onComplete }) {
  const [gamePlayers, setGamePlayers] = useState(() => {
    const names = players.length >= 2 ? players.slice(0, PIECES.length) : ["Spiller 1", "Spiller 2"];
    return names.map((name, index) => ({
      name,
      piece: PIECES[index],
      position: 0,
      currency: STARTING_CURRENCY,
      inJail: false,
      active: true,
    }));
  });
  const [ownership, setOwnership] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [dice, setDice] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [moving, setMoving] = useState(false);
  const [extraRoll, setExtraRoll] = useState(false);
  const [rollAgainPrompt, setRollAgainPrompt] = useState(false);
  const [modal, setModal] = useState({ type: "welcome" });
  const [winner, setWinner] = useState(null);
  const [tvMode, setTvMode] = useState(false);

  const currentPlayer = gamePlayers[currentIndex];

  const enterTvMode = async () => {
    setTvMode(true);
    setModal(null);
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      // The board still expands when the browser blocks native fullscreen.
    }
  };

  const exitTvMode = async () => {
    setTvMode(false);
    if (document.fullscreenElement) await document.exitFullscreen?.();
  };

  const shareBoard = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("game", "vorsbyen");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Vorsopol", text: "Åpne Vorsopol på skjermen", url: url.toString() });
      } else {
        await navigator.clipboard?.writeText(url.toString());
        setModal({ type: "screen", copied: true });
      }
    } catch (error) {
      if (error?.name !== "AbortError") setModal({ type: "screen" });
    }
  };

  const completedNeighborhoods = (playerIndex, nextOwnership = ownership) =>
    Object.keys(NEIGHBORHOODS).filter((group) => {
      const groupSpaces = PROPERTY_SPACES.filter((space) => space.group === group);
      return groupSpaces.every((space) => nextOwnership[space.id]?.owner === playerIndex);
    });

  const ownedProperties = (playerIndex, nextOwnership = ownership) =>
    PROPERTY_SPACES.filter((space) => nextOwnership[space.id]?.owner === playerIndex);

  const declareWinner = (player) => {
    setWinner(player);
    setModal({ type: "winner", player });
    onComplete?.("vorsbyen");
  };

  const advanceTurn = (nextPlayers = gamePlayers) => {
    const activePlayers = nextPlayers.filter((player) => player.active);
    if (activePlayers.length === 1) {
      declareWinner(activePlayers[0]);
      return;
    }

    if (extraRoll && nextPlayers[currentIndex].active && !nextPlayers[currentIndex].inJail) {
      setExtraRoll(false);
      setRollAgainPrompt(true);
      setDice(null);
      setMoving(false);
      setModal(null);
      return;
    }

    let nextIndex = currentIndex;
    for (let offset = 1; offset <= nextPlayers.length; offset += 1) {
      const candidate = (currentIndex + offset) % nextPlayers.length;
      if (nextPlayers[candidate].active) {
        nextIndex = candidate;
        break;
      }
    }
    if (nextIndex <= currentIndex) setRound((value) => value + 1);
    setCurrentIndex(nextIndex);
    setExtraRoll(false);
    setRollAgainPrompt(false);
    setDice(null);
    setMoving(false);
    setModal(null);
  };

  const sendToJail = () => {
    const nextPlayers = gamePlayers.map((player, index) =>
      index === currentIndex ? { ...player, position: JAIL_INDEX, inJail: true } : player,
    );
    setGamePlayers(nextPlayers);
    setModal({ type: "jailed", nextPlayers });
  };

  const removeProperty = (propertyId) => {
    const nextOwnership = { ...ownership };
    delete nextOwnership[propertyId];
    setOwnership(nextOwnership);
    advanceTurn();
  };

  const declineDrinkPenalty = () => {
    const properties = ownedProperties(currentIndex);
    if (properties.length) {
      setModal({ type: "lose-property", properties });
      return;
    }

    if (round === 1) {
      const nextPlayers = gamePlayers.map((player, index) =>
        index === currentIndex ? { ...player, position: JAIL_INDEX, inJail: true } : player,
      );
      setGamePlayers(nextPlayers);
      setModal({ type: "first-round-shield", nextPlayers });
      return;
    }

    const nextPlayers = gamePlayers.map((player, index) =>
      index === currentIndex ? { ...player, active: false } : player,
    );
    setGamePlayers(nextPlayers);
    setModal({ type: "eliminated", nextPlayers });
  };

  const buyProperty = (space) => {
    const nextPlayers = gamePlayers.map((player, index) =>
      index === currentIndex ? { ...player, currency: player.currency - space.cost } : player,
    );
    const nextOwnership = { ...ownership, [space.id]: { owner: currentIndex, houses: 0 } };
    setGamePlayers(nextPlayers);
    setOwnership(nextOwnership);

    if (completedNeighborhoods(currentIndex, nextOwnership).length >= WINNING_NEIGHBORHOODS) {
      declareWinner(nextPlayers[currentIndex]);
    } else {
      advanceTurn(nextPlayers);
    }
  };

  const upgradeProperty = (space) => {
    const property = ownership[space.id];
    const upgradeCost = property.houses + 1;
    const nextPlayers = gamePlayers.map((player, index) =>
      index === currentIndex ? { ...player, currency: player.currency - upgradeCost } : player,
    );
    setGamePlayers(nextPlayers);
    setOwnership({
      ...ownership,
      [space.id]: { ...property, houses: property.houses + 1 },
    });
    advanceTurn(nextPlayers);
  };

  const completeCard = (card) => {
    let nextPlayers = gamePlayers;
    if (card.effect === "start") {
      nextPlayers = gamePlayers.map((player, index) =>
        index === currentIndex
          ? { ...player, position: 0, currency: Math.min(MAX_CURRENCY, player.currency + 1) }
          : player,
      );
    } else if (card.effect === "currency") {
      nextPlayers = gamePlayers.map((player, index) =>
        index === currentIndex
          ? { ...player, currency: Math.min(MAX_CURRENCY, player.currency + 1) }
          : player,
      );
    }
    setGamePlayers(nextPlayers);
    advanceTurn(nextPlayers);
  };

  const resolveSpace = (space, nextPlayers) => {
    setMoving(false);

    if (space.type === "property") {
      const property = ownership[space.id];
      if (!property) {
        setModal({ type: "buy", space, canBuy: nextPlayers[currentIndex].currency >= space.cost });
      } else if (property.owner === currentIndex) {
        const upgradeCost = property.houses + 1;
        setModal({
          type: "upgrade",
          space,
          property,
          upgradeCost,
          canUpgrade: property.houses < 2 && nextPlayers[currentIndex].currency >= upgradeCost,
        });
      } else {
        setModal({
          type: "rent",
          space,
          owner: nextPlayers[property.owner],
          rent: Math.min(3, 1 + property.houses),
        });
      }
      return;
    }

    if (space.type === "bonus") {
      setModal({ type: "card", kind: "Bonusfelt", card: randomItem(PARTY_CARDS) });
    } else if (space.type === "jail") {
      const jailedPlayers = nextPlayers.map((player, index) =>
        index === currentIndex ? { ...player, inJail: true } : player,
      );
      setGamePlayers(jailedPlayers);
      setModal({ type: "jailed", nextPlayers: jailedPlayers });
    } else if (space.type === "goJail") {
      const jailedPlayers = nextPlayers.map((player, index) =>
        index === currentIndex ? { ...player, position: JAIL_INDEX, inJail: true } : player,
      );
      setGamePlayers(jailedPlayers);
      setModal({ type: "jailed", nextPlayers: jailedPlayers });
    } else if (space.type === "parking") {
      setModal({ type: "message", title: "Gratis parkering", text: "Ingen kostnad og ingen straff. Turen går videre.", nextPlayers });
    } else if (space.type === "tax") {
      setModal({ type: "tax", space });
    } else if (space.type === "pause") {
      setModal({ type: "message", title: space.name, text: "Ingen kostnad og ingen straff. Turen går videre.", nextPlayers });
    } else {
      setModal({ type: "message", title: "Start", text: "Du får 1 slurkmynt, opptil maks 5.", nextPlayers });
    }
  };

  const rollDice = async () => {
    if (moving || winner) return;
    if (currentPlayer.inJail) {
      setModal({ type: "jail-exit" });
      return;
    }

    const firstDie = Math.floor(Math.random() * 6) + 1;
    const secondDie = Math.floor(Math.random() * 6) + 1;
    const result = firstDie + secondDie;
    setDice([firstDie, secondDie]);
    setExtraRoll(firstDie === secondDie);
    setRollAgainPrompt(false);
    setMoving(true);
    setRolling(true);
    await wait(560);
    setRolling(false);

    let nextPlayers = gamePlayers;
    let position = currentPlayer.position;
    for (let step = 0; step < result; step += 1) {
      position = (position + 1) % BOARD_SPACES.length;
      nextPlayers = nextPlayers.map((player, index) =>
        index === currentIndex
          ? {
              ...player,
              position,
              currency: position === 0 ? Math.min(MAX_CURRENCY, player.currency + 1) : player.currency,
            }
          : player,
      );
      setGamePlayers(nextPlayers);
      await wait(120);
    }

    resolveSpace(BOARD_SPACES[position], nextPlayers);
  };

  const openPropertyInfo = (space) => {
    const property = ownership[space.id];
    setModal({ type: "property-info", space, property, owner: property ? gamePlayers[property.owner] : null });
  };

  const renderModal = () => {
    if (!modal) return null;

    if (modal.type === "welcome") {
      return (
        <GameSheet eyebrow="Før dere starter" title={`${STARTING_CURRENCY} slurkpoeng hver`} text={`Bruk poengene til utesteder og hus. Dere kan gjøre maks ${PURCHASES_PER_TURN} kjøp eller oppgradering per tur. To komplette nabolag vinner.`}>
          <Button onClick={() => setModal(null)}>Start spillet</Button>
          <Button variant="secondary" onClick={() => setModal({ type: "rules" })}>Åpne regelboken</Button>
        </GameSheet>
      );
    }

    if (modal.type === "rules") {
      return (
        <GameSheet eyebrow="Vorsopol" title="Regelbok">
          <div className="space-y-5 text-left text-sm font-medium leading-relaxed text-gray-600">
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">1. Målet</h3>
              <p className="mt-1">Den første som eier {WINNING_NEIGHBORHOODS} komplette fargenabolag vinner.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">2. Oppsett</h3>
              <p className="mt-1">Alle velger en drikkebrikke, starter på Start og får {STARTING_CURRENCY} slurkpoeng. Slurkpoeng er spillvalutaen som brukes til kjøp.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">3. En tur</h3>
              <p className="mt-1">Trill to terninger, følg brikken felt for felt og gjør det feltet sier. To like terninger gir en ny tur. Du kan gjøre maks {PURCHASES_PER_TURN} kjøp eller oppgradering per tur.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">4. Utesteder og hus</h3>
              <p className="mt-1">Ledige steder kan kjøpes. Eieren vises med spillerens brikkefarge. Lander du på ditt eget sted, kan du bygge opptil to fargekodede hus. Leien er 1, 2 eller maks 3 slurker.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">5. Start og banken</h3>
              <p className="mt-1">Hver gang brikken passerer eller lander på Start får du 1 slurkpoeng. Ingen kan ha mer enn {MAX_CURRENCY}.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">6. Bonusfelt</h3>
              <p className="mt-1">Brettet har to Bonusfelt. Alle utfordringer trekkes kun der. Fullfør kortet, eller stå over og gå til Fyllarresten.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">7. Hjørnefeltene</h3>
              <p className="mt-1">Start gir poeng. Gratis parkering er en trygg pause. Gå til Fyllarresten flytter brikken direkte til fengselshjørnet.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">8. Fyllarresten og straff</h3>
              <p className="mt-1">Ta en avtalt shot for å gå ut, eller stå over en tur. Står du over en drikkestraff, mister du ett utested. Ingen ryker i første runde.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">Eierfarger</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {gamePlayers.map((player) => (
                  <span key={player.name} className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: player.piece.color }} />{player.name}
                  </span>
                ))}
              </div>
            </section>
          </div>
          <Button onClick={() => setModal(null)}>Skjønner</Button>
        </GameSheet>
      );
    }

    if (modal.type === "screen") {
      return (
        <GameSheet eyebrow="TV-visning" title="Del til skjerm" text="Start fullskjerm og bruk Skjermspeiling/AirPlay på iPhone eller Cast denne fanen fra Chrome. Da ser alle det samme levende brettet.">
          <Button onClick={tvMode ? exitTvMode : enterTvMode}>{tvMode ? "Avslutt fullskjerm" : "Start fullskjerm"}</Button>
          <Button variant="secondary" onClick={shareBoard}>
            <span className="flex items-center justify-center gap-2"><Share2 size={18} />{modal.copied ? "Lenke kopiert" : "Del spill-lenke"}</span>
          </Button>
          <Button variant="ghost" onClick={() => setModal(null)}>Lukk</Button>
        </GameSheet>
      );
    }

    if (modal.type === "buy") {
      return (
        <GameSheet eyebrow={NEIGHBORHOODS[modal.space.group].name} title={modal.space.name} text={`Kjøp stedet for ${modal.space.cost} slurkpoeng. Dette er turens ene kjøp. Grunnleie er 1 slurk.`}>
          <Button disabled={!modal.canBuy} onClick={() => buyProperty(modal.space)}>Kjøp for {modal.space.cost}</Button>
          <Button variant="secondary" onClick={() => advanceTurn()}>Ikke kjøp</Button>
        </GameSheet>
      );
    }

    if (modal.type === "upgrade") {
      const maxed = modal.property.houses >= 2;
      return (
        <GameSheet eyebrow="Ditt sted" title={modal.space.name} text={maxed ? "Stedet er fullt oppgradert. Leien er 3 slurker." : `Neste hus koster ${modal.upgradeCost} slurkpoeng og bruker turens ene kjøp.`}>
          {!maxed && <Button disabled={!modal.canUpgrade} onClick={() => upgradeProperty(modal.space)}>Bygg hus for {modal.upgradeCost}</Button>}
          <Button variant="secondary" onClick={() => advanceTurn()}>Avslutt turen</Button>
        </GameSheet>
      );
    }

    if (modal.type === "rent") {
      return (
        <GameSheet eyebrow="Leie" title={`${modal.rent} slurker`} text={`${modal.space.name} eies av ${modal.owner.name}.`}>
          <Button onClick={() => advanceTurn()}>Betalt</Button>
          <Button variant="secondary" onClick={declineDrinkPenalty}>Stå over</Button>
        </GameSheet>
      );
    }

    if (modal.type === "tax") {
      return (
        <GameSheet eyebrow="Fast felt" title={modal.space.name} text={`Ta ${modal.space.penalty} slurk${modal.space.penalty === 1 ? "" : "er"}, eller stå over og mist ett utested.`}>
          <Button onClick={() => advanceTurn()}>Utført</Button>
          <Button variant="secondary" onClick={declineDrinkPenalty}>Stå over</Button>
        </GameSheet>
      );
    }

    if (modal.type === "card") {
      return (
        <GameSheet eyebrow={modal.kind} title={modal.card.title} text={modal.card.text}>
          <Button onClick={() => completeCard(modal.card)}>Fullført</Button>
          <Button variant="secondary" onClick={sendToJail}>Stå over: Fyllarresten</Button>
        </GameSheet>
      );
    }

    if (modal.type === "jail-exit") {
      return (
        <GameSheet eyebrow="Fyllarresten" title="Kom deg ut" text="Ta en avtalt shot for å gå ut. Du kan alltid stå over turen.">
          <Button onClick={() => {
            const nextPlayers = gamePlayers.map((player, index) => index === currentIndex ? { ...player, inJail: false } : player);
            setGamePlayers(nextPlayers);
            setModal(null);
          }}>Ta en shot og gå ut</Button>
          <Button variant="secondary" onClick={() => advanceTurn()}>Stå over turen</Button>
        </GameSheet>
      );
    }

    if (modal.type === "lose-property") {
      return (
        <GameSheet eyebrow="Står over straffen" title="Mister ett område" text="Velg stedet som skal tilbake til banken.">
          {modal.properties.map((space) => (
            <Button key={space.id} variant="secondary" onClick={() => removeProperty(space.id)}>{space.name}</Button>
          ))}
        </GameSheet>
      );
    }

    if (modal.type === "property-info") {
      const neighborhood = NEIGHBORHOODS[modal.space.group];
      const houses = modal.property?.houses || 0;
      return (
        <GameSheet eyebrow={neighborhood.name} title={modal.space.name} text={modal.owner ? `${modal.owner.name} eier stedet. Leie: ${Math.min(3, 1 + houses)} slurker.` : `Ledig. Pris: ${modal.space.cost} slurkmynter.`}>
          <div className="flex justify-center gap-2 text-gray-500">
            {[0, 1].map((house) => <House key={house} size={22} fill={house < houses ? neighborhood.color : "transparent"} color={house < houses ? neighborhood.color : "#e5e7eb"} />)}
          </div>
          <Button onClick={() => setModal(null)}>Lukk</Button>
        </GameSheet>
      );
    }

    if (modal.type === "winner") {
      return (
        <GameSheet eyebrow="To komplette nabolag" title={`${modal.player.name} vinner!`} text={`${modal.player.piece.name}-brikken har tatt over Vorsopol.`}>
          <Button onClick={onBack}>Tilbake til meny</Button>
        </GameSheet>
      );
    }

    const messages = {
      jailed: { eyebrow: "Fyllarresten", title: "Du er arrestert", text: "På neste tur kan du ta en avtalt shot for å gå ut, eller stå over turen." },
      "first-round-shield": { eyebrow: "Førsterundevern", title: "Du er fortsatt med", text: "Ingen ryker i første runde. Du sendes til Fyllarresten i stedet." },
      eliminated: { eyebrow: "Ingen områder igjen", title: "Ute av spillet", text: "Du hadde ingen områder å levere tilbake." },
      message: { eyebrow: "Felt", title: modal.title, text: modal.text },
    };
    const message = messages[modal.type];
    if (!message) return null;
    return (
      <GameSheet eyebrow={message.eyebrow} title={message.title} text={message.text}>
        <Button onClick={() => advanceTurn(modal.nextPlayers || gamePlayers)}>Neste spiller</Button>
      </GameSheet>
    );
  };

  return (
    <main className={`relative flex h-full min-h-0 flex-col bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-gray-900 ${tvMode ? "fixed inset-0 z-[70] h-screen w-screen overflow-hidden" : "overflow-y-auto overscroll-contain"}`} style={{ WebkitOverflowScrolling: "touch" }}>
      <header className="flex h-11 shrink-0 items-center justify-between">
        <button onClick={onBack} className="flex h-10 items-center gap-1 rounded-full bg-gray-100 px-3 text-sm font-medium text-gray-500" aria-label="Tilbake til spillmenyen">
          <ArrowLeft size={16} aria-hidden="true" /> Meny
        </button>
        <div className="text-center">
          <h1 className="font-display text-lg font-bold">Vorsopol</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Runde {round}</p>
        </div>
        <button onClick={() => setModal({ type: "rules" })} className="icon-button h-10 w-10 bg-gray-100 text-gray-500" aria-label="Vis spilleregler">
          <Info size={17} aria-hidden="true" />
        </button>
      </header>

      <section className="mt-2 flex shrink-0 gap-2 overflow-x-auto pb-2" aria-label="Spillere">
        {gamePlayers.map((player, index) => (
          <div key={player.name} className={`flex min-w-[128px] items-center gap-2 rounded-xl border-2 px-2.5 py-2 ${index === currentIndex ? "bg-gray-900 text-white" : "bg-white text-gray-600"} ${player.active ? "" : "opacity-35"}`} style={{ borderColor: index === currentIndex ? player.piece.color : `${player.piece.color}80` }}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15" style={{ color: index === currentIndex ? "#fff" : player.piece.color }}>
              <PieceIcon piece={player.piece} size={17} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-xs font-bold">{player.name}</span>
              <span className={`block text-[10px] font-semibold ${index === currentIndex ? "text-gray-300" : "text-gray-400"}`}>{player.currency}/{MAX_CURRENCY} poeng · {ownedProperties(index).length} steder</span>
            </span>
          </div>
        ))}
      </section>

      <section className={`relative mx-auto mt-1 grid aspect-square w-full shrink-0 grid-cols-8 grid-rows-8 overflow-hidden rounded-xl border-2 border-gray-900 bg-gray-50 ${tvMode ? "max-w-[min(72vh,760px)]" : "max-w-[390px]"}`} aria-label="Spillebrett">
        {BOARD_SPACES.map((space, index) => {
          const property = space.type === "property" ? ownership[space.id] : null;
          const neighborhood = space.group ? NEIGHBORHOODS[space.group] : null;
          const owner = property ? gamePlayers[property.owner] : null;
          const isCorner = CORNER_INDEXES.has(index);
          const piecesHere = gamePlayers.map((player, playerIndex) => ({ player, playerIndex })).filter(({ player }) => player.active && player.position === index);
          return (
            <button key={space.id} onClick={() => space.type === "property" && openPropertyInfo(space)} disabled={space.type !== "property"} style={{ ...getBoardPosition(index), backgroundColor: owner ? `${owner.piece.color}12` : "#fff", boxShadow: owner ? `inset 0 0 0 2px ${owner.piece.color}` : undefined }} className={`relative min-h-0 min-w-0 overflow-hidden border border-gray-200 px-1 pb-3 text-center disabled:opacity-100 ${isCorner ? "pt-3" : "pt-1.5"}`} aria-label={space.type === "property" ? `Info om ${space.name}` : space.name}>
              {neighborhood && <span className={`absolute ${getColorBarClass(index)}`} style={{ background: neighborhood.color }} />}
              {space.type !== "property" && <span className={`mx-auto mb-1 grid place-items-center text-gray-700 ${isCorner ? "h-8 w-8" : "h-5 w-5"}`}><SpaceIcon type={space.type} size={isCorner ? 22 : 14} /></span>}
              <span className={`block break-words font-display font-bold leading-[1.05] text-gray-800 ${isCorner ? "text-[9px]" : space.type === "property" ? "text-[8px]" : "text-[7px]"}`}>{space.shortName || space.name}</span>
              {space.type === "property" && !property && <span className="mt-0.5 block text-[7px] font-black text-gray-400">{space.cost} poeng</span>}
              {owner && <span className="absolute bottom-0.5 left-0.5 max-w-[70%] overflow-hidden whitespace-nowrap rounded px-1 py-0.5 text-[5px] font-black text-white" style={{ background: owner.piece.color }}>{owner.name}</span>}
              {owner && (
                <span className="absolute bottom-0.5 right-0.5 flex gap-px" aria-label={`${property.houses} av 2 hus, ${NEIGHBORHOODS[space.group].name}`}>
                  {[0, 1].map((houseIndex) => <House key={houseIndex} size={9} fill={houseIndex < property.houses ? neighborhood.color : "transparent"} color={houseIndex < property.houses ? neighborhood.color : `${neighborhood.color}80`} strokeWidth={2.5} />)}
                </span>
              )}
              <span className="absolute right-0.5 top-1.5 flex max-w-[46%] flex-wrap justify-end gap-0.5">
                {piecesHere.map(({ player, playerIndex }) => (
                  <span key={player.name} className={`grid h-[18px] w-[18px] place-items-center rounded-full text-white shadow-sm ring-1 ring-white ${moving && playerIndex === currentIndex ? "piece-hopping" : ""}`} style={{ background: player.piece.color }} title={`${player.name}: ${player.piece.name}`}>
                    <PieceIcon piece={PIECES[playerIndex]} size={10} />
                  </span>
                ))}
              </span>
            </button>
          );
        })}

        <div className="col-[3/7] row-[3/7] flex min-h-0 flex-col items-center justify-center border border-gray-200 bg-white p-3 text-center">
          {dice ? (
            <span className="flex gap-2">
              <DiceFace value={dice[0]} rolling={rolling} />
              <DiceFace value={dice[1]} rolling={rolling} />
            </span>
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100" style={{ color: currentPlayer.piece.color }}>
              <PieceIcon piece={currentPlayer.piece} size={21} />
            </span>
          )}
          <p className="mt-2 max-w-full truncate font-display text-sm font-bold">{currentPlayer.name}</p>
          <p className="text-[10px] font-semibold text-gray-400">{currentPlayer.piece.name} · {currentPlayer.currency} slurkmynter</p>
          {rollAgainPrompt && <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-600">Dobbelt! Trill igjen</p>}
          {currentPlayer.inJail && <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-500"><Shield size={11} /> Fyllarresten</span>}
          <button onClick={rollDice} disabled={moving || !currentPlayer.active || Boolean(winner)} className="mt-3 flex min-h-10 w-full max-w-36 items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 font-display text-sm font-bold text-white transition active:scale-95 disabled:opacity-40">
            <Dice5 size={17} aria-hidden="true" /> {rolling ? "Triller..." : moving ? `Flytter ${dice[0] + dice[1]} felt` : currentPlayer.inJail ? "Kom deg ut" : rollAgainPrompt ? "Trill på nytt" : "Trill terningene"}
          </button>
        </div>
      </section>

      <footer className="mt-3 flex min-h-0 flex-1 items-center justify-between gap-2 text-[11px] font-semibold text-gray-400">
        <span className="flex items-center gap-1"><Ticket size={14} /> {currentPlayer.currency}/{MAX_CURRENCY} poeng</span>
        <span className="flex items-center gap-1"><House size={14} /> {PURCHASES_PER_TURN} kjøp/tur</span>
        <button onClick={() => setModal({ type: "screen" })} className="flex min-h-10 items-center gap-1.5 rounded-xl bg-gray-900 px-3 font-display text-xs font-bold text-white" aria-label="Del Vorsopol til skjerm">
          {tvMode ? <Maximize2 size={15} /> : <MonitorUp size={15} />} Del til skjerm
        </button>
      </footer>

      {renderModal()}
    </main>
  );
}
