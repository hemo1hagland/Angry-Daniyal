// Ansikts-komponent med kule animasjoner.
// state: "idle" | "removed" | "boom"

import { FACE } from "../data/faces";

export default function Face({ state = "idle", onClick }) {
  const isBoom = state === "boom";
  const isRemoved = state === "removed";
  const src = isBoom ? FACE.angry : FACE.happy;

  return (
    <div className="relative">
      {/* Pulserende ring-effekt ved bombe */}
      {isBoom && (
        <div className="absolute inset-0 animate-pulseRing rounded-2xl ring-4 ring-red-400/40" />
      )}

      <button
        onClick={state === "idle" ? onClick : undefined}
        disabled={state !== "idle"}
        className={`relative aspect-square w-full overflow-hidden rounded-2xl transition-all
          ${isBoom
            ? "animate-boomIn ring-2 ring-red-400/60 shadow-[0_0_24px_-4px_rgba(239,68,68,0.4)] bg-red-50 z-10"
            : isRemoved
              ? "animate-popOut pointer-events-none"
              : "bg-gray-100 active:scale-[0.92] hover:bg-gray-50 ring-1 ring-gray-200/60 cursor-pointer shadow-sm hover:shadow-lg hover:ring-gray-300/60 transition-all duration-200"
          }`}
        aria-label={isBoom ? "Sint ansikt" : "Ansikt"}
      >
        <img
          src={src}
          alt={isBoom ? "Sint karakter" : "Glad karakter"}
          className={`h-full w-full object-cover object-top select-none transition-transform duration-300
            ${isBoom ? "scale-110" : ""}`}
          draggable={false}
        />

        {/* Rød flash ved bombe */}
        {isBoom && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent pointer-events-none rounded-2xl" />
            <div className="absolute inset-0 bg-red-400/10 animate-pulse pointer-events-none rounded-2xl" />
          </>
        )}
      </button>
    </div>
  );
}
