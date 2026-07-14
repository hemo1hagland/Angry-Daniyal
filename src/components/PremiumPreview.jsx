import { useEffect } from "react";
import X from "lucide-react/dist/esm/icons/x.js";
import { PRODUCT } from "../config/product";
import { trackEvent } from "../lib/analytics";

export default function PremiumPreview({ pack, onClose }) {
  useEffect(() => {
    if (pack) trackEvent("premium_pack_viewed", { packId: pack.id });
  }, [pack]);

  if (!pack) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-5" role="presentation" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="premium-preview-title" className="sheet-enter w-full max-w-sm rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-gray-300">Forhåndsvisning</span>
          <button className="icon-button" onClick={onClose} aria-label="Lukk forhåndsvisning"><X size={20} aria-hidden="true" /></button>
        </div>
        <h2 id="premium-preview-title" className="mt-4 font-display text-3xl font-bold">{pack.name}</h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{pack.description}</p>
        <ul className="mt-5 space-y-2">
          {pack.preview.map((item) => <li key={item} className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600">{item}</li>)}
        </ul>
        <div className="mt-5 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-500">
          Planlagt engangskjøp: ca. {pack.priceNok || PRODUCT.oneTimePriceNok} kr. Ingen abonnement.
        </div>
      </section>
    </div>
  );
}
