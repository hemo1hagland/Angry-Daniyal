import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Share2 from "lucide-react/dist/esm/icons/share-2.js";
import Button from "../components/Button";
import { GAMES, PREMIUM_PACKS } from "../config/product";

export default function GameMenu({ onSelect, onBack, onShare, eventPack, onPremiumPreview }) {
  const availableGames = GAMES.filter((game) => eventPack.games.includes(game.id));

  return (
    <main className="relative flex min-h-full flex-col items-center overflow-y-auto bg-white px-6 pb-12 pt-24 text-center">
      <button className="absolute left-5 top-5 flex h-11 items-center gap-1 rounded-full bg-gray-100 px-4 font-body text-sm text-gray-500 transition active:scale-95" onClick={onBack} aria-label="Tilbake til forsiden">
        <ArrowLeft size={17} aria-hidden="true" /> Meny
      </button>
      <button className="icon-button absolute right-5 top-5 bg-gray-100 text-gray-500" onClick={onShare} aria-label="Installer appen" title="Installer appen">
        <Share2 size={18} aria-hidden="true" />
      </button>

      <h1 className="mb-4 font-display text-7xl font-bold tracking-tighter text-gray-900">Vors</h1>
      <p className="mb-12 max-w-xs font-body text-lg text-gray-400">Velg spill og send mobilen rundt bordet.</p>

      <div className="w-full max-w-xs space-y-3">
        {availableGames.map((game, index) => (
          <Button key={game.id} variant={index % 2 ? "secondary" : "primary"} onClick={() => onSelect(game.id)}>
            {game.name}
          </Button>
        ))}
      </div>

      <section className="mt-12 w-full max-w-xs" aria-labelledby="premium-title">
        <h2 id="premium-title" className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-gray-300">Flere pakker</h2>
        <div className="space-y-2">
          {PREMIUM_PACKS.map((pack) => (
            <button key={pack.id} onClick={() => onPremiumPreview(pack)} className="w-full rounded-2xl bg-gray-50 px-5 py-3 text-left transition active:scale-[0.98]">
              <span className="block font-display text-sm font-bold text-gray-500">{pack.name}</span>
              <span className="mt-0.5 block text-xs text-gray-300">Åpne pakken</span>
            </button>
          ))}
        </div>
      </section>

      <p className="mt-12 max-w-xs font-body text-xs leading-relaxed text-gray-300">Spill utviklet av Torbjørn Hagland og Daniyal Chaudhry. Alle rettigheter reservert.</p>
    </main>
  );
}
