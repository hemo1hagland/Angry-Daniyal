// Apple-stil knapp — hvitt tema.
export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const base =
    "w-full rounded-[16px] px-6 py-4 font-display font-semibold text-lg tracking-tight transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed select-none";

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
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
