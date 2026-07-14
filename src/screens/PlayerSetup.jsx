import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Play from "lucide-react/dist/esm/icons/play.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import UserRound from "lucide-react/dist/esm/icons/user-round.js";
import X from "lucide-react/dist/esm/icons/x.js";
import { useState } from "react";
import Button from "../components/Button";
import AlcoholFreeToggle from "../components/AlcoholFreeToggle";

export default function PlayerSetup({ game, players, onPlayersChange, onStart, onBack, alcoholFree, onAlcoholFreeChange }) {
  const [name, setName] = useState("");
  const canStart = players.length >= game.minPlayers;

  const addPlayer = () => {
    const cleanName = name.trim();
    if (!cleanName || players.some((player) => player.toLowerCase() === cleanName.toLowerCase())) return;
    onPlayersChange([...players, cleanName].slice(0, 20));
    setName("");
  };

  return (
    <main className="min-h-full overflow-y-auto bg-[#f5f3ef] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 text-slate-950">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
        <header className="flex items-center justify-between">
          <button className="icon-button bg-white" onClick={onBack} aria-label="Tilbake til spill">
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <span className="text-xs font-bold uppercase text-slate-500">2 av 2</span>
        </header>

        <div className="mt-7">
          <p className="text-sm font-bold" style={{ color: game.accent }}>{game.name}</p>
          <h1 className="mt-1 font-display text-4xl font-bold leading-tight">Hvem er med?</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Navnene lagres bare på denne enheten.</p>
        </div>

        <div className="mt-6 flex gap-2">
          <label className="relative min-w-0 flex-1">
            <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} aria-hidden="true" />
            <span className="sr-only">Spillernavn</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && addPlayer()}
              placeholder="Legg til navn"
              autoComplete="off"
              className="h-14 w-full rounded-2xl border border-black/10 bg-white pl-11 pr-4 font-display text-base font-bold outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15"
            />
          </label>
          <button className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm transition active:scale-95" onClick={addPlayer} aria-label="Legg til spiller">
            <Plus size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 min-h-36 rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
          {players.length ? (
            <ul className="grid grid-cols-2 gap-2" aria-label="Spillere">
              {players.map((player, index) => (
                <li key={player} className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-display text-sm font-bold">{player}</span>
                  <button onClick={() => onPlayersChange(players.filter((item) => item !== player))} aria-label={`Fjern ${player}`} className="text-slate-400 hover:text-slate-950">
                    <X size={16} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid min-h-28 place-items-center text-center text-sm font-medium text-slate-400">
              Legg til minst {game.minPlayers} spillere
            </div>
          )}
        </div>

        <div className="mt-4">
          <AlcoholFreeToggle checked={alcoholFree} onChange={onAlcoholFreeChange} compact />
        </div>

        <div className="mt-auto pt-8">
          <Button onClick={onStart} disabled={!canStart} className="flex w-full items-center justify-center gap-2 py-4 text-lg">
            <Play size={20} fill="currentColor" aria-hidden="true" /> Start {game.name.toLowerCase()}
          </Button>
          {!canStart && <p className="mt-2 text-center text-xs font-medium text-slate-500">Mangler {game.minPlayers - players.length} spiller{game.minPlayers - players.length === 1 ? "" : "e"}</p>}
        </div>
      </div>
    </main>
  );
}
