// Apple-stil knapp — ren, avrundet, premium.
export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  size = "lg",
  className = "",
}) {
  const base =
    "w-full font-display font-semibold tracking-tight transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed select-none";

  const sizes = {
    lg: "rounded-[16px] px-6 py-4 text-lg",
    md: "rounded-[14px] px-5 py-3.5 text-base",
    sm: "rounded-[12px] px-4 py-2.5 text-sm",
  };

  const variants = {
    primary:
      "bg-white text-[#1a1a1a] shadow-[0_2px_12px_rgba(255,255,255,0.12)] hover:shadow-[0_2px_20px_rgba(255,255,255,0.18)] hover:bg-white/95",
    secondary:
      "bg-white/[0.08] text-white backdrop-blur-md border border-white/[0.1] hover:bg-white/[0.12]",
    ghost:
      "bg-transparent text-white/60 hover:text-white/90",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
