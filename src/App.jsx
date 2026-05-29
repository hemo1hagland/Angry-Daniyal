import { useState } from "react";
import Landing from "./screens/Landing";
import FaceGame from "./screens/FaceGame";
import ResultView from "./screens/ResultView";
import GameMenu from "./screens/GameMenu";
import HorseRace from "./screens/HorseRace";
import PubGolf from "./screens/PubGolf";
import SpinWheel from "./screens/SpinWheel";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [antall, setAntall] = useState(16);
  const [slurker, setSlurker] = useState(2);
  const [runde, setRunde] = useState(0);
  const appWidth = "max-w-md";

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
    <div className={`phone-shell relative mx-auto w-full ${appWidth} overflow-hidden bg-white font-body`}>
      {screen === "menu" && (
        <GameMenu
          onFaceGame={() => setScreen("landing")}
          onHorseRace={() => setScreen("horse")}
          onPubGolf={() => setScreen("pubgolf")}
          onSpinWheel={() => setScreen("wheel")}
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

      {screen === "pubgolf" && (
        <PubGolf onBack={() => setScreen("menu")} />
      )}

      {screen === "wheel" && (
        <SpinWheel onBack={() => setScreen("menu")} />
      )}
    </div>
  );
}
