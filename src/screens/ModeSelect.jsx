import { useState } from "react";
import Button from "../components/Button";
import { MODES } from "../data/cards";

const GRID_VALG = [9, 16, 25, 36];

export default function ModeSelect({ onStart, onBack }) {
  const [valgtModus, setValgtModus] = useState("klassisk");
  const [antall, setAntall] = useState(16);

  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <button
        onClick={onBack}
        className="mb-8 self-start font-body text-sm text-white/40 transition hover:text-white/70"
      >
        ← Tilbake
      </button>

      <h2 className="mb-2 font-display text-4xl font-bold tracking-tight text-white">
        Velg modus
      </h2>
      <p className="mb-6 font-body text-white/50">
        Hva slags oppgaver vil dere ha?
      </p>

      <div className="mb-8 grid grid-cols-2 gap-3">
        {MODES.map((m) => {
          const aktiv = valgtModus === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setValgtModus(m.id)}
              className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 active:scale-95
                ${aktiv
                  ? "border-ember/60 bg-gradient-to-br " + m.farge
                  : "border-white/[0.06] bg-white/[0.03]"}`}
            >
              <div className="mb-1 text-3xl">{m.emoji}</div>
              <div className="font-display text-base font-semibold leading-tight text-white">
                {m.navn}
              </div>
              <div className="mt-1 font-body text-xs leading-snug text-white/45">
                {m.beskrivelse}
              </div>
            </button>
          );
        })}
      </div>

      <h3 className="mb-3 font-display text-lg font-semibold text-white">
        Antall ansikter
      </h3>
      <div className="mb-auto grid grid-cols-4 gap-2">
        {GRID_VALG.map((n) => (
          <button
            key={n}
            onClick={() => setAntall(n)}
            className={`rounded-xl py-3 font-display text-lg font-bold transition-all active:scale-95
              ${antall === n
                ? "bg-gradient-to-br from-ember to-gold text-ink"
                : "bg-white/[0.04] text-white/60 border border-white/[0.06]"}`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="pt-8">
        <Button onClick={() => onStart(valgtModus, antall)}>
          Start spill
        </Button>
      </div>
    </div>
  );
}
