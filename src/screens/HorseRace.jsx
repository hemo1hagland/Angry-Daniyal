import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";

const SUITS = [
  {
    id: "spades",
    symbol: "♠",
    name: "spar",
    label: "Spar",
    color: "#0f172a",
    horseAsset: "/assets/horserace/card-horse-spades.png",
    lane: 0,
    startOffset: 0.002,
  },
  {
    id: "clubs",
    symbol: "♣",
    name: "kløver",
    label: "Kløver",
    color: "#0f172a",
    horseAsset: "/assets/horserace/card-horse-clubs.png",
    lane: 1,
    startOffset: 0.012,
  },
  {
    id: "hearts",
    symbol: "♥",
    name: "hjerter",
    label: "Hjerter",
    color: "#ef3b2d",
    horseAsset: "/assets/horserace/card-horse-hearts.png",
    lane: 2,
    startOffset: 0.022,
  },
  {
    id: "diamonds",
    symbol: "♦",
    name: "ruter",
    label: "Ruter",
    color: "#ef3b2d",
    horseAsset: "/assets/horserace/card-horse-diamonds.png",
    lane: 3,
    startOffset: 0.032,
  },
];

const CARD_RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const BETS = [1, 2, 3, 5, 10];
const AUTO_SPEEDS = [1, 1.5, 2];
const RACE_MUSIC_SRC = "/assets/audio/horse-race-music.mp4";
const TRACK_LENGTH = 6;
const FINISH_STEP = TRACK_LENGTH + 1;
const COURSE_CARDS = [
  { field: 1, type: "backOne", orientation: "standing" },
  { field: 2, type: "backOne", orientation: "standing" },
  { field: 3, type: "backStart", orientation: "lying" },
  { field: 4, type: "backOne", orientation: "standing" },
  { field: 5, type: "backOne", orientation: "standing" },
  { field: 6, type: "backStart", orientation: "lying" },
];
const COURSE_CARD_POINTS = {
  1: 20,
  2: 34,
  3: 48,
  4: 62,
  5: 76,
  6: 90,
};

const suitById = (id) => SUITS.find((suit) => suit.id === id);

const makeDeck = () =>
  SUITS.flatMap((suit) =>
    CARD_RANKS.map((rank) => ({
      rank,
      suit: suit.id,
      symbol: suit.symbol,
      color: suit.color,
      label: suit.label,
      name: suit.name,
    })),
  );

const shuffle = (cards) => {
  const next = [...cards];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const initialPositions = () =>
  SUITS.reduce((positions, suit) => ({ ...positions, [suit.id]: 0 }), {});

const getRaceResults = (winner, players) => {
  const winners = players.filter((player) => player.suit === winner.id);
  const losers = players.filter((player) => player.suit !== winner.id);
  const totalToHandOut = winners.reduce((sum, player) => sum + player.bet, 0);
  const baseHandout = losers.length ? Math.floor(totalToHandOut / losers.length) : 0;
  const extraHandouts = losers.length ? totalToHandOut % losers.length : 0;

  const rows = players.map((player) => {
    const won = player.suit === winner.id;
    const loserIndex = losers.findIndex((loser) => loser.id === player.id);
    const handedToPlayer = won ? 0 : baseHandout + (loserIndex < extraHandouts ? 1 : 0);
    return {
      ...player,
      won,
      handedToPlayer,
      drinks: won ? 0 : player.bet + handedToPlayer,
      distribute: won ? player.bet : 0,
      suit: suitById(player.suit),
    };
  });

  return {
    winners,
    losers,
    rows,
    totalToHandOut,
    totalDrinks: rows.reduce((sum, row) => sum + row.drinks, 0),
  };
};

const newRaceDeck = () => {
  const shuffled = shuffle(makeDeck().filter((card) => card.rank !== "A"));
  return {
    stageCards: shuffled.slice(0, TRACK_LENGTH).map((card, index) => ({
      ...card,
      ...COURSE_CARDS[index],
      revealed: false,
    })),
    drawDeck: shuffled.slice(TRACK_LENGTH),
  };
};

const vibrate = (pattern) => {
  if (navigator.vibrate) navigator.vibrate(pattern);
};

function getTrackPoint(progress, lane) {
  const p = Math.max(0, Math.min(progress, 1));
  const laneX = 10.25 + lane * 20.5;
  return {
    x: laneX,
    y: 11 + p * 80,
  };
}

function HorsePiece({ suit }) {
  return (
    <img
      src={suit.horseAsset}
      alt=""
      className="h-auto w-10 select-none drop-shadow-sm"
      draggable="false"
    />
  );
}

function StageCard({ card }) {
  const isLying = card.orientation === "lying";
  const cardSize = isLying ? "h-6 w-11" : "h-10 w-6";

  return (
    <div
      className={`flex items-center justify-center rounded-xl font-display font-bold ${cardSize}`}
      title={isLying ? "Liggende kort: tilbake til start" : "Stående kort: ett felt tilbake"}
    >
      {card.revealed ? (
        <span
          className="flex h-full w-full items-center justify-center rounded-lg bg-white text-sm leading-none shadow-md ring-1 ring-gray-200"
          style={{ color: card.color }}
        >
          {card.rank}
          {card.symbol}
        </span>
      ) : (
        <img
          src={isLying ? "/assets/horserace/card-back-lying.png" : "/assets/horserace/card-back-standing.png"}
          alt=""
          className="h-full w-full object-contain"
          draggable="false"
        />
      )}
    </div>
  );
}

function RaceTrack({ positions, movingSuit, backwardSuit, stageCards }) {
  return (
    <div className="relative mx-auto h-[min(43dvh,360px)] min-h-[285px] w-full max-w-[430px] overflow-visible">
      <img
        src="/assets/horserace/long-track-board.png"
        alt=""
        className="absolute bottom-0 left-0 top-0 h-full w-[calc(100%-54px)] select-none object-fill"
        draggable="false"
      />

      {SUITS.map((suit) => {
        const labelPoint = getTrackPoint(0, suit.lane);
        return (
          <div
            key={`label-${suit.id}`}
            className="absolute z-30 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-white/90 font-display font-bold shadow-sm ring-1 ring-gray-200 backdrop-blur"
            style={{
              left: `${labelPoint.x}%`,
              top: "-26px",
            }}
            title={suit.name}
          >
            <span className="text-base leading-none" style={{ color: suit.color }}>
              {suit.symbol}
            </span>
          </div>
        );
      })}

      {stageCards.map((card) => {
        return (
          <div
            key={`${card.field}-${card.rank}-${card.suit}`}
            className="absolute right-0 z-30 flex w-11 -translate-y-1/2 justify-center"
            style={{ top: `${COURSE_CARD_POINTS[card.field]}%` }}
          >
            <StageCard card={card} />
          </div>
        );
      })}

      {SUITS.map((suit) => {
        const progress = suit.startOffset + positions[suit.id] / FINISH_STEP;
        const point = getTrackPoint(progress, suit.lane);
        const moving = movingSuit === suit.id;
        const backwards = backwardSuit === suit.id;

        return (
          <div
            key={suit.id}
            className="absolute z-20 transition-[left,top] duration-700 ease-out"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className={`${moving ? "animate-horseBob" : ""} ${backwards ? "animate-pulse" : ""}`}>
              <HorsePiece suit={suit} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CardFace({ card, empty = false }) {
  return (
    <div className="flex h-16 w-11 flex-col items-center justify-between rounded-xl bg-white p-1.5 font-display font-bold shadow-sm ring-1 ring-gray-200">
      {empty ? (
        <img
          src="/assets/horserace/card-back-standing.png"
          alt=""
          className="h-full w-full object-contain"
          draggable="false"
        />
      ) : (
        <>
          <span className="self-start text-xs" style={{ color: card.color }}>
            {card.rank}
          </span>
          <span className="text-2xl leading-none" style={{ color: card.color }}>
            {card.symbol}
          </span>
          <span className="self-end rotate-180 text-xs" style={{ color: card.color }}>
            {card.rank}
          </span>
        </>
      )}
    </div>
  );
}

function DeckStack({ count }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-16 w-11">
        <img
          src="/assets/horserace/card-back-standing.png"
          alt=""
          className="absolute left-1.5 top-1.5 h-16 w-11 object-contain opacity-45"
          draggable="false"
        />
        <img
          src="/assets/horserace/card-back-standing.png"
          alt=""
          className="absolute left-1 top-1 h-16 w-11 object-contain opacity-75"
          draggable="false"
        />
        <img
          src="/assets/horserace/card-back-standing.png"
          alt=""
          className="absolute left-0 top-0 h-16 w-11 object-contain drop-shadow-md"
          draggable="false"
        />
      </div>
      <span className="mt-1 whitespace-nowrap font-body text-[11px] text-gray-400">
        {count} igjen
      </span>
    </div>
  );
}

function SpeakerIcon({ muted }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      {muted ? (
        <>
          <path d="m18 9-4 6" />
          <path d="m14 9 4 6" />
        </>
      ) : (
        <>
          <path d="M16 9.5a4 4 0 0 1 0 5" />
          <path d="M18.5 7a7.5 7.5 0 0 1 0 10" />
        </>
      )}
    </svg>
  );
}

function SoundControl({ soundOn, volume, onToggle, onVolumeChange }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1 shadow-sm ring-1 ring-gray-200">
      <button
        onClick={onToggle}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition active:scale-[0.96] ${
          soundOn ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
        aria-label={soundOn ? "Skru av lyd" : "Skru på lyd"}
      >
        <SpeakerIcon muted={!soundOn || volume === 0} />
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(event) => onVolumeChange(Number(event.target.value))}
        className="h-1 w-20 accent-slate-900"
        aria-label="Volum"
      />
    </div>
  );
}

function SuitButton({ suit, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-3 py-3 font-display text-base font-bold shadow-sm ring-1 transition active:scale-[0.97] ${
        selected
          ? "bg-slate-900 text-white ring-slate-900"
          : "bg-white text-slate-900 ring-gray-200"
      }`}
    >
      <span className="mr-2 text-3xl align-middle" style={{ color: selected ? "#fff" : suit.color }}>
        {suit.symbol}
      </span>
      {suit.name}
    </button>
  );
}

function PlayerRow({ player, onRemove }) {
  const suit = suitById(player.suit);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-gray-200">
      <div className="min-w-0">
        <p className="truncate font-display text-base font-bold text-slate-900">{player.name}</p>
        <p className="font-body text-sm text-gray-500">
          Satser {player.bet} slurker på{" "}
          <span className="font-bold" style={{ color: suit.color }}>
            {suit.symbol} {suit.name}
          </span>
        </p>
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 rounded-full bg-gray-100 px-3 py-2 font-body text-xs font-bold text-gray-500 transition active:scale-[0.95]"
      >
        Fjern
      </button>
    </div>
  );
}

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }).map((_, index) => {
        const left = (index * 37) % 100;
        const delay = (index % 9) * 0.11;
        const color = index % 3 === 0 ? "#ef3b2d" : index % 3 === 1 ? "#0f172a" : "#f6c453";
        return (
          <span
            key={index}
            className="animate-confetti absolute top-0 h-3 w-1.5 rounded-full"
            style={{
              left: `${left}%`,
              background: color,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function ResultPanel({ winner, players }) {
  const { rows, totalToHandOut, totalDrinks } = getRaceResults(winner, players);

  return (
    <div className="text-left">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-gray-50 p-3 text-center">
          <p className="font-body text-xs text-gray-400">Deles ut</p>
          <p className="font-display text-2xl font-bold text-slate-900">{totalToHandOut}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3 text-center">
          <p className="font-body text-xs text-gray-400">Drikkes nå</p>
          <p className="font-display text-2xl font-bold text-slate-900">{totalDrinks}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`rounded-2xl px-3 py-3 ring-1 ${
              row.won ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-900 ring-gray-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-base font-bold">{row.name}</p>
                <p className={`font-body text-xs ${row.won ? "text-white/70" : "text-gray-500"}`}>
                  Satset på{" "}
                  <span className="font-bold" style={{ color: row.won ? "#fff" : row.suit.color }}>
                    {row.suit.symbol} {row.suit.name}
                  </span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                {row.won ? (
                  <>
                    <p className="font-body text-xs text-white/70">Deler ut</p>
                    <p className="font-display text-2xl font-bold">{row.distribute}</p>
                  </>
                ) : (
                  <>
                    <p className="font-body text-xs text-gray-400">Drikker</p>
                    <p className="font-display text-2xl font-bold">{row.drinks}</p>
                  </>
                )}
              </div>
            </div>
            {!row.won && (
              <p className="mt-2 font-body text-xs text-gray-500">
                {row.bet} egen innsats + {row.handedToPlayer} utdelt av vinnerne.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WinnerOverlay({ winner, players, onReplay, onReset }) {
  const { winners, totalToHandOut, totalDrinks } = getRaceResults(winner, players);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 px-4 py-5 backdrop-blur-sm">
      <ConfettiBurst />
      <div className="relative z-10 flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-white p-4 text-center shadow-[0_22px_70px_rgba(15,23,42,0.20)] ring-1 ring-gray-200">
        <p className="font-body text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
          Målgang
        </p>
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
          <span className="text-5xl" style={{ color: winner.color }}>
            {winner.symbol}
          </span>
        </div>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tighter text-slate-900">
          {winner.label} vant!
        </h2>
        <p className="mx-auto mt-1 max-w-xs font-body text-sm font-semibold text-gray-500">
          {winners.length
            ? `${winners.map((player) => player.name).join(", ")} traff riktig.`
            : "Ingen satset riktig, så ingen deler ut ekstra."}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-slate-900 p-3 text-white">
            <p className="font-body text-xs text-white/60">Vinnere deler ut</p>
            <p className="font-display text-3xl font-bold">{totalToHandOut}</p>
          </div>
          <div className="rounded-2xl bg-gray-100 p-3 text-slate-900">
            <p className="font-body text-xs text-gray-500">Tapere drikker</p>
            <p className="font-display text-3xl font-bold">{totalDrinks}</p>
          </div>
        </div>

        <div className="mt-4 min-h-0 overflow-y-auto pr-1">
          <ResultPanel winner={winner} players={players} />
        </div>

        <div className="mt-4 grid shrink-0 grid-cols-2 gap-2">
          <Button onClick={onReset} variant="secondary" className="py-3 text-base">
            Innsats
          </Button>
          <Button onClick={onReplay} className="py-3 text-base">
            Nytt løp
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HorseRace({ onBack }) {
  const audioRef = useRef(null);
  const [{ drawDeck, stageCards }, setRaceCards] = useState(() => newRaceDeck());
  const [phase, setPhase] = useState("bet");
  const [selectedSuit, setSelectedSuit] = useState("spades");
  const [bet, setBet] = useState(2);
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [positions, setPositions] = useState(initialPositions);
  const [lastCard, setLastCard] = useState(null);
  const [movingSuit, setMovingSuit] = useState(null);
  const [backwardSuit, setBackwardSuit] = useState(null);
  const [winner, setWinner] = useState(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState(1);
  const [soundOn, setSoundOn] = useState(false);
  const [volume, setVolume] = useState(0.45);

  const selected = suitById(selectedSuit);
  const totalPot = players.reduce((sum, player) => sum + player.bet, 0);

  const addPlayer = () => {
    const cleanName = playerName.trim() || `Spiller ${players.length + 1}`;
    setPlayers((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        name: cleanName,
        suit: selectedSuit,
        bet,
      },
    ]);
    setPlayerName("");
  };

  const removePlayer = (id) => {
    setPlayers((current) => current.filter((player) => player.id !== id));
  };

  const pauseRaceMusic = () => {
    audioRef.current?.pause();
  };

  const prepareRace = () => {
    pauseRaceMusic();
    setRaceCards(newRaceDeck());
    setPositions(initialPositions());
    setLastCard(null);
    setMovingSuit(null);
    setBackwardSuit(null);
    setWinner(null);
    setAutoPlay(false);
    setSoundOn(false);
  };

  const startRace = () => {
    if (!players.length) return;
    prepareRace();
    setPhase("race");
  };

  const reset = () => {
    prepareRace();
    pauseRaceMusic();
    setPhase("bet");
  };

  const drawCard = () => {
    if (movingSuit || winner) return;

    const [card, ...rest] = drawDeck.length ? drawDeck : shuffle(makeDeck());
    const nextPositions = { ...positions, [card.suit]: Math.min(FINISH_STEP, positions[card.suit] + 1) };
    const nextStageCards = stageCards.map((stage) => ({ ...stage }));
    let backwards = null;

    nextStageCards.forEach((stage) => {
      if (stage.revealed) return;

      const everyonePassed = SUITS.every((suit) => nextPositions[suit.id] >= stage.field);
      if (!everyonePassed) return;

      stage.revealed = true;
      backwards = stage.suit;
      nextPositions[stage.suit] =
        stage.type === "backStart" ? 0 : Math.max(0, nextPositions[stage.suit] - 1);
    });

    const finishedSuit = SUITS.find((suit) => nextPositions[suit.id] >= FINISH_STEP);

    setRaceCards({ drawDeck: rest, stageCards: nextStageCards });
    setPositions(nextPositions);
    setLastCard(card);
    setMovingSuit(card.suit);
    setBackwardSuit(backwards);
    vibrate(backwards ? [30, 30, 80] : 20);

    if (finishedSuit) {
      setWinner(finishedSuit);
      setAutoPlay(false);
      window.setTimeout(() => vibrate([90, 50, 160]), 250);
    }

    window.setTimeout(() => {
      setMovingSuit(null);
      setBackwardSuit(null);
    }, 780);
  };

  useEffect(() => {
    const audio = new Audio(RACE_MUSIC_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (phase !== "race" || !autoPlay || movingSuit || winner) return undefined;

    const timer = window.setTimeout(() => {
      drawCard();
    }, Math.round(1250 / autoSpeed));

    return () => window.clearTimeout(timer);
  }, [autoPlay, autoSpeed, drawDeck, movingSuit, phase, positions, stageCards, winner]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = !soundOn || volume === 0;

    if (phase === "race" && soundOn && !audio.paused) {
      audio.play().catch(() => setSoundOn(false));
    }
  }, [phase, soundOn, volume]);

  if (phase === "bet") {
    return (
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-white px-3 py-2 text-center">
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <button
            onClick={onBack}
            className="rounded-full bg-gray-100 px-4 py-2 font-body text-sm text-gray-500 transition active:scale-[0.95]"
          >
            ← Meny
          </button>
          <span className="font-body text-xs uppercase tracking-[0.25em] text-gray-400">
            Hesteløp
          </span>
        </div>

        <h1 className="shrink-0 font-display text-4xl font-bold tracking-tighter text-slate-900">
          Veddeløpet
        </h1>
        <p className="mx-auto mt-1 shrink-0 max-w-sm font-body text-sm text-slate-500">
          Legg inn hvem som satser på hva.
        </p>

        <div className="mt-3 shrink-0 rounded-3xl bg-gray-50 p-3 text-left ring-1 ring-gray-200">
          <div className="grid gap-2.5">
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-[0.18em] text-gray-400" htmlFor="horse-player-name">
                Spiller
              </label>
              <input
                id="horse-player-name"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder={`Spiller ${players.length + 1}`}
                className="mt-2 w-full rounded-2xl bg-white px-4 py-3 font-display text-lg font-bold text-slate-900 outline-none ring-1 ring-gray-200 placeholder:text-gray-300 focus:ring-slate-900"
              />
            </div>

            <div>
              <p className="mb-1.5 font-body text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Hest
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SUITS.map((suit) => (
                  <SuitButton
                    key={suit.id}
                    suit={suit}
                    selected={selectedSuit === suit.id}
                    onClick={() => setSelectedSuit(suit.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 font-body text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Slurker
              </p>
              <div className="grid grid-cols-5 gap-2">
                {BETS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setBet(option)}
                    className={`rounded-xl py-2.5 font-display text-lg font-bold transition active:scale-[0.95] ${
                      bet === option
                        ? "bg-slate-900 text-white"
                        : "bg-white text-gray-500 ring-1 ring-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={addPlayer} variant="secondary" className="py-3 text-base">
              Legg til: {playerName.trim() || `Spiller ${players.length + 1}`} · {selected.symbol} {selected.name} · {bet}
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <Button onClick={startRace} disabled={!players.length} className="py-3 text-base">
            Start løp ({players.length} spillere)
          </Button>
        </div>

        {players.length > 0 && (
          <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-3xl bg-gray-50 p-3 ring-1 ring-gray-200">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-body text-sm font-bold uppercase tracking-[0.18em] text-gray-400">
                Satser
              </p>
              <p className="font-body text-sm font-bold text-gray-500">{totalPot} slurker i potten</p>
            </div>
            <div className="space-y-2">
              {players.map((player) => (
                <PlayerRow key={player.id} player={player} onRemove={() => removePlayer(player.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white px-3 py-2 text-center">
      <div className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <button
          onClick={reset}
          className="rounded-full bg-gray-100 px-3 py-2 font-body text-xs text-gray-500 transition active:scale-[0.95]"
        >
          ← Innsats
        </button>
        <h1 className="min-w-0 truncate font-display text-xl font-bold tracking-tighter text-slate-900">
          Veddeløpet
        </h1>
        <span className="whitespace-nowrap rounded-full bg-gray-50 px-2 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 ring-1 ring-gray-200">
          {players.length} · {totalPot}
        </span>
      </div>

      <div className="mb-2 mt-8 grid min-h-0 flex-1 items-start gap-2">
        <RaceTrack
          positions={positions}
          movingSuit={movingSuit}
          backwardSuit={backwardSuit}
          stageCards={stageCards}
        />

        <div className="min-h-0 space-y-2 rounded-2xl bg-gray-50 p-2 ring-1 ring-gray-200">
          <Button onClick={winner ? reset : drawCard} disabled={Boolean(movingSuit)} className="py-3 text-base">
            {winner ? "Spill på nytt" : movingSuit ? "Flytter..." : "Trekk kort"}
          </Button>

          {!winner && (
            <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-200">
              <button
                onClick={() => setAutoPlay((current) => !current)}
                className={`h-8 rounded-full px-3 font-display text-xs font-bold transition active:scale-[0.96] ${
                  autoPlay
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-gray-100 text-slate-700"
                }`}
              >
                {autoPlay ? "Pause" : "Auto"}
              </button>

              <div className="flex flex-1 justify-end gap-1">
                {AUTO_SPEEDS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setAutoSpeed(speed)}
                    className={`h-8 min-w-9 rounded-full px-2 font-display text-xs font-bold transition active:scale-[0.96] ${
                      autoSpeed === speed
                        ? "bg-slate-900 text-white"
                        : "bg-transparent text-gray-400"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <SoundControl
              soundOn={soundOn}
              volume={volume}
              onToggle={() => {
                const nextSoundOn = !soundOn;
                setSoundOn(nextSoundOn);
                if (nextSoundOn && phase === "race") {
                  const audio = audioRef.current;
                  if (audio) {
                    audio.volume = volume;
                    audio.muted = false;
                    audio.play().catch(() => setSoundOn(false));
                  }
                } else {
                  audioRef.current?.pause();
                }
              }}
              onVolumeChange={(nextVolume) => {
                setVolume(nextVolume);
                if (soundOn && nextVolume > 0 && phase === "race") {
                  const audio = audioRef.current;
                  if (audio) {
                    audio.volume = nextVolume;
                    audio.muted = false;
                    audio.play().catch(() => setSoundOn(false));
                  }
                } else if (nextVolume === 0) {
                  audioRef.current?.pause();
                }
              }}
            />
          </div>

          <div>
            <div className="flex items-start justify-center gap-4 pb-2">
              <DeckStack count={drawDeck.length} />
              {lastCard ? <CardFace card={lastCard} /> : <CardFace empty />}
            </div>

            {winner && (
              <p className="mx-auto max-w-lg rounded-xl bg-white px-3 py-2 font-body text-xs font-semibold leading-snug text-slate-700 ring-1 ring-gray-200">
                Resultatet vises nå.
              </p>
            )}
          </div>
        </div>
      </div>

      {winner && (
        <WinnerOverlay
          winner={winner}
          players={players}
          onReplay={prepareRace}
          onReset={reset}
        />
      )}
    </div>
  );
}
