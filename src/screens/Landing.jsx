import { useState } from "react";
import Button from "../components/Button";

const GRID_VALG = [9, 16, 25, 36];

export default function Landing({ onStart }) {
  const [antall, setAntall] = useState(16);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      {/* Logo */}
      <h1 className="mb-6 font-display text-8xl font-bold tracking-tighter text-gray-900">
        Vors
      </h1>

      <p className="mb-1 font-body text-lg text-gray-500">
        Trykk på ansiktene.
      </p>
      <p className="mb-12 font-body text-lg text-gray-400">
        Én av dem er sur. Ikke vær uheldig.
      </p>

      {/* Antall ansikter */}
      <div className="mb-8 w-full max-w-xs">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.2em] text-gray-400">
          Antall ansikter
        </p>
        <div className="grid grid-cols-4 gap-2">
          {GRID_VALG.map((n) => (
            <button
              key={n}
              onClick={() => setAntall(n)}
              className={`rounded-[12px] py-3 font-display text-lg font-bold transition-all duration-200 active:scale-[0.95]
                ${antall === n
                  ? "bg-gray-900 text-white shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-xs">
        <Button onClick={() => onStart(antall)}>
          Start spill
        </Button>
      </div>

      <p className="mt-16 font-body text-xs uppercase tracking-[0.3em] text-gray-300">
        Vors · partyspill
      </p>
    </div>
  );
}
