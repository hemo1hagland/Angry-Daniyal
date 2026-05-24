import { useState, useEffect, useRef } from "react";
import Face from "../components/Face";
import { buildFaceGrid } from "../data/faces";

// Beregner et balansert kolonneantall for et gitt rutenett.
const COLS = { 9: 3, 16: 4, 25: 5, 36: 6 };

export default function FaceGame({ antall, onLose, onBack, runde }) {
  const [angryIndex, setAngryIndex] = useState(null);
  const [faceStates, setFaceStates] = useState([]); // "idle" | "removed" | "boom"
  const facePairs = useRef([]);

  // Ny runde: velg skjult sint ansikt + tilfeldige ansiktspar.
  useEffect(() => {
    setAngryIndex(Math.floor(Math.random() * antall));
    setFaceStates(Array(antall).fill("idle"));
    facePairs.current = buildFaceGrid(antall);
  }, [antall, runde]);

  const håndterTrykk = (i) => {
    if (faceStates[i] !== "idle") return;

    if (i === angryIndex) {
      // BOMBE! Vis sint ansikt
      setFaceStates((prev) => {
        const next = [...prev];
        next[i] = "boom";
        return next;
      });
      if (navigator.vibrate) navigator.vibrate([60, 40, 120]);
      setTimeout(() => onLose(), 900);
    } else {
      // Trygt — fade ut ansiktet
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
    <div className="flex min-h-full flex-col px-5 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="font-body text-sm text-white/40 transition hover:text-white/70"
        >
          ← Meny
        </button>
        <span className="font-body text-xs uppercase tracking-[0.25em] text-white/30">
          Send rundt
        </span>
      </div>

      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">
          Trykk på et ansikt
        </h2>
        <p className="mt-1 font-body text-white/45">
          Én av dem er sur. Tør du?
        </p>
      </div>

      <div
        className="mx-auto grid w-full max-w-md flex-1 content-center gap-2.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {facePairs.current.map((pair, i) => (
          <Face
            key={`${runde}-${i}`}
            pair={pair}
            state={faceStates[i] || "idle"}
            onClick={() => håndterTrykk(i)}
          />
        ))}
      </div>
    </div>
  );
}
