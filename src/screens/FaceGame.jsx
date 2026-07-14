import { useState } from "react";
import Face from "../components/Face";

const COLS = { 9: 3, 16: 4, 25: 5, 36: 6 };

export default function FaceGame({ antall, onLose, onBonus, onBack, runde }) {
  const [angryIndex] = useState(() => Math.floor(Math.random() * antall));
  const [bonusIndex] = useState(() => (angryIndex + 1 + Math.floor(Math.random() * (antall - 1))) % antall);
  const [faceStates, setFaceStates] = useState(() => Array(antall).fill("idle"));

  const håndterTrykk = (i) => {
    if (faceStates[i] !== "idle") return;

    if (i === angryIndex) {
      setFaceStates((prev) => {
        const next = [...prev];
        next[i] = "angry";
        return next;
      });
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => onLose(), 450);
    } else if (i === bonusIndex) {
      setFaceStates((prev) => {
        const next = [...prev];
        next[i] = "bonus";
        return next;
      });
      if (navigator.vibrate) navigator.vibrate(35);
      setTimeout(() => onBonus(), 450);
    } else {
      if (navigator.vibrate) navigator.vibrate(15);
      setFaceStates((prev) => {
        const next = [...prev];
        next[i] = "removed";
        return next;
      });
    }
  };

  const cols = COLS[antall] || 4;
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden px-5 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-full bg-gray-100 px-4 py-2 font-body text-sm text-gray-500 transition-all duration-200 hover:bg-gray-200 active:scale-[0.95]"
        >
          ← Tilbake
        </button>
        <span className="font-body text-xs uppercase tracking-[0.25em] text-gray-400">
          Send rundt
        </span>
      </div>

      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">
          Trykk på et ansikt
        </h2>
        <p className="mt-1 font-body text-gray-400">
          Én av dem er sur. Send mobilen videre etter hvert trykk.
        </p>
      </div>

      <div
        className="mx-auto grid w-full max-w-md flex-1 content-center gap-2.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: antall }).map((_, i) => (
          <Face
            key={`${runde}-${i}`}
            state={faceStates[i] || "idle"}
            onClick={() => håndterTrykk(i)}
          />
        ))}
      </div>
    </div>
  );
}
