import { useState } from "react";
import Button from "../components/Button";
import { TORBJORN_PUB_GOLF_COURSE } from "../data/pubGolfCourse";

const createTeams = (count) => Array.from({ length: count }, (_, index) => ({
  id: `team-${index + 1}`,
  name: `Lag ${index + 1}`,
}));

const createScores = (teams, holes) => Object.fromEntries(
  teams.map((team) => [team.id, holes.map((hole) => hole.par)]),
);

const teamTotal = (teamId, scores, throughIndex = Infinity) => (scores[teamId] || [])
  .slice(0, throughIndex + 1)
  .reduce((sum, value) => sum + value, 0);

function Leaderboard({ teams, scores, currentHole, onClose }) {
  const ranked = [...teams].sort((a, b) => teamTotal(a.id, scores, currentHole) - teamTotal(b.id, scores, currentHole));

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 px-5 backdrop-blur-sm">
      <section className="w-full max-w-xs text-center">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-4xl font-bold tracking-tighter text-gray-900">Score</h2>
          <button onClick={onClose} className="min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500">Lukk</button>
        </div>
        <div className="mt-6 space-y-2">
          {ranked.map((team, index) => (
            <div key={team.id} className="flex items-center justify-between rounded-2xl bg-gray-100 px-5 py-4">
              <span className="font-display text-lg font-bold text-gray-700">{index + 1}. {team.name}</span>
              <span className="font-display text-2xl font-bold text-gray-900">{teamTotal(team.id, scores, currentHole)}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-gray-400">Lavest score leder.</p>
      </section>
    </div>
  );
}

function EndScreen({ teams, scores, onReplay, onBack }) {
  const ranked = [...teams].sort((a, b) => teamTotal(a.id, scores) - teamTotal(b.id, scores));

  return (
    <main className="flex min-h-full flex-col items-center overflow-y-auto bg-white px-6 py-12 text-center">
      <p className="text-sm text-gray-400">Torbjørn sin pubgolf er ferdig</p>
      <h1 className="mt-2 font-display text-5xl font-bold tracking-tighter text-gray-900">{ranked[0].name} vinner</h1>
      <div className="mt-8 w-full max-w-xs space-y-2">
        {ranked.map((team, index) => (
          <div key={team.id} className={`flex items-center justify-between rounded-2xl px-5 py-4 ${index === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>
            <span className="font-display text-lg font-bold">{index + 1}. {team.name}</span>
            <span className="font-display text-2xl font-bold">{teamTotal(team.id, scores)}</span>
          </div>
        ))}
      </div>
      <div className="mt-10 w-full max-w-xs space-y-3">
        <Button onClick={onReplay}>Ny runde</Button>
        <Button variant="secondary" onClick={onBack}>Til meny</Button>
      </div>
    </main>
  );
}

export default function PubGolf({ onBack, onComplete }) {
  const [phase, setPhase] = useState("setup");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);
  const [holes, setHoles] = useState([]);
  const [scores, setScores] = useState({});
  const [currentHole, setCurrentHole] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const start = () => {
    const nextTeams = createTeams(teamCount);
    const nextHoles = TORBJORN_PUB_GOLF_COURSE.map((hole) => ({ ...hole }));
    setTeams(nextTeams);
    setHoles(nextHoles);
    setScores(createScores(nextTeams, nextHoles));
    setCurrentHole(0);
    setPhase("play");
  };

  const updateScore = (teamId, value) => {
    setScores((currentScores) => ({
      ...currentScores,
      [teamId]: currentScores[teamId].map((score, index) => index === currentHole ? Math.max(0, value) : score),
    }));
  };

  const replay = () => {
    setPhase("setup");
    setTeams([]);
    setHoles([]);
    setScores({});
    setCurrentHole(0);
  };

  if (phase === "setup") {
    return (
      <main className="relative flex min-h-full flex-col items-center justify-center overflow-y-auto bg-white px-6 py-12 text-center">
        <button onClick={onBack} className="absolute left-5 top-5 min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500 transition active:scale-95">← Meny</button>
        <p className="mb-2 text-sm text-gray-400">9 faste hull</p>
        <h1 className="max-w-xs font-display text-5xl font-bold tracking-tighter text-gray-900">Torbjørn sin pubgolf</h1>
        <p className="mt-4 max-w-xs text-base leading-relaxed text-gray-400">Din bane, din rekkefølge. Velg antall lag.</p>

        <div className="mt-12 w-full max-w-xs">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">Antall lag</p>
          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 5, 6].map((count) => (
              <button key={count} onClick={() => setTeamCount(count)} className={`aspect-square rounded-2xl font-display text-lg font-bold transition active:scale-95 ${teamCount === count ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`} aria-label={`${count} lag`}>
                {count}
              </button>
            ))}
          </div>
          <Button onClick={start} className="mt-5">Start med {teamCount} lag</Button>
        </div>

        <p className="mt-12 max-w-xs text-xs leading-relaxed text-gray-300">Lagene får navn automatisk. Lavest score vinner.</p>
      </main>
    );
  }

  if (phase === "end") {
    return <EndScreen teams={teams} scores={scores} onReplay={replay} onBack={onBack} />;
  }

  const hole = holes[currentHole];

  return (
    <main className="relative flex h-full flex-col overflow-hidden bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-center">
      <header className="flex shrink-0 items-center justify-between gap-2">
        <button onClick={replay} className="min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500 transition active:scale-95">← Lag</button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tighter text-gray-900">Hull {currentHole + 1}</h1>
          <p className="text-xs text-gray-400">av {holes.length}</p>
        </div>
        <button onClick={() => setShowLeaderboard(true)} className="min-h-11 rounded-full bg-gray-100 px-4 text-sm font-bold text-gray-500">Score</button>
      </header>

      <div className="mt-3 h-1 shrink-0 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-gray-900 transition-all" style={{ width: `${((currentHole + 1) / holes.length) * 100}%` }} />
      </div>

      <section className="shrink-0 py-3">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase text-gray-400">
          <span>Utfordring</span><span>·</span><span>Par {hole.par}</span>
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900">{hole.title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-relaxed text-gray-600">{hole.task}</p>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-gray-400">{hole.rule}</p>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto" aria-label="Lagscore">
        <div className="space-y-1.5 pb-2">
          {teams.map((team) => {
            const value = scores[team.id][currentHole];
            return (
              <div key={team.id} className="flex items-center gap-3 rounded-2xl bg-gray-100 p-1 pl-4">
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate font-display text-base font-bold text-gray-700">{team.name}</p>
                  <p className="text-xs text-gray-400">Hittil {teamTotal(team.id, scores, currentHole)}</p>
                </div>
                <button onClick={() => updateScore(team.id, value - 1)} className="grid h-11 w-11 place-items-center rounded-xl bg-white font-display text-xl font-bold text-gray-600" aria-label={`Trekk fra slag for ${team.name}`}>−</button>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gray-900 font-display text-xl font-bold text-white" aria-label={`${value} slag`}>{value}</span>
                <button onClick={() => updateScore(team.id, value + 1)} className="grid h-11 w-11 place-items-center rounded-xl bg-white font-display text-xl font-bold text-gray-600" aria-label={`Legg til slag for ${team.name}`}>+</button>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-2 grid shrink-0 grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => setCurrentHole((value) => Math.max(0, value - 1))} disabled={currentHole === 0} className="py-3 text-base">Forrige</Button>
        <Button onClick={() => {
          if (currentHole === holes.length - 1) {
            setPhase("end");
            onComplete?.("pubgolf");
          } else {
            setCurrentHole((value) => value + 1);
          }
        }} className="py-3 text-base">{currentHole === holes.length - 1 ? "Se resultat" : "Neste"}</Button>
      </footer>

      {showLeaderboard && <Leaderboard teams={teams} scores={scores} currentHole={currentHole} onClose={() => setShowLeaderboard(false)} />}
    </main>
  );
}
