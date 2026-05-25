import { useState } from "react";
import Button from "../components/Button";

const GRID_VALG = [9, 16, 25, 36];

export default function Landing({ onStart }) {
  const [antall, setAntall] = useState(16);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      {/* Logo med myk glød */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 animate-glowPulse bg-gradient-to-br from-coral/30 via-violet/20 to-gold/20 blur-[60px]" />
        <h1 className="font-display text-8xl font-bold tracking-tighter text-white">
          Vors
        </h1>
      </div>

      <p className="mb-1 font-body text-lg text-white/50">
        Trykk på ansiktene.
      </p>
      <p className="mb-12 font-body text-lg text-white/35">
        Én av dem er sur. Ikke vær uheldig.
      </p>

      {/* Antall ansikter */}
      <div className="mb-8 w-full max-w-xs">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.2em] text-white/30">
          Antall ansikter
        </p>
        <div className="grid grid-cols-4 gap-2">
          {GRID_VALG.map((n) => (
            <button
              key={n}
              onClick={() => setAntall(n)}
              className={`rounded-[12px] py-3 font-display text-lg font-bold transition-all duration-200 active:scale-[0.95]
                ${antall === n
                  ? "bg-white text-[#1a1a1a] shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
                  : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1]"}`}
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

      <p className="mt-16 font-body text-xs uppercase tracking-[0.3em] text-white/15">
        Vors · partyspill
      </p>
    </div>
  );
}
