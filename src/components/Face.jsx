// Ansikts-komponent med bilde-baserte ansikter.
// Props:
//   pair   – objekt med { happy, angry } bilde-stier
//   state  – "idle" | "removed" | "boom"
//   onClick

export default function Face({ pair, state = "idle", onClick }) {
  const isBoom = state === "boom";
  const isRemoved = state === "removed";
  const src = isBoom ? pair.angry : pair.happy;

  return (
    <button
      onClick={state === "idle" ? onClick : undefined}
      disabled={state !== "idle"}
      className={`relative aspect-square w-full overflow-hidden rounded-2xl transition-all duration-300
        ${isBoom
          ? "animate-shake ring-2 ring-coral/60 shadow-[0_0_24px_-4px_rgba(235,115,100,0.55)] bg-gradient-to-br from-red-400/20 to-rose-500/15"
          : isRemoved
            ? "scale-0 opacity-0 pointer-events-none"
            : "bg-white/[0.04] active:scale-95 hover:bg-white/[0.06] ring-1 ring-white/[0.06] cursor-pointer"
        }`}
      style={{
        transition: isRemoved
          ? "transform 0.3s ease-in, opacity 0.3s ease-in"
          : "all 0.3s ease",
      }}
      aria-label={isBoom ? "Sint ansikt" : "Ansikt"}
    >
      <img
        src={src}
        alt={isBoom ? "Sint karakter" : "Glad karakter"}
        className={`h-full w-full object-cover object-top select-none transition-transform duration-300
          ${isBoom ? "scale-110" : ""}`}
        draggable={false}
      />

      {/* Myk rød overlay ved bombe */}
      {isBoom && (
        <div className="absolute inset-0 bg-red-400/10 animate-pulse pointer-events-none rounded-2xl" />
      )}
    </button>
  );
}
