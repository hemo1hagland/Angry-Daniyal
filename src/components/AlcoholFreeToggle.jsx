export default function AlcoholFreeToggle({ checked, onChange, compact = false }) {
  return (
    <label className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-gray-100 text-left ${compact ? "px-4 py-3" : "px-5 py-4"}`}>
      <span className="min-w-0">
        <span className="block font-display text-sm font-bold text-gray-600">Alkoholfri modus</span>
        {!compact && <span className="mt-0.5 block text-xs leading-snug text-gray-400">Poeng og utfordringer uten alkohol</span>}
      </span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-gray-300 transition peer-checked:bg-gray-900 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-900 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}
