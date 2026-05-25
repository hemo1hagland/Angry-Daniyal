import Button from "../components/Button";

export default function ResultView({ onNext, onMenu }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 animate-burst text-7xl">😡</div>

      <h2 className="mb-2 animate-floatUp font-display text-5xl font-bold tracking-tighter text-white">
        Du tapte!
      </h2>
      <p
        className="mb-14 animate-floatUp font-body text-lg text-white/40"
        style={{ animationDelay: "0.08s" }}
      >
        Du traff det sinte ansiktet.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <Button onClick={onNext}>Ny runde</Button>
        <Button variant="ghost" onClick={onMenu}>
          Tilbake til meny
        </Button>
      </div>
    </div>
  );
}
