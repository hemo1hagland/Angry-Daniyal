import { useState } from "react";
import Landing from "./screens/Landing";
import FaceGame from "./screens/FaceGame";
import ResultView from "./screens/ResultView";
import GameMenu from "./screens/GameMenu";
import HorseRace from "./screens/HorseRace";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [antall, setAntall] = useState(16);
  const [slurker, setSlurker] = useState(2);
  const [runde, setRunde] = useState(0);
  const appWidth = screen === "horse" ? "max-w-5xl" : "max-w-md";

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
    <div className={`relative mx-auto min-h-screen w-full ${appWidth} overflow-hidden bg-white font-body`}>
      {screen === "menu" && (
        <GameMenu
          onFaceGame={() => setScreen("landing")}
          onHorseRace={() => setScreen("horse")}
        />
      )}

      {screen === "landing" && (
        <Landing onStart={startSpill} onBack={() => setScreen("menu")} />
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

      {screen === "horse" && (
        <HorseRace onBack={() => setScreen("menu")} />
      )}
    </div>
  );
}
