import { useMemo, useState } from "react";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw.js";
import Button from "../components/Button";
import usePersistentState from "../hooks/usePersistentState";

const DEFAULT_CARDS = [
  "Hvem i gruppen kjenner deg best?",
  "Fortell om kveldens morsomste øyeblikk.",
  "Hvem ville du tatt med på en spontan reise?",
];

const shuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

export default function CustomCards({ onBack, onComplete }) {
  const [savedCards, setSavedCards] = usePersistentState("vors.customCards", DEFAULT_CARDS);
  const [draft, setDraft] = useState(() => savedCards.join("\n"));
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const cards = useMemo(() => draft.split("\n").map((card) => card.trim()).filter(Boolean).slice(0, 100), [draft]);
  const playing = deck.length > 0;

  const start = () => {
    setSavedCards(cards);
    setDeck(shuffle(cards));
    setIndex(0);
  };

  if (!playing) {
    return (
      <main className="relative flex min-h-full flex-col items-center overflow-y-auto bg-white px-6 pb-10 pt-24 text-center">
        <button onClick={onBack} className="absolute left-5 top-5 min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500">← Meny</button>
        <p className="text-sm text-gray-400">Egen pakke</p>
        <h1 className="mt-2 font-display text-5xl font-bold tracking-tighter text-gray-900">Lag egne kort</h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">Skriv ett spørsmål eller én utfordring per linje.</p>

        <div className="mt-8 w-full max-w-xs text-left">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-64 w-full resize-none rounded-2xl bg-gray-100 px-4 py-4 text-base font-semibold leading-relaxed text-gray-700 outline-none focus:ring-2 focus:ring-gray-900" placeholder="Ett kort per linje" />
          <p className="mt-2 text-center text-xs text-gray-400">{cards.length} / 100 kort · lagres på denne telefonen</p>
          <Button onClick={start} disabled={!cards.length} className="mt-5">Bland og start</Button>
        </div>
      </main>
    );
  }

  const finished = index >= deck.length;

  return (
    <main className="relative flex min-h-full flex-col overflow-hidden bg-white px-6 pb-8 pt-5 text-center">
      <header className="flex items-center justify-between">
        <button onClick={() => setDeck([])} className="min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500">← Rediger</button>
        <span className="text-xs font-bold text-gray-400">{Math.min(index + 1, deck.length)} / {deck.length}</span>
        <button onClick={start} className="icon-button bg-gray-100 text-gray-500" aria-label="Bland kortene på nytt"><RotateCcw size={17} /></button>
      </header>

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-8">
        <p className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold uppercase text-gray-400">Eget kort</p>
        <h1 className="mt-7 max-w-sm font-display text-4xl font-bold leading-tight text-gray-900">{finished ? "Alle kort er brukt" : deck[index]}</h1>
      </section>

      <div className="mx-auto w-full max-w-xs">
        {finished ? (
          <>
            <Button onClick={start}>Bland og spill igjen</Button>
            <Button variant="secondary" onClick={() => setDeck([])} className="mt-3">Rediger kort</Button>
          </>
        ) : (
          <Button onClick={() => {
            if (index === deck.length - 1) onComplete?.("custom-cards");
            setIndex((value) => value + 1);
          }}>Neste kort</Button>
        )}
      </div>
    </main>
  );
}
