import { useState } from "react";
import Shuffle from "lucide-react/dist/esm/icons/shuffle.js";
import Button from "../components/Button";
import { buildPubGolfCourse, PUB_GOLF_CHALLENGES, PUB_GOLF_PRESETS } from "../data/pubGolfCourse";

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

function ChallengePicker({ holes, holeIndex, onChoose, onClose }) {
  const selectedIds = new Set(holes.filter((_, index) => index !== holeIndex).map((hole) => hole.id));

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/45 p-3" role="presentation" onMouseDown={onClose}>
      <section className="sheet-enter flex max-h-[82%] w-full flex-col overflow-hidden rounded-2xl bg-white p-4" role="dialog" aria-modal="true" aria-labelledby="challenge-picker-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Hull {holeIndex + 1}</p>
            <h2 id="challenge-picker-title" className="mt-1 font-display text-3xl font-bold text-gray-900">Velg utfordring</h2>
          </div>
          <button onClick={onClose} className="min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500">Lukk</button>
        </div>
        <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto">
          {PUB_GOLF_CHALLENGES.filter((challenge) => !selectedIds.has(challenge.id)).map((challenge) => {
            const selected = holes[holeIndex]?.id === challenge.id;
            return (
              <button key={challenge.id} onClick={() => onChoose(challenge)} className={`w-full rounded-2xl px-4 py-3 text-left transition active:scale-[0.98] ${selected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-base font-bold">{challenge.title}</span>
                  <span className={`shrink-0 text-xs font-bold ${selected ? "text-white/60" : "text-gray-400"}`}>Par {challenge.par}</span>
                </span>
                <span className={`mt-1 block text-xs leading-relaxed ${selected ? "text-white/65" : "text-gray-400"}`}>{challenge.task}</span>
              </button>
            );
          })}
        </div>
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
        <Button onClick={onReplay}>Bygg ny bane</Button>
        <Button variant="secondary" onClick={onBack}>Til meny</Button>
      </div>
    </main>
  );
}

export default function PubGolf({ onBack, onComplete }) {
  const [phase, setPhase] = useState("setup");
  const [teamCount, setTeamCount] = useState(2);
  const [holeCount, setHoleCount] = useState(9);
  const [presetId, setPresetId] = useState("torbjorn");
  const [teams, setTeams] = useState([]);
  const [holes, setHoles] = useState([]);
  const [scores, setScores] = useState({});
  const [jokers, setJokers] = useState({});
  const [currentHole, setCurrentHole] = useState(0);
  const [pickerIndex, setPickerIndex] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const prepareCourse = () => {
    setHoles(buildPubGolfCourse(presetId, holeCount));
    setPhase("course");
  };

  const mixCourse = () => {
    setPresetId("mix");
    setHoles(buildPubGolfCourse("mix", holeCount));
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const chooseChallenge = (challenge) => {
    setHoles((currentHoles) => currentHoles.map((hole, index) => index === pickerIndex ? { ...challenge } : hole));
    setPickerIndex(null);
  };

  const startRound = () => {
    const nextTeams = createTeams(teamCount);
    setTeams(nextTeams);
    setScores(createScores(nextTeams, holes));
    setJokers(Object.fromEntries(nextTeams.map((team) => [team.id, false])));
    setCurrentHole(0);
    setShowLeaderboard(false);
    setPhase("play");
  };

  const updateScore = (teamId, value) => {
    setScores((currentScores) => ({
      ...currentScores,
      [teamId]: currentScores[teamId].map((score, index) => index === currentHole ? Math.max(0, value) : score),
    }));
    if (navigator.vibrate) navigator.vibrate(12);
  };

  const applyJoker = (teamId) => {
    if (jokers[teamId]) return;
    updateScore(teamId, scores[teamId][currentHole] - 1);
    setJokers((currentJokers) => ({ ...currentJokers, [teamId]: true }));
  };

  const replay = () => {
    setPhase("setup");
    setTeams([]);
    setHoles([]);
    setScores({});
    setJokers({});
    setCurrentHole(0);
  };

  if (phase === "setup") {
    return (
      <main className="relative min-h-full overflow-y-auto bg-white px-5 pb-10 pt-20 text-center">
        <button onClick={onBack} className="absolute left-5 top-5 min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500 transition active:scale-95">← Meny</button>
        <p className="text-sm text-gray-400">Bygg din egen bane</p>
        <h1 className="mx-auto mt-1 max-w-xs font-display text-5xl font-bold tracking-tighter text-gray-900">Torbjørn sin pubgolf</h1>

        <div className="mx-auto mt-8 w-full max-w-xs space-y-6">
          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">Antall lag</p>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((count) => (
                <button key={count} onClick={() => setTeamCount(count)} className={`aspect-square rounded-2xl font-display text-lg font-bold transition active:scale-95 ${teamCount === count ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`} aria-label={`${count} lag`}>{count}</button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">Antall hull</p>
            <div className="grid grid-cols-3 gap-2">
              {[3, 6, 9].map((count) => (
                <button key={count} onClick={() => setHoleCount(count)} className={`rounded-2xl py-3 font-display text-base font-bold transition active:scale-95 ${holeCount === count ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>{count} hull</button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">Grunnbane</p>
            <div className="grid grid-cols-2 gap-2">
              {PUB_GOLF_PRESETS.map((preset) => (
                <button key={preset.id} onClick={() => setPresetId(preset.id)} className={`rounded-2xl px-4 py-3 text-left transition active:scale-[0.98] ${presetId === preset.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                  <span className="block font-display text-base font-bold">{preset.name}</span>
                  <span className={`mt-0.5 block text-xs ${presetId === preset.id ? "text-white/60" : "text-gray-400"}`}>{preset.description}</span>
                </button>
              ))}
            </div>
          </section>

          <Button onClick={prepareCourse}>Velg hull</Button>
        </div>
      </main>
    );
  }

  if (phase === "course") {
    return (
      <main className="relative flex h-full flex-col overflow-hidden bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 text-center">
        <header className="flex shrink-0 items-center justify-between">
          <button onClick={() => setPhase("setup")} className="min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500">← Oppsett</button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tighter text-gray-900">Velg hull</h1>
            <p className="text-xs text-gray-400">{holes.length} hull</p>
          </div>
          <button onClick={mixCourse} className="icon-button bg-gray-100 text-gray-500" aria-label="Bland alle hull" title="Bland alle hull"><Shuffle size={18} /></button>
        </header>

        <p className="mt-4 shrink-0 text-sm text-gray-400">Bytt de hullene du vil. Hull 1 er alltid fast.</p>

        <section className="mt-4 min-h-0 flex-1 overflow-y-auto" aria-label="Valgte pubgolfhull">
          <div className="space-y-2 pb-2">
            {holes.map((hole, index) => (
              <div key={`${index}-${hole.id}`} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left ${index === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${index === 0 ? "bg-white text-gray-900" : "bg-white text-gray-500"}`}>{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base font-bold">{hole.title}</span>
                  <span className={`block text-xs ${index === 0 ? "text-white/55" : "text-gray-400"}`}>Par {hole.par}</span>
                </span>
                {index === 0 ? <span className="px-2 text-xs font-bold text-white/55">Fast</span> : <button onClick={() => setPickerIndex(index)} className="min-h-10 rounded-xl bg-white px-3 text-xs font-bold text-gray-600">Bytt</button>}
              </div>
            ))}
          </div>
        </section>

        <Button onClick={startRound} className="mt-3 shrink-0">Start runden</Button>
        {pickerIndex !== null && <ChallengePicker holes={holes} holeIndex={pickerIndex} onChoose={chooseChallenge} onClose={() => setPickerIndex(null)} />}
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
        <button onClick={() => setPhase("course")} className="min-h-11 rounded-full bg-gray-100 px-4 text-sm text-gray-500 transition active:scale-95">← Bane</button>
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
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase text-gray-400"><span>Utfordring</span><span>·</span><span>Par {hole.par}</span></div>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900">{hole.title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-relaxed text-gray-600">{hole.task}</p>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-gray-400">{hole.rule}</p>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto" aria-label="Lagscore">
        <div className="space-y-1.5 pb-2">
          {teams.map((team) => {
            const value = scores[team.id][currentHole];
            const jokerUsed = jokers[team.id];
            return (
              <div key={team.id} className="flex items-center gap-2 rounded-2xl bg-gray-100 p-1 pl-3">
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate font-display text-sm font-bold text-gray-700">{team.name}</p>
                  <button onClick={() => applyJoker(team.id)} disabled={jokerUsed || value === 0} className="mt-0.5 text-[10px] font-bold text-gray-400 disabled:opacity-45">{jokerUsed ? "Joker brukt" : "Bruk joker -1"}</button>
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
