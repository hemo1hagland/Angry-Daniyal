// Gjenbrukbar knapp med premium, varm festfølelse.
export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const base =
    "w-full rounded-2xl px-6 py-4 font-display font-semibold text-lg tracking-tight transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:active:scale-100 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-br from-coral to-peach text-ink shadow-[0_8px_28px_-6px_rgba(235,115,100,0.35)]",
    ghost:
      "bg-white/5 text-white border border-white/10 backdrop-blur-sm hover:bg-white/10",
    subtle: "bg-transparent text-white/50 hover:text-white/80 py-2 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
