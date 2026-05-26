import Button from "../components/Button";
import { FACE } from "../data/faces";

export default function ResultView({ slurker, onNext, onMenu }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      {/* Sint ansikt */}
      <div className="mb-6 animate-burst">
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-3xl bg-red-50 ring-2 ring-red-300/40 shadow-[0_0_30px_-6px_rgba(239,68,68,0.3)]">
          <img
            src={FACE.angry}
            alt="Sint"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>

      <h2 className="mb-2 animate-floatUp font-display text-5xl font-bold tracking-tighter text-gray-900">
        Du tapte!
      </h2>
      <p
        className="mb-8 animate-floatUp font-body text-gray-400"
        style={{ animationDelay: "0.08s" }}
      >
        Du traff det sinte ansiktet.
      </p>

      {/* Slurk-teller */}
      <div
        className="mb-12 animate-countUp"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="rounded-[20px] bg-gray-50 px-10 py-6 shadow-sm ring-1 ring-gray-200/60">
          <p className="mb-1 font-body text-sm uppercase tracking-[0.2em] text-gray-400">
            Straff
          </p>
          <p className="font-display text-5xl font-bold text-gray-900">
            {slurker}
          </p>
          <p className="mt-1 font-body text-lg text-gray-500">
            {slurker === 1 ? "slurk" : "slurker"} 🍺
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Button onClick={onNext}>Ny runde</Button>
        <Button variant="ghost" onClick={onMenu}>
          Tilbake til meny
        </Button>
      </div>
    </div>
  );
}
