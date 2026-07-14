import { useEffect, useState } from "react";
import Download from "lucide-react/dist/esm/icons/download.js";
import Share2 from "lucide-react/dist/esm/icons/share-2.js";
import X from "lucide-react/dist/esm/icons/x.js";
import Button from "./Button";
import { trackEvent } from "../lib/analytics";

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

export default function InstallSheet({ open, onClose }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => typeof window !== "undefined" && isStandalone());

  useEffect(() => {
    const handlePrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      trackEvent("app_installed");
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (open) trackEvent("install_guide_opened", { platform: isIos() ? "ios" : "other" });
  }, [open]);

  if (!open) return null;

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    trackEvent("install_prompt_answered", { outcome: choice.outcome });
    if (choice.outcome === "accepted") setInstallPrompt(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 sm:items-center sm:p-5" role="presentation" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="install-title" className="sheet-enter w-full max-w-sm rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Vors på mobilen</p>
            <h2 id="install-title" className="mt-1 font-display text-3xl font-bold text-gray-900">Installer appen</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Lukk installasjon"><X size={20} /></button>
        </div>

        {installed ? (
          <div className="mt-6 rounded-2xl bg-gray-100 px-5 py-5 text-center">
            <p className="font-display text-lg font-bold text-gray-700">Vors er allerede installert</p>
            <p className="mt-1 text-sm text-gray-400">Åpne appen fra hjem-skjermen.</p>
          </div>
        ) : installPrompt ? (
          <>
            <div className="mx-auto mt-7 grid h-16 w-16 place-items-center rounded-2xl bg-gray-900 text-white"><Download size={28} /></div>
            <p className="mx-auto mt-5 max-w-xs text-center text-sm leading-relaxed text-gray-500">Installer Vors som en vanlig app. Den åpnes i fullskjerm og fungerer også ved ustabilt nett.</p>
            <Button onClick={install} className="mt-6">Installer appen</Button>
          </>
        ) : isIos() ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-4 rounded-2xl bg-gray-100 px-4 py-4 text-left">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-gray-700"><Share2 size={20} /></span>
              <p className="text-sm font-semibold text-gray-600"><strong className="block text-gray-900">1. Trykk Del</strong>Bruk deleikonet nederst i Safari.</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-gray-100 px-4 py-4 text-left">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white font-display text-2xl text-gray-700">+</span>
              <p className="text-sm font-semibold text-gray-600"><strong className="block text-gray-900">2. Legg til på Hjem-skjermen</strong>Bekreft med «Legg til».</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-gray-100 px-5 py-5 text-center">
            <p className="font-display text-lg font-bold text-gray-700">Åpne nettlesermenyen</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">Velg «Installer app» eller «Legg til på startsiden». Bruk Safari på iPhone eller Chrome på Android.</p>
          </div>
        )}
      </section>
    </div>
  );
}
