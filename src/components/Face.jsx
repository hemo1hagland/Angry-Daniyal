// Helt originalt SVG-ansikt. Ingen opphavsrettsbeskyttet innhold.
// mood: "neutral" | "angry". Liten variasjon styres av `variant` (0–3)
// for at rutenettet skal se levende ut.

const HUD = ["#f2c9a0", "#e8b489", "#d99b6c", "#f6d4b0"];

export default function Face({
  mood = "neutral",
  variant = 0,
  revealed = false,
  onClick,
}) {
  const sint = mood === "angry";
  const hud = sint ? "#ff6b5e" : HUD[variant % HUD.length];

  return (
    <button
      onClick={onClick}
      className={`relative aspect-square w-full rounded-2xl p-1.5 transition-all duration-300
        ${sint
          ? "bg-gradient-to-br from-red-500/40 to-rose-700/30 animate-shake"
          : "bg-white/[0.04] active:animate-pop hover:bg-white/[0.07]"}
        ${revealed ? "ring-2 ring-ember/70 shadow-[0_0_30px_-5px_rgba(255,77,77,0.7)]" : "ring-1 ring-white/[0.06]"}`}
      aria-label={sint ? "Sint ansikt" : "Ansikt"}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* Hode */}
        <ellipse
          cx="50"
          cy="52"
          rx="34"
          ry="38"
          fill={hud}
          style={{ transition: "fill 0.3s ease" }}
        />
        {/* Ører */}
        <circle cx="16" cy="54" r="7" fill={hud} />
        <circle cx="84" cy="54" r="7" fill={hud} />

        {/* Øyenbryn */}
        {sint ? (
          <>
            <path d="M28 38 L46 46" stroke="#3a1f1f" strokeWidth="4" strokeLinecap="round" />
            <path d="M72 38 L54 46" stroke="#3a1f1f" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M30 40 Q38 36 46 40" stroke="#5a4636" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M54 40 Q62 36 70 40" stroke="#5a4636" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Øyne */}
        <circle cx="38" cy="50" r={sint ? 4.5 : 4} fill="#2a2a2a" />
        <circle cx="62" cy="50" r={sint ? 4.5 : 4} fill="#2a2a2a" />

        {/* Munn */}
        {sint ? (
          <path d="M38 72 Q50 62 62 72 Q50 78 38 72 Z" fill="#7a1f1f" />
        ) : (
          <path
            d={
              variant % 2 === 0
                ? "M40 68 Q50 75 60 68"
                : "M42 70 Q50 73 58 70"
            }
            stroke="#5a3a2a"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Sinne-detalj: panne-rynke */}
        {sint && (
          <path d="M48 28 L52 28 M50 28 L50 34" stroke="#7a1f1f" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
