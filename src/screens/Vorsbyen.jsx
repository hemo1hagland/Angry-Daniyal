import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Beer from "lucide-react/dist/esm/icons/beer.js";
import Citrus from "lucide-react/dist/esm/icons/citrus.js";
import CupSoda from "lucide-react/dist/esm/icons/cup-soda.js";
import Dice5 from "lucide-react/dist/esm/icons/dice-5.js";
import GlassWater from "lucide-react/dist/esm/icons/glass-water.js";
import House from "lucide-react/dist/esm/icons/house.js";
import Info from "lucide-react/dist/esm/icons/info.js";
import Martini from "lucide-react/dist/esm/icons/martini.js";
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

const getBoardPosition = (index) => {
  if (index <= 5) return { gridRow: 1, gridColumn: index + 1 };
  if (index <= 10) return { gridRow: index - 4, gridColumn: 6 };
  if (index <= 15) return { gridRow: 6, gridColumn: 16 - index };
  return { gridRow: 21 - index, gridColumn: 1 };
};

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

function PieceIcon({ piece, size = 15 }) {
  const Icon = PIECE_ICONS[piece.id] || Beer;
  return <Icon size={size} strokeWidth={2.4} aria-hidden="true" />;
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
      currency: 3,
      inJail: false,
      active: true,
    }));
  });
  const [ownership, setOwnership] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [dice, setDice] = useState(null);
  const [moving, setMoving] = useState(false);
  const [modal, setModal] = useState(null);
  const [winner, setWinner] = useState(null);

  const currentPlayer = gamePlayers[currentIndex];

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
    setDice(null);
    setMoving(false);
    setModal(null);
  };

  const sendToJail = () => {
    const nextPlayers = gamePlayers.map((player, index) =>
      index === currentIndex ? { ...player, position: 8, inJail: true } : player,
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
        index === currentIndex ? { ...player, position: 8, inJail: true } : player,
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

    if (space.type === "challenge") {
      setModal({ type: "card", kind: "Challenge", card: randomItem(CHALLENGE_CARDS) });
    } else if (space.type === "bonus") {
      setModal({ type: "card", kind: "Bonuskort", card: randomItem(BONUS_CARDS) });
    } else if (space.type === "jail") {
      const jailedPlayers = nextPlayers.map((player, index) =>
        index === currentIndex ? { ...player, inJail: true } : player,
      );
      setGamePlayers(jailedPlayers);
      setModal({ type: "jailed", nextPlayers: jailedPlayers });
    } else if (space.type === "taxi") {
      const taxiPlayers = nextPlayers.map((player, index) =>
        index === currentIndex
          ? { ...player, position: 0, currency: Math.min(MAX_CURRENCY, player.currency + 1) }
          : player,
      );
      setGamePlayers(taxiPlayers);
      setModal({ type: "message", title: "Taxi til Start", text: "Du får 1 slurkmynt.", nextPlayers: taxiPlayers });
    } else if (space.type === "pause") {
      setModal({ type: "message", title: "Vannpause", text: "Ingen straff. Ta en liten pause før neste spiller.", nextPlayers });
    } else {
      setModal({ type: "message", title: "Start", text: "Du får 1 slurkmynt, opptil maks 5.", nextPlayers });
    }
  };

  const rollDice = () => {
    if (moving || winner) return;
    if (currentPlayer.inJail) {
      setModal({ type: "jail-exit" });
      return;
    }

    const result = Math.floor(Math.random() * 6) + 1;
    const rawPosition = currentPlayer.position + result;
    const passedStart = rawPosition >= BOARD_SPACES.length;
    const position = rawPosition % BOARD_SPACES.length;
    const nextPlayers = gamePlayers.map((player, index) =>
      index === currentIndex
        ? {
            ...player,
            position,
            currency: passedStart ? Math.min(MAX_CURRENCY, player.currency + 1) : player.currency,
          }
        : player,
    );
    setDice(result);
    setMoving(true);
    setGamePlayers(nextPlayers);
    setTimeout(() => resolveSpace(BOARD_SPACES[position], nextPlayers), 420);
  };

  const openPropertyInfo = (space) => {
    const property = ownership[space.id];
    setModal({ type: "property-info", space, property, owner: property ? gamePlayers[property.owner] : null });
  };

  const renderModal = () => {
    if (!modal) return null;

    if (modal.type === "rules") {
      return (
        <GameSheet eyebrow="Slik spiller dere" title="Vorsbyen">
          <ul className="space-y-3 text-left text-sm font-medium leading-relaxed text-gray-600">
            <li>Trill, flytt og kjøp utesteder med slurkmynter.</li>
            <li>Start gir 1 slurkmynt. Ingen kan ha mer enn {MAX_CURRENCY}.</li>
            <li>Oppgrader et sted to ganger. Leien øker til maks 3 slurker.</li>
            <li>Challenge kan stås over, men da går du til Fyllarresten.</li>
            <li>Den første som eier {WINNING_NEIGHBORHOODS} komplette nabolag vinner.</li>
          </ul>
          <Button onClick={() => setModal(null)}>Skjønner</Button>
        </GameSheet>
      );
    }

    if (modal.type === "buy") {
      return (
        <GameSheet eyebrow={NEIGHBORHOODS[modal.space.group].name} title={modal.space.name} text={`Kjøp stedet for ${modal.space.cost} slurkmynt${modal.space.cost === 1 ? "" : "er"}. Grunnleie er 1 slurk.`}>
          <Button disabled={!modal.canBuy} onClick={() => buyProperty(modal.space)}>Kjøp for {modal.space.cost}</Button>
          <Button variant="secondary" onClick={() => advanceTurn()}>Ikke kjøp</Button>
        </GameSheet>
      );
    }

    if (modal.type === "upgrade") {
      const maxed = modal.property.houses >= 2;
      return (
        <GameSheet eyebrow="Ditt sted" title={modal.space.name} text={maxed ? "Stedet er fullt oppgradert. Leien er 3 slurker." : `Neste hus koster ${modal.upgradeCost} slurkmynt${modal.upgradeCost === 1 ? "" : "er"}.`}>
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
            {[0, 1].map((house) => <House key={house} size={22} className={house < houses ? "fill-gray-900 text-gray-900" : "text-gray-200"} />)}
          </div>
          <Button onClick={() => setModal(null)}>Lukk</Button>
        </GameSheet>
      );
    }

    if (modal.type === "winner") {
      return (
        <GameSheet eyebrow="To komplette nabolag" title={`${modal.player.name} vinner!`} text={`${modal.player.piece.name}-brikken har tatt over Vorsbyen.`}>
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
    <main className="relative flex min-h-full flex-col overflow-hidden bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-gray-900">
      <header className="flex h-11 shrink-0 items-center justify-between">
        <button onClick={onBack} className="flex h-10 items-center gap-1 rounded-full bg-gray-100 px-3 text-sm font-medium text-gray-500" aria-label="Tilbake til spillmenyen">
          <ArrowLeft size={16} aria-hidden="true" /> Meny
        </button>
        <div className="text-center">
          <h1 className="font-display text-lg font-bold">Vorsbyen</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Runde {round}</p>
        </div>
        <button onClick={() => setModal({ type: "rules" })} className="icon-button h-10 w-10 bg-gray-100 text-gray-500" aria-label="Vis spilleregler">
          <Info size={17} aria-hidden="true" />
        </button>
      </header>

      <section className="mt-2 flex shrink-0 gap-2 overflow-x-auto pb-2" aria-label="Spillere">
        {gamePlayers.map((player, index) => (
          <div key={player.name} className={`flex min-w-[118px] items-center gap-2 rounded-xl border px-2.5 py-2 ${index === currentIndex ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-600"} ${player.active ? "" : "opacity-35"}`}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15" style={{ color: index === currentIndex ? "#fff" : player.piece.color }}>
              <PieceIcon piece={player.piece} size={17} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-xs font-bold">{player.name}</span>
              <span className={`block text-[10px] font-semibold ${index === currentIndex ? "text-gray-300" : "text-gray-400"}`}>{player.currency}/{MAX_CURRENCY} mynter · {completedNeighborhoods(index).length} nabolag</span>
            </span>
          </div>
        ))}
      </section>

      <section className="relative mx-auto mt-1 grid aspect-square w-full max-w-[390px] shrink-0 grid-cols-6 grid-rows-6 overflow-hidden rounded-xl border-2 border-gray-900 bg-gray-50" aria-label="Spillebrett">
        {BOARD_SPACES.map((space, index) => {
          const property = space.type === "property" ? ownership[space.id] : null;
          const neighborhood = space.group ? NEIGHBORHOODS[space.group] : null;
          const piecesHere = gamePlayers.map((player, playerIndex) => ({ player, playerIndex })).filter(({ player }) => player.active && player.position === index);
          return (
            <button key={space.id} onClick={() => space.type === "property" && openPropertyInfo(space)} disabled={space.type !== "property"} style={getBoardPosition(index)} className="relative min-h-0 min-w-0 overflow-hidden border border-gray-200 bg-white px-0.5 pb-3 pt-1 text-center disabled:opacity-100" aria-label={space.type === "property" ? `Info om ${space.name}` : space.name}>
              {neighborhood && <span className="absolute inset-x-0 top-0 h-1" style={{ background: neighborhood.color }} />}
              <span className="block break-words font-display text-[7px] font-bold leading-[1.05] text-gray-700">{space.shortName || space.name}</span>
              {property && <span className="mt-0.5 block text-[7px] font-black text-gray-400">{property.houses ? `${property.houses}H` : "EID"}</span>}
              <span className="absolute inset-x-0 bottom-0.5 flex flex-wrap justify-center gap-0.5">
                {piecesHere.map(({ player, playerIndex }) => (
                  <span key={player.name} className="grid h-3.5 w-3.5 place-items-center rounded-full text-white ring-1 ring-white" style={{ background: player.piece.color }} title={`${player.name}: ${player.piece.name}`}>
                    <PieceIcon piece={PIECES[playerIndex]} size={8} />
                  </span>
                ))}
              </span>
            </button>
          );
        })}

        <div className="col-[2/6] row-[2/6] flex min-h-0 flex-col items-center justify-center border border-gray-200 bg-white p-3 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100" style={{ color: currentPlayer.piece.color }}>
            <PieceIcon piece={currentPlayer.piece} size={21} />
          </span>
          <p className="mt-2 max-w-full truncate font-display text-sm font-bold">{currentPlayer.name}</p>
          <p className="text-[10px] font-semibold text-gray-400">{currentPlayer.piece.name} · {currentPlayer.currency} slurkmynter</p>
          {currentPlayer.inJail && <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-500"><Shield size={11} /> Fyllarresten</span>}
          <button onClick={rollDice} disabled={moving || !currentPlayer.active || Boolean(winner)} className="mt-3 flex min-h-10 w-full max-w-36 items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 font-display text-sm font-bold text-white transition active:scale-95 disabled:opacity-40">
            <Dice5 size={17} aria-hidden="true" /> {moving ? "Flytter..." : dice ? `Trillet ${dice}` : currentPlayer.inJail ? "Kom deg ut" : "Trill terningen"}
          </button>
        </div>
      </section>

      <footer className="mt-3 flex min-h-0 flex-1 items-center justify-center gap-5 text-xs font-semibold text-gray-400">
        <span className="flex items-center gap-1"><Ticket size={14} /> Maks {MAX_CURRENCY} mynter</span>
        <span className="flex items-center gap-1"><House size={14} /> {WINNING_NEIGHBORHOODS} nabolag vinner</span>
      </footer>

      {renderModal()}
    </main>
  );
}
