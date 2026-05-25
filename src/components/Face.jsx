// Ansikts-komponent — lyst tema, Apple-stil.
// state: "idle" | "removed" | "boom"

import { FACE } from "../data/faces";

export default function Face({ state = "idle", onClick }) {
  const isBoom = state === "boom";
  const isRemoved = state === "removed";
  const src = isBoom ? FACE.angry : FACE.happy;

  return (
    <button
      onClick={state === "idle" ? onClick : undefined}
      disabled={state !== "idle"}
      className={`relative aspect-square w-full overflow-hidden rounded-2xl transition-all duration-300
        ${isBoom
          ? "animate-shake ring-2 ring-red-400/50 shadow-[0_0_20px_-4px_rgba(239,68,68,0.3)] bg-red-50"
          : isRemoved
            ? "scale-0 opacity-0 pointer-events-none"
            : "bg-gray-100 active:scale-95 hover:bg-gray-50 ring-1 ring-gray-200/60 cursor-pointer shadow-sm hover:shadow-md"
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

      {isBoom && (
        <div className="absolute inset-0 bg-red-400/10 animate-pulse pointer-events-none rounded-2xl" />
      )}
    </button>
  );
}
