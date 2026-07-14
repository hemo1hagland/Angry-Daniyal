import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw.js";
import Button from "../components/Button";
import { DRINKING_QUESTIONS } from "../data/drinkingQuestions";
import { useState } from "react";

const shuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

export default function QuestionGame({ onBack, alcoholFree = false, onComplete }) {
  const [questions, setQuestions] = useState(() => shuffle(DRINKING_QUESTIONS));
  const [index, setIndex] = useState(0);
  const question = questions[index];
  const finished = index >= questions.length;

  const restart = () => {
    setQuestions(shuffle(DRINKING_QUESTIONS));
    setIndex(0);
  };

  const next = () => {
    if (index === questions.length - 1) onComplete?.("questions");
    setIndex((value) => value + 1);
  };

  if (finished) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center bg-white px-6 py-12 text-center">
        <p className="font-body text-sm text-gray-400">Alle spørsmål er brukt</p>
        <h1 className="mt-2 font-display text-6xl font-bold tracking-tighter text-gray-900">Ferdig!</h1>
        <div className="mt-12 w-full max-w-xs space-y-3">
          <Button onClick={restart}>Bland og spill igjen</Button>
          <Button variant="secondary" onClick={onBack}>Til meny</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-full flex-col overflow-hidden bg-white px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 text-center">
      <header className="flex shrink-0 items-center justify-between">
        <button onClick={onBack} className="min-h-11 rounded-full bg-gray-100 px-4 font-body text-sm text-gray-500 transition active:scale-95">← Meny</button>
        <span className="font-body text-xs font-bold text-gray-400">{index + 1} / {questions.length}</span>
        <button onClick={restart} className="icon-button bg-gray-100 text-gray-500" aria-label="Bland spørsmålene på nytt" title="Bland på nytt">
          <RotateCcw size={17} aria-hidden="true" />
        </button>
      </header>

      <div className="mt-5 h-1 shrink-0 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
        <div className="h-full rounded-full bg-gray-900 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-8">
        <p className="rounded-full bg-gray-100 px-4 py-2 font-body text-xs font-bold uppercase text-gray-400">{question.category}</p>
        <h1 className="mt-7 max-w-sm font-display text-4xl font-bold leading-tight text-gray-900">{question.text}</h1>
        <p className="mt-7 max-w-xs font-body text-base leading-relaxed text-gray-400">Pek samtidig på den som passer best.</p>
      </section>

      <div className="mx-auto w-full max-w-xs shrink-0">
        <p className="mb-4 rounded-2xl bg-gray-100 px-4 py-3 font-body text-sm font-semibold text-gray-500">
          {alcoholFree ? "Flest pek gir 1 poeng." : "Flest pek kan ta 1 valgfri slurk."}
        </p>
        <Button onClick={next}>Neste spørsmål</Button>
      </div>
    </main>
  );
}
