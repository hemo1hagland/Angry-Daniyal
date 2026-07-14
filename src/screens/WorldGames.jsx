import { useEffect, useState } from "react";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Dices from "lucide-react/dist/esm/icons/dices.js";
import Globe2 from "lucide-react/dist/esm/icons/globe-2.js";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw.js";
import Button from "../components/Button";
import { GOVERNOR_RULES, INTERNATIONAL_COUNTRIES, INTERNATIONAL_GAMES, KING_RULES } from "../data/internationalGames";

const shuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const createDeck = () => shuffle(
  ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"].flatMap((rank) => (
    ["Hjerter", "Ruter", "Klover", "Spar"].map((suit) => ({ rank, suit }))
  )),
);

function TopBar({ title, subtitle, onBack, onReset }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3">
      <button onClick={onBack} className="flex min-h-11 items-center gap-1 rounded-full bg-gray-100 px-4 text-sm text-gray-500"><ArrowLeft size={17} /> Tilbake</button>
      <div className="min-w-0 text-center">
        <h1 className="truncate font-display text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="truncate text-xs text-gray-400">{subtitle}</p>}
      </div>
      {onReset ? <button onClick={onReset} className="icon-button bg-gray-100 text-gray-500" aria-label="Start på nytt" title="Start på nytt"><RotateCcw size={17} /></button> : <span className="h-11 w-11" />}
    </header>
  );
}

function KingsCup({ onBack }) {
  const [deck, setDeck] = useState(createDeck);
  const [card, setCard] = useState(null);

  const reset = () => {
    setDeck(createDeck());
    setCard(null);
  };

  const draw = () => {
    const [nextCard, ...remaining] = deck;
    setCard(nextCard);
    setDeck(remaining);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const rule = card ? KING_RULES[card.rank] : null;
  return (
    <GameFrame title="King's Cup" subtitle={`${deck.length} kort igjen`} onBack={onBack} onReset={reset}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {card ? (
          <>
            <div className="grid h-40 w-28 place-items-center rounded-2xl border-2 border-gray-900 bg-white shadow-lg">
              <div><p className="font-display text-6xl font-bold text-gray-900">{card.rank}</p><p className="mt-1 text-xs text-gray-400">{card.suit}</p></div>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gray-400">{rule.title}</p>
            <p className="mt-2 max-w-xs font-display text-2xl font-bold leading-tight text-gray-900">{rule.text}</p>
          </>
        ) : <EmptyState icon="52" title="Digital kortstokk" text="Send mobilen videre etter hvert kort." />}
      </div>
      <Button onClick={deck.length ? draw : reset}>{deck.length ? (card ? "Trekk neste kort" : "Trekk første kort") : "Bland på nytt"}</Button>
    </GameFrame>
  );
}

function Governor({ onBack }) {
  const [number, setNumber] = useState(1);
  const [rules, setRules] = useState([]);
  const [rounds, setRounds] = useState(0);

  const reset = () => { setNumber(1); setRules([]); setRounds(0); };
  const correct = () => {
    if (number < 21) {
      setNumber((value) => value + 1);
      return;
    }
    const available = GOVERNOR_RULES.filter((rule) => !rules.includes(rule));
    const nextRule = available[Math.floor(Math.random() * available.length)] || GOVERNOR_RULES[Math.floor(Math.random() * GOVERNOR_RULES.length)];
    setRules((current) => [...current, nextRule]);
    setRounds((value) => value + 1);
    setNumber(1);
  };

  return (
    <GameFrame title="Governor 21" subtitle={`${rules.length} aktive regler`} onBack={onBack} onReset={reset}>
      <div className="min-h-0 flex-1 overflow-y-auto text-center">
        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gray-400">Neste tall</p>
        <p className="font-display text-[8rem] font-bold leading-none tracking-tighter text-gray-900">{number}</p>
        {rounds > 0 && <p className="mt-2 text-sm font-bold text-gray-500">{rounds} runder fullført</p>}
        <div className="mx-auto mt-6 max-w-xs space-y-2 text-left">
          {rules.map((rule, index) => <div key={`${index}-${rule}`} className="rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600"><span className="mr-2 text-gray-400">{index + 1}.</span>{rule}</div>)}
          {!rules.length && <p className="text-center text-sm text-gray-400">Nå er det bare å telle. Nye regler kommer ved 21.</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => setNumber(1)}>Feil, start på 1</Button>
        <Button onClick={correct}>{number === 21 ? "Guvernør!" : "Godkjent"}</Button>
      </div>
    </GameFrame>
  );
}

function Medusa({ onBack }) {
  const [status, setStatus] = useState("ready");
  const [countdown, setCountdown] = useState(3);
  const [round, setRound] = useState(1);

  useEffect(() => {
    if (status !== "counting") return undefined;
    const timer = window.setTimeout(() => {
      if (countdown === 1) {
        setCountdown(0);
        setStatus("reveal");
        if (navigator.vibrate) navigator.vibrate([60, 40, 100]);
      } else {
        setCountdown((value) => value - 1);
      }
    }, 750);
    return () => window.clearTimeout(timer);
  }, [countdown, status]);

  const start = () => { setCountdown(3); setStatus("counting"); };
  const nextRound = () => { setRound((value) => value + 1); setStatus("ready"); };
  const reset = () => { setRound(1); setCountdown(3); setStatus("ready"); };

  return (
    <GameFrame title="Medusa" subtitle={`Runde ${round}`} onBack={onBack} onReset={reset}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {status === "ready" && <EmptyState icon="↓" title="Alle ser ned" text="Bestem hvem du vil se på. Trykk når alle er klare." />}
        {status === "counting" && <><p className="text-sm text-gray-400">Hold blikket nede</p><p className="font-display text-[9rem] font-bold leading-none text-gray-900">{countdown}</p></>}
        {status === "reveal" && <><p className="font-display text-6xl font-bold text-gray-900">Se opp</p><p className="mt-4 max-w-xs text-base leading-relaxed text-gray-500">Møtte dere blikket? Rop «Medusa» og ta den avtalte konsekvensen.</p></>}
      </div>
      {status === "ready" ? <Button onClick={start}>Start nedtelling</Button> : status === "reveal" ? <Button onClick={nextRound}>Neste runde</Button> : <Button disabled>Teller ned</Button>}
    </GameFrame>
  );
}

function Quarters({ onBack, playerCount }) {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState(() => Array(playerCount).fill(0));
  const reset = () => { setCurrent(0); setScores(Array(playerCount).fill(0)); };
  const next = () => setCurrent((value) => (value + 1) % playerCount);
  const hit = () => {
    setScores((currentScores) => currentScores.map((score, index) => index === current ? score + 1 : score));
    if (navigator.vibrate) navigator.vibrate(30);
  };

  return (
    <GameFrame title="Quarters" subtitle={`Spiller ${current + 1} sin tur`} onBack={onBack} onReset={reset}>
      <div className="min-h-0 flex-1 overflow-y-auto text-center">
        <div className="mx-auto mt-8 grid h-40 w-40 place-items-center rounded-full border-8 border-gray-100 bg-white">
          <div><p className="text-xs uppercase tracking-[0.16em] text-gray-400">Aktiv</p><p className="font-display text-5xl font-bold text-gray-900">{current + 1}</p></div>
        </div>
        <div className="mx-auto mt-8 grid max-w-xs grid-cols-4 gap-2">
          {scores.map((score, index) => <div key={index} className={`rounded-xl px-2 py-3 ${index === current ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}><p className="text-[10px]">Spiller {index + 1}</p><p className="font-display text-xl font-bold">{score}</p></div>)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={next}>Bom</Button><Button onClick={hit}>Treff +1</Button></div>
    </GameFrame>
  );
}

function SevenEleven({ onBack, playerCount }) {
  const [current, setCurrent] = useState(0);
  const [dice, setDice] = useState(null);
  const roll = () => {
    setDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]);
    if (navigator.vibrate) navigator.vibrate(25);
  };
  const win = dice && (dice[0] === dice[1] || dice[0] + dice[1] === 7 || dice[0] + dice[1] === 11);
  const next = () => { setCurrent((value) => (value + 1) % playerCount); setDice(null); };
  return (
    <GameFrame title="7-11 Doubles" subtitle={`Spiller ${current + 1} ruller`} onBack={onBack} onReset={() => { setCurrent(0); setDice(null); }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {dice ? <><div className="flex gap-3">{dice.map((value, index) => <span key={index} className="grid h-24 w-24 place-items-center rounded-2xl bg-gray-900 font-display text-5xl font-bold text-white">{value}</span>)}</div><p className={`mt-6 font-display text-3xl font-bold ${win ? "text-gray-900" : "text-gray-400"}`}>{win ? "Du traff!" : `Sum ${dice[0] + dice[1]}`}</p><p className="mt-2 max-w-xs text-sm text-gray-400">{win ? "Velg en spiller som får avtalt konsekvens." : "Ingen 7, 11 eller par denne gangen."}</p></> : <EmptyState icon={<Dices size={44} />} title={`Spiller ${current + 1}`} text="Rull to terninger." />}
      </div>
      {dice ? <Button onClick={next}>Neste spiller</Button> : <Button onClick={roll}>Rull terningene</Button>}
    </GameFrame>
  );
}

function Maexchen({ onBack, playerCount }) {
  const [current, setCurrent] = useState(0);
  const [dice, setDice] = useState(null);
  const [stage, setStage] = useState("ready");
  const roll = () => { setDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]); setStage("peek"); };
  const pass = () => { setCurrent((value) => (value + 1) % playerCount); setStage("decision"); };
  const reset = () => { setCurrent(0); setDice(null); setStage("ready"); };
  const value = dice ? [...dice].sort((a, b) => b - a).join("") : "";
  return (
    <GameFrame title="Mäxchen" subtitle={`Spiller ${current + 1}`} onBack={onBack} onReset={reset}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {stage === "ready" && <EmptyState icon="?" title={`Spiller ${current + 1}`} text="Hold skjermen skjult for resten av gruppen." />}
        {stage === "peek" && <><p className="text-sm text-gray-400">Bare du skal se dette</p><div className="mt-4 flex gap-3">{dice.map((die, index) => <span key={index} className="grid h-24 w-24 place-items-center rounded-2xl bg-gray-900 font-display text-5xl font-bold text-white">{die}</span>)}</div><p className="mt-4 font-display text-2xl font-bold text-gray-900">Verdi {value}</p><p className="mt-2 max-w-xs text-sm text-gray-400">Si en verdi høyt. Du kan si sannheten eller bløffe.</p></>}
        {stage === "decision" && <EmptyState icon="!" title={`Spiller ${current + 1}`} text="Tror du på forrige spillers påstand?" />}
        {stage === "revealed" && <><p className="text-sm text-gray-400">Det virkelige kastet var</p><p className="mt-2 font-display text-7xl font-bold text-gray-900">{value}</p><p className="mt-4 max-w-xs text-sm text-gray-500">Gruppen avgjør om påstanden var sann. Taperen får avtalt konsekvens.</p></>}
      </div>
      {stage === "ready" && <Button onClick={roll}>Rull skjult</Button>}
      {stage === "peek" && <Button onClick={pass}>Skjul og send videre</Button>}
      {stage === "decision" && <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={roll}>Tro og rull</Button><Button onClick={() => setStage("revealed")}>Utfordre</Button></div>}
      {stage === "revealed" && <Button onClick={() => { setDice(null); setStage("ready"); }}>Neste runde</Button>}
    </GameFrame>
  );
}

function TeamRace({ gameId, onBack }) {
  const target = gameId === "flunkyball" ? 5 : 3;
  const title = gameId === "flunkyball" ? "Flunkyball" : "Flip Cup";
  const [scores, setScores] = useState([0, 0]);
  const winner = scores.findIndex((score) => score >= target);
  const score = (team) => setScores((current) => current.map((value, index) => index === team ? Math.min(target, value + 1) : value));
  return (
    <GameFrame title={title} subtitle={`Først til ${target}`} onBack={onBack} onReset={() => setScores([0, 0])}>
      <div className="flex flex-1 flex-col justify-center">
        <div className="grid grid-cols-2 gap-3 text-center">
          {[0, 1].map((team) => <button key={team} onClick={() => score(team)} disabled={winner >= 0} className={`rounded-2xl px-4 py-10 transition active:scale-[0.98] ${team === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}><span className="text-sm">Lag {team === 0 ? "A" : "B"}</span><span className="mt-2 block font-display text-7xl font-bold">{scores[team]}</span><span className={`mt-3 block text-xs ${team === 0 ? "text-white/55" : "text-gray-400"}`}>Trykk ved vunnet runde</span></button>)}
        </div>
        {winner >= 0 && <p className="mt-8 text-center font-display text-3xl font-bold text-gray-900">Lag {winner === 0 ? "A" : "B"} vinner</p>}
        <p className="mx-auto mt-5 max-w-xs text-center text-sm leading-relaxed text-gray-400">{gameId === "flunkyball" ? "Treff flasken for å vinne poenget. Bytt kastelag etter hvert forsøk." : "Første lag som får hele rekken med kopper rundt, vinner poenget."}</p>
      </div>
    </GameFrame>
  );
}

function GoonFortune({ onBack, playerCount }) {
  const [picked, setPicked] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const spin = () => {
    setSpinning(true);
    setPicked(null);
    window.setTimeout(() => {
      setPicked(1 + Math.floor(Math.random() * playerCount));
      setSpinning(false);
      if (navigator.vibrate) navigator.vibrate([40, 40, 80]);
    }, 700);
  };
  return (
    <GameFrame title="Goon of Fortune" subtitle={`${playerCount} spillere`} onBack={onBack} onReset={() => setPicked(null)}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className={`grid h-56 w-56 place-items-center rounded-full border-[12px] border-gray-100 bg-white ${spinning ? "animate-spin" : ""}`}>
          <div><p className="text-xs uppercase tracking-[0.18em] text-gray-400">{spinning ? "Velger" : picked ? "Valgt spiller" : "Klar"}</p><p className="font-display text-7xl font-bold text-gray-900">{picked || "?"}</p></div>
        </div>
        <p className="mt-6 max-w-xs text-sm text-gray-400">{picked ? `Spiller ${picked} tar avtalt konsekvens og starter neste runde.` : "Appen velger helt tilfeldig."}</p>
      </div>
      <Button onClick={spin} disabled={spinning}>{spinning ? "Snurrer" : "Snurr"}</Button>
    </GameFrame>
  );
}

function EmptyState({ icon, title, text }) {
  return <div className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gray-100 font-display text-4xl font-bold text-gray-700">{icon}</div><h2 className="mt-5 font-display text-3xl font-bold text-gray-900">{title}</h2><p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-400">{text}</p></div>;
}

function GameFrame({ title, subtitle, onBack, onReset, children }) {
  return <main className="flex h-full flex-col overflow-hidden bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5"><TopBar title={title} subtitle={subtitle} onBack={onBack} onReset={onReset} />{children}</main>;
}

function ActiveGame({ game, playerCount, onBack }) {
  if (game.id === "kings-cup") return <KingsCup onBack={onBack} />;
  if (game.id === "governor") return <Governor onBack={onBack} />;
  if (game.id === "medusa") return <Medusa onBack={onBack} />;
  if (game.id === "quarters") return <Quarters onBack={onBack} playerCount={playerCount} />;
  if (game.id === "seven-eleven") return <SevenEleven onBack={onBack} playerCount={playerCount} />;
  if (game.id === "maexchen") return <Maexchen onBack={onBack} playerCount={playerCount} />;
  if (game.id === "flip-cup" || game.id === "flunkyball") return <TeamRace gameId={game.id} onBack={onBack} />;
  return <GoonFortune onBack={onBack} playerCount={playerCount} />;
}

export default function WorldGames({ onBack, onComplete }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("menu");
  const [playerCount, setPlayerCount] = useState(4);

  if (phase === "play" && selected) {
    return <ActiveGame game={selected} playerCount={playerCount} onBack={() => setPhase("guide")} />;
  }

  if (phase === "guide" && selected) {
    return (
      <main className="min-h-full overflow-y-auto bg-white px-5 pb-10 pt-5">
        <TopBar title={selected.name} subtitle={selected.country} onBack={() => setPhase("menu")} />
        <section className="mx-auto mt-10 max-w-xs text-center">
          <p className="text-sm leading-relaxed text-gray-400">{selected.description}</p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[selected.players, selected.duration, selected.equipment].map((item) => <div key={item} className="grid min-h-20 place-items-center rounded-2xl bg-gray-100 px-2 text-xs font-bold leading-tight text-gray-500">{item}</div>)}
          </div>
          <div className="mt-8 space-y-3 text-left">
            {selected.steps.map((step, index) => <div key={step} className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-900 font-display text-sm font-bold text-white">{index + 1}</span><p className="pt-1 text-sm leading-relaxed text-gray-600">{step}</p></div>)}
          </div>
          {!['kings-cup', 'governor', 'medusa', 'flip-cup', 'flunkyball'].includes(selected.id) && (
            <section className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-400">Antall spillere</p>
              <div className="grid grid-cols-6 gap-1.5">{[3, 4, 5, 6, 8, 10].map((count) => <button key={count} onClick={() => setPlayerCount(count)} className={`aspect-square rounded-xl font-display text-sm font-bold ${playerCount === count ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</button>)}</div>
            </section>
          )}
          <p className="mt-7 text-xs leading-relaxed text-gray-400">Avtal små konsekvenser på forhånd. Ingen må drikke, og alle kan stå over.</p>
          <Button className="mt-5" onClick={() => { setPhase("play"); onComplete?.("world"); }}>Start {selected.name}</Button>
        </section>
      </main>
    );
  }

  if (!selectedCountry) {
    return (
      <main className="min-h-full overflow-y-auto bg-white px-5 pb-12 pt-5">
        <TopBar title="Velg land" subtitle={`${INTERNATIONAL_COUNTRIES.length} land`} onBack={onBack} />
        <section className="mx-auto mt-8 max-w-sm text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-900 text-white"><Globe2 size={28} /></div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-gray-900">Hvor skal vi dra?</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-400">Velg et land og få opp kjente leker derfra.</p>
        </section>
        <section className="mx-auto mt-8 max-w-sm space-y-2" aria-label="Velg land">
          {INTERNATIONAL_COUNTRIES.map((country) => {
            const count = INTERNATIONAL_GAMES.filter((game) => game.country.includes(country.match)).length;
            return (
              <button key={country.id} onClick={() => setSelectedCountry(country)} className="flex w-full items-center gap-4 rounded-2xl bg-gray-100 px-4 py-4 text-left transition active:scale-[0.98]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white font-display text-lg font-bold text-gray-700">{country.name.charAt(0)}</span>
                <span className="min-w-0 flex-1"><span className="block font-display text-lg font-bold text-gray-800">{country.name}</span><span className="block truncate text-xs text-gray-400">{country.description}</span></span>
                <span className="text-right"><span className="block font-display text-lg font-bold text-gray-700">{count}</span><span className="block text-[10px] text-gray-400">spill</span></span>
              </button>
            );
          })}
        </section>
      </main>
    );
  }

  const countryGames = INTERNATIONAL_GAMES.filter((game) => game.country.includes(selectedCountry.match));
  return (
    <main className="min-h-full overflow-y-auto bg-white px-5 pb-12 pt-5">
      <TopBar title={selectedCountry.name} subtitle={`${countryGames.length} kjente spill`} onBack={() => setSelectedCountry(null)} />
      <section className="mx-auto mt-8 max-w-sm text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-900 text-white"><Globe2 size={28} /></div>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-gray-900">Leker fra {selectedCountry.name}</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-400">Velg en lek for regler, oppsett og spillmodus.</p>
      </section>
      <section className="mx-auto mt-8 max-w-sm space-y-2" aria-label="Internasjonale drikkeleker">
        {countryGames.map((game) => (
          <button key={game.id} onClick={() => { setSelected(game); setPhase("guide"); }} className="flex w-full items-center gap-4 rounded-2xl bg-gray-100 px-4 py-4 text-left transition active:scale-[0.98]">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white font-display text-lg font-bold text-gray-700">{game.country.charAt(0)}</span>
            <span className="min-w-0 flex-1"><span className="block font-display text-lg font-bold text-gray-800">{game.name}</span><span className="block truncate text-xs text-gray-400">{game.country} · {game.players}</span></span>
            <span className="text-xl text-gray-300">›</span>
          </button>
        ))}
      </section>
    </main>
  );
}
