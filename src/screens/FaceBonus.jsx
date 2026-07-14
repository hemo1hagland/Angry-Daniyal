import Button from "../components/Button";
import { FACE } from "../data/faces";

export default function FaceBonus({ onNext, onMenu }) {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-white px-6 py-10 text-center">
      <div className="h-36 w-28 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
        <img src={FACE.bonus} alt="Bonusdame" className="h-full w-full object-cover object-top" />
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Bonus</p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-tighter text-gray-900">Del ut 2 slurker</h1>

      <div className="mt-10 w-full max-w-xs space-y-2">
        <Button onClick={onNext}>Neste runde</Button>
        <Button variant="ghost" onClick={onMenu}>Tilbake til meny</Button>
      </div>
    </main>
  );
}
