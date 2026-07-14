import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
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
import { useEffect, useState } from "react";
import Button from "../components/Button";
import {
  BOARD_SPACES,
  BONUS_CARDS,
  CASH_PER_LEVEL_ML,
  CHALLENGE_CARDS,
  MAX_CURRENCY,
  MAX_BUILDINGS,
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
const CORNER_INDEXES = new Set([0, 10, 20, 30]);
const START_REWARD = 6;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const formatCash = (levels) => `${levels * CASH_PER_LEVEL_ML} ml`;

const getBoardPosition = (index) => {
  if (index === 0) return { gridRow: "1 / 3", gridColumn: "1 / 3" };
  if (index <= 9) return { gridRow: "1 / 3", gridColumn: index + 2 };
  if (index === 10) return { gridRow: "1 / 3", gridColumn: "12 / 14" };
  if (index <= 19) return { gridRow: index - 8, gridColumn: "12 / 14" };
  if (index === 20) return { gridRow: "12 / 14", gridColumn: "12 / 14" };
  if (index <= 29) return { gridRow: "12 / 14", gridColumn: 32 - index };
  if (index === 30) return { gridRow: "12 / 14", gridColumn: "1 / 3" };
  return { gridRow: 42 - index, gridColumn: "1 / 3" };
};

const getColorBarClass = (index) => {
  if (index >= 1 && index <= 9) return "inset-x-0 bottom-0 h-1";
  if (index >= 11 && index <= 19) return "inset-y-0 left-0 w-1";
  if (index >= 21 && index <= 29) return "inset-x-0 top-0 h-1";
  return "inset-y-0 right-0 w-1";
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
    <span className={`grid h-12 w-12 grid-cols-3 grid-rows-3 gap-1 rounded-xl border-2 border-gray-900 bg-white p-1.5 shadow-md md:h-16 md:w-16 md:p-2 ${rolling ? "dice-rolling" : ""}`} aria-label={value ? `Terningen viser ${value}` : "Terning"}>
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} className={`m-auto h-1.5 w-1.5 rounded-full ${pips[value]?.includes(index) ? "bg-gray-900" : "bg-transparent"}`} />
      ))}
    </span>
  );
}

function BeerGlass({ value, size = "small", animate = false }) {
  const level = Math.max(0, Math.min(100, (value / MAX_CURRENCY) * 100));
  const dimensions = size === "large" ? "h-36 w-24" : size === "responsive" ? "h-16 w-11 md:h-36 md:w-24" : size === "medium" ? "h-16 w-11" : "h-9 w-6";

  return (
    <span className={`beer-glass ${dimensions}`} role="img" aria-label={`Cashglass med ${formatCash(value)}`}>
      <span className={`beer-liquid ${animate ? "beer-fill-intro" : ""}`} style={{ "--beer-level": `${level}%`, height: `${level}%` }}>
        <span className="beer-foam" />
      </span>
      <span className="beer-measurements" aria-hidden="true" />
    </span>
  );
}

function BuildingMeter({ count, color, large = false }) {
  return (
    <span className={`flex items-end justify-center ${large ? "gap-2 py-2" : "gap-px"}`} aria-label={`${Math.min(count, 4)} hus${count >= MAX_BUILDINGS ? " og hotell" : ""}`}>
      {[0, 1, 2, 3].map((houseIndex) => (
        <House
          key={houseIndex}
          size={large ? 22 : 7}
          fill={houseIndex < Math.min(count, 4) ? color : "transparent"}
          color={houseIndex < Math.min(count, 4) ? color : `${color}70`}
          strokeWidth={2.6}
        />
      ))}
      <span className={`${large ? "h-6 w-5 text-[9px]" : "h-2 w-1.5 text-[4px]"} grid place-items-center rounded-[2px] border font-black`} style={{ borderColor: count >= MAX_BUILDINGS ? color : `${color}70`, background: count >= MAX_BUILDINGS ? color : "transparent", color: count >= MAX_BUILDINGS ? "#fff" : `${color}90` }}>H</span>
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
    <div className="absolute inset-0 z-50 flex items-end bg-black/45 p-3 md:items-center md:justify-center" role="presentation">
      <section className="sheet-enter max-h-[88%] w-full overflow-y-auto rounded-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center md:max-w-md md:p-7" role="dialog" aria-modal="true">
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
    const names = players.length >= 2 ? players.slice(0, 4) : ["Spiller 1", "Spiller 2"];
    return names.map((name, index) => ({
      name,
      piece: PIECES[index],
      position: 0,
      currency: 0,
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
  const [modal, setModal] = useState({ type: "beer-start" });
  const [winner, setWinner] = useState(null);
  const [tvMode, setTvMode] = useState(false);
  const [cashActivated, setCashActivated] = useState(false);
  const [lastTransaction, setLastTransaction] = useState("5 slurker låser opp 500 ml cash");

  const currentPlayer = gamePlayers[currentIndex];

  const activateCash = () => {
    setGamePlayers((currentPlayers) => currentPlayers.map((player) => ({ ...player, currency: STARTING_CURRENCY })));
    setCashActivated(true);
    setLastTransaction("Alle fikk 500 ml i cashglasset");
    setModal(null);
  };

  useEffect(() => () => document.body.classList.remove("vorsopol-tv-active"), []);

  const enterTvMode = async () => {
    document.body.classList.add("vorsopol-tv-active");
    setTvMode(true);
    setModal(null);
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      // The board still expands when the browser blocks native fullscreen.
    }
  };

  const exitTvMode = async () => {
    document.body.classList.remove("vorsopol-tv-active");
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
      if (NEIGHBORHOODS[group].countsForWin === false) return false;
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
    setLastTransaction(`${currentPlayer.name} betalte ${formatCash(space.cost)} til banken for ${space.shortName || space.name}`);

    if (completedNeighborhoods(currentIndex, nextOwnership).length >= WINNING_NEIGHBORHOODS) {
      declareWinner(nextPlayers[currentIndex]);
    } else {
      finishPayment(nextPlayers);
    }
  };

  const upgradeProperty = (space) => {
    const property = ownership[space.id];
    const upgradeCost = Math.min(3, 1 + Math.floor(property.houses / 2));
    const nextPlayers = gamePlayers.map((player, index) =>
      index === currentIndex ? { ...player, currency: player.currency - upgradeCost } : player,
    );
    setGamePlayers(nextPlayers);
    setOwnership({
      ...ownership,
      [space.id]: { ...property, houses: property.houses + 1 },
    });
    setLastTransaction(`${currentPlayer.name} betalte ${formatCash(upgradeCost)} til banken og bygde på ${space.shortName || space.name}`);
    finishPayment(nextPlayers);
  };

  const finishPayment = (nextPlayers) => {
    setGamePlayers(nextPlayers);
    if (nextPlayers[currentIndex].currency === 0) {
      setModal({ type: "refill", nextPlayers });
      return;
    }
    advanceTurn(nextPlayers);
  };

  const refillCash = () => {
    const sourcePlayers = modal?.nextPlayers || gamePlayers;
    const nextPlayers = sourcePlayers.map((player, index) =>
      index === currentIndex ? { ...player, currency: STARTING_CURRENCY } : player,
    );
    setGamePlayers(nextPlayers);
    setLastTransaction(`${currentPlayer.name} tok 5 slurker og fylte 500 ml cash`);
    advanceTurn(nextPlayers);
  };

  const payFromGlass = (amount) => {
    const nextPlayers = gamePlayers.map((player, index) =>
      index === currentIndex ? { ...player, currency: Math.max(0, player.currency - amount) } : player,
    );
    setLastTransaction(`${currentPlayer.name} betalte ${formatCash(amount)} til banken`);
    finishPayment(nextPlayers);
  };

  const payRent = (amount, ownerIndex) => {
    const nextPlayers = gamePlayers.map((player, index) => {
      if (index === currentIndex) return { ...player, currency: Math.max(0, player.currency - amount) };
      if (index === ownerIndex) return { ...player, currency: player.currency + amount };
      return player;
    });
    setLastTransaction(`${currentPlayer.name} betalte ${formatCash(amount)} i leie til ${gamePlayers[ownerIndex].name}`);
    finishPayment(nextPlayers);
  };

  const completeCard = (card) => {
    let nextPlayers = gamePlayers;
    if (card.effect === "start") {
      nextPlayers = gamePlayers.map((player, index) =>
        index === currentIndex
          ? { ...player, position: 0, currency: player.currency + START_REWARD }
          : player,
      );
    } else if (card.effect === "currency") {
      nextPlayers = gamePlayers.map((player, index) =>
        index === currentIndex
          ? { ...player, currency: player.currency + (card.currencyAmount || 1) }
          : player,
      );
    } else if (card.effect === "refill") {
      nextPlayers = gamePlayers.map((player, index) =>
        index === currentIndex
          ? { ...player, currency: Math.max(player.currency, MAX_CURRENCY) }
          : player,
      );
    }
    setGamePlayers(nextPlayers);
    if (["start", "currency", "refill"].includes(card.effect)) {
      const gain = nextPlayers[currentIndex].currency - gamePlayers[currentIndex].currency;
      setLastTransaction(`${currentPlayer.name} fikk ${formatCash(gain)} fra bonuskortet`);
    }
    advanceTurn(nextPlayers);
  };

  const resolveSpace = (space, nextPlayers) => {
    setMoving(false);

    if (space.type === "property") {
      const property = ownership[space.id];
      if (!property) {
        setModal({ type: "buy", space, canBuy: nextPlayers[currentIndex].currency >= space.cost });
      } else if (property.owner === currentIndex) {
        if (space.buildable === false) {
          setModal({ type: "message", title: space.name, text: "Dette stedet er ditt. Ingen betaling denne gangen.", nextPlayers });
        } else {
          const upgradeCost = Math.min(3, 1 + Math.floor(property.houses / 2));
          setModal({
            type: "upgrade",
            space,
            property,
            upgradeCost,
            canUpgrade: property.houses < MAX_BUILDINGS && nextPlayers[currentIndex].currency >= upgradeCost,
          });
        }
      } else {
        const rent = space.buildable === false ? space.rent : Math.min(5, 1 + property.houses);
        setModal({
          type: "rent",
          space,
          owner: nextPlayers[property.owner],
          ownerIndex: property.owner,
          rent,
          canPay: nextPlayers[currentIndex].currency >= rent,
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
      setModal({ type: "message", title: "Start", text: "Få 300 ml fra banken. Opptjent cash kan gå over 500 ml.", nextPlayers });
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
      if (position === 0) setLastTransaction(`${currentPlayer.name} passerte Start og fikk 300 ml fra banken`);
      nextPlayers = nextPlayers.map((player, index) =>
        index === currentIndex
          ? {
              ...player,
              position,
              currency: position === 0 ? player.currency + START_REWARD : player.currency,
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

    if (modal.type === "beer-start") {
      return (
        <GameSheet eyebrow="Inngangsbilletten" title="5 slurker gir 500 ml" text="Alle åpner en øl og tar 5 slurker. Da aktiveres et fullt cashglass på 500 ml som brukes til kjøp, hus, leie og avgifter.">
          <div className="flex justify-center py-2">
            <BeerGlass value={STARTING_CURRENCY} size="large" animate />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-600">5 slurker = {formatCash(STARTING_CURRENCY)} cash</p>
          <Button onClick={activateCash}>5 slurker tatt: få 500 ml</Button>
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
              <p className="mt-1">Spillet er for 2-4 personer. Alle åpner én øl og tar 5 slurker. Deretter får hver spiller {formatCash(STARTING_CURRENCY)} i sitt digitale cashglass.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">3. En tur</h3>
              <p className="mt-1">Trill to terninger og flytt alltid med klokken: mot høyre fra Start. Følg brikken felt for felt og gjør det feltet sier. To like terninger gir en ny tur. Maks {PURCHASES_PER_TURN} kjøp eller oppgradering per tur.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">4. Utesteder og hus</h3>
              <p className="mt-1">Ledige steder betales til banken. Leie flyttes direkte fra betaleren til eieren med hele beløpet. Opptjent cash kan gå over 500 ml. På egne fargesteder kan du bygge fire hus og deretter hotell.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">5. Start og banken</h3>
              <p className="mt-1">Hver gang brikken passerer eller lander på Start får du 300 ml fra banken. Cash kan gå over 500 ml, så leie og belønninger går aldri tapt.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">6. Bonusfelt</h3>
              <p className="mt-1">Brettet har to Bonusfelt. Noen kort gir ml-cash, men da må slurkene på kortet tas før beløpet fylles på. Står du over, går du til Fyllarresten.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">7. Hjørnefeltene</h3>
              <p className="mt-1">Start fyller glasset. Gratis parkering er en trygg pause. Gå til Fyllarresten flytter brikken direkte til fengselshjørnet.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">8. Fyllarresten og straff</h3>
              <p className="mt-1">Ta en avtalt shot for å gå ut, eller stå over en tur. Står du over en drikkestraff, mister du ett utested. Ingen ryker i første runde.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">9. Tomt cashglass</h3>
              <p className="mt-1">Når cashglasset når 0 ml stopper turen. Ta 5 slurker for å fylle det tilbake til 500 ml før spillet fortsetter.</p>
            </section>
            <section>
              <h3 className="font-display text-base font-bold text-gray-900">10. Slik flyter cashen</h3>
              <p className="mt-1">Kjøp, bygging og avgifter går til banken. Leie går direkte til eieren. Start, bonuskort og påfyll kommer fra banken. Siste transaksjon vises midt på brettet.</p>
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
          <Button onClick={() => setModal(cashActivated ? null : { type: "beer-start" })}>{cashActivated ? "Skjønner" : "Til 5-slurkersstarten"}</Button>
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
        <GameSheet eyebrow={NEIGHBORHOODS[modal.space.group].name} title={modal.space.name} text={`Kjøp stedet for ${formatCash(modal.space.cost)} fra cashglasset. Dette er turens ene kjøp.`}>
          <div className="flex items-center justify-center gap-3 py-1"><BeerGlass value={currentPlayer.currency} size="medium" /><span className="font-display text-lg font-bold text-gray-800">{formatCash(currentPlayer.currency)}</span></div>
          <Button disabled={!modal.canBuy} onClick={() => buyProperty(modal.space)}>Betal {formatCash(modal.space.cost)} og kjøp</Button>
          <Button variant="secondary" onClick={() => advanceTurn()}>Ikke kjøp</Button>
        </GameSheet>
      );
    }

    if (modal.type === "upgrade") {
      const maxed = modal.property.houses >= MAX_BUILDINGS;
      const nextBuilding = modal.property.houses === 4 ? "hotell" : "hus";
      return (
        <GameSheet eyebrow="Ditt sted" title={modal.space.name} text={maxed ? "Stedet har hotell og er fullt oppgradert." : `Neste ${nextBuilding} koster ${formatCash(modal.upgradeCost)} fra cashglasset.`}>
          {!maxed && <Button disabled={!modal.canUpgrade} onClick={() => upgradeProperty(modal.space)}>Betal {formatCash(modal.upgradeCost)} og bygg {nextBuilding}</Button>}
          <Button variant="secondary" onClick={() => advanceTurn()}>Avslutt turen</Button>
        </GameSheet>
      );
    }

    if (modal.type === "rent") {
      return (
        <GameSheet eyebrow="Leie" title={`${formatCash(modal.rent)} til ${modal.owner.name}`} text="Hele beløpet flyttes fra betaleren til eieren. Eierens cash kan gå over 500 ml.">
          <Button disabled={!modal.canPay} onClick={() => payRent(modal.rent, modal.ownerIndex)}>Overfør leien</Button>
          <Button variant="secondary" onClick={declineDrinkPenalty}>Stå over</Button>
        </GameSheet>
      );
    }

    if (modal.type === "tax") {
      return (
        <GameSheet eyebrow="Fast felt" title={modal.space.name} text={`Betal ${formatCash(modal.space.penalty)} fra cashglasset, eller stå over og mist ett utested.`}>
          <Button disabled={currentPlayer.currency < modal.space.penalty} onClick={() => payFromGlass(modal.space.penalty)}>Betal avgiften</Button>
          <Button variant="secondary" onClick={declineDrinkPenalty}>Stå over</Button>
        </GameSheet>
      );
    }

    if (modal.type === "refill") {
      return (
        <GameSheet eyebrow="0 ml cash" title="Cashglasset er tomt" text="Ta 5 slurker. Da fylles cashglasset tilbake til 500 ml før neste tur eller ekstrakast.">
          <div className="flex justify-center py-2"><BeerGlass value={0} size="large" /></div>
          <Button onClick={refillCash}>5 slurker tatt: fyll 500 ml</Button>
        </GameSheet>
      );
    }

    if (modal.type === "card") {
      return (
        <GameSheet eyebrow={modal.kind} title={modal.card.title} text={modal.card.text}>
          <Button onClick={() => completeCard(modal.card)}>{["start", "currency", "refill"].includes(modal.card.effect) ? "Slurkene tatt: få cash" : "Fullført"}</Button>
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
      const buildable = modal.space.buildable !== false;
      return (
        <GameSheet eyebrow={neighborhood.name} title={modal.space.name} text={modal.owner ? `${modal.owner.name} eier stedet. Leie: ${formatCash(modal.space.buildable === false ? modal.space.rent : Math.min(5, 1 + houses))}.` : `Ledig. Pris: ${formatCash(modal.space.cost)} fra cashglasset.`}>
          {buildable && <BuildingMeter count={houses} color={neighborhood.color} large />}
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
    <main className={`relative flex h-full min-h-0 flex-col bg-white text-gray-900 ${tvMode ? "fixed inset-0 z-[70] h-screen w-screen overflow-hidden px-5 py-3" : "overflow-y-auto overscroll-contain px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:px-5 md:py-3"}`} style={{ WebkitOverflowScrolling: "touch" }}>
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

      <section className={`mt-2 flex shrink-0 gap-2 pb-2 ${tvMode ? "justify-center overflow-visible" : "overflow-x-auto md:justify-center md:overflow-visible"}`} aria-label="Spillere">
        {gamePlayers.map((player, index) => (
          <div key={player.name} className={`flex items-center gap-2 rounded-xl border-2 px-2.5 py-2 ${tvMode ? "min-w-[180px]" : "min-w-[148px] md:min-w-[180px]"} ${index === currentIndex ? "bg-gray-900 text-white" : "bg-white text-gray-600"} ${player.active ? "" : "opacity-35"}`} style={{ borderColor: index === currentIndex ? player.piece.color : `${player.piece.color}80` }}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15" style={{ color: index === currentIndex ? "#fff" : player.piece.color }}>
              <PieceIcon piece={player.piece} size={17} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-xs font-bold">{player.name}</span>
              <span className={`block text-[10px] font-semibold ${index === currentIndex ? "text-gray-300" : "text-gray-400"}`}>{formatCash(player.currency)} cash · {ownedProperties(index).length} steder</span>
            </span>
            <BeerGlass value={player.currency} />
          </div>
        ))}
      </section>

      <section className={`relative mx-auto mt-1 grid aspect-square shrink-0 overflow-hidden rounded-lg border-2 border-gray-900 bg-gray-50 ${tvMode ? "w-[min(78vh,88vw)] max-w-none" : "w-full max-w-[430px] md:w-[min(76vh,76vw)] md:max-w-none"}`} style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))", gridTemplateRows: "repeat(13, minmax(0, 1fr))" }} aria-label="Spillebrett med 40 felt">
        {BOARD_SPACES.map((space, index) => {
          const property = space.type === "property" ? ownership[space.id] : null;
          const neighborhood = space.group ? NEIGHBORHOODS[space.group] : null;
          const owner = property ? gamePlayers[property.owner] : null;
          const isCorner = CORNER_INDEXES.has(index);
          const piecesHere = gamePlayers.map((player, playerIndex) => ({ player, playerIndex })).filter(({ player }) => player.active && player.position === index);
          return (
            <button key={space.id} onClick={() => space.type === "property" && openPropertyInfo(space)} disabled={space.type !== "property"} style={{ ...getBoardPosition(index), backgroundColor: owner ? `${owner.piece.color}12` : "#fff", boxShadow: owner ? `inset 0 0 0 ${tvMode ? 3 : 1.5}px ${owner.piece.color}` : undefined }} className={`relative min-h-0 min-w-0 overflow-hidden border border-gray-200 text-center disabled:opacity-100 ${isCorner ? "px-1 pb-2 pt-2" : "px-px pb-2 pt-1"}`} aria-label={space.type === "property" ? `Info om ${space.name}` : space.name}>
              {neighborhood && <span className={`absolute ${getColorBarClass(index)}`} style={{ background: neighborhood.color }} />}
              {space.type !== "property" && <span className={`mx-auto grid place-items-center text-gray-700 ${isCorner ? "mb-1 h-7 w-7 md:h-9 md:w-9 md:[&_svg]:h-6 md:[&_svg]:w-6" : "mb-0.5 h-3 w-3 md:h-5 md:w-5 md:[&_svg]:h-3.5 md:[&_svg]:w-3.5"}`}><SpaceIcon type={space.type} size={isCorner ? (tvMode ? 25 : 18) : (tvMode ? 14 : 8)} /></span>}
              <span className={`block break-words font-display font-bold leading-none text-gray-800 ${isCorner ? (tvMode ? "text-[12px]" : "text-[7px] md:text-[12px]") : (tvMode ? "text-[9px]" : "text-[5px] md:text-[9px]")}`}>{space.shortName || space.name}</span>
              {space.type === "start" && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-gray-700" title="Spill med klokken"><ArrowRight className={tvMode ? "h-[18px] w-[18px]" : "h-[11px] w-[11px] md:h-[18px] md:w-[18px]"} strokeWidth={2.8} /></span>}
              {space.type === "property" && !property && <span className={`mt-0.5 block font-black text-gray-400 ${tvMode ? "text-[8px]" : "text-[4px] md:text-[8px]"}`}>{formatCash(space.cost)}</span>}
              {owner && <span className={`absolute bottom-0.5 left-0.5 max-w-[62%] overflow-hidden whitespace-nowrap rounded-sm px-0.5 font-black text-white ${tvMode ? "text-[7px]" : "text-[4px] md:text-[7px]"}`} style={{ background: owner.piece.color }}>{tvMode ? owner.name : <><span className="md:hidden">{owner.name.slice(0, 2)}</span><span className="hidden md:inline">{owner.name}</span></>}</span>}
              {owner && space.buildable !== false && <span className="absolute bottom-0.5 right-0.5"><BuildingMeter count={property.houses} color={neighborhood.color} /></span>}
              <span className="absolute right-0.5 top-0.5 flex max-w-[70%] flex-wrap justify-end gap-px">
                {piecesHere.map(({ player, playerIndex }) => (
                  <span key={player.name} className={`grid place-items-center rounded-full text-white shadow-sm ring-1 ring-white ${tvMode ? "h-[23px] w-[23px]" : "h-[13px] w-[13px] md:h-[23px] md:w-[23px] md:[&_svg]:h-[13px] md:[&_svg]:w-[13px]"} ${moving && playerIndex === currentIndex ? "piece-hopping" : ""}`} style={{ background: player.piece.color }} title={`${player.name}: ${player.piece.name}`}>
                    <PieceIcon piece={PIECES[playerIndex]} size={tvMode ? 13 : 7} />
                  </span>
                ))}
              </span>
            </button>
          );
        })}

        <div className={`col-[3/12] row-[3/12] flex min-h-0 flex-col items-center justify-center border border-gray-200 bg-white text-center ${tvMode ? "p-6" : "p-3"}`}>
          {dice ? (
            <span className="flex gap-2">
              <DiceFace value={dice[0]} rolling={rolling} />
              <DiceFace value={dice[1]} rolling={rolling} />
            </span>
          ) : (
            <BeerGlass value={currentPlayer.currency} size={tvMode ? "large" : "responsive"} />
          )}
          <p className={`mt-2 max-w-full truncate font-display font-bold ${tvMode ? "text-2xl" : "text-sm md:text-2xl"}`}>{currentPlayer.name}</p>
          <p className={`font-semibold text-gray-400 ${tvMode ? "text-sm" : "text-[10px] md:text-sm"}`}>{currentPlayer.piece.name} · {formatCash(currentPlayer.currency)} cash</p>
          <p className={`mt-1 max-w-[280px] font-semibold leading-tight text-gray-500 ${tvMode ? "text-xs" : "text-[8px] md:text-xs"}`} aria-live="polite">Sist: {lastTransaction}</p>
          {rollAgainPrompt && <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-600">Dobbelt! Trill igjen</p>}
          {currentPlayer.inJail && <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-500"><Shield size={11} /> Fyllarresten</span>}
          <button onClick={rollDice} disabled={moving || !currentPlayer.active || Boolean(winner)} className="mt-3 flex min-h-10 w-full max-w-36 items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 font-display text-sm font-bold text-white transition active:scale-95 disabled:opacity-40">
            <Dice5 size={17} aria-hidden="true" /> {rolling ? "Triller..." : moving ? `Flytter ${dice[0] + dice[1]} felt` : currentPlayer.inJail ? "Kom deg ut" : rollAgainPrompt ? "Trill på nytt" : "Trill terningene"}
          </button>
        </div>
      </section>

      <footer className={`mt-3 flex min-h-0 flex-1 items-center justify-between gap-2 font-semibold text-gray-400 ${tvMode ? "text-sm" : "text-[11px] md:text-sm"}`}>
        <span className="flex items-center gap-1"><Beer size={14} /> {formatCash(currentPlayer.currency)} cash</span>
        <span className="flex items-center gap-1"><House size={14} /> {PURCHASES_PER_TURN} kjøp/tur</span>
        <button onClick={() => setModal({ type: "screen" })} className="flex min-h-10 items-center gap-1.5 rounded-xl bg-gray-900 px-3 font-display text-xs font-bold text-white" aria-label="Del Vorsopol til skjerm">
          {tvMode ? <Maximize2 size={15} /> : <MonitorUp size={15} />} Del til skjerm
        </button>
      </footer>

      {renderModal()}
    </main>
  );
}
