import { useState } from "react";

const fmt = v => v == null || isNaN(v) || v === "" ? "$0" : (v < 0 ? "-" : "") + "$" + Math.abs(Math.round(v)).toLocaleString("en-US");
const fmtP = v => v == null || isNaN(v) ? "0.0%" : (v * 100).toFixed(1) + "%";
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const p = v => parseFloat(v) || 0;

const Badge = ({ s }) => {
  const C = { Qualified: { bg: "linear-gradient(135deg,#c9a227,#e8d374)", c: "#1a1207", ic: "\u2605" }, "On Pace": { bg: "linear-gradient(135deg,#2d6a4f,#52b788)", c: "#f0fff4", ic: "\u25B2" }, "In Training": { bg: "linear-gradient(135deg,#6b3a2a,#c97b4b)", c: "#fff5ee", ic: "\u25C6" } }[s] || { bg: "#333", c: "#aaa", ic: "?" };
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.bg, color: C.c, padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase" }}><span style={{ fontSize: 11 }}>{C.ic}</span>{s}</span>;
};

const Bar = ({ cur, tgt, label, color = "#c9a227", marker }) => {
  const pct = tgt > 0 ? cl(cur / tgt, 0, 1.35) : 0;
  return <div style={{ marginBottom: 10 }}>
    {label && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}><span>{label}</span><span>{(pct * 100).toFixed(1)}%</span></div>}
    <div style={{ position: "relative", height: 10, background: "#1a1a1a", borderRadius: 5 }}>
      <div style={{ width: `${Math.min(pct, 1) * 100}%`, height: "100%", borderRadius: 5, background: pct >= 1 ? "linear-gradient(90deg,#c9a227,#e8d374)" : `linear-gradient(90deg,${color}55,${color})`, transition: "width .7s cubic-bezier(.4,0,.2,1)", boxShadow: pct >= 1 ? "0 0 12px #c9a22744" : "none" }} />
      {marker != null && <div style={{ position: "absolute", left: `${cl(marker, 0, 1) * 100}%`, top: -2, width: 2, height: 14, background: "#fff5", borderRadius: 1 }} />}
    </div>
  </div>;
};

const Card = ({ label, value, sub, accent }) => <div style={{ background: "#141414", border: "1px solid #252525", borderRadius: 10, padding: "14px 16px", flex: "1 1 155px", minWidth: 155 }}>
  <div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5 }}>{label}</div>
  <div style={{ fontSize: 24, fontWeight: 800, color: accent || "#e8e8e8", fontFamily: "'Barlow Condensed',sans-serif", lineHeight: 1.1 }}>{value}</div>
  {sub && <div style={{ fontSize: 13, color: "#EEEEEE", marginTop: 4 }}>{sub}</div>}
</div>;

const Sec = ({ id, icon, title, sub, children }) => <section id={id} style={{ marginBottom: 36, scrollMarginTop: 80 }}>
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 18, fontWeight: 800, color: "#e8e8e8", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.5 }}>{title}</span>
    </div>
    {sub && <div style={{ fontSize: 14, color: "#EEEEEE", paddingLeft: 26 }}>{sub}</div>}
    <div style={{ height: 1, background: "linear-gradient(90deg,#c9a22744,transparent)", marginTop: 8 }} />
  </div>
  {children}
</section>;

const Inp = ({ label, value, onChange, ph, suf, pre }) => <div style={{ flex: "1 1 130px", minWidth: 120 }}>
  <label style={{ display: "block", fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 3 }}>{label}</label>
  <div style={{ display: "flex", alignItems: "center", background: "#0c0c0c", border: "1px solid #252525", borderRadius: 6, overflow: "hidden" }}>
    {pre && <span style={{ padding: "0 0 0 10px", color: "#EEEEEE", fontSize: 14, fontFamily: "'Barlow Condensed',sans-serif" }}>{pre}</span>}
    <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={ph || "0"} style={{ flex: 1, background: "transparent", border: "none", color: "#e8e8e8", padding: "10px 10px", fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, outline: "none", MozAppearance: "textfield", WebkitAppearance: "none", width: "100%" }} />
    {suf && <span style={{ padding: "0 10px 0 0", color: "#EEEEEE", fontSize: 11, fontFamily: "'Barlow Condensed',sans-serif" }}>{suf}</span>}
  </div>
</div>;

const TInp = ({ label, value, onChange, ph, wide }) => <div style={{ flex: wide ? "1 1 240px" : "1 1 160px", minWidth: wide ? 200 : 140 }}>
  <label style={{ display: "block", fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 3 }}>{label}</label>
  <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={ph || ""} style={{ width: "100%", background: "#0c0c0c", border: "1px solid #252525", borderRadius: 6, color: "#e8e8e8", padding: "10px", fontSize: 14, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
</div>;

export default function App() {
  const [name, setName] = useState("");
  const [pyBl, setPyBl] = useState("");
  const [buMed, setBuMed] = useState("67120");
  const [curDay, setCurDay] = useState("1");
  const [totalBV, setTotalBV] = useState("");
  const [hBV, setHBV] = useState("");
  const [pBV, setPBV] = useState("");
  const [lsBV, setLsBV] = useState("");
  const [bv20, setBv20] = useState("");
  const [acts, setActs] = useState("");
  const [appts, setAppts] = useState("");
  const [pres, setPres] = useState("");
  const [presSale, setPresSale] = useState("");
  const [acv, setAcv] = useState("");
  const [t5t, setT5t] = useState("");
  const [t5h, setT5h] = useState("");
  const [t5p, setT5p] = useState("");
  const [locked110, setLocked110] = useState(false);

  const QD = 20, CD = 31;
  const py = p(pyBl), med = p(buMed), day = Math.max(1, Math.min(31, Math.round(p(curDay))));
  const adj = Math.max(py, med), q110 = adj * 1.1, c120 = adj * 1.2;
  const tBV = p(totalBV), tH = p(hBV), tP = p(pBV), tLS = p(lsBV), t20 = p(bv20);
  const wBV = tBV - tLS, pct = adj > 0 ? wBV / adj : 0;
  const d2q = Math.max(0, QD - day), d2c = Math.max(0, CD - day);
  const bvAt20 = day >= QD ? (t20 || wBV) : wBV;
  const p20v = adj > 0 ? bvAt20 / adj : 0;
  const s110 = locked110 ? "Qualified" : (day < QD && q110 > 0 && wBV / q110 >= (day / QD) * 0.85 ? "On Pace" : "In Training");
  const s120 = pct >= 1.2 ? "Qualified" : (c120 > 0 && wBV / c120 >= (day / CD) * 0.85 ? "On Pace" : "In Training");
  const bonus = (locked110 && s120 === "Qualified") ? 1200 : (locked110 ? 700 : (s120 === "Qualified" ? 500 : 0));
  const g2q = Math.max(0, q110 - wBV), g2c = Math.max(0, c120 - wBV);
  const drQ = d2q > 0 ? g2q / d2q : (g2q > 0 ? Infinity : 0), drC = d2c > 0 ? g2c / d2c : (g2c > 0 ? Infinity : 0);
  const dAvg = day > 0 ? wBV / day : 0, pFin = dAvg * CD, p20proj = dAvg * QD;

  const nA = p(acts), nAp = p(appts), nPr = p(pres), nPS = p(presSale), nAcv = p(acv);
  const apptR = nA > 0 ? nAp / nA : 0, holdR = nAp > 0 ? nPr / nAp : 0, closeR = nPr > 0 ? nPS / nPr : 0;
  const projW = nPS * nAcv, wksR = d2c > 0 ? d2c / 7 : 0, behP = wBV + (projW * wksR);

  const v5t = p(t5t), v5h = p(t5h), v5p = p(t5p);
  const gPt = Math.max(0, v5t - wBV), gPh = Math.max(0, v5h - tH), gPp = Math.max(0, v5p - tP);
  const aCV = nAcv > 0 ? nAcv : 5000, cr = closeR > 0 ? closeR : 0.33;
  const cPt = gPt > 0 ? Math.ceil(gPt / aCV) : 0, cPh = gPh > 0 ? Math.ceil(gPh / aCV) : 0, cPp = gPp > 0 ? Math.ceil(gPp / aCV) : 0;
  const prPt = cPt > 0 ? Math.ceil(cPt / cr) : 0, prPh = cPh > 0 ? Math.ceil(cPh / cr) : 0, prPp = cPp > 0 ? Math.ceil(cPp / cr) : 0;

  const nav = [{ id: "position", l: "Current Lift", ic: "\u2B06" }, { id: "minimum", l: "Daily Reps", ic: "\uD83D\uDD01" }, { id: "training", l: "Training Log", ic: "\uD83D\uDCCB" }, { id: "podium", l: "Podium Push", ic: "\uD83C\uDFC5" }];

  return <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", fontFamily: "'DM Sans',sans-serif" }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}::selection{background:#c9a22744}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0a0a0a}::-webkit-scrollbar-thumb{background:#252525;border-radius:3px}`}</style>

    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#0a0a0aee", backdropFilter: "blur(14px)", borderBottom: "1px solid #1a1a1a", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#c9a227,#8b6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, fontFamily: "'Barlow Condensed',sans-serif", color: "#0a0a0a" }}>M</div>
        <div><div style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 2 }}>MSBU March Olympiad</div><div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>PERFORMANCE INTELLIGENCE DASHBOARD</div></div>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif", color: d2q <= 3 && d2q > 0 ? "#e74c3c" : "#c9a227" }}>{d2q}</div><div style={{ fontSize: 8, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>to Qualifying</div></div>
        <div style={{ width: 1, height: 28, background: "#252525" }} />
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif", color: d2c <= 5 && d2c > 0 ? "#e74c3c" : "#52b788" }}>{d2c}</div><div style={{ fontSize: 8, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>to Championship</div></div>
      </div>
      <nav style={{ display: "flex", gap: 3 }}>{nav.map(x => <a key={x.id} href={`#${x.id}`} style={{ padding: "5px 10px", borderRadius: 5, background: "#141414", border: "1px solid #252525", color: "#EEEEEE", fontSize: 10, textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 3 }}>{x.ic} {x.l}</a>)}</nav>
    </header>

    <div style={{ padding: "14px 20px", background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Athlete Setup</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <TInp label="Counselor Name" value={name} onChange={setName} ph="Last, First" wide />
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Inp label="PY Baseline (March 2025 BV)" value={pyBl} onChange={setPyBl} pre="$" />
        <Inp label="BU Median Floor" value={buMed} onChange={setBuMed} pre="$" />
        <Inp label="Current Day of March (1-31)" value={curDay} onChange={setCurDay} />
      </div>
      <div style={{ marginTop: 8, padding: "8px 12px", background: "#141414", borderRadius: 6, display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14, fontFamily: "'Barlow Condensed',sans-serif" }}>
        <span style={{ color: "#EEEEEE" }}>Training Weight: <span style={{ color: "#c9a227", fontWeight: 700 }}>{fmt(adj)}</span></span>
        <span style={{ color: "#EEEEEE" }}>Qualifying Round (110%): <span style={{ color: "#EEEEEE", fontWeight: 600 }}>{fmt(q110)}</span></span>
        <span style={{ color: "#EEEEEE" }}>Championship Round (120%): <span style={{ color: "#EEEEEE", fontWeight: 600 }}>{fmt(c120)}</span></span>
      </div>
    </div>

    <div style={{ padding: "14px 20px", background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Current Production (March 2026)</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Inp label="Total BV" value={totalBV} onChange={setTotalBV} pre="$" />
        <Inp label="Heritage BV" value={hBV} onChange={setHBV} pre="$" />
        <Inp label="PAF Insurance BV" value={pBV} onChange={setPBV} pre="$" />
        <Inp label="Large Sale BV" value={lsBV} onChange={setLsBV} pre="$" />
        {day >= QD && <Inp label="BV as of Mar 20" value={bv20} onChange={setBv20} pre="$" />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, padding: "10px 14px", background: locked110 ? "#1a2e1a" : "#141414", border: `1px solid ${locked110 ? "#52b78844" : "#252525"}`, borderRadius: 8, transition: "all .3s", cursor: "pointer" }} onClick={() => setLocked110(!locked110)}>
        <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${locked110 ? "#c9a227" : "#444"}`, background: locked110 ? "#c9a227" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", flexShrink: 0 }}>
          {locked110 && <span style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 900, lineHeight: 1 }}>{"\u2713"}</span>}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: locked110 ? "#c9a227" : "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 0.8 }}>
            {locked110 ? "\u2605 110% Qualified by March 20 \u2014 Locked" : "Lock 110% Qualification (check when confirmed by March 20)"}
          </div>
          <div style={{ fontSize: 12, color: locked110 ? "#52b788" : "#666", marginTop: 2 }}>
            {locked110 ? "Earning $700 bonus. Hit 120% by March 31 to earn $1,200 total." : "Only check this if you reached 110% of your Training Weight by March 20."}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#EEEEEE", marginTop: 6 }}>Working BV = Total BV minus Large Sale BV = <span style={{ color: "#666" }}>{fmt(wBV)}</span></div>
    </div>

    <main style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>

      <Sec id="position" icon={"\u2B06"} title="Current Lift" sub="Where you stand right now">
        {name && <div style={{ background: "#0e0e0e", border: "1px solid #252525", borderRadius: 10, padding: 16, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif" }}>{name}</div></div>
          <div style={{ display: "flex", gap: 8 }}><Badge s={s110} /><Badge s={s120} /></div>
        </div>}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <Card label="Current Lift" value={fmt(wBV)} sub={`of ${fmt(adj)} baseline`} />
          <Card label="Performance Delta" value={fmtP(pct)} sub={pct >= 1 ? "Above baseline" : `${fmt(adj - wBV)} to go`} accent={pct >= 1 ? "#52b788" : "#c9a227"} />
          <Card label="Bonus Potential" value={`$${bonus.toLocaleString()}`} sub={bonus >= 1200 ? "110% + 120% — Full bonus earned" : bonus === 700 ? "110% locked — hit 120% for $1,200" : bonus === 500 ? "120% only — 110% not locked by Mar 20" : "No bonus qualification yet"} accent="#52b788" />
        </div>
        <div style={{ background: "#0e0e0e", border: "1px solid #252525", borderRadius: 10, padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 24px", fontSize: 14, fontFamily: "'Barlow Condensed',sans-serif", marginBottom: 14 }}>
            <span style={{ color: "#EEEEEE" }}>PY Production</span><span style={{ color: "#EEEEEE", fontWeight: 600 }}>{fmt(py)}</span>
            <span style={{ color: "#EEEEEE" }}>BU Median Floor</span><span style={{ color: "#EEEEEE", fontWeight: 600 }}>{fmt(med)}</span>
            <span style={{ color: "#c9a227" }}>Training Weight</span><span style={{ color: "#c9a227", fontWeight: 700 }}>{fmt(adj)}</span>
            <span style={{ color: "#EEEEEE" }}>Qualifying Round (110%)</span><span style={{ color: "#EEEEEE", fontWeight: 600 }}>{fmt(q110)}</span>
            <span style={{ color: "#EEEEEE" }}>Championship Round (120%)</span><span style={{ color: "#EEEEEE", fontWeight: 600 }}>{fmt(c120)}</span>
          </div>
          <Bar cur={wBV} tgt={c120} label="Progress to Championship Round" color="#52b788" marker={c120 > 0 ? q110 / c120 : 0} />
          <Bar cur={tH} tgt={py > 0 ? py * 0.4 : med * 0.3} label="Heritage BV" color="#6c8ebf" />
          <Bar cur={tP} tgt={py > 0 ? py * 0.6 : med * 0.5} label="PAF Insurance BV" color="#b07cc6" />
        </div>
      </Sec>

      <Sec id="minimum" icon={"\uD83D\uDD01"} title="Daily Reps" sub="What it takes from here to qualify">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <Card label="Gain to Qualifying (110%)" value={fmt(g2q)} sub={g2q <= 0 ? "Target reached" : `${d2q} days remaining`} accent={g2q <= 0 ? "#52b788" : "#c9a227"} />
          <Card label="Daily Reps to Qualify" value={drQ === Infinity ? "\u2014" : fmt(drQ)} sub={d2q <= 0 ? "Qualifying Day passed" : "per day through Mar 20"} accent="#52b788" />
          <Card label="Gain to Championship (120%)" value={fmt(g2c)} sub={g2c <= 0 ? "#52b788" : `${d2c} days remaining`} accent={g2c <= 0 ? "#52b788" : "#c9a227"} />
          <Card label="Daily Reps to Championship" value={drC === Infinity ? "\u2014" : fmt(drC)} sub={d2c <= 0 ? "Championship Day passed" : "per day through Mar 31"} accent="#52b788" />
        </div>
        <div style={{ background: "#0e0e0e", border: "1px solid #252525", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Pace Analysis</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, textAlign: "center" }}>
            <div><div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Current Daily Avg</div><div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif" }}>{fmt(dAvg)}</div><div style={{ fontSize: 13, color: "#EEEEEE" }}>per day so far</div></div>
            <div><div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Projected at Mar 20</div><div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif", color: p20proj >= q110 ? "#52b788" : "#c9a227" }}>{fmt(p20proj)}</div><div style={{ fontSize: 13, color: "#EEEEEE" }}>{p20proj >= q110 ? "On pace for $700 bonus" : `${fmt(q110 - p20proj)} short of qualifying`}</div></div>
            <div><div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Projected Finish</div><div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif", color: pFin >= c120 ? "#52b788" : "#e8e8e8" }}>{fmt(pFin)}</div><div style={{ fontSize: 13, color: "#EEEEEE" }}>{pFin >= c120 ? "Championship round pace" : pFin >= q110 ? "Qualifying pace, push for championship" : "Increase daily output"}</div></div>
          </div>
          <div style={{ marginTop: 18, position: "relative", height: 30, background: "#1a1a1a", borderRadius: 6 }}>
            <div style={{ position: "absolute", left: `${c120 > 0 ? cl(adj / c120, 0, 1) * 100 : 83.3}%`, top: 0, bottom: 0, width: 1, background: "#333" }}><span style={{ position: "absolute", top: -14, left: -12, fontSize: 8, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", whiteSpace: "nowrap" }}>100%</span></div>
            <div style={{ position: "absolute", left: `${c120 > 0 ? cl(q110 / c120, 0, 1) * 100 : 91.7}%`, top: 0, bottom: 0, width: 2, background: "#c9a22766" }}><span style={{ position: "absolute", top: -14, left: -6, fontSize: 8, color: "#c9a227", fontFamily: "'Barlow Condensed',sans-serif" }}>110%</span></div>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 2, background: "#52b78866" }}><span style={{ position: "absolute", top: -14, right: -6, fontSize: 8, color: "#52b788", fontFamily: "'Barlow Condensed',sans-serif" }}>120%</span></div>
            <div style={{ width: `${c120 > 0 ? cl(wBV / c120, 0, 1) * 100 : 0}%`, height: "100%", borderRadius: 6, background: "linear-gradient(90deg,#c9a22722,#c9a22766)", transition: "width .6s" }} />
            {pFin > 0 && c120 > 0 && <div style={{ position: "absolute", left: `${cl(pFin / c120, 0, 1) * 100}%`, top: 3, width: 7, height: 24, borderRadius: 4, background: pFin >= c120 ? "#52b788" : "#e74c3c", border: "2px solid #0a0a0a", opacity: 0.85 }}><span style={{ position: "absolute", bottom: -14, left: -16, fontSize: 8, color: pFin >= c120 ? "#52b788" : "#e74c3c", fontFamily: "'Barlow Condensed',sans-serif", whiteSpace: "nowrap" }}>Projected</span></div>}
          </div>
        </div>
      </Sec>

      <Sec id="training" icon={"\uD83D\uDCCB"} title="Training Log" sub="Model your output to see what it takes">
        <div style={{ background: "#0e0e0e", border: "1px solid #252525", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Weekly Behavior Input</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Inp label="Activities (Sets)" value={acts} onChange={setActs} />
            <Inp label="Appointments (Reps Booked)" value={appts} onChange={setAppts} />
            <Inp label="Presentations (Reps Completed)" value={pres} onChange={setPres} />
            <Inp label="Pres. Resulting in Sale" value={presSale} onChange={setPresSale} />
            <Inp label="Avg Contract Value" value={acv} onChange={setAcv} pre="$" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <Card label="Appointment Set Rate" value={fmtP(apptR)} sub="Appointments / Activities" accent={apptR > 0 ? "#6c8ebf" : "#444"} />
          <Card label="Presentation Hold Rate" value={fmtP(holdR)} sub="Presentations / Appointments" accent={holdR > 0 ? "#b07cc6" : "#444"} />
          <Card label="Conversion Strength" value={fmtP(closeR)} sub="Sales / Presentations" accent={closeR >= 0.3 ? "#52b788" : closeR > 0 ? "#c9a227" : "#444"} />
          <Card label="Projected Weekly BV" value={fmt(projW)} sub={`${nPS} sales x ${fmt(nAcv)} ACV`} accent={projW > 0 ? "#e8e8e8" : "#444"} />
        </div>
        {projW > 0 && <div style={{ background: "#0e0e0e", border: "1px solid #252525", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Projected Finish from Training Log</div>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif", color: behP >= c120 ? "#52b788" : behP >= q110 ? "#c9a227" : "#e8e8e8" }}>{fmt(behP)}</div><div style={{ fontSize: 14, color: "#EEEEEE" }}>Current lift + weekly output x {wksR.toFixed(1)} weeks remaining</div></div>
            <div style={{ flex: 1, minWidth: 200 }}><Bar cur={behP} tgt={c120} label="Behavior-Projected vs Championship" color={behP >= c120 ? "#52b788" : "#c9a227"} marker={c120 > 0 ? q110 / c120 : 0} /></div>
          </div>
          <div style={{ fontSize: 14, color: behP >= c120 ? "#52b788" : behP >= q110 ? "#c9a227" : "#e74c3c", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, marginTop: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {behP >= c120 ? "Your training puts you in championship range. Keep this pace." : behP >= q110 ? "You're tracking toward qualifying. Push for one more sale per week to reach championship." : "At this output, you'll fall short. Look at increasing presentations or raising your average contract value."}
          </div>
        </div>}
      </Sec>

      <Sec id="podium" icon={"\uD83C\uDFC5"} title="Podium Push" sub="What it takes to reach Top 5">
        <div style={{ background: "#0e0e0e", border: "1px solid #252525", borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#EEEEEE", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Enter Current Top 5 Thresholds (from your manager or Podium sheet)</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Inp label="Top 5 Total BV Threshold" value={t5t} onChange={setT5t} pre="$" />
            <Inp label="Top 5 Heritage BV Threshold" value={t5h} onChange={setT5h} pre="$" />
            <Inp label="Top 5 PAF BV Threshold" value={t5p} onChange={setT5p} pre="$" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 12 }}>
          {[{ label: "Total BV Podium", gap: gPt, cur: wBV, thresh: v5t, contracts: cPt, pres: prPt, color: "#c9a227", inP: wBV >= v5t && v5t > 0 },
            { label: "Heritage Podium", gap: gPh, cur: tH, thresh: v5h, contracts: cPh, pres: prPh, color: "#6c8ebf", inP: tH >= v5h && v5h > 0 },
            { label: "PAF Podium", gap: gPp, cur: tP, thresh: v5p, contracts: cPp, pres: prPp, color: "#b07cc6", inP: tP >= v5p && v5p > 0 }
          ].map(pd => <div key={pd.label} style={{ background: "#0e0e0e", border: "1px solid #252525", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 1, color: pd.color, marginBottom: 10 }}>{pd.label}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", fontSize: 14, fontFamily: "'Barlow Condensed',sans-serif", marginBottom: 10 }}>
              <span style={{ color: "#EEEEEE" }}>Your Current</span><span style={{ color: "#EEEEEE", fontWeight: 600 }}>{fmt(pd.cur)}</span>
              <span style={{ color: "#EEEEEE" }}>Top 5 Threshold</span><span style={{ color: "#EEEEEE", fontWeight: 600 }}>{pd.thresh > 0 ? fmt(pd.thresh) : "Not set"}</span>
              <span style={{ color: pd.color }}>Distance to Podium</span><span style={{ color: pd.color, fontWeight: 700 }}>{pd.thresh <= 0 ? "Enter threshold" : pd.inP ? "On Podium" : fmt(pd.gap)}</span>
            </div>
            {pd.thresh > 0 && !pd.inP && pd.gap > 0 && <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 8, fontSize: 14, fontFamily: "'Barlow Condensed',sans-serif" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ color: "#EEEEEE" }}>Contracts Required</span><span style={{ color: "#EEEEEE", fontWeight: 700 }}>{pd.contracts}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#EEEEEE" }}>Presentations Required</span><span style={{ color: "#EEEEEE", fontWeight: 700 }}>{pd.pres}</span></div>
              <div style={{ fontSize: 12, color: "#EEEEEE", marginTop: 6 }}>Based on {fmt(aCV)} avg contract value and {fmtP(cr)} conversion rate</div>
            </div>}
            {pd.inP && <div style={{ fontSize: 13, fontWeight: 700, color: pd.color, fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", textAlign: "center", padding: "8px 0" }}>You're on the podium. Defend your position.</div>}
          </div>)}
        </div>
      </Sec>

      <div style={{ textAlign: "center", padding: "28px 0 14px", borderTop: "1px solid #1a1a1a", marginTop: 24 }}>
        <div style={{ fontSize: 10, color: "#252525", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: 2 }}>MSBU March Olympiad \u00B7 Performance Intelligence System \u00B7 Q1 2026</div>
      </div>
    </main>
  </div>;
}
