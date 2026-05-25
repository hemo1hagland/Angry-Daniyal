import { useState } from "react";
import Landing from "./screens/Landing";
import FaceGame from "./screens/FaceGame";
import ResultView from "./screens/ResultView";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [antall, setAntall] = useState(16);
  const [runde, setRunde] = useState(0);

  const startSpill = (valgtAntall) => {
    setAntall(valgtAntall);
    setRunde((r) => r + 1);
    setScreen("game");
  };

  const nyRunde = () => {
    setRunde((r) => r + 1);
    setScreen("game");
  };

  return (
    <div className="grain relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-ink font-body">
      {/* Myk bakgrunns-glød */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute -left-1/3 top-[-10%] h-[60%] w-[80%] rounded-full bg-violet/[0.06] blur-[160px]" />
        <div className="absolute -right-1/4 bottom-[-5%] h-1/2 w-3/4 rounded-full bg-coral/[0.05] blur-[160px]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {screen === "landing" && (
          <Landing onStart={startSpill} />
        )}

        {screen === "game" && (
          <FaceGame
            antall={antall}
            runde={runde}
            onLose={() => setScreen("result")}
            onBack={() => setScreen("landing")}
          />
        )}

        {screen === "result" && (
          <ResultView
            onNext={nyRunde}
            onMenu={() => setScreen("landing")}
          />
        )}
      </div>
    </div>
  );
}
