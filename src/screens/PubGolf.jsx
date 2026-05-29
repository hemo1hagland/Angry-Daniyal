import { useMemo, useState } from "react";
import Button from "../components/Button";

const DEFAULT_BARS = [
  "Bar 1",
  "Bar 2",
  "Bar 3",
  "Bar 4",
  "Bar 5",
  "Bar 6",
  "Bar 7",
  "Bar 8",
  "Bar 9",
];

const DEFAULT_HOLE_COUNT = 9;

const OPENING_HOLE = {
  title: "Åpningshullet",
  par: 1,
  drink: "Chug",
  task: "Alle starter med chug. Dette hullet er låst.",
  rule: "Chug = 1 slag.",
  locked: true,
};

const CHALLENGES = [
  {
    title: "Split the G",
    par: 2,
    drink: "Guinness",
    task: "Prøv å lande første slurk midt i G-en. Treffer laget, skriv par.",
    rule: "Bom gir +1.",
  },
  {
    title: "Wrong hand",
    par: 3,
    drink: "Valgfri",
    task: "Hele laget drikker med feil hånd på dette hullet.",
    rule: "Glemmer noen det, legg på +1.",
  },
  {
    title: "Caddie choice",
    par: 4,
    drink: "Lagkameratens valg",
    task: "En på laget velger drikke for en annen.",
    rule: "Nekt gir +1.",
  },
  {
    title: "Golf-kommentator",
    par: 4,
    drink: "Valgfri",
    task: "Forklar lagets score med golfkommentator-stemme.",
    rule: "Bryter noen karakteren helt, legg på +1.",
  },
  {
    title: "Team chant",
    par: 3,
    drink: "Valgfri",
    task: "Lag et kort lagrop før første slurk.",
    rule: "Ingen lagrop gir +1.",
  },
  {
    title: "Photo finish",
    par: 3,
    drink: "Valgfri",
    task: "Ta et dramatisk lagbilde før dere går videre.",
    rule: "Ingen bilde gir +1.",
  },
  {
    title: "Mulligan",
    par: 4,
    drink: "Samme som forrige hull",
    task: "Dårligste lag kan trekke fra 1 hvis alle fullfører hullet.",
    rule: "Kan bare brukes én gang per lag.",
  },
  {
    title: "Trivia tee",
    par: 2,
    drink: "Liten drikke",
    task: "Motstanderlaget stiller ett lett quizspørsmål.",
    rule: "Feil svar gir +1.",
  },
  {
    title: "Dress code",
    par: 5,
    drink: "Valgfri",
    task: "Alle må bruke golfpose/kostymedel på dette hullet.",
    rule: "Manglende kostyme gir +1.",
  },
  {
    title: "Strawpedo",
    par: 2,
    drink: "Flaskeøl eller cider",
    task: "Fullfør med sugerør-trikset.",
    rule: "Mislykket forsøk gir +1.",
  },
  {
    title: "Phone ban",
    par: 4,
    drink: "Valgfri",
    task: "Ingen på laget bruker mobilen før neste hull.",
    rule: "Mobil oppe gir +1.",
  },
  {
    title: "Caddy walk",
    par: 3,
    drink: "Valgfri",
    task: "Gå samlet inn som et seriøst golf-team.",
    rule: "Mister laget samlet entré, legg på +1.",
  },
  {
    title: "Final putt",
    par: 2,
    drink: "Siste lille drikke",
    task: "Alle gjetter hvem som leder før leaderboard åpnes.",
    rule: "Feil laggjetting gir +1.",
  },
  {
    title: "Par save",
    par: 3,
    drink: "Valgfri",
    task: "Laget må treffe nøyaktig par på dette hullet.",
    rule: "Over eller under par gir +1.",
  },
  {
    title: "Captain's order",
    par: 4,
    drink: "Kapteinens valg",
    task: "Kapteinen bestemmer rekkefølgen laget drikker i.",
    rule: "Feil rekkefølge gir +1.",
  },
];

const getScoreActions = (hole) => {
  if (hole.locked) {
    return [
      { label: "Chug", detail: "Fullført", value: 1 },
      { label: "Treg", detail: "Nesten", value: 2 },
      { label: "Ikke ferdig", detail: "Straff", value: 3 },
      { label: "Søl +1", detail: "Legg på", delta: 1 },
    ];
  }

  return [
    { label: "Par", detail: "Klarte hullet", value: hole.par },
    { label: "+1", detail: "Liten straff", delta: 1 },
    { label: "+2", detail: "Ikke ferdig", delta: 2 },
    { label: "-1", detail: "Bonus/mulligan", delta: -1 },
  ];
};

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const shuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const createTeams = (players, teamCount) => {
  const count = Math.min(teamCount, Math.max(1, players.length));
  const teams = Array.from({ length: count }, (_, index) => ({
    id: makeId(),
    name: `Lag ${index + 1}`,
    players: [],
  }));

  shuffle(players).forEach((player, index) => {
    teams[index % count].players.push(player);
  });

  return teams.filter((team) => team.players.length);
};

const createHole = (index, bar = `Bar ${index + 1}`, challenge = index === 0 ? OPENING_HOLE : shuffle(CHALLENGES)[0]) => ({
  ...challenge,
  locked: index === 0 || Boolean(challenge.locked),
  id: makeId(),
  bar: bar.trim() || `Bar ${index + 1}`,
});

const createCourse = (barNames, count = DEFAULT_HOLE_COUNT) => {
  const picked = shuffle(CHALLENGES);
  return Array.from({ length: count }, (_, index) =>
    createHole(index, barNames[index], index === 0 ? OPENING_HOLE : picked[(index - 1) % picked.length]),
  );
};

const normalizeBars = (count) =>
  Array.from({ length: count }, (_, index) => DEFAULT_BARS[index] || `Bar ${index + 1}`);

const renumberHoles = (holes) =>
  holes.map((hole, index) => ({
    ...hole,
    ...(index === 0 ? OPENING_HOLE : {}),
    locked: index === 0,
    bar: hole.bar?.trim() || `Bar ${index + 1}`,
  }));

const createScores = (teams, holes) =>
  Object.fromEntries(
    teams.map((team) => [
      team.id,
      holes.map((hole) => ({
        value: hole.par,
        done: false,
      })),
    ]),
  );

const teamTotal = (teamId, scores, teams = []) => {
  const baseScore = (scores[teamId] || []).reduce((sum, score) => sum + score.value, 0);
  const nameBonus = teams.find((team) => team.id === teamId)?.nameBonus ? 1 : 0;

  return baseScore - nameBonus;
};

function RouteMap({ holes, currentHole }) {
  const compact = holes.length > 7;

  return (
    <div className="overflow-hidden rounded-2xl bg-gray-50 px-3 py-2 ring-1 ring-gray-200">
      <div
        className="relative grid items-center gap-1"
        style={{ gridTemplateColumns: `repeat(${holes.length}, minmax(0, 1fr))` }}
      >
        <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200" />
        <div
          className="absolute left-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-emerald-500 transition-all"
          style={{ width: holes.length > 1 ? `calc((100% - 32px) * ${currentHole / (holes.length - 1)})` : 0 }}
        />
        {holes.map((hole, index) => {
          const active = index === currentHole;
          const completed = index < currentHole;

          return (
            <div
              key={hole.id || index}
              className="relative z-10 grid place-items-center"
            >
              <div
                className={`grid shrink-0 place-items-center rounded-full font-display font-bold transition ${
                  compact ? "h-7 w-7 text-xs" : "h-8 w-8 text-sm"
                } ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : completed
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-gray-400 ring-1 ring-gray-200"
                }`}
                aria-label={`Hull ${index + 1}: ${hole.bar}`}
              >
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex items-center justify-between font-body text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
        <span>Start</span>
        <span className="truncate px-2 text-center normal-case tracking-normal text-slate-500">
          {holes[currentHole]?.bar}
        </span>
        <span>Mål</span>
      </div>
    </div>
  );
}

function ChallengeInfoModal({ hole, onClose }) {
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/35 px-3 pb-3 backdrop-blur-sm">
      <div className="w-full rounded-[30px] bg-white p-4 text-left shadow-[0_18px_55px_rgba(15,23,42,0.22)] ring-1 ring-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Challenge
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tighter text-slate-900">
              {hole.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-4 py-2 font-body text-sm font-bold text-gray-500 active:scale-[0.96]"
          >
            Lukk
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Par</p>
            <p className="font-display text-2xl font-bold text-slate-900">{hole.par}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Drikke</p>
            <p className="truncate font-display text-lg font-bold text-slate-900">{hole.drink}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-slate-900 px-4 py-4 text-white">
          <p className="font-body text-sm font-semibold leading-snug text-white/75">{hole.task}</p>
          <p className="mt-3 font-body text-sm font-bold leading-snug">{hole.rule}</p>
        </div>
      </div>
    </div>
  );
}

function TeamPreview({ teams, onRename, onPickNameBonus }) {
  if (!teams.length) return null;

  return (
    <div className="mt-3 grid gap-2">
      {teams.map((team) => (
        <div key={team.id} className="rounded-2xl bg-slate-900 p-3 text-left text-white">
          <div className="flex items-center gap-2">
            <input
              value={team.name}
              onChange={(event) => onRename(team.id, event.target.value)}
              className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 font-display text-base font-bold text-white outline-none ring-1 ring-white/10 placeholder:text-white/35 focus:ring-white/40"
              placeholder="Lagnavn"
            />
            <button
              onClick={() => onPickNameBonus(team.id)}
              className={`shrink-0 rounded-xl px-3 py-2 font-body text-[10px] font-bold uppercase tracking-[0.12em] active:scale-[0.96] ${
                team.nameBonus ? "bg-red-500 text-white" : "bg-white/10 text-white/60"
              }`}
            >
              -1
            </button>
          </div>
          <p className="mt-2 truncate font-body text-xs font-semibold text-white/60">{team.players.join(", ")}</p>
          {team.nameBonus && (
            <p className="mt-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-red-200">
              Beste lagnavn
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Leaderboard({ teams, scores, onClose }) {
  const ranked = [...teams].sort((a, b) => teamTotal(a.id, scores, teams) - teamTotal(b.id, scores, teams));

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.16)] ring-1 ring-gray-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold tracking-tighter text-slate-900">Score</h2>
          <button onClick={onClose} className="rounded-full bg-gray-100 px-3 py-2 font-body text-sm font-bold text-gray-500">
            Lukk
          </button>
        </div>
        <div className="space-y-2">
          {ranked.map((team, index) => (
            <div key={team.id} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-left ring-1 ring-gray-200">
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold text-slate-900">
                  {index + 1}. {team.name}
                </p>
                <p className="truncate font-body text-xs font-semibold text-gray-400">
                  {team.players.join(", ")}
                </p>
              </div>
              <p className="font-display text-3xl font-bold text-slate-900">{teamTotal(team.id, scores, teams)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-body text-sm font-semibold text-gray-500">
          Lavest score vinner.
        </p>
      </div>
    </div>
  );
}

function LiveScoreButton({ teams, scores, onClick }) {
  const ranked = [...teams].sort((a, b) => teamTotal(a.id, scores, teams) - teamTotal(b.id, scores, teams));

  return (
    <button
      onClick={onClick}
      className="w-28 rounded-2xl bg-gray-100 px-3 py-2 text-left ring-1 ring-gray-200 active:scale-[0.96]"
    >
      <p className="font-body text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
        Score
      </p>
      <div className="mt-1 space-y-0.5">
        {ranked.slice(0, 2).map((team) => (
          <div key={team.id} className="flex items-center justify-between gap-1">
            <span className="truncate font-body text-[10px] font-bold text-slate-700">{team.name}</span>
            <span className="font-display text-sm font-bold leading-none text-slate-900">
              {teamTotal(team.id, scores, teams)}
            </span>
          </div>
        ))}
        {ranked.length > 2 && (
          <p className="font-body text-[9px] font-bold text-gray-400">
            +{ranked.length - 2} lag
          </p>
        )}
      </div>
    </button>
  );
}

function ChallengePicker({ hole, holeNumber, onChoose, onClose }) {
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/35 px-3 pb-3 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full flex-col overflow-hidden rounded-[30px] bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.22)]">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <div className="min-w-0 text-left">
            <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Hull {holeNumber}
            </p>
            <h2 className="truncate font-display text-3xl font-bold tracking-tighter text-slate-900">
              {hole.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-4 py-2 font-body text-sm font-bold text-gray-500"
          >
            Lukk
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {CHALLENGES.map((challenge) => {
            const selected = challenge.title === hole.title;
            return (
              <button
                key={challenge.title}
                onClick={() => onChoose(challenge)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left ring-1 transition active:scale-[0.98] ${
                  selected
                    ? "bg-slate-900 text-white ring-slate-900"
                    : "bg-gray-50 text-slate-900 ring-gray-200"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold leading-tight">{challenge.title}</p>
                  <p className={`mt-0.5 truncate font-body text-xs font-bold ${selected ? "text-white/55" : "text-gray-400"}`}>
                    Par {challenge.par} · {challenge.drink}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.12em] ${
                  selected ? "bg-white/15 text-white/75" : "bg-white text-gray-400 ring-1 ring-gray-200"
                }`}>
                  {selected ? "Valgt" : "Velg"}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 shrink-0 text-center font-body text-xs font-bold text-gray-400">
          Bla for flere valg
        </p>
      </div>
    </div>
  );
}

function EndScreen({ teams, scores, onEdit, onReplay, onHome }) {
  const ranked = [...teams].sort((a, b) => teamTotal(a.id, scores, teams) - teamTotal(b.id, scores, teams));
  const winnerScore = teamTotal(ranked[0].id, scores, teams);
  const winners = ranked.filter((team) => teamTotal(team.id, scores, teams) === winnerScore);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white px-5 py-6 text-center">
      <h1 className="font-display text-5xl font-bold tracking-tighter text-slate-900">Pubgolf</h1>
      <p className="mt-1 font-body text-sm font-semibold text-gray-400">Sluttresultat</p>

      <div className="mt-6 rounded-[30px] bg-slate-900 p-5 text-white shadow-[0_18px_55px_rgba(15,23,42,0.16)]">
        <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-white/50">Vinner</p>
        <p className="mt-2 text-4xl leading-none">🏆</p>
        <p className="mt-2 font-display text-4xl font-bold">
          {winners.map((team) => team.name).join(", ")}
        </p>
        <p className="mt-1 font-body text-sm font-bold text-white/55">
          Lavest score: {winnerScore}
        </p>
      </div>

      <div className="mt-5 space-y-2">
        {ranked.map((team, index) => {
          const isWinner = teamTotal(team.id, scores, teams) === winnerScore;

          return (
            <div
              key={team.id}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left ring-1 ${
                isWinner ? "bg-gray-50 ring-slate-900/20" : "bg-white ring-gray-200"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-lg font-bold ${
                  isWinner ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {isWinner ? "🏆" : index + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-bold text-slate-900">{team.name}</p>
                  <p className="truncate font-body text-xs font-semibold text-gray-400">{team.players.join(", ")}</p>
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">{teamTotal(team.id, scores, teams)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-auto grid gap-2 pt-6">
        <Button onClick={onEdit}>Endre score</Button>
        <Button onClick={onReplay} variant="secondary">Ny pubgolf</Button>
        <Button onClick={onHome} variant="secondary">Til meny</Button>
      </div>
    </div>
  );
}

export default function PubGolf({ onBack }) {
  const [phase, setPhase] = useState("teams");
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);
  const [barNames, setBarNames] = useState(() => normalizeBars(DEFAULT_HOLE_COUNT));
  const [holes, setHoles] = useState([]);
  const [scores, setScores] = useState({});
  const [currentHole, setCurrentHole] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [challengePicker, setChallengePicker] = useState(null);
  const [showChallengeInfo, setShowChallengeInfo] = useState(false);
  const [finishArmed, setFinishArmed] = useState(false);

  const canMakeTeams = players.length >= 2;
  const current = holes[currentHole];
  const currentScores = scores;

  const rankedTeams = useMemo(
    () => [...teams].sort((a, b) => teamTotal(a.id, currentScores, teams) - teamTotal(b.id, currentScores, teams)),
    [teams, currentScores],
  );

  const addPlayer = () => {
    const cleanName = playerName.trim() || `Spiller ${players.length + 1}`;
    setPlayers((currentPlayers) => [...currentPlayers, cleanName]);
    setTeams([]);
    setPlayerName("");
  };

  const removePlayer = (player) => {
    setPlayers((currentPlayers) => currentPlayers.filter((item) => item !== player));
    setTeams([]);
  };

  const randomizeTeams = () => {
    if (!canMakeTeams) return;
    setTeams(createTeams(players, teamCount));
  };

  const renameTeam = (teamId, name) => {
    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === teamId ? { ...team, name } : team,
      ),
    );
  };

  const pickNameBonus = (teamId) => {
    setTeams((currentTeams) =>
      currentTeams.map((team) => ({
        ...team,
        nameBonus: team.id === teamId,
      })),
    );
  };

  const goToRoute = () => {
    const readyTeams = teams.length ? teams : createTeams(players, teamCount);
    const nextCourse = createCourse(barNames, barNames.length);
    setTeams(readyTeams);
    setHoles(nextCourse);
    setPhase("route");
  };

  const randomizeHoles = () => {
    setHoles(createCourse(barNames, holes.length || barNames.length));
  };

  const addHole = () => {
    setHoles((currentHoles) => {
      const nextIndex = currentHoles.length;
      const nextHoles = [...currentHoles, createHole(nextIndex)];
      setBarNames(nextHoles.map((hole) => hole.bar));
      return nextHoles;
    });
  };

  const removeHole = (holeIndex) => {
    if (holeIndex === 0) return;
    if (holes.length <= 3) return;
    setHoles((currentHoles) => {
      const nextHoles = renumberHoles(currentHoles.filter((_, index) => index !== holeIndex));
      setBarNames(nextHoles.map((hole) => hole.bar));
      return nextHoles;
    });
  };

  const swapHole = (holeIndex) => {
    if (holeIndex === 0) return;
    setHoles((currentHoles) => {
      const used = new Set(currentHoles.map((hole) => hole.title));
      const options = CHALLENGES.filter((challenge) => !used.has(challenge.title));
      const challenge = shuffle(options.length ? options : CHALLENGES)[0];

      return currentHoles.map((hole, index) =>
        index === holeIndex
          ? { ...challenge, locked: false, id: makeId(), bar: hole.bar }
          : hole,
      );
    });
  };

  const chooseChallenge = (holeIndex, challenge) => {
    if (holeIndex === 0) return;
    setHoles((currentHoles) =>
      currentHoles.map((hole, index) =>
        index === holeIndex
          ? { ...challenge, locked: false, id: makeId(), bar: hole.bar }
          : hole,
      ),
    );
    setChallengePicker(null);
  };

  const startRound = () => {
    setScores(createScores(teams, holes));
    setCurrentHole(0);
    setFinishArmed(false);
    setShowChallengeInfo(false);
    setPhase("play");
  };

  const setHoleScore = (teamId, value) => {
    setFinishArmed(false);
    setScores((currentState) => ({
      ...currentState,
      [teamId]: currentState[teamId].map((score, index) =>
        index === currentHole ? { ...score, value: Math.max(0, value) } : score,
      ),
    }));
  };

  const applyScoreAction = (teamId, action) => {
    const score = scores[teamId][currentHole];
    const nextValue = typeof action.value === "number"
      ? action.value
      : score.value + action.delta;

    setHoleScore(teamId, nextValue);
  };

  const replay = () => {
    setPhase("teams");
    setPlayerName("");
    setPlayers([]);
    setTeams([]);
    setHoles([]);
    setScores({});
    setCurrentHole(0);
    setShowLeaderboard(false);
    setChallengePicker(null);
    setShowChallengeInfo(false);
    setFinishArmed(false);
  };

  if (phase === "end") {
    return (
      <EndScreen
        teams={teams}
        scores={scores}
        onEdit={() => {
          setFinishArmed(false);
          setCurrentHole(Math.max(0, holes.length - 1));
          setPhase("play");
        }}
        onReplay={replay}
        onHome={onBack}
      />
    );
  }

  if (phase === "teams") {
    return (
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-white px-5 py-5 text-center">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <button
            onClick={onBack}
            className="rounded-full bg-gray-100 px-4 py-2 font-body text-sm text-gray-500 transition active:scale-[0.95]"
          >
            ← Meny
          </button>
          <span className="font-body text-xs uppercase tracking-[0.25em] text-gray-400">Start</span>
        </div>

        <h1 className="shrink-0 font-display text-5xl font-bold tracking-tighter text-slate-900">Pubgolf</h1>
        <p className="mx-auto mt-1 max-w-xs shrink-0 font-body text-sm font-semibold leading-snug text-gray-400">
          Skriv inn folk, velg antall lag og trykk random.
        </p>

        <div className="mt-5 shrink-0 rounded-[28px] bg-gray-50 p-3 text-left ring-1 ring-gray-200">
          <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Deltakere</p>
          <div className="mt-2 flex gap-2">
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addPlayer();
              }}
              placeholder={`Spiller ${players.length + 1}`}
              className="min-w-0 flex-1 rounded-2xl bg-white px-4 py-3 font-display text-base font-bold text-slate-900 outline-none ring-1 ring-gray-200 placeholder:text-gray-300 focus:ring-slate-900"
            />
            <button
              onClick={addPlayer}
              className="rounded-2xl bg-slate-900 px-4 font-display text-sm font-bold text-white active:scale-[0.96]"
            >
              Legg til
            </button>
          </div>
          <div className="mt-3 flex max-h-24 flex-wrap gap-2 overflow-y-auto">
            {players.map((player) => (
              <button
                key={player}
                onClick={() => removePlayer(player)}
                className="rounded-full bg-white px-3 py-2 font-body text-xs font-bold text-slate-700 ring-1 ring-gray-200 active:scale-[0.96]"
              >
                {player} ×
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 shrink-0 rounded-[28px] bg-gray-50 p-3 text-left ring-1 ring-gray-200">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Lag</p>
            <button
              onClick={randomizeTeams}
              disabled={!canMakeTeams}
              className="rounded-full bg-slate-900 px-4 py-2 font-body text-xs font-bold text-white disabled:opacity-40"
            >
              Random
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => {
                  setTeamCount(count);
                  setTeams([]);
                }}
                className={`rounded-2xl py-3 font-display text-sm font-bold active:scale-[0.96] ${
                  teamCount === count
                    ? "bg-slate-900 text-white"
                    : "bg-white text-gray-500 ring-1 ring-gray-200"
                }`}
              >
                {count} lag
              </button>
            ))}
          </div>
          <p className="mt-2 font-body text-xs font-bold text-gray-400">
            Gi lagene navn. Beste lagnavn starter med -1 slag.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TeamPreview teams={teams} onRename={renameTeam} onPickNameBonus={pickNameBonus} />
          {!teams.length && (
            <p className="mt-8 font-body text-sm font-semibold text-gray-400">
              Legg til minst 2 spillere og trykk Random.
            </p>
          )}
        </div>

        <div className="mt-3 shrink-0">
          <Button onClick={goToRoute} disabled={!canMakeTeams}>
            Neste: barer
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "route") {
    return (
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-white px-5 py-5 text-center">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <button
            onClick={() => setPhase("teams")}
            className="rounded-full bg-gray-100 px-4 py-2 font-body text-sm text-gray-500 transition active:scale-[0.95]"
          >
            ← Lag
          </button>
          <span className="font-body text-xs uppercase tracking-[0.25em] text-gray-400">Rute</span>
        </div>

        <h1 className="shrink-0 font-display text-4xl font-bold tracking-tighter text-slate-900">
          {holes.length} hull
        </h1>

        <div className="mt-3 flex shrink-0 gap-2">
          <button
            onClick={() => {
              const nextBars = normalizeBars(holes.length);
              setBarNames(nextBars);
              setHoles(createCourse(nextBars, holes.length));
            }}
            className="flex-1 rounded-2xl bg-gray-100 px-3 py-3 font-display text-sm font-bold text-gray-600 active:scale-[0.96]"
          >
            Barforslag
          </button>
          <button
            onClick={randomizeHoles}
            className="flex-1 rounded-2xl bg-slate-900 px-3 py-3 font-display text-sm font-bold text-white active:scale-[0.96]"
          >
            Nye challenges
          </button>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-[28px] bg-gray-50 p-3 text-left ring-1 ring-gray-200">
          <div className="space-y-2 pb-1">
            {holes.map((hole, index) => (
              <div key={hole.id} className="rounded-2xl bg-white p-3 ring-1 ring-gray-200">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label
                    htmlFor={`pubgolf-bar-${index}`}
                    className="font-body text-xs font-bold uppercase tracking-[0.16em] text-gray-400"
                  >
                    Bar {index + 1}
                  </label>
                  <button
                    onClick={() => removeHole(index)}
                    disabled={index === 0 || holes.length <= 3}
                    className="rounded-full bg-gray-100 px-3 py-1.5 font-body text-[10px] font-bold text-gray-500 disabled:opacity-35"
                  >
                    {index === 0 ? "Låst" : "Fjern"}
                  </button>
                </div>
                <input
                  id={`pubgolf-bar-${index}`}
                  value={hole.bar}
                  onChange={(event) => {
                    const value = event.target.value;
                    setBarNames((currentNames) =>
                      currentNames.map((bar, barIndex) => (barIndex === index ? value : bar)),
                    );
                    setHoles((currentHoles) =>
                      currentHoles.map((courseHole, holeIndex) =>
                        holeIndex === index ? { ...courseHole, bar: value } : courseHole,
                      ),
                    );
                  }}
                  placeholder={`Skriv bar ${index + 1}`}
                  className="w-full rounded-2xl bg-gray-50 px-4 py-3 font-display text-base font-bold text-slate-900 outline-none ring-1 ring-gray-200 placeholder:text-gray-300 focus:ring-slate-900"
                />
                <div
                  className={`mt-2 flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left ring-1 ${
                    index === 0
                      ? "bg-slate-900 text-white ring-slate-900"
                      : "bg-gray-100 text-slate-900 ring-gray-200"
                  }`}
                >
                  <button
                    onClick={() => setChallengePicker(index)}
                    disabled={index === 0}
                    className="min-w-0 flex-1 text-left disabled:cursor-default"
                  >
                    <p className={`font-body text-[10px] font-bold uppercase tracking-[0.16em] ${
                      index === 0 ? "text-white/45" : "text-gray-400"
                    }`}>
                      Challenge
                    </p>
                    <p className="truncate font-display text-lg font-bold">
                      {index === 0 ? "Åpningshullet · Chug" : hole.title}
                    </p>
                  </button>
                  <button
                    onClick={() => setShowChallengeInfo(hole)}
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-base font-bold ring-1 active:scale-[0.96] ${
                      index === 0
                        ? "bg-white/15 text-white ring-white/10"
                        : "bg-white text-slate-900 ring-gray-200"
                    }`}
                    aria-label={`Info om ${hole.title}`}
                  >
                    i
                  </button>
                  <span className={`shrink-0 rounded-full px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.12em] ${
                    index === 0 ? "bg-white/15 text-white/70" : "bg-white text-gray-500"
                  }`}>
                    {index === 0 ? "Låst" : `Par ${hole.par}`}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={addHole}
              className="w-full rounded-2xl bg-white px-4 py-4 font-display text-base font-bold text-slate-900 ring-1 ring-dashed ring-gray-300 active:scale-[0.98]"
            >
              + Legg til hull
            </button>
          </div>
        </div>

        <div className="mt-3 shrink-0">
          <Button onClick={startRound}>Start runden</Button>
        </div>

        {challengePicker !== null && (
          <ChallengePicker
            hole={holes[challengePicker]}
            holeNumber={challengePicker + 1}
            onChoose={(challenge) => chooseChallenge(challengePicker, challenge)}
            onClose={() => setChallengePicker(null)}
          />
        )}

        {showChallengeInfo && (
          <ChallengeInfoModal
            hole={showChallengeInfo === true ? holes[0] : showChallengeInfo}
            onClose={() => setShowChallengeInfo(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white px-3 py-2 text-center">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <button
          onClick={() => setPhase("route")}
          className="rounded-full bg-gray-100 px-3 py-1.5 font-body text-xs font-bold text-gray-500 active:scale-[0.95]"
        >
          ← Rute
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold tracking-tighter text-slate-900">Hull {currentHole + 1}</h1>
          <p className="truncate font-body text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
            {current.bar} · Par {current.par}
          </p>
        </div>
        <LiveScoreButton teams={rankedTeams} scores={scores} onClick={() => setShowLeaderboard(true)} />
      </div>

      <div className="mt-1.5 shrink-0">
        <RouteMap holes={holes} currentHole={currentHole} />
      </div>

      <div className="mt-1.5 shrink-0 rounded-[20px] bg-slate-900 p-2 text-center text-white">
        <p className="font-body text-[9px] font-bold uppercase tracking-[0.22em] text-white/45">
          Hull {currentHole + 1} · Par {current.par}
        </p>
        <h2 className="truncate font-display text-xl font-bold tracking-tight">
          {current.bar}
        </h2>
        <div className="mt-1 flex items-center justify-between gap-2 rounded-2xl bg-white px-3 py-1.5 text-left text-slate-900">
          <div className="min-w-0">
            <p className="font-body text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
              Challenge
            </p>
            <p className="truncate font-display text-lg font-bold leading-tight">
              {current.title}
            </p>
          </div>
          <button
            onClick={() => setShowChallengeInfo(true)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-100 font-display text-sm font-bold text-slate-900 ring-1 ring-gray-200 active:scale-[0.96]"
            aria-label="Vis challenge-info"
          >
            i
          </button>
        </div>
      </div>

      <div className="mt-1.5 min-h-0 flex-1 overflow-y-auto rounded-[22px] bg-gray-50 p-1.5 ring-1 ring-gray-200">
        <div className="space-y-1.5">
          {teams.map((team) => {
            const score = scores[team.id][currentHole];
            return (
              <div key={team.id} className="rounded-2xl bg-white p-2 text-left ring-1 ring-gray-200">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-slate-900">{team.name}</p>
                    <p className="truncate font-body text-[10px] font-semibold text-gray-400">{team.players.join(", ")}</p>
                  </div>
                  <p className="shrink-0 font-body text-[11px] font-bold text-gray-400">
                    Total {teamTotal(team.id, scores, teams)}
                  </p>
                </div>
                <div className="grid grid-cols-[42px_1fr_42px] items-center gap-1.5">
                  <button
                    onClick={() => setHoleScore(team.id, score.value - 1)}
                    className="h-11 rounded-2xl bg-gray-100 font-display text-xl font-bold text-slate-700 active:scale-[0.96]"
                  >
                    -
                  </button>
                  <div className="rounded-2xl bg-slate-900 py-1.5 text-center text-white">
                    <p className="font-body text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">Slag</p>
                    <p className="font-display text-3xl font-bold leading-none">{score.value}</p>
                  </div>
                  <button
                    onClick={() => setHoleScore(team.id, score.value + 1)}
                    className="h-11 rounded-2xl bg-red-500 font-display text-xl font-bold text-white active:scale-[0.96]"
                  >
                    +
                  </button>
                </div>
                <div className="mt-1.5">
                  <div className="grid grid-cols-4 gap-1">
                    {getScoreActions(current).map((action) => (
                      <button
                        key={`${action.label}-${action.detail}`}
                        onClick={() => applyScoreAction(team.id, action)}
                        className="rounded-xl bg-gray-50 px-1.5 py-1.5 text-center ring-1 ring-gray-200 active:scale-[0.97]"
                      >
                        <span className="block truncate font-display text-[11px] font-bold text-slate-900">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-1.5 grid shrink-0 grid-cols-3 gap-2">
        <Button
          onClick={() => {
            setFinishArmed(false);
            setCurrentHole((index) => Math.max(0, index - 1));
          }}
          variant="secondary"
          className="py-2.5 text-sm"
        >
          Forrige
        </Button>
        <Button
          onClick={() => {
            if (currentHole === holes.length - 1) {
              if (finishArmed) {
                setFinishArmed(false);
                setPhase("end");
              } else {
                setFinishArmed(true);
              }
            } else {
              setFinishArmed(false);
              setCurrentHole((index) => index + 1);
            }
          }}
          className={`py-2.5 text-sm ${finishArmed ? "!bg-red-500 !text-white" : ""}`}
        >
          {currentHole === holes.length - 1 ? (finishArmed ? "Bekreft" : "Ferdig") : "Neste"}
        </Button>
        <Button onClick={() => setShowLeaderboard(true)} variant="secondary" className="py-2.5 text-sm">
          Score
        </Button>
      </div>

      {showLeaderboard && (
        <Leaderboard teams={rankedTeams} scores={scores} onClose={() => setShowLeaderboard(false)} />
      )}

      {showChallengeInfo && (
        <ChallengeInfoModal hole={current} onClose={() => setShowChallengeInfo(false)} />
      )}
    </div>
  );
}
