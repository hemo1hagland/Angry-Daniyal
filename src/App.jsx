import { useState } from "react";
import Landing from "./screens/Landing";
import FaceGame from "./screens/FaceGame";
import ResultView from "./screens/ResultView";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [antall, setAntall] = useState(16);
  const [slurker, setSlurker] = useState(2);
  const [runde, setRunde] = useState(0);

  const startSpill = (valgtAntall, valgtSlurker) => {
    setAntall(valgtAntall);
    setSlurker(valgtSlurker);
    setRunde((r) => r + 1);
    setScreen("game");
  };

  const nyRunde = () => {
    setRunde((r) => r + 1);
    setScreen("game");
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-white font-body">
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
          slurker={slurker}
          onNext={nyRunde}
          onMenu={() => setScreen("landing")}
        />
      )}
    </div>
  );
}
