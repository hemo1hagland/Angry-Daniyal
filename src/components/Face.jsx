import { FACE } from "../data/faces";

export default function Face({ state = "idle", onClick }) {
  const isBoom = state === "boom";
  const isBonus = state === "bonus";
  const isRemoved = state === "removed";
  const src = isBoom ? FACE.angry : isBonus ? FACE.bonus : FACE.happy;

  return (
    <div className="relative">
      {isBoom && <div className="absolute inset-0 animate-pulseRing rounded-2xl ring-4 ring-red-400/40" />}
      <button
        onClick={state === "idle" ? onClick : undefined}
        disabled={state !== "idle"}
        className={`relative aspect-square w-full overflow-hidden rounded-2xl transition-all
          ${isBoom
            ? "z-10 animate-boomIn bg-red-50 ring-2 ring-red-400/60 shadow-[0_0_24px_-4px_rgba(239,68,68,0.4)]"
            : isBonus
              ? "z-10 animate-boomIn bg-gray-100 ring-1 ring-gray-200"
            : isRemoved
              ? "animate-popOut pointer-events-none"
              : "bg-gray-100 active:scale-[0.92] hover:bg-gray-50 ring-1 ring-gray-200/60 cursor-pointer shadow-sm hover:shadow-lg hover:ring-gray-300/60 transition-all duration-200"
          }`}
        aria-label={isBoom ? "Sint ansikt" : isBonus ? "Bonusansikt" : "Ansikt"}
      >
        <img
          src={src}
          alt={isBoom ? "Sint karakter" : isBonus ? "Bonusdame" : "Glad karakter"}
          className={`h-full w-full select-none object-cover object-top transition-transform duration-300 ${isBoom ? "scale-110" : ""}`}
          draggable={false}
        />
        {isBoom && (
          <>
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-red-500/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl bg-red-400/10" />
          </>
        )}
      </button>
    </div>
  );
}
