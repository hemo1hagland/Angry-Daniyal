import { useState } from "react";
import Button from "../components/Button";
import { MODES } from "../data/cards";

export default function CustomCards({ customCards, setCustomCards, onBack }) {
  const [modus, setModus] = useState("klassisk");
  const [tekst, setTekst] = useState("");

  const liste = customCards[modus] || [];

  const leggTil = () => {
    const t = tekst.trim();
    if (!t) return;
    setCustomCards({
      ...customCards,
      [modus]: [...(customCards[modus] || []), t],
    });
    setTekst("");
  };

  const fjern = (i) => {
    setCustomCards({
      ...customCards,
      [modus]: liste.filter((_, idx) => idx !== i),
    });
  };

  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <button
        onClick={onBack}
        className="mb-8 self-start font-body text-sm text-white/40 transition hover:text-white/70"
      >
        ← Tilbake
      </button>

      <h2 className="mb-2 font-display text-4xl font-bold tracking-tight text-white">
        Egne kort
      </h2>
      <p className="mb-6 font-body text-white/50">
        Lag dine egne oppgaver. Lagres på denne enheten.
      </p>

      {/* Kategori-velger */}
      <div className="mb-5 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setModus(m.id)}
            className={`rounded-full px-4 py-2 font-body text-sm transition active:scale-95
              ${modus === m.id
                ? "bg-gradient-to-br from-coral to-peach text-ink font-semibold"
                : "bg-white/[0.04] text-white/60 border border-white/[0.06]"}`}
          >
            {m.emoji} {m.navn}
          </button>
        ))}
      </div>

      <div className="mb-5 flex gap-2">
        <input
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && leggTil()}
          placeholder="Skriv et eget kort…"
          maxLength={120}
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-body text-white placeholder-white/30 outline-none transition focus:border-coral/50"
        />
        <button
          onClick={leggTil}
          className="rounded-2xl bg-gradient-to-br from-coral to-peach px-6 font-display text-2xl font-bold text-ink active:scale-95"
        >
          +
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {liste.map((k, i) => (
          <div
            key={i}
            className="flex animate-floatUp items-start justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5"
          >
            <span className="font-body text-white/90">{k}</span>
            <button
              onClick={() => fjern(i)}
              className="shrink-0 font-body text-sm text-white/30 transition hover:text-coral"
            >
              ✕
            </button>
          </div>
        ))}
        {liste.length === 0 && (
          <p className="pt-8 text-center font-body text-white/25">
            Ingen egne kort i denne kategorien ennå
          </p>
        )}
      </div>
    </div>
  );
}
