// Ansikts-komponent som bruker egne karakter-bilder.
// Viser glad ansikt som standard, sint ved tap.
// variant (0–1) velger mellom to ulike karakterer.

const FACES = [
  { happy: "/faces/char1_happy.png", angry: "/faces/char1_angry.png" },
  { happy: "/faces/char2_happy.png", angry: "/faces/char2_angry.png" },
];

export default function Face({
  mood = "neutral",
  variant = 0,
  revealed = false,
  onClick,
}) {
  const sint = mood === "angry";
  const char = FACES[variant % FACES.length];
  const src = sint ? char.angry : char.happy;

  return (
    <button
      onClick={onClick}
      className={`relative aspect-square w-full overflow-hidden rounded-2xl transition-all duration-300
        ${sint
          ? "bg-gradient-to-br from-red-500/40 to-rose-700/30 animate-shake ring-2 ring-ember/70 shadow-[0_0_30px_-5px_rgba(255,77,77,0.7)]"
          : "bg-white/[0.04] active:animate-pop hover:bg-white/[0.07] ring-1 ring-white/[0.06]"}
        ${revealed ? "ring-2 ring-ember/70 shadow-[0_0_30px_-5px_rgba(255,77,77,0.7)]" : ""}`}
      aria-label={sint ? "Sint ansikt" : "Ansikt"}
    >
      <img
        src={src}
        alt={sint ? "Sint karakter" : "Glad karakter"}
        className={`h-full w-full object-cover object-top transition-transform duration-300
          ${sint ? "scale-110" : "hover:scale-105"}`}
        draggable={false}
      />

      {/* Rød overlay ved sinne */}
      {sint && (
        <div className="absolute inset-0 bg-red-500/15 animate-pulse pointer-events-none rounded-2xl" />
      )}
    </button>
  );
}
