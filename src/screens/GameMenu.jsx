import Button from "../components/Button";

export default function GameMenu({ onFaceGame, onHorseRace, onPubGolf, onSpinWheel, onBusRoute }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="mb-4 font-display text-7xl font-bold tracking-tighter text-gray-900">
        Vors
      </h1>
      <p className="mb-12 max-w-xs font-body text-lg text-gray-400">
        Velg spill og send mobilen rundt bordet.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <Button onClick={onFaceGame}>Ansiktsspillet</Button>
        <Button variant="secondary" onClick={onHorseRace}>
          Hesteløp
        </Button>
        <Button onClick={onPubGolf}>Pubgolf</Button>
        <Button variant="secondary" onClick={onSpinWheel}>
          Spin wheel
        </Button>
        <Button onClick={onBusRoute}>Bussruta</Button>
      </div>

      <p className="mt-16 max-w-xs font-body text-xs leading-relaxed text-gray-300">
        Spill utviklet av Torbjørn Hagland og Daniyal Chaudhry. Alle rettigheter reservert.
      </p>
    </div>
  );
}
