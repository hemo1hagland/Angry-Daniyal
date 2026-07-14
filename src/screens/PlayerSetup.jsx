import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import Trash2 from "lucide-react/dist/esm/icons/trash-2.js";
import X from "lucide-react/dist/esm/icons/x.js";
import { useRef, useState } from "react";
import Button from "../components/Button";
import { PIECES } from "../data/vorsbyen";

export default function PlayerSetup({ game, players, onPlayersChange, onStart, onBack }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const maxPlayers = game.maxPlayers || 20;
  const canStart = players.length >= game.minPlayers && players.length <= maxPlayers;
  const showPieces = game.id === "vorsbyen";

  const addPlayer = () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Skriv inn et navn");
      return;
    }
    if (players.length >= maxPlayers) {
      setError(`Maks ${maxPlayers} spillere`);
      return;
    }
    if (players.some((player) => player.toLowerCase() === cleanName.toLowerCase())) {
      setError("Navnet er allerede lagt til");
      return;
    }
    onPlayersChange([...players, cleanName].slice(0, maxPlayers));
    setName("");
    setError("");
    inputRef.current?.focus();
  };

  return (
    <main className="relative flex h-full min-h-0 flex-col items-center overflow-y-auto overscroll-contain bg-white px-6 pb-[max(3rem,env(safe-area-inset-bottom))] pt-20 text-center touch-pan-y" style={{ WebkitOverflowScrolling: "touch" }}>
      <button className="absolute left-5 top-5 flex h-11 items-center gap-1 rounded-full bg-gray-100 px-4 font-body text-sm text-gray-500 transition active:scale-95" onClick={onBack} aria-label="Tilbake til spill">
        <ArrowLeft size={17} aria-hidden="true" /> Meny
      </button>

      <p className="mb-2 font-body text-sm text-gray-400">{game.name}</p>
      <h1 className="mb-3 font-display text-5xl font-bold tracking-tighter text-gray-900">Hvem er med?</h1>
      <p className="mb-8 max-w-xs font-body text-sm text-gray-400">{players.length} av {maxPlayers} spillere</p>

      <form className="flex w-full max-w-xs gap-2" onSubmit={(event) => { event.preventDefault(); addPlayer(); }}>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Spillernavn</span>
          <input ref={inputRef} value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="Legg til navn" autoComplete="off" maxLength={18} autoFocus className="h-14 w-full rounded-2xl bg-gray-100 px-4 font-display text-base font-bold text-gray-800 outline-none placeholder:font-body placeholder:font-normal placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900" />
        </label>
        <button type="submit" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gray-900 text-white transition active:scale-95 disabled:opacity-40" disabled={players.length >= maxPlayers} aria-label="Legg til spiller">
          <Plus size={23} aria-hidden="true" />
        </button>
      </form>
      <p className="mt-2 min-h-5 text-xs font-semibold text-red-500" role="status">{error}</p>

      <div className="mt-4 w-full max-w-xs">
        {players.length ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Spillere</span>
              <button onClick={() => { onPlayersChange([]); setError(""); }} className="flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-gray-400" aria-label="Fjern alle spillere"><Trash2 size={14} /> Fjern alle</button>
            </div>
            <ul className={showPieces ? "space-y-2" : "flex flex-wrap justify-center gap-2"} aria-label="Spillere">
            {players.map((player, index) => (
              <li key={player} className={`flex min-w-0 items-center gap-2 bg-gray-100 ${showPieces ? "w-full rounded-xl p-2.5" : "rounded-full py-2 pl-4 pr-2"}`}>
                {showPieces && <span className="h-9 w-2 shrink-0 rounded-full" style={{ background: PIECES[index]?.color }} />}
                <span className="min-w-0 flex-1 text-left">
                  <span className="block max-w-36 truncate font-display text-sm font-bold text-gray-700">{player}</span>
                  {showPieces && <span className="block text-xs font-semibold text-gray-400">{PIECES[index]?.name}-brikken</span>}
                </span>
                <button onClick={() => onPlayersChange(players.filter((item) => item !== player))} aria-label={`Fjern ${player}`} className="grid h-7 w-7 place-items-center rounded-full text-gray-400 hover:bg-gray-200">
                  <X size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
            </ul>
          </>
        ) : <p className="py-5 text-sm text-gray-300">Legg til minst {game.minPlayers} spillere</p>}
      </div>

      <div className="mt-7 w-full max-w-xs">
        <Button onClick={onStart} disabled={!canStart}>Start {game.name.toLowerCase()}</Button>
        {!canStart && players.length < game.minPlayers && <p className="mt-3 text-xs text-gray-300">Mangler {game.minPlayers - players.length} spiller{game.minPlayers - players.length === 1 ? "" : "e"}</p>}
        {players.length > maxPlayers && <p className="mt-3 text-xs text-gray-300">Maks {maxPlayers} spillere i {game.name}</p>}
      </div>
    </main>
  );
}
