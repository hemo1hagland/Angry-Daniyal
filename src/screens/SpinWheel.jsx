import { useMemo, useState } from "react";
import Button from "../components/Button";

const COLORS = [
  "#0f172a",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

const DEFAULT_CHOICES = ["Torbjørn", "Daniyal", "Magnus", "Zachen"];

const normalizeChoices = (text) =>
  text
    .split("\n")
    .map((choice) => choice.trim())
    .filter(Boolean)
    .slice(0, 40);

const polarToCartesian = (cx, cy, radius, angle) => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
};

const makeSlicePath = (index, total) => {
  const slice = 360 / total;
  const startAngle = index * slice - 90;
  const endAngle = (index + 1) * slice - 90;
  const start = polarToCartesian(50, 50, 48, startAngle);
  const end = polarToCartesian(50, 50, 48, endAngle);
  const largeArc = slice > 180 ? 1 : 0;

  return `M 50 50 L ${start.x} ${start.y} A 48 48 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
};

function WheelSvg({ choices, rotation, spinning }) {
  const total = Math.max(choices.length, 1);
  const slice = 360 / total;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[330px]">
      <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-x-[16px] border-t-[28px] border-x-transparent border-t-slate-900 drop-shadow-md" />
      <svg
        viewBox="0 0 100 100"
        className={`h-full w-full rounded-full drop-shadow-[0_18px_35px_rgba(15,23,42,0.18)] ${spinning ? "will-change-transform" : ""}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 4.2s cubic-bezier(0.12, 0.75, 0.12, 1)" : "none",
        }}
      >
        {choices.map((choice, index) => {
          const labelAngle = index * slice + slice / 2 - 90;
          const labelPoint = polarToCartesian(50, 50, 31, labelAngle);
          const textRotation = labelAngle + 90;
          return (
            <g key={`${choice}-${index}`}>
              <path
                d={makeSlicePath(index, total)}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth="0.8"
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                fill="white"
                fontSize={total > 14 ? "3.2" : total > 9 ? "3.8" : "4.5"}
                fontWeight="800"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textRotation} ${labelPoint.x} ${labelPoint.y})`}
              >
                {choice.length > 12 ? `${choice.slice(0, 11)}…` : choice}
              </text>
            </g>
          );
        })}
        <circle cx="50" cy="50" r="10" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <circle cx="50" cy="50" r="4" fill="#0f172a" />
      </svg>
    </div>
  );
}

export default function SpinWheel({ onBack }) {
  const [listText, setListText] = useState(DEFAULT_CHOICES.join("\n"));
  const [newChoice, setNewChoice] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");

  const choices = useMemo(() => normalizeChoices(listText), [listText]);
  const canSpin = choices.length >= 2 && !spinning;

  const updateChoices = (nextChoices) => {
    setListText(nextChoices.join("\n"));
    setWinner("");
  };

  const addChoice = () => {
    const trimmed = newChoice.trim();
    if (!trimmed) return;
    updateChoices([...choices, trimmed]);
    setNewChoice("");
  };

  const removeChoice = (indexToRemove) => {
    updateChoices(choices.filter((_, index) => index !== indexToRemove));
  };

  const spin = () => {
    if (!canSpin) return;
    const winnerIndex = Math.floor(Math.random() * choices.length);
    const slice = 360 / choices.length;
    const targetMod = (360 - (winnerIndex + 0.5) * slice) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const extra = (targetMod - currentMod + 360) % 360;
    const nextRotation = rotation + 360 * 6 + extra;

    setWinner("");
    setSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setWinner(choices[winnerIndex]);
      setSpinning(false);
      if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
    }, 4300);
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white px-5 py-5 text-center">
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-full bg-gray-100 px-4 py-2 font-body text-sm text-gray-500 transition active:scale-[0.95]"
        >
          ← Meny
        </button>
        <span className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
          {choices.length} valg
        </span>
      </div>

      <h1 className="shrink-0 font-display text-5xl font-bold tracking-tighter text-slate-900">
        Spin wheel
      </h1>
      <p className="mx-auto mt-1 max-w-xs shrink-0 font-body text-sm font-semibold text-gray-400">
        Legg inn navn eller valg. Snurr hjulet.
      </p>

      <div className="mt-4 shrink-0">
        <WheelSvg choices={choices.length ? choices : ["Legg inn valg"]} rotation={rotation} spinning={spinning} />
      </div>

      <div className="mt-4 grid shrink-0 gap-2">
        <Button onClick={spin} disabled={!canSpin} className="py-4">
          {spinning ? "Spinner..." : "Spinn"}
        </Button>
        {winner && (
          <div className="rounded-[24px] bg-slate-900 px-5 py-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
            <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-white/45">Resultat</p>
            <p className="mt-1 truncate font-display text-4xl font-bold">{winner}</p>
          </div>
        )}
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-[28px] bg-gray-50 p-3 text-left ring-1 ring-gray-200">
        <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
          Valg
        </p>
        <div className="mt-2 flex gap-2">
          <input
            value={newChoice}
            onChange={(event) => setNewChoice(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addChoice();
            }}
            placeholder="Nytt navn"
            className="min-w-0 flex-1 rounded-2xl bg-white px-4 py-3 font-display text-base font-bold text-slate-900 outline-none ring-1 ring-gray-200 placeholder:text-gray-300 focus:ring-slate-900"
          />
          <button
            onClick={addChoice}
            className="rounded-2xl bg-slate-900 px-4 font-display text-sm font-bold text-white active:scale-[0.96]"
          >
            Legg til
          </button>
        </div>

        <textarea
          value={listText}
          onChange={(event) => {
            setListText(event.target.value);
            setWinner("");
          }}
          className="mt-3 min-h-28 w-full resize-none rounded-2xl bg-white px-4 py-3 font-body text-base font-semibold leading-relaxed text-slate-900 outline-none ring-1 ring-gray-200 focus:ring-slate-900"
          placeholder="Ett valg per linje"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {choices.map((choice, index) => (
            <button
              key={`${choice}-${index}`}
              onClick={() => removeChoice(index)}
              className="max-w-full truncate rounded-full bg-white px-3 py-2 font-body text-xs font-bold text-slate-700 ring-1 ring-gray-200 active:scale-[0.96]"
            >
              {choice} ×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
