import { useState } from "react";
import Button from "../components/Button";

export default function Players({ players, setPlayers, onNext, onBack }) {
  const [navn, setNavn] = useState("");

  const leggTil = () => {
    const trimmet = navn.trim();
    if (!trimmet) return;
    if (players.some((p) => p.toLowerCase() === trimmet.toLowerCase())) {
      setNavn("");
      return;
    }
    setPlayers([...players, trimmet]);
    setNavn("");
  };

  const fjern = (i) => setPlayers(players.filter((_, idx) => idx !== i));

  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <button
        onClick={onBack}
        className="mb-8 self-start font-body text-sm text-white/40 transition hover:text-white/70"
      >
        ← Tilbake
      </button>

      <h2 className="mb-2 font-display text-4xl font-bold tracking-tight text-white">
        Hvem er med?
      </h2>
      <p className="mb-8 font-body text-white/50">
        Legg til alle som spiller. Minst 2.
      </p>

      <div className="mb-4 flex gap-2">
        <input
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && leggTil()}
          placeholder="Navn"
          maxLength={20}
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-body text-lg text-white placeholder-white/30 outline-none transition focus:border-ember/50"
        />
        <button
          onClick={leggTil}
          className="rounded-2xl bg-gradient-to-br from-ember to-gold px-6 font-display text-2xl font-bold text-ink active:scale-95"
        >
          +
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {players.map((p, i) => (
          <div
            key={i}
            className="flex animate-floatUp items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5"
          >
            <span className="font-body text-lg text-white">{p}</span>
            <button
              onClick={() => fjern(i)}
              className="font-body text-sm text-white/30 transition hover:text-ember"
            >
              ✕
            </button>
          </div>
        ))}
        {players.length === 0 && (
          <p className="pt-8 text-center font-body text-white/25">
            Ingen spillere ennå
          </p>
        )}
      </div>

      <div className="pt-6">
        <Button onClick={onNext} disabled={players.length < 2}>
          Videre {players.length >= 2 && `(${players.length})`}
        </Button>
      </div>
    </div>
  );
}
