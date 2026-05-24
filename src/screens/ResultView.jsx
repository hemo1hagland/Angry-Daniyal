import { useMemo } from "react";
import Button from "../components/Button";
import { drawCard, MODES } from "../data/cards";

export default function ResultView({ modeId, customCards, onNext, onMenu }) {
  const kort = useMemo(
    () => drawCard(modeId, customCards),
    [modeId, customCards]
  );
  const modus = MODES.find((m) => m.id === modeId);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-2 animate-burst text-7xl">😡</div>

      <h2 className="mb-1 animate-floatUp font-display text-5xl font-bold tracking-tighter text-coral">
        Du tapte!
      </h2>
      <p
        className="mb-10 animate-floatUp font-body text-white/40"
        style={{ animationDelay: "0.08s" }}
      >
        Du traff det sinte ansiktet.
      </p>

      {/* Kort */}
      <div
        className="mb-12 w-full max-w-sm animate-floatUp rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 shadow-2xl"
        style={{ animationDelay: "0.16s" }}
      >
        <div className="mb-4 flex items-center justify-center gap-2 font-body text-xs uppercase tracking-[0.25em] text-white/40">
          <span>{modus?.emoji}</span>
          <span>{modus?.navn}</span>
        </div>
        <p className="font-display text-2xl font-semibold leading-snug text-white">
          {kort}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Button onClick={onNext}>Ny runde</Button>
        <Button variant="ghost" onClick={onMenu}>
          Tilbake til meny
        </Button>
      </div>
    </div>
  );
}
