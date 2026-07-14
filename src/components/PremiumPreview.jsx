import { useEffect } from "react";
import Crown from "lucide-react/dist/esm/icons/crown.js";
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
      <section role="dialog" aria-modal="true" aria-labelledby="premium-preview-title" className="sheet-enter w-full max-w-sm rounded-t-[28px] bg-[#f7f5f1] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-[28px]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-100 text-amber-800"><Crown size={21} aria-hidden="true" /></span>
          <button className="icon-button" onClick={onClose} aria-label="Lukk forhåndsvisning"><X size={20} aria-hidden="true" /></button>
        </div>
        <h2 id="premium-preview-title" className="mt-4 font-display text-3xl font-bold">{pack.name}</h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{pack.description}</p>
        <ul className="mt-5 space-y-2">
          {pack.preview.map((item) => <li key={item} className="rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm ring-1 ring-black/5">{item}</li>)}
        </ul>
        <div className="mt-5 rounded-xl bg-amber-100 px-4 py-3 text-sm font-medium text-amber-950">
          Planlagt engangskjøp: ca. {pack.priceNok || PRODUCT.oneTimePriceNok} kr. Ingen abonnement.
        </div>
      </section>
    </div>
  );
}
