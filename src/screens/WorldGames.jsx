import { useEffect, useState } from "react";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.js";
import Dices from "lucide-react/dist/esm/icons/dices.js";
import Globe2 from "lucide-react/dist/esm/icons/globe-2.js";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw.js";
import Button from "../components/Button";
import { DRINK_OR_TELL_QUESTIONS, GOVERNOR_RULES, INTERNATIONAL_COUNTRIES, INTERNATIONAL_GAMES, KING_RULES, YAMANOTE_CATEGORIES } from "../data/internationalGames";

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

const randomOtherPlayer = (current, playerCount) => {
  if (playerCount < 2) return current;
  const offset = 1 + Math.floor(Math.random() * (playerCount - 1));
  return (current + offset) % playerCount;
};

const randomSips = () => 1 + Math.floor(Math.random() * 3);

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

function DrinkPenalty({ penalty, onDone }) {
  if (!penalty) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/55 p-3" role="presentation">
      <section className="sheet-enter w-full rounded-2xl bg-gray-900 p-6 text-center text-white" role="dialog" aria-modal="true" aria-labelledby="drink-penalty-title">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Drikkestraff</p>
        <h2 id="drink-penalty-title" className="mt-3 font-display text-4xl font-bold tracking-tight">{penalty.target}</h2>
        <p className="mt-5 font-display text-7xl font-bold leading-none">{penalty.amount}</p>
        <p className="mt-2 text-sm font-bold text-white/60">{penalty.amount === 1 ? "slurk" : "slurker"}</p>
        {penalty.note && <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/55">{penalty.note}</p>}
        <Button variant="secondary" className="mt-7" onClick={onDone}>Ferdig</Button>
      </section>
    </div>
  );
}

function KingsCup({ onBack, playerCount }) {
  const [deck, setDeck] = useState(createDeck);
  const [card, setCard] = useState(null);
  const [current, setCurrent] = useState(0);
  const [drawer, setDrawer] = useState(0);
  const [penalty, setPenalty] = useState(null);

  const reset = () => {
    setDeck(createDeck());
    setCard(null);
    setCurrent(0);
    setDrawer(0);
    setPenalty(null);
  };

  const draw = () => {
    const [nextCard, ...remaining] = deck;
    const loserLabels = {
      A: "Alle spillere",
      2: `Spiller ${randomOtherPlayer(current, playerCount) + 1}`,
      3: `Spiller ${current + 1}`,
      4: "Sistemann til gulvet",
      5: "Den som står fast",
      6: "Sistemann til tommelen",
      7: "Sistemann som peker opp",
      8: `Spiller ${current + 1} og valgt makker`,
      9: "Den som ikke finner rim",
      10: "Den som ødelegger historien",
      J: "Alle som har gjort det",
      Q: "Den som svarer spørsmålsmesteren",
      K: `Spiller ${current + 1}`,
    };
    setCard(nextCard);
    setDrawer(current);
    setDeck(remaining);
    setPenalty({ target: loserLabels[nextCard.rank], amount: nextCard.rank === "2" || nextCard.rank === "3" ? 2 : 1 });
    setCurrent((value) => (value + 1) % playerCount);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const rule = card ? KING_RULES[card.rank] : null;
  return (
    <GameFrame title="King's Cup" subtitle={card ? `Spiller ${drawer + 1} trakk · ${deck.length} igjen` : `Spiller ${current + 1} trekker`} onBack={onBack} onReset={reset}>
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
      <DrinkPenalty penalty={penalty} onDone={() => setPenalty(null)} />
    </GameFrame>
  );
}

function Governor({ onBack, playerCount }) {
  const [number, setNumber] = useState(1);
  const [rules, setRules] = useState([]);
  const [rounds, setRounds] = useState(0);
  const [current, setCurrent] = useState(0);
  const [penalty, setPenalty] = useState(null);

  const reset = () => { setNumber(1); setRules([]); setRounds(0); setCurrent(0); setPenalty(null); };
  const correct = () => {
    if (number < 21) {
      setNumber((value) => value + 1);
      setCurrent((value) => (value + 1) % playerCount);
      return;
    }
    const available = GOVERNOR_RULES.filter((rule) => !rules.includes(rule));
    const nextRule = available[Math.floor(Math.random() * available.length)] || GOVERNOR_RULES[Math.floor(Math.random() * GOVERNOR_RULES.length)];
    setRules((current) => [...current, nextRule]);
    setRounds((value) => value + 1);
    setNumber(1);
    setPenalty({ target: "Alle spillere", amount: 1, note: `Spiller ${current + 1} er guvernør og legger til regelen.` });
    setCurrent((value) => (value + 1) % playerCount);
  };

  const fail = () => {
    setPenalty({ target: `Spiller ${current + 1}`, amount: 2, note: "Feil tall eller brutt regel." });
    setNumber(1);
    setCurrent((value) => (value + 1) % playerCount);
  };

  return (
    <GameFrame title="Governor 21" subtitle={`Spiller ${current + 1} · ${rules.length} regler`} onBack={onBack} onReset={reset}>
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
        <Button variant="secondary" onClick={fail}>Feil</Button>
        <Button onClick={correct}>{number === 21 ? "Guvernør!" : "Godkjent"}</Button>
      </div>
      <DrinkPenalty penalty={penalty} onDone={() => setPenalty(null)} />
    </GameFrame>
  );
}

function Medusa({ onBack, playerCount }) {
  const [status, setStatus] = useState("ready");
  const [countdown, setCountdown] = useState(3);
  const [round, setRound] = useState(1);
  const [penalty, setPenalty] = useState(null);

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
  const reset = () => { setRound(1); setCountdown(3); setStatus("ready"); setPenalty(null); };

  return (
    <GameFrame title="Medusa" subtitle={`Runde ${round}`} onBack={onBack} onReset={reset}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {status === "ready" && <EmptyState icon="↓" title="Alle ser ned" text="Bestem hvem du vil se på. Trykk når alle er klare." />}
        {status === "counting" && <><p className="text-sm text-gray-400">Hold blikket nede</p><p className="font-display text-[9rem] font-bold leading-none text-gray-900">{countdown}</p></>}
        {status === "reveal" && <><p className="font-display text-6xl font-bold text-gray-900">Se opp</p><p className="mt-4 max-w-xs text-base leading-relaxed text-gray-500">Møtte dere blikket? Trykk på hver spiller som tapte.</p><div className="mt-5 grid max-w-xs grid-cols-5 gap-2">{Array.from({ length: playerCount }, (_, index) => <button key={index} onClick={() => setPenalty({ target: `Spiller ${index + 1}`, amount: 2, note: "Øyekontakt i Medusa." })} className="grid aspect-square place-items-center rounded-xl bg-gray-100 font-display text-sm font-bold text-gray-600">{index + 1}</button>)}</div></>}
      </div>
      {status === "ready" ? <Button onClick={start}>Start nedtelling</Button> : status === "reveal" ? <Button onClick={nextRound}>Neste runde</Button> : <Button disabled>Teller ned</Button>}
      <DrinkPenalty penalty={penalty} onDone={() => setPenalty(null)} />
    </GameFrame>
  );
}

function Quarters({ onBack, playerCount }) {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState(() => Array(playerCount).fill(0));
  const [penalty, setPenalty] = useState(null);
  const reset = () => { setCurrent(0); setScores(Array(playerCount).fill(0)); setPenalty(null); };
  const miss = () => {
    setPenalty({ target: `Spiller ${current + 1}`, amount: 1, note: "Mynten traff ikke koppen." });
    setCurrent((value) => (value + 1) % playerCount);
  };
  const hit = () => {
    setScores((currentScores) => currentScores.map((score, index) => index === current ? score + 1 : score));
    setPenalty({ target: `Spiller ${randomOtherPlayer(current, playerCount) + 1}`, amount: 2, note: `Valgt av spiller ${current + 1} etter treff.` });
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
      <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={miss}>Bom</Button><Button onClick={hit}>Treff +1</Button></div>
      <DrinkPenalty penalty={penalty} onDone={() => setPenalty(null)} />
    </GameFrame>
  );
}

function SevenEleven({ onBack, playerCount }) {
  const [current, setCurrent] = useState(0);
  const [dice, setDice] = useState(null);
  const [penalty, setPenalty] = useState(null);
  const roll = () => {
    setDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]);
    if (navigator.vibrate) navigator.vibrate(25);
  };
  const win = dice && (dice[0] === dice[1] || dice[0] + dice[1] === 7 || dice[0] + dice[1] === 11);
  const next = () => { setCurrent((value) => (value + 1) % playerCount); setDice(null); };
  const showPenalty = () => {
    setPenalty(win
      ? { target: `Spiller ${randomOtherPlayer(current, playerCount) + 1}`, amount: 2, note: `Spiller ${current + 1} rullet 7, 11 eller par.` }
      : { target: `Spiller ${current + 1}`, amount: 1, note: "Kastet traff ingen vinnerkombinasjon." });
  };
  return (
    <GameFrame title="7-11 Doubles" subtitle={`Spiller ${current + 1} ruller`} onBack={onBack} onReset={() => { setCurrent(0); setDice(null); setPenalty(null); }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {dice ? <><div className="flex gap-3">{dice.map((value, index) => <span key={index} className="grid h-24 w-24 place-items-center rounded-2xl bg-gray-900 font-display text-5xl font-bold text-white">{value}</span>)}</div><p className={`mt-6 font-display text-3xl font-bold ${win ? "text-gray-900" : "text-gray-400"}`}>{win ? "Du traff!" : `Sum ${dice[0] + dice[1]}`}</p><p className="mt-2 max-w-xs text-sm text-gray-400">{win ? "Velg en spiller som får avtalt konsekvens." : "Ingen 7, 11 eller par denne gangen."}</p></> : <EmptyState icon={<Dices size={44} />} title={`Spiller ${current + 1}`} text="Rull to terninger." />}
      </div>
      {dice ? <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={next}>Neste</Button><Button onClick={showPenalty}>Vis straff</Button></div> : <Button onClick={roll}>Rull terningene</Button>}
      <DrinkPenalty penalty={penalty} onDone={() => { setPenalty(null); next(); }} />
    </GameFrame>
  );
}

function Maexchen({ onBack, playerCount, title = "Mäxchen", diceCount = 2 }) {
  const [current, setCurrent] = useState(0);
  const [dice, setDice] = useState(null);
  const [stage, setStage] = useState("ready");
  const [penalty, setPenalty] = useState(null);
  const roll = () => { setDice(Array.from({ length: diceCount }, () => 1 + Math.floor(Math.random() * 6))); setStage("peek"); };
  const pass = () => { setCurrent((value) => (value + 1) % playerCount); setStage("decision"); };
  const reset = () => { setCurrent(0); setDice(null); setStage("ready"); setPenalty(null); };
  const value = dice ? [...dice].sort((a, b) => b - a).join("") : "";
  return (
    <GameFrame title={title} subtitle={`Spiller ${current + 1}`} onBack={onBack} onReset={reset}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {stage === "ready" && <EmptyState icon="?" title={`Spiller ${current + 1}`} text="Hold skjermen skjult for resten av gruppen." />}
        {stage === "peek" && <><p className="text-sm text-gray-400">Bare du skal se dette</p><div className={`mt-4 grid gap-2 ${diceCount > 2 ? "grid-cols-3" : "grid-cols-2"}`}>{dice.map((die, index) => <span key={index} className={`grid place-items-center rounded-2xl bg-gray-900 font-display font-bold text-white ${diceCount > 2 ? "h-16 w-16 text-3xl" : "h-24 w-24 text-5xl"}`}>{die}</span>)}</div><p className="mt-4 font-display text-2xl font-bold text-gray-900">{diceCount === 2 ? `Verdi ${value}` : "Husk kastet"}</p><p className="mt-2 max-w-xs text-sm text-gray-400">Si en påstand høyt. Du kan si sannheten eller bløffe.</p></>}
        {stage === "decision" && <EmptyState icon="!" title={`Spiller ${current + 1}`} text="Tror du på forrige spillers påstand?" />}
        {stage === "revealed" && <><p className="text-sm text-gray-400">Det virkelige kastet var</p><p className={`mt-2 font-display font-bold text-gray-900 ${diceCount > 2 ? "text-4xl" : "text-7xl"}`}>{diceCount > 2 ? dice.join(" · ") : value}</p><p className="mt-4 max-w-xs text-sm text-gray-500">Var påstanden sann, eller ble bløffen avslørt?</p></>}
      </div>
      {stage === "ready" && <Button onClick={roll}>Rull skjult</Button>}
      {stage === "peek" && <Button onClick={pass}>Skjul og send videre</Button>}
      {stage === "decision" && <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={roll}>Tro og rull</Button><Button onClick={() => setStage("revealed")}>Utfordre</Button></div>}
      {stage === "revealed" && <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => setPenalty({ target: `Spiller ${current + 1}`, amount: 3, note: "Utfordret en sann påstand." })}>Påstanden var sann</Button><Button onClick={() => setPenalty({ target: `Spiller ${((current - 1 + playerCount) % playerCount) + 1}`, amount: 3, note: "Bløffen ble avslørt." })}>Bløff avslørt</Button></div>}
      <DrinkPenalty penalty={penalty} onDone={() => { setPenalty(null); setDice(null); setStage("ready"); }} />
    </GameFrame>
  );
}

function TeamRace({ gameId, onBack }) {
  const target = gameId === "flunkyball" ? 5 : 3;
  const title = gameId === "flunkyball" ? "Flunkyball" : "Flip Cup";
  const [scores, setScores] = useState([0, 0]);
  const [penalty, setPenalty] = useState(null);
  const winner = scores.findIndex((score) => score >= target);
  const score = (team) => {
    setScores((current) => current.map((value, index) => index === team ? Math.min(target, value + 1) : value));
    setPenalty({ target: `Lag ${team === 0 ? "B" : "A"}`, amount: gameId === "flunkyball" ? 2 : 1, note: "Hver spiller på laget tar straffen." });
  };
  return (
    <GameFrame title={title} subtitle={`Først til ${target}`} onBack={onBack} onReset={() => { setScores([0, 0]); setPenalty(null); }}>
      <div className="flex flex-1 flex-col justify-center">
        <div className="grid grid-cols-2 gap-3 text-center">
          {[0, 1].map((team) => <button key={team} onClick={() => score(team)} disabled={winner >= 0} className={`rounded-2xl px-4 py-10 transition active:scale-[0.98] ${team === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}><span className="text-sm">Lag {team === 0 ? "A" : "B"}</span><span className="mt-2 block font-display text-7xl font-bold">{scores[team]}</span><span className={`mt-3 block text-xs ${team === 0 ? "text-white/55" : "text-gray-400"}`}>Trykk ved vunnet runde</span></button>)}
        </div>
        {winner >= 0 && <p className="mt-8 text-center font-display text-3xl font-bold text-gray-900">Lag {winner === 0 ? "A" : "B"} vinner</p>}
        <p className="mx-auto mt-5 max-w-xs text-center text-sm leading-relaxed text-gray-400">{gameId === "flunkyball" ? "Treff flasken for å vinne poenget. Bytt kastelag etter hvert forsøk." : "Første lag som får hele rekken med kopper rundt, vinner poenget."}</p>
      </div>
      <DrinkPenalty penalty={penalty} onDone={() => setPenalty(null)} />
    </GameFrame>
  );
}

function GoonFortune({ onBack, playerCount }) {
  const [picked, setPicked] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [penalty, setPenalty] = useState(null);
  const spin = () => {
    setSpinning(true);
    setPicked(null);
    window.setTimeout(() => {
      const nextPlayer = 1 + Math.floor(Math.random() * playerCount);
      setPicked(nextPlayer);
      setPenalty({ target: `Spiller ${nextPlayer}`, amount: randomSips(), note: "Valgt av lykkehjulet." });
      setSpinning(false);
      if (navigator.vibrate) navigator.vibrate([40, 40, 80]);
    }, 700);
  };
  return (
    <GameFrame title="Goon of Fortune" subtitle={`${playerCount} spillere`} onBack={onBack} onReset={() => { setPicked(null); setPenalty(null); }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className={`grid h-56 w-56 place-items-center rounded-full border-[12px] border-gray-100 bg-white ${spinning ? "animate-spin" : ""}`}>
          <div><p className="text-xs uppercase tracking-[0.18em] text-gray-400">{spinning ? "Velger" : picked ? "Valgt spiller" : "Klar"}</p><p className="font-display text-7xl font-bold text-gray-900">{picked || "?"}</p></div>
        </div>
        <p className="mt-6 max-w-xs text-sm text-gray-400">{picked ? `Spiller ${picked} tar avtalt konsekvens og starter neste runde.` : "Appen velger helt tilfeldig."}</p>
      </div>
      <Button onClick={spin} disabled={spinning}>{spinning ? "Snurrer" : "Snurr"}</Button>
      <DrinkPenalty penalty={penalty} onDone={() => setPenalty(null)} />
    </GameFrame>
  );
}

function Baskin31({ onBack, playerCount }) {
  const [number, setNumber] = useState(1);
  const [current, setCurrent] = useState(0);
  const [penalty, setPenalty] = useState(null);
  const play = (count) => {
    const lastNumber = Math.min(31, number + count - 1);
    if (lastNumber === 31) {
      setPenalty({ target: `Spiller ${current + 1}`, amount: 3, note: "Du ble spilleren som sa 31." });
      return;
    }
    setNumber(lastNumber + 1);
    setCurrent((value) => (value + 1) % playerCount);
  };
  const reset = () => { setNumber(1); setCurrent(0); setPenalty(null); };
  return (
    <GameFrame title="Baskin Robbins 31" subtitle={`Spiller ${current + 1} · neste tall ${number}`} onBack={onBack} onReset={reset}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Neste tall</p>
        <p className="font-display text-[8rem] font-bold leading-none text-gray-900">{number}</p>
        <p className="mt-4 max-w-xs text-sm text-gray-400">Velg hvor mange tall spiller {current + 1} sier høyt.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">{[1, 2, 3].map((count) => <Button key={count} variant={count === 2 ? "primary" : "secondary"} onClick={() => play(count)}>{count} {count === 1 ? "tall" : "tall"}</Button>)}</div>
      <DrinkPenalty penalty={penalty} onDone={() => { setPenalty(null); setNumber(1); setCurrent((value) => (value + 1) % playerCount); }} />
    </GameFrame>
  );
}

function ThreeSixNine({ onBack, playerCount }) {
  const [number, setNumber] = useState(1);
  const [current, setCurrent] = useState(0);
  const [penalty, setPenalty] = useState(null);
  const shouldClap = /[369]/.test(String(number));
  const next = () => { setNumber((value) => value + 1); setCurrent((value) => (value + 1) % playerCount); };
  const answer = (clapped) => {
    if (clapped === shouldClap) next();
    else {
      setPenalty({ target: `Spiller ${current + 1}`, amount: 2, note: shouldClap ? `Skulle klappe på ${number}.` : `Skulle si ${number} høyt.` });
    }
  };
  return (
    <GameFrame title="3-6-9" subtitle={`Spiller ${current + 1}`} onBack={onBack} onReset={() => { setNumber(1); setCurrent(0); setPenalty(null); }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center"><p className="text-xs uppercase tracking-[0.2em] text-gray-400">Neste tall</p><p className="font-display text-[9rem] font-bold leading-none text-gray-900">{number}</p><p className="mt-4 font-display text-2xl font-bold text-gray-500">{shouldClap ? "Klapp" : "Si tallet"}</p></div>
      <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => answer(false)}>Sa tallet</Button><Button onClick={() => answer(true)}>Klappet</Button></div>
      <DrinkPenalty penalty={penalty} onDone={() => { setPenalty(null); next(); }} />
    </GameFrame>
  );
}

function RhythmGame({ gameId, onBack, playerCount }) {
  const isYamanote = gameId === "yamanote";
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(() => YAMANOTE_CATEGORIES[Math.floor(Math.random() * YAMANOTE_CATEGORIES.length)]);
  const [penalty, setPenalty] = useState(null);
  const words = ["Pin", "Pon", "Pan"];
  const advance = () => {
    if (isYamanote) setCurrent((value) => (value + 1) % playerCount);
    else if (step === 2) setCurrent(randomOtherPlayer(current, playerCount));
    else setCurrent((value) => (value + 1) % playerCount);
    if (!isYamanote) setStep((value) => (value + 1) % 3);
  };
  const fail = () => setPenalty({ target: `Spiller ${current + 1}`, amount: 2, note: isYamanote ? "Nøling, gjentakelse eller feil kategori." : `Feil på ordet ${words[step]}.` });
  const reset = () => { setCurrent(0); setStep(0); setPenalty(null); setCategory(YAMANOTE_CATEGORIES[Math.floor(Math.random() * YAMANOTE_CATEGORIES.length)]); };
  return (
    <GameFrame title={isYamanote ? "Yamanote" : "Pin-Pon-Pan"} subtitle={`Spiller ${current + 1}`} onBack={onBack} onReset={reset}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{isYamanote ? "Kategori" : "Si ordet"}</p>
        <p className="mt-3 max-w-xs font-display text-5xl font-bold tracking-tight text-gray-900">{isYamanote ? category : words[step]}</p>
        <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-400">{isYamanote ? "Klapp, klapp, svar. Ingen gjentakelser." : step === 2 ? "Si Pan og pek på den som skal fortsette." : "Neste spiller fortsetter rytmen."}</p>
      </div>
      <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={fail}>Feil</Button><Button onClick={advance}>Godkjent</Button></div>
      <DrinkPenalty penalty={penalty} onDone={() => { setPenalty(null); advance(); }} />
    </GameFrame>
  );
}

function FifteenTwenty({ onBack, playerCount }) {
  const [first, setFirst] = useState(0);
  const [penalty, setPenalty] = useState(null);
  const second = (first + 1) % playerCount;
  const win = (winner) => {
    const loser = winner === first ? second : first;
    setPenalty({ target: `Spiller ${loser + 1}`, amount: 2, note: `Spiller ${winner + 1} gjettet riktig totalsum.` });
  };
  const next = () => setFirst((value) => (value + 1) % playerCount);
  return (
    <GameFrame title="15-15-20" subtitle={`Spiller ${first + 1} mot ${second + 1}`} onBack={onBack} onReset={() => { setFirst(0); setPenalty(null); }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center"><p className="text-xs uppercase tracking-[0.2em] text-gray-400">Dagens duell</p><p className="mt-3 font-display text-5xl font-bold text-gray-900">{first + 1} mot {second + 1}</p><p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-400">Vis hender og rop 0, 5, 10, 15 eller 20. Trykk på spilleren som vant.</p></div>
      <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => win(first)}>Spiller {first + 1} vant</Button><Button onClick={() => win(second)}>Spiller {second + 1} vant</Button></div>
      <DrinkPenalty penalty={penalty} onDone={() => { setPenalty(null); next(); }} />
    </GameFrame>
  );
}

function LuckyShot({ onBack, playerCount }) {
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState("Klar for myntknips");
  const [penalty, setPenalty] = useState(null);
  const play = () => {
    const outcomes = [
      { label: "Eget felt", target: current, amount: 1 },
      { label: "Dobbelt felt", target: current, amount: 2 },
      { label: "Velg en annen", target: randomOtherPlayer(current, playerCount), amount: 2 },
      { label: "Hardt felt", target: current, amount: 3 },
    ];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    setResult(outcome.label);
    setPenalty({ target: `Spiller ${outcome.target + 1}`, amount: outcome.amount, note: `Lucky Shot: ${outcome.label}.` });
  };
  const next = () => { setCurrent((value) => (value + 1) % playerCount); setResult("Klar for myntknips"); };
  return (
    <GameFrame title="Lucky Shot" subtitle={`Spiller ${current + 1}`} onBack={onBack} onReset={() => { setCurrent(0); setResult("Klar for myntknips"); setPenalty(null); }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center"><div className="grid h-52 w-52 place-items-center rounded-full border-[12px] border-gray-100"><div><p className="text-xs uppercase tracking-[0.18em] text-gray-400">Resultat</p><p className="mt-2 px-4 font-display text-3xl font-bold text-gray-900">{result}</p></div></div><p className="mt-6 max-w-xs text-sm text-gray-400">Knips mynten fysisk eller la appen trekke feltet direkte.</p></div>
      <Button onClick={play}>Knips og trekk felt</Button>
      <DrinkPenalty penalty={penalty} onDone={() => { setPenalty(null); next(); }} />
    </GameFrame>
  );
}

function DrinkOrTell({ onBack, playerCount }) {
  const [current, setCurrent] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [penalty, setPenalty] = useState(null);
  const next = () => { setCurrent((value) => (value + 1) % playerCount); setQuestionIndex((value) => (value + 1) % DRINK_OR_TELL_QUESTIONS.length); };
  return (
    <GameFrame title="Drink or Tell" subtitle={`Spiller ${current + 1}`} onBack={onBack} onReset={() => { setCurrent(0); setQuestionIndex(0); setPenalty(null); }}>
      <div className="flex flex-1 flex-col items-center justify-center text-center"><p className="text-xs uppercase tracking-[0.2em] text-gray-400">Svar ærlig eller drikk</p><p className="mt-4 max-w-xs font-display text-3xl font-bold leading-tight text-gray-900">{DRINK_OR_TELL_QUESTIONS[questionIndex]}</p></div>
      <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={next}>Svarte</Button><Button onClick={() => setPenalty({ target: `Spiller ${current + 1}`, amount: randomSips(), note: "Valgte å ikke svare." })}>Drikker</Button></div>
      <DrinkPenalty penalty={penalty} onDone={() => { setPenalty(null); next(); }} />
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
  if (game.id === "kings-cup") return <KingsCup onBack={onBack} playerCount={playerCount} />;
  if (game.id === "governor") return <Governor onBack={onBack} playerCount={playerCount} />;
  if (game.id === "medusa") return <Medusa onBack={onBack} playerCount={playerCount} />;
  if (game.id === "quarters") return <Quarters onBack={onBack} playerCount={playerCount} />;
  if (game.id === "seven-eleven") return <SevenEleven onBack={onBack} playerCount={playerCount} />;
  if (game.id === "maexchen") return <Maexchen onBack={onBack} playerCount={playerCount} />;
  if (game.id === "flip-cup" || game.id === "flunkyball") return <TeamRace gameId={game.id} onBack={onBack} />;
  if (game.id === "goon-fortune") return <GoonFortune onBack={onBack} playerCount={playerCount} />;
  if (game.id === "baskin-31") return <Baskin31 onBack={onBack} playerCount={playerCount} />;
  if (game.id === "three-six-nine") return <ThreeSixNine onBack={onBack} playerCount={playerCount} />;
  if (game.id === "yamanote" || game.id === "pin-pon-pan") return <RhythmGame gameId={game.id} onBack={onBack} playerCount={playerCount} />;
  if (game.id === "fifteen-twenty") return <FifteenTwenty onBack={onBack} playerCount={playerCount} />;
  if (game.id === "chui-niu") return <Maexchen title="Chui Niu" diceCount={5} onBack={onBack} playerCount={playerCount} />;
  if (game.id === "lucky-shot") return <LuckyShot onBack={onBack} playerCount={playerCount} />;
  return <DrinkOrTell onBack={onBack} playerCount={playerCount} />;
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
          {!['flip-cup', 'flunkyball'].includes(selected.id) && (
            <section className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-400">Antall spillere</p>
              <div className="grid grid-cols-6 gap-1.5">{[2, 3, 4, 5, 6, 8].map((count) => <button key={count} onClick={() => setPlayerCount(count)} className={`aspect-square rounded-xl font-display text-sm font-bold ${playerCount === count ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</button>)}</div>
            </section>
          )}
          <p className="mt-7 text-xs leading-relaxed text-gray-400">Appen velger hvem som drikker og 1-3 slurker. Alle kan alltid stå over.</p>
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
