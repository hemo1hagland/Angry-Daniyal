import { useState, useEffect } from "react";
import Face from "../components/Face";

const COLS = { 9: 3, 16: 4, 25: 5, 36: 6 };

export default function FaceGame({ antall, onLose, onBack, runde }) {
  const [angryIndex, setAngryIndex] = useState(null);
  const [faceStates, setFaceStates] = useState([]);

  useEffect(() => {
    setAngryIndex(Math.floor(Math.random() * antall));
    setFaceStates(Array(antall).fill("idle"));
  }, [antall, runde]);

  const håndterTrykk = (i) => {
    if (faceStates[i] !== "idle") return;

    if (i === angryIndex) {
      setFaceStates((prev) => {
        const next = [...prev];
        next[i] = "boom";
        return next;
      });
      if (navigator.vibrate) navigator.vibrate([60, 40, 120]);
      setTimeout(() => onLose(), 900);
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
    <div className="flex min-h-[100dvh] flex-col px-5 py-8">
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
          Én av dem er sur. Tør du?
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
