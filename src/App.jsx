import { lazy, Suspense, useEffect, useState } from "react";
import Home from "./screens/Home";
import GameMenu from "./screens/GameMenu";
import PlayerSetup from "./screens/PlayerSetup";
import ShareSheet from "./components/ShareSheet";
import PremiumPreview from "./components/PremiumPreview";
import InstallSheet from "./components/InstallSheet";
import usePersistentState from "./hooks/usePersistentState";
import { getActiveEventPack } from "./data/eventPacks";
import { getGame } from "./config/product";
import { trackEvent } from "./lib/analytics";

const Landing = lazy(() => import("./screens/Landing"));
const FaceGame = lazy(() => import("./screens/FaceGame"));
const ResultView = lazy(() => import("./screens/ResultView"));
const HorseRace = lazy(() => import("./screens/HorseRace"));
const PubGolf = lazy(() => import("./screens/PubGolf"));
const SpinWheel = lazy(() => import("./screens/SpinWheel"));
const BusRoute = lazy(() => import("./screens/BusRoute"));
const QuestionGame = lazy(() => import("./screens/QuestionGame"));
const CustomCards = lazy(() => import("./screens/CustomCards"));
const WorldGames = lazy(() => import("./screens/WorldGames"));

const DIRECT_START_GAMES = new Set(["questions", "pubgolf", "world"]);

const getDeepLinkedGame = () => {
  const id = new URLSearchParams(window.location.search).get("game");
  return getGame(id) ? id : null;
};

function LoadingScreen() {
  return <div className="grid min-h-full place-items-center bg-white" role="status"><span className="loader" /><span className="sr-only">Laster spill</span></div>;
}

export default function App() {
  const deepLinkedGame = getDeepLinkedGame();
  const [eventPack] = useState(getActiveEventPack);
  const [screen, setScreen] = useState(deepLinkedGame ? (DIRECT_START_GAMES.has(deepLinkedGame) ? deepLinkedGame : "setup") : "home");
  const [selectedGameId, setSelectedGameId] = useState(deepLinkedGame);
  const [players, setPlayers] = usePersistentState("vors.players", []);
  const [antall, setAntall] = usePersistentState("vors.face.count", 16);
  const [penalty, setPenalty] = usePersistentState("vors.face.penalty", 2);
  const [runde, setRunde] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [premiumPack, setPremiumPack] = useState(null);
  const [questionMode, setQuestionMode] = useState("standard");
  const [installOpen, setInstallOpen] = useState(() => new URLSearchParams(window.location.search).get("install") === "1");

  const selectedGame = getGame(selectedGameId);

  useEffect(() => {
    document.documentElement.style.setProperty("--event-primary", eventPack.theme.primary);
    document.documentElement.style.setProperty("--event-secondary", eventPack.theme.secondary);
    document.documentElement.style.setProperty("--event-surface", eventPack.theme.surface);
    trackEvent("app_opened", { eventId: eventPack.id, source: deepLinkedGame ? "shared_game" : "direct" });
  }, [deepLinkedGame, eventPack]);

  const selectGame = (gameId) => {
    setSelectedGameId(gameId);
    if (gameId === "questions") setQuestionMode("standard");
    setScreen(DIRECT_START_GAMES.has(gameId) ? gameId : "setup");
    trackEvent("game_selected", { gameId });
  };

  const startPack = (pack) => {
    setPremiumPack(null);
    if (pack.id === "after-dark") {
      setSelectedGameId("questions");
      setQuestionMode("edgy");
      setScreen("questions");
    } else if (pack.id === "event-maker") {
      setSelectedGameId("custom-cards");
      setScreen("custom-cards");
    }
    trackEvent("premium_pack_started", { packId: pack.id });
  };

  const launchGame = () => {
    setScreen(selectedGameId === "face" ? "face-settings" : selectedGameId);
    trackEvent("game_started", { gameId: selectedGameId, playerCount: players.length });
  };

  const goHome = () => {
    window.history.replaceState({}, "", window.location.pathname);
    setSelectedGameId(null);
    setScreen("home");
  };

  const completeGame = (gameId) => {
    trackEvent("game_completed", { gameId, playerCount: players.length });
  };

  const startFaceGame = (valgtAntall, valgtPenalty) => {
    setAntall(valgtAntall);
    setPenalty(valgtPenalty);
    setRunde((round) => round + 1);
    setScreen("face-game");
  };

  const playFaceAgain = () => {
    setRunde((round) => round + 1);
    setScreen("face-game");
    trackEvent("play_again_clicked", { gameId: "face" });
  };

  const gameProps = { players, onBack: () => setScreen("games"), onComplete: completeGame };

  return (
    <div className="phone-shell relative mx-auto w-full max-w-md overflow-hidden bg-white font-body shadow-2xl shadow-black/10">
      <Suspense fallback={<LoadingScreen />}>
        {screen === "home" && <Home onStart={() => setScreen("games")} onShare={() => setShareOpen(true)} eventPack={eventPack} />}
        {screen === "games" && <GameMenu onSelect={selectGame} onBack={goHome} onShare={() => setShareOpen(true)} eventPack={eventPack} onPremiumPreview={setPremiumPack} />}
        {screen === "setup" && selectedGame && <PlayerSetup game={selectedGame} players={players} onPlayersChange={setPlayers} onStart={launchGame} onBack={() => setScreen("games")} />}
        {screen === "face-settings" && <Landing initialCount={antall} initialPenalty={penalty} onStart={startFaceGame} onBack={() => setScreen("setup")} />}
        {screen === "face-game" && <FaceGame antall={antall} runde={runde} players={players} onLose={() => { completeGame("face"); setScreen("face-result"); }} onBack={() => setScreen("face-settings")} />}
        {screen === "face-result" && <ResultView penalty={penalty} onNext={playFaceAgain} onMenu={() => setScreen("games")} />}
        {screen === "horse" && <HorseRace {...gameProps} />}
        {screen === "pubgolf" && <PubGolf {...gameProps} />}
        {screen === "wheel" && <SpinWheel {...gameProps} />}
        {screen === "busroute" && <BusRoute {...gameProps} />}
        {screen === "questions" && <QuestionGame key={questionMode} {...gameProps} initialMode={questionMode} />}
        {screen === "custom-cards" && <CustomCards {...gameProps} />}
        {screen === "world" && <WorldGames {...gameProps} />}
      </Suspense>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} gameId={selectedGameId} eventPack={eventPack} />
      <PremiumPreview pack={premiumPack} onClose={() => setPremiumPack(null)} onStart={startPack} />
      <InstallSheet open={installOpen} onClose={() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("install");
        window.history.replaceState({}, "", `${url.pathname}${url.search}`);
        setInstallOpen(false);
      }} />
    </div>
  );
}
