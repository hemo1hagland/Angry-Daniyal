import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right.js";
import Crown from "lucide-react/dist/esm/icons/crown.js";
import Dices from "lucide-react/dist/esm/icons/dices.js";
import LockKeyhole from "lucide-react/dist/esm/icons/lock-keyhole.js";
import Share2 from "lucide-react/dist/esm/icons/share-2.js";
import { GAMES, PREMIUM_PACKS } from "../config/product";

const ICON_LABELS = { faces: "🙂", wheel: "◎", cards: "♠", horse: "♞", golf: "⚑" };

export default function GameMenu({ onSelect, onBack, onShare, eventPack, onPremiumPreview }) {
  const availableGames = GAMES.filter((game) => eventPack.games.includes(game.id));

  return (
    <main className="min-h-full overflow-y-auto bg-[#f5f3ef] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 text-slate-950">
      <div className="mx-auto w-full max-w-md">
        <header className="flex items-center justify-between">
          <button className="icon-button bg-white" onClick={onBack} aria-label="Tilbake til forsiden"><ArrowLeft size={20} aria-hidden="true" /></button>
          <span className="text-xs font-bold uppercase text-slate-500">1 av 2</span>
          <button className="icon-button bg-white" onClick={onShare} aria-label="Del spill"><Share2 size={19} aria-hidden="true" /></button>
        </header>

        <div className="mt-7">
          <p className="flex items-center gap-1.5 text-sm font-bold text-[#ef5b45]"><Dices size={17} aria-hidden="true" /> Spillbibliotek</p>
          <h1 className="mt-1 font-display text-4xl font-bold leading-tight">Hva skal vi spille?</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Alle spill fungerer med eller uten alkohol.</p>
        </div>

        <section className="mt-6 space-y-3" aria-label="Tilgjengelige spill">
          {availableGames.map((game) => (
            <button key={game.id} onClick={() => onSelect(game.id)} className="game-row group w-full text-left">
              <span className="game-icon" style={{ backgroundColor: game.accent }} aria-hidden="true">{ICON_LABELS[game.icon]}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold text-slate-950">{game.name}</span>
                <span className="mt-0.5 block text-xs font-medium leading-snug text-slate-500">{game.description}</span>
              </span>
              <ChevronRight size={20} className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          ))}
        </section>

        <section className="mt-8" aria-labelledby="premium-title">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-700"><Crown size={15} aria-hidden="true" /> Premium</p>
              <h2 id="premium-title" className="mt-1 font-display text-2xl font-bold">Flere pakker</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Kommer senere</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {PREMIUM_PACKS.map((pack) => (
              <button key={pack.id} onClick={() => onPremiumPreview(pack)} className="min-h-40 overflow-hidden rounded-2xl border border-black/10 bg-white p-4 text-left shadow-sm transition active:scale-[0.98]">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-amber-800"><LockKeyhole size={17} aria-hidden="true" /></span>
                <span className="mt-5 block font-display text-base font-bold leading-tight">{pack.name}</span>
                <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">Forhåndsvis innhold</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
