import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Landing from "./screens/Landing";
import Players from "./screens/Players";
import ModeSelect from "./screens/ModeSelect";
import FaceGame from "./screens/FaceGame";
import ResultView from "./screens/ResultView";
import CustomCards from "./screens/CustomCards";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [players, setPlayers] = useLocalStorage("vors_players", []);
  const [customCards, setCustomCards] = useLocalStorage("vors_custom", {});

  const [modus, setModus] = useState("klassisk");
  const [antall, setAntall] = useState(16);
  const [runde, setRunde] = useState(0);

  const startSpill = (valgtModus, valgtAntall) => {
    setModus(valgtModus);
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
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute -left-1/4 top-0 h-1/2 w-3/4 rounded-full bg-violet/[0.08] blur-[140px]" />
        <div className="absolute -right-1/4 bottom-0 h-1/2 w-3/4 rounded-full bg-coral/[0.08] blur-[140px]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {screen === "landing" && (
          <Landing
            onStart={() => setScreen("players")}
            onCustom={() => setScreen("custom")}
          />
        )}

        {screen === "players" && (
          <Players
            players={players}
            setPlayers={setPlayers}
            onNext={() => setScreen("mode")}
            onBack={() => setScreen("landing")}
          />
        )}

        {screen === "mode" && (
          <ModeSelect onStart={startSpill} onBack={() => setScreen("players")} />
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
            modeId={modus}
            customCards={customCards}
            onNext={nyRunde}
            onMenu={() => setScreen("landing")}
          />
        )}

        {screen === "custom" && (
          <CustomCards
            customCards={customCards}
            setCustomCards={setCustomCards}
            onBack={() => setScreen("landing")}
          />
        )}
      </div>
    </div>
  );
}
