import { useEffect, useRef, useState } from "react";

const SUITS = [
  { id: "spades", symbol: "♠", color: "#0f172a" },
  { id: "clubs", symbol: "♣", color: "#0f172a" },
  { id: "hearts", symbol: "♥", color: "#ef3b2d" },
  { id: "diamonds", symbol: "♦", color: "#ef3b2d" },
];

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const FACE_RANKS = ["J", "Q", "K"];
const ROW_COUNT = 5;
const PYRAMID_CARD_COUNT = 15;

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const shuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const makeDeck = () =>
  SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: makeId(),
      rank,
      suit: suit.id,
      symbol: suit.symbol,
      color: suit.color,
    })),
  );

const randomDealStyle = () => ({
  dealX: `${Math.round(Math.random() * 180 - 90)}px`,
  dealY: `${Math.round(Math.random() * 120 - 60)}px`,
  dealRotate: `${Math.round(Math.random() * 34 - 17)}deg`,
});

const createRowsFromCards = (cards) => {
  let cursor = 0;

  return Array.from({ length: ROW_COUNT }, (_, topIndex) => {
    const count = topIndex + 1;
    const rowCards = cards
      .slice(cursor, cursor + count)
      .map((card) => ({ ...card, ...randomDealStyle(), revealed: false, failed: false }));
    cursor += count;

    return {
      id: makeId(),
      count,
      sips: (ROW_COUNT - topIndex) * 2,
      cards: rowCards,
    };
  });
};

const dealPyramidFromDeck = (currentDeck) => {
  const sourceDeck = currentDeck.length >= PYRAMID_CARD_COUNT ? currentDeck : shuffle(makeDeck());
  const pyramidCards = sourceDeck.slice(0, PYRAMID_CARD_COUNT);

  return {
    rows: createRowsFromCards(pyramidCards),
    deck: sourceDeck.slice(PYRAMID_CARD_COUNT),
  };
};

const createGame = () => dealPyramidFromDeck(shuffle(makeDeck()));

const faceCardImage = (card) =>
  FACE_RANKS.includes(card.rank) ? `/assets/busroute/face-${card.rank.toLowerCase()}-${card.suit}.png` : null;

function PlayingCard({ card, onClick, dealIndex, dealing, disabled }) {
  const isFaceCard = FACE_RANKS.includes(card.rank);
  const faceImage = faceCardImage(card);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`grid h-[78px] w-[52px] shrink-0 touch-manipulation place-items-center rounded-2xl bg-white font-display font-bold shadow-md ring-1 ring-gray-200 transition active:scale-95 disabled:cursor-default disabled:active:scale-100 min-[390px]:h-[84px] min-[390px]:w-14 ${
        dealing ? "animate-cardDeal" : ""
      } ${card.failed ? "ring-2 ring-red-400" : ""}`}
      style={{
        animationDelay: `${dealIndex * 55}ms`,
        "--deal-x": card.dealX,
        "--deal-y": card.dealY,
        "--deal-rotate": card.dealRotate,
      }}
      aria-label={card.revealed ? `Snu ned ${card.rank}${card.symbol}` : "Snu kort"}
    >
      {card.revealed && faceImage ? (
        <img
          src={faceImage}
          alt={`${card.rank}${card.symbol}`}
          className="h-full w-full rounded-2xl object-fill"
          draggable="false"
        />
      ) : card.revealed ? (
        <div className="flex h-full w-full flex-col justify-between p-1.5">
          <span className="self-start text-sm leading-none" style={{ color: card.color }}>
            {card.rank}
          </span>
          <span
            className={`text-center leading-none ${isFaceCard ? "text-2xl" : "text-3xl"}`}
            style={{ color: card.color }}
          >
            {isFaceCard ? `${card.rank}${card.symbol}` : card.symbol}
          </span>
          <span className="self-end rotate-180 text-sm leading-none" style={{ color: card.color }}>
            {card.rank}
          </span>
        </div>
      ) : (
        <img
          src="/assets/horserace/card-back-standing.png"
          alt=""
          className="h-full w-full object-contain"
          draggable="false"
        />
      )}
    </button>
  );
}

export default function BusRoute({ onBack }) {
  const [game, setGame] = useState(() => createGame());
  const [lastCard, setLastCard] = useState(null);
  const [dealKey, setDealKey] = useState(0);
  const [dealing, setDealing] = useState(false);
  const timersRef = useRef([]);
  const rows = game.rows;

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const queueTimer = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  };

  const dealNewCards = (status = null, clearExistingTimers = true, freshDeck = false) => {
    if (clearExistingTimers) clearTimers();
    setGame((currentGame) => (freshDeck ? createGame() : dealPyramidFromDeck(currentGame.deck)));
    setDealKey((key) => key + 1);
    setDealing(true);
    setLastCard(status);
    queueTimer(() => setDealing(false), 1700);
  };

  const toggleCard = (rowId, cardId) => {
    if (dealing) return;

    const rowToFlip = rows.find((row) => row.id === rowId);
    const cardToFlip = rowToFlip?.cards.find((card) => card.id === cardId);
    if (!rowToFlip || !cardToFlip) return;

    if (cardToFlip.revealed) {
      setGame((currentGame) => ({
        ...currentGame,
        rows: currentGame.rows.map((row) => ({
          ...row,
          cards: row.cards.map((card) => {
            if (row.id !== rowId || card.id !== cardId) return card;
            return { ...card, revealed: false, failed: false };
          }),
        })),
      }));

      if (lastCard?.id === cardToFlip.id) setLastCard(null);
      return;
    }

    const failed = FACE_RANKS.includes(cardToFlip.rank);
    const flipped = { ...cardToFlip, rowSips: rowToFlip.sips, failed };

    setGame((currentGame) => ({
      ...currentGame,
      rows: currentGame.rows.map((row) => ({
        ...row,
        cards: row.cards.map((card) => {
          if (row.id !== rowId || card.id !== cardId || card.revealed) return card;
          return { ...card, revealed: true, failed };
        }),
      })),
    }));

    setLastCard(flipped);

    if (failed) {
      if (navigator.vibrate) navigator.vibrate([50, 35, 90]);
      queueTimer(() => {
        dealNewCards({ ...flipped, redealt: true }, false);
      }, 1650);
    } else if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  const reset = () => {
    dealNewCards(null, true, true);
  };
  const warningText = lastCard?.failed
    ? lastCard.redealt
      ? `Feil: ${lastCard.rank}${lastCard.symbol}. Drikk ${lastCard.rowSips} slurker. Nye kort er lagt ut.`
      : `Feil: ${lastCard.rank}${lastCard.symbol} er bildekort. Drikk ${lastCard.rowSips} slurker.`
    : "";
  const helperText = dealing ? "Legger ut nye kort..." : warningText;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white px-3 py-3 text-center">
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <button
          onClick={onBack}
          className="min-h-11 rounded-full bg-gray-100 px-4 py-2 font-body text-sm font-bold text-gray-500 active:scale-[0.95]"
        >
          ← Meny
        </button>
        <span className="rounded-full bg-gray-50 px-3 py-2 font-body text-xs font-bold text-gray-400 ring-1 ring-gray-200">
          {game.deck.length} igjen
        </span>
      </div>

      <h1 className="shrink-0 font-display text-4xl font-bold tracking-tighter text-slate-900">
        Bussruta
      </h1>

      {helperText ? (
        <div
          className={`mt-2 shrink-0 rounded-2xl px-4 py-3 font-body text-sm font-bold ${
            warningText ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          {helperText}
        </div>
      ) : null}

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-[30px] bg-gray-50 px-2 py-3 ring-1 ring-gray-200">
        <div className="grid gap-2.5">
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="grid grid-cols-[38px_1fr] items-center gap-2">
              <p className="rounded-full bg-white px-1 py-2 text-center font-body text-[11px] font-bold text-gray-400 ring-1 ring-gray-200">
                {row.sips} sl.
              </p>
              <div className="flex justify-center gap-1.5 min-[390px]:gap-2">
                {row.cards.map((card, cardIndex) => {
                  const dealIndex =
                    rows
                      .slice(0, rowIndex)
                      .reduce((sum, previousRow) => sum + previousRow.cards.length, 0) + cardIndex;

                  return (
                  <PlayingCard
                    key={`${dealKey}-${card.id}`}
                    card={card}
                    dealIndex={dealIndex}
                    dealing={dealing}
                    disabled={dealing}
                    onClick={() => toggleCard(row.id, card.id)}
                  />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 shrink-0">
        <button
          onClick={reset}
          disabled={dealing}
          className="min-h-14 w-full touch-manipulation rounded-2xl bg-slate-900 px-4 py-4 font-display text-lg font-bold text-white active:scale-[0.97] disabled:opacity-50"
        >
          Nye kort
        </button>
      </div>
    </div>
  );
}
