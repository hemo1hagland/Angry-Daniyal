import { FACE } from "../data/faces";

export default function Face({ state = "idle", onClick }) {
  const isAngry = state === "angry";
  const isBonus = state === "bonus";
  const isRemoved = state === "removed";
  const src = isAngry ? FACE.angry : isBonus ? FACE.bonus : FACE.happy;

  return (
    <div>
      <button
        onClick={state === "idle" ? onClick : undefined}
        disabled={state !== "idle"}
        className={`relative aspect-square w-full overflow-hidden rounded-2xl transition-all
          ${isAngry
            ? "bg-gray-100 ring-1 ring-gray-200"
            : isBonus
              ? "bg-gray-100 ring-1 ring-gray-200"
            : isRemoved
              ? "animate-popOut pointer-events-none"
              : "bg-gray-100 active:scale-[0.92] hover:bg-gray-50 ring-1 ring-gray-200/60 cursor-pointer shadow-sm hover:shadow-lg hover:ring-gray-300/60 transition-all duration-200"
          }`}
        aria-label={isAngry ? "Sint ansikt" : isBonus ? "Bonusansikt" : "Ansikt"}
      >
        <img
          src={src}
          alt={isAngry ? "Sint karakter" : isBonus ? "Bonusdame" : "Glad karakter"}
          className="h-full w-full select-none object-cover object-top"
          draggable={false}
        />
      </button>
    </div>
  );
}
