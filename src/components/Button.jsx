export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  style,
  type = "button",
}) {
  const base =
    "w-full select-none rounded-2xl px-6 py-4 font-display text-lg font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

  const variants = {
    primary:
      "bg-gray-900 text-white shadow-[0_2px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.16)] hover:bg-gray-800",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost:
      "bg-transparent text-gray-500 hover:text-gray-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
