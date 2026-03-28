import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, CartesianGrid, LineChart, Line, Legend
} from "recharts";
import { ModelBackBar } from '../pages/FrameworkIndex';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:       "#F7F4EF",
  surface:  "#FFFFFF",
  card:     "#FDFCFA",
  border:   "#E2DDD6",
  ink:      "#1C1C1C",
  inkMid:   "#4A4540",
  inkFaint: "#9C948A",
  green:    "#1B6B45",
  greenLt:  "#E8F4EE",
  amber:    "#B8690A",
  amberLt:  "#FEF3E2",
  red:      "#B83232",
  redLt:    "#FDEAEA",
  blue:     "#1A3D7C",
  blueLt:   "#EBF0FA",
  rule:     "#D5CFC7",
  gridLine: "#EDE9E3",
};

// ─── RAIL DEFINITIONS ─────────────────────────────────────────────────────────
const RAILS = {
  ACH:      { label: "ACH",         color: T.green,  unitCost: 0.12,  minHrs: 2,    maxHrs: 24,   maxAmt: 1000000,  stpRate: 99.2, finality: "Next-day",    domestic: true,  xborder: false },
  FEDWIRE:  { label: "Fedwire",     color: T.blue,   unitCost: 8.50,  minHrs: 0.25, maxHrs: 4,    maxAmt: null,     stpRate: 96.8, finality: "Same-day",    domestic: true,  xborder: false },
  RTP:      { label: "RTP",         color: "#7B3FA0", unitCost: 0.06, minHrs: 0,    maxHrs: 0.08, maxAmt: 1000000,  stpRate: 99.6, finality: "Instant",     domestic: true,  xborder: false },
  FEDNOW:   { label: "FedNow",      color: "#1A7A7A", unitCost: 0.045,minHrs: 0,    maxHrs: 0.08, maxAmt: 500000,   stpRate: 99.8, finality: "Instant",     domestic: true,  xborder: false },
  SWIFTMX:  { label: "SWIFT MX",   color: T.amber,  unitCost: 18.40, minHrs: 2,    maxHrs: 24,   maxAmt: null,     stpRate: 91.2, finality: "1–2 days",    domestic: false, xborder: true  },
  VCARD:    { label: "Virtual Card",color: T.inkMid, unitCost: 0.28,  minHrs: 0,    maxHrs: 2,    maxAmt: 100000,   stpRate: 98.4, finality: "Same-day",    domestic: true,  xborder: false },
};

// ─── SYNTHETIC PAYMENT QUEUE ──────────────────────────────────────────────────
const PAYMENT_QUEUE = [
  { id:"PMT-001", client:"Meridian Industries",  amount:42000,    currency:"USD", urgency:"standard", domestic:true,  purpose:"supplier",   currentRail:"FEDWIRE" },
  { id:"PMT-002", client:"Apex Global Trade",    amount:285000,   currency:"USD", urgency:"urgent",   domestic:false, purpose:"trade",      currentRail:"SWIFTMX" },
  { id:"PMT-003", client:"Solara Payments",      amount:8400,     currency:"USD", urgency:"standard", domestic:true,  purpose:"payroll",    currentRail:"ACH"     },
  { id:"PMT-004", client:"Northgate Capital",    amount:1200000,  currency:"USD", urgency:"urgent",   domestic:true,  purpose:"settlement", currentRail:"FEDWIRE" },
  { id:"PMT-005", client:"Crescent Logistics",   amount:18500,    currency:"MXN", urgency:"standard", domestic:false, purpose:"supplier",   currentRail:"SWIFTMX" },
  { id:"PMT-006", client:"Veritas Healthcare",   amount:3200,     currency:"USD", urgency:"standard", domestic:true,  purpose:"vendor",     currentRail:"ACH"     },
  { id:"PMT-007", client:"TerraFin Services",    amount:47000,    currency:"USD", urgency:"urgent",   domestic:true,  purpose:"settlement", currentRail:"FEDWIRE" },
  { id:"PMT-008", client:"Atlas Commodities",    amount:920000,   currency:"USD", urgency:"standard", domestic:false, purpose:"trade",      currentRail:"SWIFTMX" },
  { id:"PMT-009", client:"Pinnacle Asset Mgmt",  amount:22000,    currency:"USD", urgency:"standard", domestic:true,  purpose:"vendor",     currentRail:"FEDWIRE" },
  { id:"PMT-010", client:"Orion Energy Corp",    amount:6800,     currency:"USD", urgency:"standard", domestic:true,  purpose:"payroll",    currentRail:"ACH"     },
  { id:"PMT-011", client:"Meridian Industries",  amount:490000,   currency:"EUR", urgency:"urgent",   domestic:false, purpose:"trade",      currentRail:"SWIFTMX" },
  { id:"PMT-012", client:"Solara Payments",      amount:12000,    currency:"USD", urgency:"urgent",   domestic:true,  purpose:"settlement", currentRail:"FEDWIRE" },
  { id:"PMT-013", client:"Crescent Logistics",   amount:3800,     currency:"USD", urgency:"standard", domestic:true,  purpose:"vendor",     currentRail:"ACH"     },
  { id:"PMT-014", client:"Apex Global Trade",    amount:67000,    currency:"SGD", urgency:"standard", domestic:false, purpose:"supplier",   currentRail:"SWIFTMX" },
  { id:"PMT-015", client:"Northgate Capital",    amount:88000,    currency:"USD", urgency:"standard", domestic:true,  purpose:"settlement", currentRail:"FEDWIRE" },
];

// ─── ROUTING LOGIC ────────────────────────────────────────────────────────────
// Score each available rail for a payment, return ranked recommendations
function scoreRails(payment) {
  const candidates = Object.entries(RAILS)
    .filter(([key, r]) => {
      if (!payment.domestic && !r.xborder) return false;
      if (payment.domestic && !r.domestic) return false;
      if (r.maxAmt && payment.amount > r.maxAmt) return false;
      return true;
    });

  return candidates.map(([key, r]) => {
    // Cost score (0–40): lower cost = higher score
    const maxCost = 20;
    const costScore = Math.max(0, 40 * (1 - Math.min(r.unitCost / maxCost, 1)));

    // Speed score (0–30): faster = higher; weight by urgency
    const speedWeight = payment.urgency === "urgent" ? 40 : 20;
    const speedScore = speedWeight * (1 - Math.min(r.minHrs / 24, 1));

    // STP score (0–20): higher STP = higher score
    const stpScore = 20 * ((r.stpRate - 88) / 12);

    // Finality score (0–10)
    const finalityMap = { Instant: 10, "Same-day": 7, "Next-day": 4, "1–2 days": 1 };
    const finalityScore = finalityMap[r.finality] || 4;

    const total = costScore + speedScore + stpScore + finalityScore;

    // Savings vs current rail
    const currentCost = RAILS[payment.currentRail]?.unitCost || 8.5;
    const saving = currentCost - r.unitCost;

    return {
      railKey: key,
      rail: r.label,
      color: r.color,
      score: Math.round(total),
      costScore: Math.round(costScore),
      speedScore: Math.round(speedScore),
      stpScore: Math.round(stpScore),
      finalityScore: Math.round(finalityScore),
      unitCost: r.unitCost,
      saving,
      settlementTime: r.minHrs === 0 ? "< 5 min" : r.minHrs < 1 ? `${Math.round(r.minHrs*60)} min` : `${r.minHrs}–${r.maxHrs}h`,
      stpRate: r.stpRate,
      finality: r.finality,
    };
  }).sort((a, b) => b.score - a.score);
}

// ─── PORTFOLIO ROUTING ANALYSIS ───────────────────────────────────────────────
function buildPortfolioStats(queue) {
  const current = queue.reduce((acc, p) => {
    const r = RAILS[p.currentRail];
    acc.cost += r ? r.unitCost : 0;
    acc.txns++;
    return acc;
  }, { cost: 0, txns: 0 });

  const optimized = queue.reduce((acc, p) => {
    const ranked = scoreRails(p);
    if (ranked.length > 0) acc.cost += ranked[0].unitCost;
    acc.txns++;
    return acc;
  }, { cost: 0, txns: 0 });

  const currentAvg = current.cost / current.txns;
  const optimizedAvg = optimized.cost / optimized.txns;
  const savingPct = ((currentAvg - optimizedAvg) / currentAvg) * 100;

  // Rail distribution shift
  const currentDist = {};
  const optDist = {};
  queue.forEach(p => {
    currentDist[p.currentRail] = (currentDist[p.currentRail] || 0) + 1;
    const top = scoreRails(p)[0];
    if (top) optDist[top.railKey] = (optDist[top.railKey] || 0) + 1;
  });

  return { currentAvg, optimizedAvg, savingPct, currentDist, optDist, totalPayments: queue.length };
}

const portfolioStats = buildPortfolioStats(PAYMENT_QUEUE);

// Rail migration chart data
const RAIL_SHIFT_DATA = Object.keys(RAILS).map(key => ({
  rail: RAILS[key].label,
  current: portfolioStats.currentDist[key] || 0,
  optimized: portfolioStats.optDist[key] || 0,
  color: RAILS[key].color,
})).filter(d => d.current > 0 || d.optimized > 0);

// ─── RADAR DATA per rail ──────────────────────────────────────────────────────
const RAIL_RADAR = Object.entries(RAILS).map(([key, r]) => ({
  rail: r.label,
  color: r.color,
  data: [
    { dimension: "Cost Efficiency", value: Math.round(100 * (1 - Math.min(r.unitCost / 20, 1))) },
    { dimension: "Speed",           value: Math.round(100 * (1 - r.minHrs / 24)) },
    { dimension: "STP Rate",        value: Math.round((r.stpRate - 88) / 12 * 100) },
    { dimension: "Finality",        value: { Instant: 100, "Same-day": 70, "Next-day": 40, "1–2 days": 10 }[r.finality] },
    { dimension: "Scalability",     value: r.maxAmt ? 60 : 100 },
  ]
}));

// Flatten for one radar
const RADAR_DIMENSIONS = ["Cost Efficiency", "Speed", "STP Rate", "Finality", "Scalability"];
const RADAR_DATA = RADAR_DIMENSIONS.map(dim => {
  const row = { dimension: dim };
  RAIL_RADAR.forEach(r => { row[r.rail] = r.data.find(d => d.dimension === dim)?.value || 0; });
  return row;
});

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n.toFixed(2)}`;
const urgencyColor = u => u === "urgent" ? T.red : T.green;

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────
const Chip = ({ label, color, bg }) => (
  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: bg || `${color}18`, color: color || T.inkMid, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em", fontWeight: 500, border: `1px solid ${color || T.rule}33` }}>{label}</span>
);

const ScoreBar = ({ label, value, max = 40, color }) => (
  <div style={{ marginBottom: 6 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
      <span style={{ fontSize: 10, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</span>
      <span style={{ fontSize: 10, color: T.ink, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{value}</span>
    </div>
    <div style={{ height: 5, background: T.gridLine, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
    </div>
  </div>
);

const MetricTile = ({ label, value, sub, accent }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "18px 20px", borderBottom: `3px solid ${accent || T.green}` }}>
    <div style={{ fontSize: 10, color: T.inkFaint, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
    <div style={{ width: 24, height: 2, background: T.green }} />
    <h2 style={{ margin: 0, fontSize: 11, fontWeight: 600, color: T.green, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.14em", textTransform: "uppercase" }}>{children}</h2>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function RailSelectionOptimizer() {
  const [activeTab, setActiveTab] = useState("optimizer");
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_QUEUE[0]);
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const ranked = useMemo(() => scoreRails(selectedPayment), [selectedPayment]);
  const topRail = ranked[0];

  const filteredQueue = useMemo(() =>
    PAYMENT_QUEUE.filter(p =>
      (filterUrgency === "all" || p.urgency === filterUrgency) &&
      (filterType === "all" || (filterType === "domestic" ? p.domestic : !p.domestic))
    ), [filterUrgency, filterType]);

  const tabs = ["optimizer", "queue", "rails", "savings"];

return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'IBM Plex Sans', sans-serif", color: T.ink }}>
      <ModelBackBar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: ${T.bg}; } ::-webkit-scrollbar-thumb { background: ${T.rule}; border-radius: 2px; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 10px 20px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.2s; border-bottom: 2px solid transparent; }
        .tab-btn:hover { color: ${T.green} !important; }
        .pmt-row { cursor: pointer; transition: background 0.15s; }
        .pmt-row:hover { background: ${T.greenLt} !important; }
        .rail-card { transition: all 0.2s; cursor: pointer; }
        .rail-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .filter-btn { cursor: pointer; background: none; border: 1px solid ${T.border}; color: ${T.inkFaint}; padding: 4px 12px; border-radius: 3px; font-size: 10px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; transition: all 0.15s; }
        .filter-btn.active { border-color: ${T.green}; color: ${T.green}; background: ${T.greenLt}; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        .slide-in { animation: slideIn 0.35s ease forwards; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ background: T.ink, padding: "0 32px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 28, height: 28, border: `2px solid ${T.green}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: T.green }}>⇄</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color: "#FFFFFF", letterSpacing: "0.06em" }}>RAIL ECONOMICS ANALYZER</div>
              <div style={{ fontSize: 10, color: "#888", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em" }}>MODEL 02 — INFRASTRUCTURE INTELLIGENCE · LAYER 2</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[
              { label: "RAILS ACTIVE", value: "6" },
              { label: "QUEUE", value: `${PAYMENT_QUEUE.length} PMTs` },
              { label: "SAVINGS OPP.", value: `${portfolioStats.savingPct.toFixed(0)}%` },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.green, fontFamily: "'IBM Plex Mono', monospace" }}>{m.value}</div>
                <div style={{ fontSize: 9, color: "#666", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ───────────────────────────────────────────────────────── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", gap: 0 }}>
          {tabs.map(t => (
            <button key={t} className="tab-btn" onClick={() => setActiveTab(t)}
              style={{ color: activeTab === t ? T.green : T.inkFaint, borderBottomColor: activeTab === t ? T.green : "transparent", fontWeight: activeTab === t ? 600 : 400 }}>
              {t === "optimizer" ? "Rail Optimizer" : t === "queue" ? "Payment Queue" : t === "rails" ? "Rail Comparison" : "Savings Analysis"}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "28px 32px" }}>

        {/* ══ OPTIMIZER TAB ══════════════════════════════════════════════ */}
        {activeTab === "optimizer" && (
          <div className="slide-in" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>

            {/* Left: Payment selector */}
            <div>
              <SectionTitle>Select Payment</SectionTitle>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                {PAYMENT_QUEUE.slice(0, 8).map((p, i) => (
                  <div key={p.id} className="pmt-row"
                    onClick={() => setSelectedPayment(p)}
                    style={{
                      padding: "12px 16px",
                      borderBottom: i < 7 ? `1px solid ${T.border}` : "none",
                      background: selectedPayment.id === p.id ? T.greenLt : i % 2 === 0 ? T.card : T.surface,
                      borderLeft: selectedPayment.id === p.id ? `3px solid ${T.green}` : "3px solid transparent"
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: T.ink }}>{p.client}</div>
                        <div style={{ fontSize: 10, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>{p.id} · {p.currency}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(p.amount)}</div>
                        <Chip label={p.urgency} color={urgencyColor(p.urgency)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", background: T.blueLt, borderRadius: 8, border: `1px solid ${T.blue}22` }}>
                <div style={{ fontSize: 10, color: T.blue, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, marginBottom: 4 }}>CURRENT ROUTING</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{RAILS[selectedPayment.currentRail]?.label}</span>
                  <span style={{ fontSize: 12, color: T.inkMid, fontFamily: "'IBM Plex Mono', monospace" }}>${RAILS[selectedPayment.currentRail]?.unitCost} / txn</span>
                </div>
              </div>
            </div>

            {/* Right: Recommendation panel */}
            <div>
              <SectionTitle>Routing Recommendation</SectionTitle>

              {/* Payment summary */}
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                  {[
                    { l: "Payment ID", v: selectedPayment.id },
                    { l: "Amount", v: fmt(selectedPayment.amount) },
                    { l: "Currency", v: selectedPayment.currency },
                    { l: "Urgency", v: selectedPayment.urgency.toUpperCase() },
                    { l: "Type", v: selectedPayment.domestic ? "Domestic" : "Cross-border" },
                  ].map(m => (
                    <div key={m.l}>
                      <div style={{ fontSize: 10, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>{m.l}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, fontFamily: "'IBM Plex Mono', monospace" }}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ranked rail cards */}
              {ranked.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace" }}>No eligible rails for this payment configuration.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ranked.slice(0, 4).map((r, i) => (
                    <div key={r.railKey} className="rail-card"
                      style={{
                        background: i === 0 ? T.greenLt : T.surface,
                        border: `1px solid ${i === 0 ? T.green : T.border}`,
                        borderRadius: 10, padding: 18,
                        borderLeft: `4px solid ${r.color}`,
                        opacity: i === 0 ? 1 : 0.85
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {i === 0 && <span style={{ fontSize: 10, padding: "2px 8px", background: T.green, color: "#fff", borderRadius: 3, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>RECOMMENDED</span>}
                          {i === 1 && <span style={{ fontSize: 10, padding: "2px 8px", background: T.amber, color: "#fff", borderRadius: 3, fontFamily: "'IBM Plex Mono', monospace" }}>ALTERNATIVE</span>}
                          <span style={{ fontSize: 15, fontWeight: 700, color: r.color, fontFamily: "'IBM Plex Mono', monospace" }}>{r.rail}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, fontFamily: "'Playfair Display', serif" }}>{r.score}</div>
                            <div style={{ fontSize: 9, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace" }}>SCORE / 100</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                        {[
                          { l: "Unit Cost", v: `$${r.unitCost}`, good: r.unitCost < 5 },
                          { l: "Settlement", v: r.settlementTime, good: r.settlementTime.includes("min") },
                          { l: "STP Rate", v: `${r.stpRate}%`, good: r.stpRate > 98 },
                          { l: "Finality", v: r.finality, good: r.finality === "Instant" },
                        ].map(m => (
                          <div key={m.l} style={{ background: T.bg, borderRadius: 6, padding: "8px 12px" }}>
                            <div style={{ fontSize: 9, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", marginBottom: 3 }}>{m.l}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: m.good ? T.green : T.ink, fontFamily: "'IBM Plex Mono', monospace" }}>{m.v}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                        <ScoreBar label="Cost" value={r.costScore} max={40} color={r.color} />
                        <ScoreBar label="Speed" value={r.speedScore} max={40} color={r.color} />
                        <ScoreBar label="STP" value={r.stpScore} max={20} color={r.color} />
                        <ScoreBar label="Finality" value={r.finalityScore} max={10} color={r.color} />
                      </div>

                      {i === 0 && r.saving > 0 && (
                        <div style={{ marginTop: 12, padding: "8px 12px", background: `${T.green}10`, borderRadius: 6, border: `1px solid ${T.green}33` }}>
                          <span style={{ fontSize: 11, color: T.inkMid, fontFamily: "'IBM Plex Mono', monospace" }}>COST SAVING vs. current routing: </span>
                          <span style={{ fontSize: 11, color: T.green, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>−${r.saving.toFixed(2)} per transaction</span>
                        </div>
                      )}
                      {i === 0 && r.saving <= 0 && (
                        <div style={{ marginTop: 12, padding: "8px 12px", background: T.amberLt, borderRadius: 6, border: `1px solid ${T.amber}33` }}>
                          <span style={{ fontSize: 11, color: T.inkMid, fontFamily: "'IBM Plex Mono', monospace" }}>Current rail is already cost-optimal. </span>
                          <span style={{ fontSize: 11, color: T.amber, fontFamily: "'IBM Plex Mono', monospace" }}>Score advantage is driven by speed / STP / finality factors.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ QUEUE TAB ══════════════════════════════════════════════════ */}
        {activeTab === "queue" && (
          <div className="slide-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <SectionTitle>Full Payment Queue — Optimized Routing</SectionTitle>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 10, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", alignSelf: "center" }}>FILTER:</span>
                {["all", "urgent", "standard"].map(f => (
                  <button key={f} className={`filter-btn ${filterUrgency === f ? "active" : ""}`} onClick={() => setFilterUrgency(f)}>{f.toUpperCase()}</button>
                ))}
                <div style={{ width: 1, background: T.border, margin: "0 4px" }} />
                {["all", "domestic", "xborder"].map(f => (
                  <button key={f} className={`filter-btn ${filterType === f ? "active" : ""}`} onClick={() => setFilterType(f)}>
                    {f === "xborder" ? "CROSS-BORDER" : f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: T.ink }}>
                    {["Payment ID", "Client", "Amount", "Currency", "Urgency", "Type", "Current Rail", "Current Cost", "Recommended Rail", "Rec. Cost", "Saving", "Score"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 9, color: "#888", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", borderBottom: `1px solid #333`, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((p, i) => {
                    const rec = scoreRails(p)[0];
                    const currentRail = RAILS[p.currentRail];
                    const saving = currentRail ? currentRail.unitCost - (rec?.unitCost || 0) : 0;
                    const isSameRail = p.currentRail === rec?.railKey;
                    return (
                      <tr key={p.id} style={{ background: i % 2 === 0 ? T.card : T.surface, borderBottom: `1px solid ${T.gridLine}` }}>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: T.green, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{p.id}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: T.ink }}>{p.client}</td>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: T.ink, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{fmt(p.amount)}</td>
                        <td style={{ padding: "10px 14px" }}><Chip label={p.currency} /></td>
                        <td style={{ padding: "10px 14px" }}><Chip label={p.urgency} color={urgencyColor(p.urgency)} /></td>
                        <td style={{ padding: "10px 14px" }}><Chip label={p.domestic ? "Domestic" : "X-Border"} color={p.domestic ? T.blue : T.amber} /></td>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: T.inkMid, fontFamily: "'IBM Plex Mono', monospace" }}>{currentRail?.label}</td>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: T.red, fontFamily: "'IBM Plex Mono', monospace" }}>${currentRail?.unitCost}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: rec?.color, fontFamily: "'IBM Plex Mono', monospace" }}>{rec?.rail}</span>
                          {isSameRail && <span style={{ fontSize: 9, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", marginLeft: 6 }}>✓ optimal</span>}
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: T.green, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>${rec?.unitCost}</td>
                        <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: saving > 0 ? T.green : saving < 0 ? T.red : T.inkFaint, fontWeight: 600 }}>
                          {saving > 0 ? `−$${saving.toFixed(2)}` : saving < 0 ? `+$${Math.abs(saving).toFixed(2)}` : "—"}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 40, height: 5, background: T.gridLine, borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ width: `${rec?.score || 0}%`, height: "100%", background: rec?.color || T.green, borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 10, color: T.ink, fontFamily: "'IBM Plex Mono', monospace" }}>{rec?.score}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ RAILS TAB ══════════════════════════════════════════════════ */}
        {activeTab === "rails" && (
          <div className="slide-in">
            <SectionTitle>Rail Capability Comparison</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

              {/* Radar chart */}
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 24 }}>
                <div style={{ fontSize: 11, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", marginBottom: 16 }}>MULTI-DIMENSION RAIL SCORING</div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={RADAR_DATA}>
                    <PolarGrid stroke={T.gridLine} />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: T.inkFaint, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} />
                    <PolarRadiusAxis tick={false} domain={[0, 100]} />
                    {Object.entries(RAILS).map(([key, r]) => (
                      <Radar key={key} name={r.label} dataKey={r.label} stroke={r.color} fill={r.color} fillOpacity={0.08} strokeWidth={2} dot={{ fill: r.color, r: 3 }} />
                    ))}
                    <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Cost comparison bar */}
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 24 }}>
                <div style={{ fontSize: 11, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", marginBottom: 16 }}>UNIT COST PER TRANSACTION ($)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={Object.entries(RAILS).map(([k, r]) => ({ rail: r.label, cost: r.unitCost, stp: r.stpRate, color: r.color }))} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
                    <XAxis type="number" tick={{ fill: T.inkFaint, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} tickFormatter={v => `$${v}`} />
                    <YAxis type="category" dataKey="rail" tick={{ fill: T.inkMid, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }} width={90} />
                    <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }} formatter={v => [`$${v}`, "Unit Cost"]} />
                    <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                      {Object.entries(RAILS).map(([k, r]) => <Cell key={k} fill={r.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rail detail cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {Object.entries(RAILS).map(([key, r]) => (
                <div key={key} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20, borderTop: `3px solid ${r.color}` }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: r.color, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>{r.label}</div>
                  {[
                    { l: "Unit Cost", v: `$${r.unitCost}` },
                    { l: "Settlement Window", v: `${r.minHrs === 0 ? "< 5 min" : `${r.minHrs}h`} – ${r.maxHrs < 1 ? `${r.maxHrs * 60} min` : `${r.maxHrs}h`}` },
                    { l: "Finality", v: r.finality },
                    { l: "STP Rate", v: `${r.stpRate}%` },
                    { l: "Max Amount", v: r.maxAmt ? fmt(r.maxAmt) : "No limit" },
                    { l: "Scope", v: [r.domestic && "Domestic", r.xborder && "Cross-border"].filter(Boolean).join(" · ") },
                  ].map(m => (
                    <div key={m.l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${T.gridLine}` }}>
                      <span style={{ fontSize: 10, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace" }}>{m.l}</span>
                      <span style={{ fontSize: 11, color: T.ink, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{m.v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ SAVINGS TAB ════════════════════════════════════════════════ */}
        {activeTab === "savings" && (
          <div className="slide-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              <MetricTile label="Avg. Current Cost" value={`$${portfolioStats.currentAvg.toFixed(2)}`} sub="per transaction (queue avg)" accent={T.red} />
              <MetricTile label="Avg. Optimized Cost" value={`$${portfolioStats.optimizedAvg.toFixed(2)}`} sub="after rail optimization" accent={T.green} />
              <MetricTile label="Cost Reduction" value={`${portfolioStats.savingPct.toFixed(1)}%`} sub="vs. current routing defaults" accent={T.green} />
              <MetricTile label="Payments Analyzed" value={portfolioStats.totalPayments} sub="in current queue" accent={T.blue} />
            </div>

            {/* Rail shift chart */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 24, marginBottom: 24 }}>
              <SectionTitle>Rail Distribution Shift — Current vs. Optimized</SectionTitle>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={RAIL_SHIFT_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                  <XAxis dataKey="rail" tick={{ fill: T.inkFaint, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }} />
                  <YAxis tick={{ fill: T.inkFaint, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} label={{ value: "# Payments", angle: -90, position: "insideLeft", style: { fill: T.inkFaint, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" } }} />
                  <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} />
                  <Bar dataKey="current" name="Current Routing" fill={`${T.red}80`} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="optimized" name="Optimized Routing" radius={[3, 3, 0, 0]}>
                    {RAIL_SHIFT_DATA.map(d => <Cell key={d.rail} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI insights */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 24 }}>
              <SectionTitle>Optimization Insights</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { icon: "↓", color: T.green, title: "Wire Migration Opportunity", body: `${PAYMENT_QUEUE.filter(p => p.currentRail === "FEDWIRE" && p.domestic && p.amount <= 1000000).length} domestic wire payments in the queue are eligible for RTP or FedNow migration. At $8.50 vs. $0.06 per transaction, migrating these payments reduces unit cost by 99%. STP rates on instant rails are higher, reducing operational exception risk.` },
                  { icon: "⇄", color: T.blue, title: "Cross-Border Consistency", body: `All cross-border payments are correctly routed to SWIFT MX — no alternative exists within the current rail set for non-domestic flows. Corridor-specific FX optimization (Model 03) will provide the next layer of cost intelligence on top of rail selection for these payments.` },
                  { icon: "◎", color: T.amber, title: "ACH Retention", body: `Standard domestic low-value payments are already optimally routed on ACH. No migration is recommended — the STP rate and cost profile are appropriate. The focus should be on urgent or same-day eligible flows currently on Fedwire, where instant rail substitution generates the clearest savings.` },
                ].map(n => (
                  <div key={n.title} style={{ background: T.bg, borderRadius: 8, padding: 18, border: `1px solid ${n.color}22`, borderTop: `3px solid ${n.color}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 20, color: n.color, fontFamily: "'IBM Plex Mono', monospace" }}>{n.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>{n.title}</span>
                    </div>
                    <p style={{ fontSize: 12, color: T.inkMid, lineHeight: 1.7, margin: 0 }}>{n.body}</p>
                  </div>
                ))}
              </div>

              {/* Connection to Model 1 */}
              <div style={{ marginTop: 16, padding: "12px 16px", background: T.blueLt, borderRadius: 8, border: `1px solid ${T.blue}22`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, color: T.blue, flexShrink: 0 }}>⟵</span>
                <div>
                  <span style={{ fontSize: 11, color: T.blue, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>MODEL 01 CONNECTION: </span>
                  <span style={{ fontSize: 11, color: T.inkMid }}>Rail unit cost benchmarks and STP performance scores used in this optimizer are sourced from the Profitability Engine (Model 01). Rail migration recommendations here directly reduce the Rail Cost line in the Model 01 margin waterfall — estimated portfolio impact of {portfolioStats.savingPct.toFixed(0)}% reduction in average transaction cost at current queue volumes.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <span style={{ fontSize: 10, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em" }}>RAIL ECONOMICS ANALYZER · MODEL 02 · CARLOS UREÑA PAYMENTS STRATEGY PORTFOLIO</span>
        <span style={{ fontSize: 10, color: T.inkFaint, fontFamily: "'IBM Plex Mono', monospace" }}>PROTOTYPE · SYNTHETIC DATA · Q1 2025</span>
      </div>
    </div>
  );
}
