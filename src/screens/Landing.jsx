import Button from "../components/Button";

export default function Landing({ onStart, onCustom }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
      {/* Glød bak logo */}
      <div className="relative mb-4">
        <div className="absolute inset-0 -z-10 animate-glowPulse bg-gradient-to-br from-coral via-violet to-gold blur-3xl opacity-25" />
        <h1 className="font-display text-8xl font-bold tracking-tighter text-white">
          Vors
        </h1>
      </div>

      <p className="mb-1 font-body text-lg text-white/60">
        Trykk på ansiktene.
      </p>
      <p className="mb-12 font-body text-lg text-white/40">
        Én av dem blir sur. Ikke vær uheldig.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <Button onClick={onStart}>Start spill</Button>
        <Button variant="subtle" onClick={onCustom}>
          Egne kort
        </Button>
      </div>

      <p className="mt-16 font-body text-xs uppercase tracking-[0.3em] text-white/20">
        Vors · partyspill
      </p>
    </div>
  );
}
