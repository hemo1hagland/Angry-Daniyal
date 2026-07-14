import { useEffect, useMemo, useState } from "react";
import Check from "lucide-react/dist/esm/icons/check.js";
import Copy from "lucide-react/dist/esm/icons/copy.js";
import Share2 from "lucide-react/dist/esm/icons/share-2.js";
import X from "lucide-react/dist/esm/icons/x.js";
import Button from "./Button";
import { PRODUCT } from "../config/product";
import { trackEvent } from "../lib/analytics";

export default function ShareSheet({ open, onClose, gameId, eventPack }) {
  const [qrSrc, setQrSrc] = useState("");
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(eventPack.shareUrl || PRODUCT.publicUrl);
    url.search = "";
    url.searchParams.set("install", "1");
    if (gameId) url.searchParams.set("game", gameId);
    if (eventPack.id !== "default") url.searchParams.set("event", eventPack.id);
    return url.toString();
  }, [eventPack, gameId]);

  useEffect(() => {
    if (!open || !shareUrl) return;
    let active = true;
    import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(shareUrl, {
        width: 420,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#151515", light: "#ffffff" },
      }),
    ).then((source) => {
      if (active) setQrSrc(source);
    });
    trackEvent("qr_code_displayed", { gameId: gameId || "app", eventId: eventPack.id });
    return () => {
      active = false;
    };
  }, [eventPack.id, gameId, open, shareUrl]);

  if (!open) return null;

  const closeSheet = () => {
    setCopied(false);
    onClose();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("textarea");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    trackEvent("share_button_clicked", { method: "copy", gameId: gameId || "app" });
  };

  const nativeShare = async () => {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({
        title: `Installer ${PRODUCT.name}`,
        text: "Åpne Vors og legg appen til på hjem-skjermen",
        url: shareUrl,
      });
      trackEvent("share_button_clicked", { method: "native", gameId: gameId || "app" });
    } catch (error) {
      if (error?.name !== "AbortError") await copyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-5" role="presentation" onMouseDown={closeSheet}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        className="sheet-enter w-full max-w-sm rounded-t-2xl bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Vors på mobilen</p>
            <h2 id="share-title" className="mt-1 font-display text-3xl font-bold text-slate-950">Installer appen</h2>
          </div>
          <button className="icon-button" onClick={closeSheet} aria-label="Lukk deling">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mx-auto mt-5 aspect-square w-full max-w-[250px] overflow-hidden rounded-2xl bg-gray-50 p-3">
          {qrSrc ? <img src={qrSrc} alt="QR-kode for å installere Vors" className="h-full w-full" /> : <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />}
        </div>
        <p className="mx-auto mt-3 max-w-xs text-center text-sm font-medium leading-snug text-slate-500">
          Skann med mobilkameraet for å åpne og installere Vors.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={copyLink} className="flex items-center justify-center gap-2 py-3">
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            {copied ? "Kopiert" : "Kopier lenke"}
          </Button>
          <Button onClick={nativeShare} className="flex items-center justify-center gap-2 py-3">
            <Share2 size={18} aria-hidden="true" /> Del
          </Button>
        </div>
      </section>
    </div>
  );
}
