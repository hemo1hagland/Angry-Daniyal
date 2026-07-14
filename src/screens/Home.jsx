import Download from "lucide-react/dist/esm/icons/download.js";
import Share2 from "lucide-react/dist/esm/icons/share-2.js";
import Sparkles from "lucide-react/dist/esm/icons/sparkles.js";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import AlcoholFreeToggle from "../components/AlcoholFreeToggle";
import { PRODUCT } from "../config/product";
import { FACE } from "../data/faces";

export default function Home({ onStart, onShare, alcoholFree, onAlcoholFreeChange, eventPack }) {
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
    <main className="home-screen min-h-full overflow-y-auto text-slate-950" style={{ backgroundColor: eventPack.theme.surface }}>
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <header className="flex items-center justify-between">
          {eventPack.logo ? <img src={eventPack.logo} alt={eventPack.name} className="h-9 max-w-36 object-contain object-left" /> : <span className="font-display text-xl font-bold">{eventPack.name}</span>}
          <div className="flex gap-2">
            {installPrompt && (
              <button className="icon-button bg-white" onClick={install} aria-label="Installer appen" title="Installer appen">
                <Download size={19} aria-hidden="true" />
              </button>
            )}
            <button className="icon-button bg-white" onClick={onShare} aria-label="Del spillet" title="Del spillet">
              <Share2 size={19} aria-hidden="true" />
            </button>
          </div>
        </header>

        <section className="relative mt-5 overflow-hidden rounded-[28px] px-5 pb-5 pt-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]" style={{ backgroundColor: eventPack.theme.primary }}>
          <div className="absolute right-[-12px] top-3 h-48 w-48 rotate-6 overflow-hidden rounded-[38px]" style={{ backgroundColor: eventPack.theme.secondary }}>
            <img src={FACE.happy} alt="" className="h-full w-full object-cover object-top opacity-95" />
          </div>
          <div className="relative z-10 max-w-[66%]">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#f4bf48]">
              <Sparkles size={14} aria-hidden="true" /> Partyspill
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold leading-[0.95]">{PRODUCT.name}</h1>
            <p className="mt-3 text-sm font-medium leading-snug text-white/70">{eventPack.introduction}</p>
          </div>
          <div className="relative z-10 mt-20">
            <Button onClick={onStart} style={{ backgroundColor: eventPack.theme.secondary, color: eventPack.theme.primary }} className="w-full py-4 text-lg">
              Start spill
            </Button>
          </div>
        </section>

        <div className="mt-4">
          <AlcoholFreeToggle checked={alcoholFree} onChange={onAlcoholFreeChange} />
        </div>

        <section className="mt-5 grid grid-cols-3 gap-2" aria-label="Spillfordeler">
          <div className="stat-tile"><strong>5</strong><span>spill</span></div>
          <div className="stat-tile"><strong>0</strong><span>kontoer</span></div>
          <div className="stat-tile"><strong>1</strong><span>mobil</span></div>
        </section>

        <p className="mt-auto px-2 pt-7 text-center text-xs font-medium leading-relaxed text-slate-500">
          {PRODUCT.responsibleUse} Aldersgrenser for alkohol gjelder.
        </p>
        {eventPack.sponsor && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
            <span>I samarbeid med</span>
            {eventPack.sponsor.logo ? <img src={eventPack.sponsor.logo} alt={eventPack.sponsor.name} className="h-5 max-w-24 object-contain" /> : <span>{eventPack.sponsor.name}</span>}
          </div>
        )}
      </div>
    </main>
  );
}
