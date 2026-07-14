import { useState } from "react";
import Sparkles from "lucide-react/dist/esm/icons/sparkles.js";
import Button from "../components/Button";
import { FACE } from "../data/faces";

function PlayerChoices({ players, selected, onSelect, label }) {
  return (
    <section>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">{label}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {players.map((player) => (
          <button key={player} onClick={() => onSelect(player)} className={`min-h-11 rounded-xl px-4 font-display text-sm font-bold transition active:scale-95 ${selected === player ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>{player}</button>
        ))}
      </div>
    </section>
  );
}

export default function FaceBonus({ players, onNext, onMenu }) {
  const [drinkTarget, setDrinkTarget] = useState("");
  const [nextPlayer, setNextPlayer] = useState("");
  const canContinue = players.length ? drinkTarget && nextPlayer : true;

  return (
    <main className="flex min-h-full flex-col items-center overflow-y-auto bg-white px-6 py-10 text-center">
      <div className="relative mt-2 h-44 w-36 overflow-hidden rounded-3xl bg-white ring-2 ring-amber-200 shadow-lg">
        <img src={FACE.bonus} alt="Bonusdame" className="h-full w-full object-cover object-top" />
        <span className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-amber-600 shadow"><Sparkles size={19} /></span>
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Skjult bonus</p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-tighter text-gray-900">Bonus!</h1>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">Du fant bonusansiktet. Del ut 2 slurker og bestem hvem som trykker først i neste runde.</p>

      {players.length ? (
        <div className="mt-8 w-full max-w-xs space-y-7">
          <PlayerChoices players={players} selected={drinkTarget} onSelect={setDrinkTarget} label="Hvem får 2 slurker?" />
          <PlayerChoices players={players} selected={nextPlayer} onSelect={setNextPlayer} label="Hvem trykker neste?" />
        </div>
      ) : <p className="mt-8 rounded-2xl bg-gray-100 px-5 py-4 text-sm font-bold text-gray-600">Del ut 2 slurker og send mobilen til valgfri spiller.</p>}

      <div className="mt-9 w-full max-w-xs space-y-2">
        <Button disabled={!canContinue} onClick={() => onNext(nextPlayer || null)}>Start neste runde</Button>
        <Button variant="ghost" onClick={onMenu}>Tilbake til meny</Button>
      </div>
    </main>
  );
}
