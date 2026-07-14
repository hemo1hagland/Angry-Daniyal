const FLAG_LABELS = {
  usa: "USAs flagg",
  germany: "Tysklands flagg",
  australia: "Australias flagg",
  uk: "Storbritannias flagg",
  "south-korea": "Sør-Koreas flagg",
  japan: "Japans flagg",
  china: "Kinas flagg",
  "south-africa": "Sør-Afrikas flagg",
};

function UsaFlag() {
  return <><rect width="24" height="16" fill="#fff" />{[0, 2.46, 4.92, 7.38, 9.84, 12.3, 14.76].map((y) => <rect key={y} width="24" height="1.24" y={y} fill="#b22234" />)}<rect width="10.4" height="8.62" fill="#3c3b6e" />{[2, 5.2, 8.4].flatMap((x) => [1.6, 4.2, 6.8].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.42" fill="#fff" />))}</>;
}

function GermanyFlag() {
  return <><rect width="24" height="5.34" fill="#151515" /><rect width="24" height="5.34" y="5.33" fill="#dd0000" /><rect width="24" height="5.34" y="10.66" fill="#ffce00" /></>;
}

function UkMark({ scale = 1 }) {
  return <g transform={`scale(${scale})`}><rect width="12" height="8" fill="#21468b" /><path d="M0 0L12 8M12 0L0 8" stroke="#fff" strokeWidth="2.1" /><path d="M0 0L12 8M12 0L0 8" stroke="#cf142b" strokeWidth="0.85" /><path d="M6 0V8M0 4H12" stroke="#fff" strokeWidth="2.5" /><path d="M6 0V8M0 4H12" stroke="#cf142b" strokeWidth="1.25" /></g>;
}

function AustraliaFlag() {
  return <><rect width="24" height="16" fill="#012169" /><UkMark /><circle cx="17" cy="4" r="0.75" fill="#fff" /><circle cx="20.5" cy="7.2" r="0.55" fill="#fff" /><circle cx="16.4" cy="11.5" r="0.65" fill="#fff" /><circle cx="21" cy="13" r="0.55" fill="#fff" /><circle cx="12.8" cy="8.2" r="0.8" fill="#fff" /></>;
}

function UkFlag() {
  return <><rect width="24" height="16" fill="#21468b" /><path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="4" /><path d="M0 0L24 16M24 0L0 16" stroke="#cf142b" strokeWidth="1.7" /><path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="5" /><path d="M12 0V16M0 8H24" stroke="#cf142b" strokeWidth="2.5" /></>;
}

function SouthKoreaFlag() {
  return <><rect width="24" height="16" fill="#fff" /><path d="M12 4a4 4 0 0 1 0 8 2 2 0 0 1 0-4 2 2 0 0 0 0-4Z" fill="#cd2e3a" /><path d="M12 12a4 4 0 0 1 0-8 2 2 0 0 1 0 4 2 2 0 0 0 0 4Z" fill="#0047a0" /><g stroke="#151515" strokeWidth="0.55"><path d="M3.4 4.2l3-1.8M3.9 5l3-1.8M17.5 12.8l3-1.8M17 12l3-1.8M17.4 3.2l3 1.8M17 4l3 1.8M3.8 11l3 1.8M3.4 11.8l3 1.8" /></g></>;
}

function JapanFlag() {
  return <><rect width="24" height="16" fill="#fff" /><circle cx="12" cy="8" r="4.2" fill="#bc002d" /></>;
}

function ChinaFlag() {
  return <><rect width="24" height="16" fill="#de2910" /><polygon points="4,2 4.7,4 6.8,4 5.1,5.2 5.8,7.2 4,6 2.2,7.2 2.9,5.2 1.2,4 3.3,4" fill="#ffde00" /><circle cx="8.5" cy="2.5" r="0.55" fill="#ffde00" /><circle cx="10" cy="4.6" r="0.55" fill="#ffde00" /><circle cx="10" cy="7" r="0.55" fill="#ffde00" /><circle cx="8.4" cy="9" r="0.55" fill="#ffde00" /></>;
}

function SouthAfricaFlag() {
  return <><rect width="24" height="8" fill="#de3831" /><rect width="24" height="8" y="8" fill="#002395" /><path d="M0 1.5L10 8 0 14.5" fill="none" stroke="#fff" strokeWidth="5.5" /><path d="M0 1.5L10 8H24M10 8L0 14.5" fill="none" stroke="#007a4d" strokeWidth="3.2" /><path d="M0 3L7.5 8 0 13" fill="#151515" stroke="#ffb612" strokeWidth="1.4" /></>;
}

const FLAG_ART = {
  usa: UsaFlag,
  germany: GermanyFlag,
  australia: AustraliaFlag,
  uk: UkFlag,
  "south-korea": SouthKoreaFlag,
  japan: JapanFlag,
  china: ChinaFlag,
  "south-africa": SouthAfricaFlag,
};

export default function CountryFlag({ countryId, large = false, className = "" }) {
  const FlagArt = FLAG_ART[countryId];
  if (!FlagArt) return null;
  return (
    <span className={`country-flag ${large ? "country-flag-large" : ""} ${className}`} role="img" aria-label={FLAG_LABELS[countryId]}>
      <svg viewBox="0 0 24 16" aria-hidden="true" focusable="false"><FlagArt /></svg>
    </span>
  );
}
