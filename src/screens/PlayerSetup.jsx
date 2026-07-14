import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import X from "lucide-react/dist/esm/icons/x.js";
import { useState } from "react";
import AlcoholFreeToggle from "../components/AlcoholFreeToggle";
import Button from "../components/Button";

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
    <main className="relative flex min-h-full flex-col items-center overflow-y-auto bg-white px-6 pb-12 pt-24 text-center">
      <button className="absolute left-5 top-5 flex h-11 items-center gap-1 rounded-full bg-gray-100 px-4 font-body text-sm text-gray-500 transition active:scale-95" onClick={onBack} aria-label="Tilbake til spill">
        <ArrowLeft size={17} aria-hidden="true" /> Meny
      </button>

      <p className="mb-2 font-body text-sm text-gray-400">{game.name}</p>
      <h1 className="mb-3 font-display text-5xl font-bold tracking-tighter text-gray-900">Hvem er med?</h1>
      <p className="mb-10 max-w-xs font-body text-sm text-gray-400">Navnene lagres bare på denne mobilen.</p>

      <div className="flex w-full max-w-xs gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Spillernavn</span>
          <input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addPlayer()} placeholder="Legg til navn" autoComplete="off" className="h-14 w-full rounded-2xl bg-gray-100 px-4 font-display text-base font-bold text-gray-800 outline-none placeholder:font-body placeholder:font-normal placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900" />
        </label>
        <button className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gray-900 text-white transition active:scale-95" onClick={addPlayer} aria-label="Legg til spiller">
          <Plus size={23} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 w-full max-w-xs">
        {players.length ? (
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Spillere">
            {players.map((player) => (
              <li key={player} className="flex min-w-0 items-center gap-2 rounded-full bg-gray-100 py-2 pl-4 pr-2">
                <span className="max-w-32 truncate font-display text-sm font-bold text-gray-600">{player}</span>
                <button onClick={() => onPlayersChange(players.filter((item) => item !== player))} aria-label={`Fjern ${player}`} className="grid h-7 w-7 place-items-center rounded-full text-gray-400 hover:bg-gray-200">
                  <X size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : <p className="py-5 text-sm text-gray-300">Legg til minst {game.minPlayers} spillere</p>}
      </div>

      <div className="mt-7 w-full max-w-xs">
        <AlcoholFreeToggle checked={alcoholFree} onChange={onAlcoholFreeChange} compact />
      </div>
      <div className="mt-4 w-full max-w-xs">
        <Button onClick={onStart} disabled={!canStart}>Start {game.name.toLowerCase()}</Button>
        {!canStart && <p className="mt-3 text-xs text-gray-300">Mangler {game.minPlayers - players.length} spiller{game.minPlayers - players.length === 1 ? "" : "e"}</p>}
      </div>
    </main>
  );
}
