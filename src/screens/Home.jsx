import Download from "lucide-react/dist/esm/icons/download.js";
import Share2 from "lucide-react/dist/esm/icons/share-2.js";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { PRODUCT } from "../config/product";

export default function Home({ onStart, onShare, eventPack }) {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handlePrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  };

  return (
    <main className="relative h-full min-h-0 overflow-y-auto overscroll-contain bg-white text-center text-gray-900 touch-pan-y" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="absolute right-5 top-5 flex gap-2">
        {installPrompt && (
          <button className="icon-button bg-gray-100 text-gray-500" onClick={install} aria-label="Installer appen" title="Installer appen">
            <Download size={18} aria-hidden="true" />
          </button>
        )}
        <button className="icon-button bg-gray-100 text-gray-500" onClick={onShare} aria-label="Installer appen" title="Installer appen">
          <Share2 size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="flex min-h-full w-full flex-col items-center justify-center px-6 pb-10 pt-20">
        {eventPack.logo && <img src={eventPack.logo} alt={eventPack.name} className="mb-5 h-9 max-w-40 object-contain" />}
        <h1 className="mb-5 font-display text-7xl font-bold tracking-tighter text-gray-900">{PRODUCT.name}</h1>
        <p className="mb-10 max-w-xs font-body text-lg text-gray-500">Velg spill og send mobilen rundt bordet.</p>

        <div className="w-full max-w-xs">
          <Button onClick={onStart}>Start spill</Button>
        </div>

        <p className="mt-10 max-w-xs font-body text-xs leading-relaxed text-gray-300">
          {PRODUCT.responsibleUse} Aldersgrenser for alkohol gjelder.
        </p>
        {eventPack.sponsor && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>I samarbeid med</span>
            {eventPack.sponsor.logo ? <img src={eventPack.sponsor.logo} alt={eventPack.sponsor.name} className="h-5 max-w-24 object-contain" /> : <span>{eventPack.sponsor.name}</span>}
          </div>
        )}
      </div>
    </main>
  );
}
