import Leaf from "lucide-react/dist/esm/icons/leaf.js";

export default function AlcoholFreeToggle({ checked, onChange, compact = false }) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/80 text-left shadow-sm backdrop-blur ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
          <Leaf size={18} strokeWidth={2.4} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-sm font-bold text-slate-950">Alkoholfri modus</span>
          {!compact && (
            <span className="block text-xs font-medium leading-snug text-slate-500">
              Likeverdig spill med poeng og utfordringer
            </span>
          )}
        </span>
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate-900 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}
