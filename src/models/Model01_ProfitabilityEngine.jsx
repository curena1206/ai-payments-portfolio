import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, ScatterChart, Scatter, ZAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { ModelBackBar } from '../pages/FrameworkIndex'

// ── SYNTHETIC DATA ──────────────────────────────────────────────────────────

const CLIENTS = [
  { id: "C01", name: "Meridian Industries", segment: "Corporate", rail: "Wire+ACH", grossRevenue: 2840000, railCost: 312000, fxMargin: 410000, liquidityDrag: 185000, exceptions: 48000, supportCost: 62000, volume: 18400, corridors: ["US→EU","US→UK","US→SG"] },
  { id: "C02", name: "Apex Global Trade", segment: "Corporate", rail: "SWIFT+Wire", grossRevenue: 3120000, railCost: 498000, fxMargin: 580000, liquidityDrag: 290000, exceptions: 94000, supportCost: 88000, volume: 9200, corridors: ["US→AE","US→IN","US→HK"] },
  { id: "C03", name: "Northgate Capital", segment: "FI", rail: "Wire", grossRevenue: 1950000, railCost: 180000, fxMargin: 95000, liquidityDrag: 72000, exceptions: 22000, supportCost: 41000, volume: 5100, corridors: ["US→EU","US→CH"] },
  { id: "C04", name: "Solara Payments", segment: "Fintech", rail: "RTP+ACH", grossRevenue: 890000, railCost: 44000, fxMargin: 12000, liquidityDrag: 18000, exceptions: 8000, supportCost: 29000, volume: 142000, corridors: ["US DOM"] },
  { id: "C05", name: "Crescent Logistics", segment: "Mid-Market", rail: "ACH+Wire", grossRevenue: 620000, railCost: 88000, fxMargin: 72000, liquidityDrag: 55000, exceptions: 31000, supportCost: 38000, volume: 7800, corridors: ["US→MX","US→BR"] },
  { id: "C06", name: "Atlas Commodities", segment: "Corporate", rail: "SWIFT", grossRevenue: 2210000, railCost: 420000, fxMargin: 310000, liquidityDrag: 248000, exceptions: 118000, supportCost: 71000, volume: 3900, corridors: ["US→NG","US→ZA","US→IN"] },
  { id: "C07", name: "Veritas Healthcare", segment: "Mid-Market", rail: "ACH", grossRevenue: 310000, railCost: 18000, fxMargin: 0, liquidityDrag: 8000, exceptions: 4000, supportCost: 22000, volume: 48000, corridors: ["US DOM"] },
  { id: "C08", name: "Pinnacle Asset Mgmt", segment: "FI", rail: "Wire+SWIFT", grossRevenue: 1680000, railCost: 210000, fxMargin: 240000, liquidityDrag: 135000, exceptions: 29000, supportCost: 48000, volume: 4200, corridors: ["US→EU","US→JP","US→UK"] },
  { id: "C09", name: "TerraFin Services", segment: "Fintech", rail: "FedNow+RTP", grossRevenue: 540000, railCost: 28000, fxMargin: 0, liquidityDrag: 11000, exceptions: 6000, supportCost: 31000, volume: 210000, corridors: ["US DOM"] },
  { id: "C10", name: "Orion Energy Corp", segment: "Corporate", rail: "SWIFT+Wire", grossRevenue: 1890000, railCost: 355000, fxMargin: 220000, liquidityDrag: 198000, exceptions: 88000, supportCost: 55000, volume: 6100, corridors: ["US→NO","US→SA","US→QA"] },
];

const CORRIDORS = [
  { corridor: "US → EU", volume: 14200, grossRev: 1840000, railCost: 198000, fxMargin: 420000, nostro: 145000, compliance: 38000, exceptions: 42000 },
  { corridor: "US → UK", volume: 8900, grossRev: 1120000, railCost: 148000, fxMargin: 280000, nostro: 98000, compliance: 29000, exceptions: 28000 },
  { corridor: "US → SG", volume: 4100, grossRev: 710000, railCost: 108000, fxMargin: 195000, nostro: 88000, compliance: 42000, exceptions: 31000 },
  { corridor: "US → IN", volume: 3800, grossRev: 480000, railCost: 118000, fxMargin: 92000, nostro: 112000, compliance: 58000, exceptions: 64000 },
  { corridor: "US → AE", volume: 2900, grossRev: 620000, railCost: 98000, fxMargin: 148000, nostro: 95000, compliance: 48000, exceptions: 38000 },
  { corridor: "US → MX", volume: 6200, grossRev: 390000, railCost: 68000, fxMargin: 58000, nostro: 42000, compliance: 28000, exceptions: 22000 },
  { corridor: "US → JP", volume: 2100, grossRev: 580000, railCost: 88000, fxMargin: 168000, nostro: 78000, compliance: 35000, exceptions: 18000 },
  { corridor: "US → HK", volume: 1800, grossRev: 490000, railCost: 78000, fxMargin: 145000, nostro: 72000, compliance: 38000, exceptions: 14000 },
  { corridor: "US → BR", volume: 2400, grossRev: 310000, railCost: 88000, fxMargin: 42000, nostro: 95000, compliance: 68000, exceptions: 72000 },
  { corridor: "US → NG", volume: 820, grossRev: 290000, railCost: 78000, fxMargin: 48000, nostro: 112000, compliance: 88000, exceptions: 98000 },
];

const RAIL_DATA = [
  { rail: "ACH", unitCost: 0.12, avgTicket: 4200, volume: 284000, totalCost: 34080, stpRate: 99.2, settlementHrs: 24 },
  { rail: "FedNow", unitCost: 0.045, avgTicket: 8400, volume: 48000, totalCost: 2160, stpRate: 99.8, settlementHrs: 0.08 },
  { rail: "RTP", unitCost: 0.06, avgTicket: 6200, volume: 62000, totalCost: 3720, stpRate: 99.6, settlementHrs: 0.05 },
  { rail: "Domestic Wire", unitCost: 8.50, avgTicket: 284000, volume: 18400, totalCost: 156400, stpRate: 96.8, settlementHrs: 4 },
  { rail: "SWIFT MX", unitCost: 18.40, avgTicket: 412000, volume: 12800, totalCost: 235520, stpRate: 91.2, settlementHrs: 18 },
  { rail: "Virtual Card", unitCost: 0.28, avgTicket: 1800, volume: 28000, totalCost: 7840, stpRate: 98.4, settlementHrs: 2 },
];

const MONTHLY_TREND = [
  { month: "Apr", revenue: 1580, margin: 348, exceptions: 58 },
  { month: "May", revenue: 1690, margin: 372, exceptions: 54 },
  { month: "Jun", revenue: 1740, margin: 391, exceptions: 51 },
  { month: "Jul", revenue: 1820, margin: 412, exceptions: 48 },
  { month: "Aug", revenue: 1940, margin: 398, exceptions: 52 },
  { month: "Sep", revenue: 2010, margin: 441, exceptions: 44 },
  { month: "Oct", revenue: 2180, margin: 418, exceptions: 61 },
  { month: "Nov", revenue: 2340, margin: 502, exceptions: 38 },
  { month: "Dec", revenue: 2090, margin: 448, exceptions: 42 },
  { month: "Jan", revenue: 2280, margin: 521, exceptions: 35 },
  { month: "Feb", revenue: 2410, margin: 489, exceptions: 47 },
  { month: "Mar", revenue: 2560, margin: 558, exceptions: 31 },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (n, decimals = 0) =>
  n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M`
  : n >= 1000 ? `$${(n / 1000).toFixed(decimals === 0 ? 0 : 1)}K`
  : `$${n.toFixed(decimals)}`;

const pct = (n, d) => d === 0 ? "0%" : `${((n / d) * 100).toFixed(1)}%`;

const netMargin = (c) =>
  c.grossRevenue + c.fxMargin - c.railCost - c.liquidityDrag - c.exceptions - c.supportCost;

const netContribution = (c) =>
  c.grossRev + c.fxMargin - c.railCost - c.nostro - c.compliance - c.exceptions;

// ── COLOUR SYSTEM ────────────────────────────────────────────────────────────

const C = {
  bg: "#0a0d12",
  surface: "#111620",
  card: "#161c28",
  border: "#1e2840",
  accent: "#00d4ff",
  accentDim: "#0099bb",
  gold: "#f0a500",
  green: "#00c984",
  red: "#ff4d6a",
  amber: "#ffb830",
  text: "#e8edf5",
  muted: "#6b7a9a",
  gridLine: "#1a2035",
};

// ── SUB COMPONENTS ────────────────────────────────────────────────────────────

const MetricCard = ({ label, value, sub, accent, delta }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "20px 24px",
    borderTop: `2px solid ${accent || C.accent}`,
    display: "flex", flexDirection: "column", gap: 6,
  }}>
    <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: delta > 0 ? C.green : delta < 0 ? C.red : C.muted, fontFamily: "'DM Mono', monospace" }}>{sub}</div>}
  </div>
);

const SectionHead = ({ title, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <div style={{ width: 3, height: 18, background: C.accent, borderRadius: 2 }} />
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, fontFamily: "'Syne', sans-serif", letterSpacing: "0.02em", textTransform: "uppercase" }}>{title}</h2>
    </div>
    {sub && <div style={{ fontSize: 12, color: C.muted, paddingLeft: 13, fontFamily: "'DM Mono', monospace" }}>{sub}</div>}
  </div>
);

const Tag = ({ label, color }) => (
  <span style={{
    fontSize: 10, padding: "2px 8px", borderRadius: 4,
    background: `${color}22`, color, border: `1px solid ${color}44`,
    fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
  }}>{label}</span>
);

// ── WATERFALL CHART ───────────────────────────────────────────────────────────

const WaterfallBar = ({ label, value, isPositive, isNet, total }) => {
  const w = Math.abs(value / total) * 100;
  const color = isNet ? C.accent : isPositive ? C.green : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <div style={{ width: 140, fontSize: 11, color: C.muted, textAlign: "right", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 28, background: C.surface, borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{ width: `${w}%`, height: "100%", background: isNet ? `linear-gradient(90deg, ${C.accentDim}, ${C.accent})` : color, borderRadius: 4, opacity: isNet ? 1 : 0.85, transition: "width 0.8s ease" }} />
        <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: C.text, fontFamily: "'DM Mono', monospace" }}>
          {isPositive ? "+" : ""}{fmt(value)}
        </div>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function PaymentProfitabilityEngine() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClient, setSelectedClient] = useState(null);
  const [sortBy, setSortBy] = useState("net");
  const [hoveredCorridor, setHoveredCorridor] = useState(null);

  // Portfolio aggregates
  const portfolio = useMemo(() => {
    const totals = CLIENTS.reduce((acc, c) => ({
      grossRevenue: acc.grossRevenue + c.grossRevenue,
      railCost: acc.railCost + c.railCost,
      fxMargin: acc.fxMargin + c.fxMargin,
      liquidityDrag: acc.liquidityDrag + c.liquidityDrag,
      exceptions: acc.exceptions + c.exceptions,
      supportCost: acc.supportCost + c.supportCost,
      volume: acc.volume + c.volume,
    }), { grossRevenue: 0, railCost: 0, fxMargin: 0, liquidityDrag: 0, exceptions: 0, supportCost: 0, volume: 0 });
    totals.net = totals.grossRevenue + totals.fxMargin - totals.railCost - totals.liquidityDrag - totals.exceptions - totals.supportCost;
    totals.netMarginPct = (totals.net / (totals.grossRevenue + totals.fxMargin)) * 100;
    return totals;
  }, []);

  // Sorted clients
  const sortedClients = useMemo(() => {
    const withNet = CLIENTS.map(c => ({ ...c, net: netMargin(c), netPct: (netMargin(c) / (c.grossRevenue + c.fxMargin)) * 100 }));
    return [...withNet].sort((a, b) => sortBy === "net" ? b.net - a.net : sortBy === "pct" ? b.netPct - a.netPct : b.grossRevenue - a.grossRevenue);
  }, [sortBy]);

  // Corridor analytics
  const corridorData = useMemo(() => CORRIDORS.map(c => ({
    ...c,
    net: netContribution(c),
    netPct: (netContribution(c) / (c.grossRev + c.fxMargin)) * 100,
    costRatio: (c.railCost + c.nostro + c.compliance + c.exceptions) / (c.grossRev + c.fxMargin),
  })).sort((a, b) => b.net - a.net), []);

  // Waterfall for portfolio
  const waterfallTotal = portfolio.grossRevenue + portfolio.fxMargin;

  const tabs = ["overview", "clients", "corridors", "rails", "trends"];

return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      <ModelBackBar />
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${C.bg}; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
        .tab-btn { cursor: pointer; padding: 8px 18px; border-radius: 6px; font-size: 12px; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; border: none; transition: all 0.2s; text-transform: uppercase; }
        .tab-btn:hover { background: #1a2240 !important; }
        .client-row { transition: background 0.15s; cursor: pointer; }
        .client-row:hover { background: #1a2240 !important; }
        .sort-btn { cursor: pointer; background: none; border: 1px solid ${C.border}; color: ${C.muted}; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; transition: all 0.15s; }
        .sort-btn:hover, .sort-btn.active { border-color: ${C.accent}; color: ${C.accent}; background: ${C.accent}11; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDim})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14 }}>◈</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.text, letterSpacing: "0.04em" }}>PAYMENT PROFITABILITY ENGINE</div>
              <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>MODEL 01 — MARGIN INTELLIGENCE</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
            <span style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>LIVE · Q1 2025 · 10 CLIENTS · {CORRIDORS.length} CORRIDORS</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t} className="tab-btn" onClick={() => setActiveTab(t)}
              style={{ background: activeTab === t ? `${C.accent}18` : "transparent", color: activeTab === t ? C.accent : C.muted, borderBottom: activeTab === t ? `2px solid ${C.accent}` : "2px solid transparent" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "28px 32px" }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="fade-in">
            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 28 }}>
              <MetricCard label="Gross Revenue" value={fmt(portfolio.grossRevenue + portfolio.fxMargin)} sub="Fees + FX margin" accent={C.accent} />
              <MetricCard label="Net Contribution" value={fmt(portfolio.net)} sub={`${portfolio.netMarginPct.toFixed(1)}% net margin`} accent={C.green} />
              <MetricCard label="Rail Cost" value={fmt(portfolio.railCost)} sub={pct(portfolio.railCost, portfolio.grossRevenue + portfolio.fxMargin) + " of revenue"} accent={C.amber} />
              <MetricCard label="Liquidity Drag" value={fmt(portfolio.liquidityDrag)} sub="Nostro + prefund" accent={C.amber} />
              <MetricCard label="Exception Cost" value={fmt(portfolio.exceptions)} sub={`${(portfolio.exceptions / portfolio.volume * 100).toFixed(2)}¢ per txn`} accent={C.red} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
              {/* Margin Waterfall */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                <SectionHead title="Portfolio Margin Waterfall" sub="Gross revenue to net contribution" />
                <WaterfallBar label="Fee Revenue" value={portfolio.grossRevenue} isPositive total={waterfallTotal} />
                <WaterfallBar label="+ FX Margin" value={portfolio.fxMargin} isPositive total={waterfallTotal} />
                <div style={{ borderTop: `1px dashed ${C.border}`, margin: "10px 0" }} />
                <WaterfallBar label="− Rail Costs" value={-portfolio.railCost} total={waterfallTotal} />
                <WaterfallBar label="− Liquidity Drag" value={-portfolio.liquidityDrag} total={waterfallTotal} />
                <WaterfallBar label="− Exception Costs" value={-portfolio.exceptions} total={waterfallTotal} />
                <WaterfallBar label="− Support Overhead" value={-portfolio.supportCost} total={waterfallTotal} />
                <div style={{ borderTop: `1px solid ${C.accent}44`, margin: "10px 0" }} />
                <WaterfallBar label="NET CONTRIBUTION" value={portfolio.net} isNet total={waterfallTotal} />
                <div style={{ marginTop: 16, padding: "10px 14px", background: `${C.accent}0a`, borderRadius: 8, border: `1px solid ${C.accent}22` }}>
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>AI INSIGHT: </span>
                  <span style={{ fontSize: 11, color: C.text }}>Liquidity drag represents <strong style={{ color: C.amber }}>{pct(portfolio.liquidityDrag, portfolio.grossRevenue + portfolio.fxMargin)}</strong> of gross revenue — the single largest margin compression driver after rail costs. Corridor prefunding optimization could recover <strong style={{ color: C.green }}>{fmt(portfolio.liquidityDrag * 0.22)}</strong> annually.</span>
                </div>
              </div>

              {/* Client concentration */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                <SectionHead title="Client Revenue Concentration" sub="Top 10 by gross contribution" />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={sortedClients.slice(0, 8).map(c => ({ name: c.name.split(" ")[0], net: Math.round(c.net / 1000), gross: Math.round((c.grossRevenue + c.fxMargin) / 1000) }))} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} />
                    <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} tickFormatter={v => `$${v}K`} />
                    <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 11 }} formatter={(v) => [`$${v}K`]} />
                    <Bar dataKey="gross" fill={`${C.accent}33`} radius={[3, 3, 0, 0]} name="Gross Rev" />
                    <Bar dataKey="net" fill={C.green} radius={[3, 3, 0, 0]} name="Net Margin" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rail cost efficiency */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
              <SectionHead title="Rail Cost Efficiency Matrix" sub="Unit cost vs. volume vs. STP rate" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
                {RAIL_DATA.map(r => {
                  const efficiency = r.stpRate / (r.unitCost * 10 + 1);
                  const color = r.unitCost < 1 ? C.green : r.unitCost < 10 ? C.amber : C.red;
                  return (
                    <div key={r.rail} style={{ background: C.surface, borderRadius: 8, padding: 16, border: `1px solid ${color}33` }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.text, fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>{r.rail}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "'Syne', sans-serif" }}>${r.unitCost}</div>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>per transaction</div>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace" }}>STP: <span style={{ color: C.text }}>{r.stpRate}%</span></div>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace" }}>Vol: <span style={{ color: C.text }}>{(r.volume / 1000).toFixed(0)}K txns</span></div>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace" }}>T+: <span style={{ color: C.text }}>{r.settlementHrs < 1 ? `${(r.settlementHrs * 60).toFixed(0)}min` : `${r.settlementHrs}h`}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CLIENT TAB ── */}
        {activeTab === "clients" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <SectionHead title="Client Profitability Ranking" sub="Transaction-level margin attribution by client" />
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace" }}>SORT BY:</span>
                {["net", "pct", "gross"].map(s => (
                  <button key={s} className={`sort-btn ${sortBy === s ? "active" : ""}`} onClick={() => setSortBy(s)}>
                    {s === "net" ? "NET $" : s === "pct" ? "MARGIN %" : "GROSS REV"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.surface }}>
                    {["#", "Client", "Segment", "Rail Mix", "Gross Rev", "Rail Cost", "FX Margin", "Liq. Drag", "Exceptions", "Net Margin", "Margin %", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedClients.map((c, i) => {
                    const statusColor = c.netPct > 35 ? C.green : c.netPct > 20 ? C.amber : C.red;
                    const statusLabel = c.netPct > 35 ? "HEALTHY" : c.netPct > 20 ? "WATCH" : "AT RISK";
                    return (
                      <tr key={c.id} className="client-row"
                        onClick={() => setSelectedClient(selectedClient?.id === c.id ? null : c)}
                        style={{ background: selectedClient?.id === c.id ? `${C.accent}08` : i % 2 === 0 ? C.card : `${C.card}cc`, borderLeft: selectedClient?.id === c.id ? `3px solid ${C.accent}` : "3px solid transparent" }}>
                        <td style={{ padding: "12px 14px", fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>{String(i + 1).padStart(2, "0")}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
                          <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace" }}>{c.volume.toLocaleString()} txns</div>
                        </td>
                        <td style={{ padding: "12px 14px" }}><Tag label={c.segment} color={C.accent} /></td>
                        <td style={{ padding: "12px 14px", fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>{c.rail}</td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(c.grossRevenue)}</td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: C.red, fontFamily: "'DM Mono', monospace" }}>−{fmt(c.railCost)}</td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: C.green, fontFamily: "'DM Mono', monospace" }}>+{fmt(c.fxMargin)}</td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: C.amber, fontFamily: "'DM Mono', monospace" }}>−{fmt(c.liquidityDrag)}</td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: C.red, fontFamily: "'DM Mono', monospace" }}>−{fmt(c.exceptions)}</td>
                        <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: c.net > 0 ? C.green : C.red, fontFamily: "'Syne', sans-serif" }}>{fmt(c.net)}</td>
                        <td style={{ padding: "12px 14px", fontSize: 12, color: statusColor, fontFamily: "'DM Mono', monospace" }}>{c.netPct.toFixed(1)}%</td>
                        <td style={{ padding: "12px 14px" }}><Tag label={statusLabel} color={statusColor} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Client drill-down */}
            {selectedClient && (
              <div className="fade-in" style={{ marginTop: 20, background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.text }}>{selectedClient.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
                      {selectedClient.segment} · {selectedClient.rail} · {selectedClient.corridors.join(" · ")}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: selectedClient.net > 0 ? C.green : C.red }}>{fmt(selectedClient.net)}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>net contribution</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
                  {[
                    { label: "Fee Revenue", value: selectedClient.grossRevenue, color: C.accent },
                    { label: "FX Margin", value: selectedClient.fxMargin, color: C.green },
                    { label: "Rail Cost", value: -selectedClient.railCost, color: C.red },
                    { label: "Liquidity Drag", value: -selectedClient.liquidityDrag, color: C.amber },
                    { label: "Exceptions", value: -selectedClient.exceptions, color: C.red },
                    { label: "Support", value: -selectedClient.supportCost, color: C.amber },
                  ].map(m => (
                    <div key={m.label} style={{ background: C.surface, borderRadius: 8, padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{m.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: m.color, fontFamily: "'Syne', sans-serif" }}>{m.value > 0 ? "+" : ""}{fmt(m.value)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: "10px 14px", background: `${C.accent}08`, borderRadius: 8, border: `1px solid ${C.accent}22` }}>
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>AI INSIGHT: </span>
                  <span style={{ fontSize: 11, color: C.text }}>
                    {selectedClient.exceptions / selectedClient.grossRevenue > 0.04
                      ? `Exception cost ratio of ${pct(selectedClient.exceptions, selectedClient.grossRevenue)} is above portfolio average. Primary driver is likely ${selectedClient.corridors[selectedClient.corridors.length - 1]} corridor complexity. Operational review recommended.`
                      : selectedClient.fxMargin / selectedClient.grossRevenue > 0.15
                      ? `FX margin contribution of ${pct(selectedClient.fxMargin, selectedClient.grossRevenue)} is a key value driver. Protect pricing in next renewal — this client has cross-border dependency and limited rate sensitivity.`
                      : `Net margin of ${selectedClient.netPct?.toFixed(1)}% is within portfolio range. Primary optimization lever is rail cost — evaluate eligibility for ACH or RTP migration on domestic flows.`}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CORRIDORS TAB ── */}
        {activeTab === "corridors" && (
          <div className="fade-in">
            <SectionHead title="Corridor Economics" sub="Net contribution by currency corridor — growth, defend, optimize, exit classification" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 24 }}>
              {corridorData.map((c) => {
                const netPct = c.netPct;
                const quadrant = netPct > 40 ? { label: "GROW", color: C.green } : netPct > 25 ? { label: "DEFEND", color: C.accent } : netPct > 10 ? { label: "OPTIMIZE", color: C.amber } : { label: "EXIT", color: C.red };
                const barFill = (c.net / corridorData[0].net) * 100;
                return (
                  <div key={c.corridor} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, borderLeft: `3px solid ${quadrant.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.text }}>{c.corridor}</div>
                        <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{c.volume.toLocaleString()} txns · avg {fmt(Math.round((c.grossRev + c.fxMargin) / c.volume))} / txn</div>
                      </div>
                      <Tag label={quadrant.label} color={quadrant.color} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
                      {[
                        { l: "Gross Rev", v: fmt(c.grossRev + c.fxMargin), c: C.accent },
                        { l: "Rail + Nostro", v: fmt(c.railCost + c.nostro), c: C.red },
                        { l: "Compliance", v: fmt(c.compliance + c.exceptions), c: C.amber },
                        { l: "Net", v: fmt(c.net), c: c.net > 0 ? C.green : C.red },
                      ].map(m => (
                        <div key={m.l} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>{m.l}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: m.c, fontFamily: "'Syne', sans-serif" }}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: 4, background: C.surface, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${Math.max(0, Math.min(100, barFill))}%`, height: "100%", background: quadrant.color, borderRadius: 2, transition: "width 0.6s ease" }} />
                    </div>
                    <div style={{ textAlign: "right", fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
                      Net margin: <span style={{ color: quadrant.color }}>{netPct.toFixed(1)}%</span> · Cost ratio: <span style={{ color: C.text }}>{(c.costRatio * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strategy matrix summary */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <SectionHead title="Portfolio Strategy Matrix" sub="AI-generated corridor investment recommendations" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {[
                  { label: "GROW", color: C.green, items: corridorData.filter(c => c.netPct > 40).map(c => c.corridor), desc: "High margin, invest in volume growth" },
                  { label: "DEFEND", color: C.accent, items: corridorData.filter(c => c.netPct > 25 && c.netPct <= 40).map(c => c.corridor), desc: "Solid economics, protect pricing" },
                  { label: "OPTIMIZE", color: C.amber, items: corridorData.filter(c => c.netPct > 10 && c.netPct <= 25).map(c => c.corridor), desc: "Margin pressure — review costs" },
                  { label: "EXIT", color: C.red, items: corridorData.filter(c => c.netPct <= 10).map(c => c.corridor), desc: "Below threshold — restructure or exit" },
                ].map(q => (
                  <div key={q.label} style={{ background: C.surface, borderRadius: 8, padding: 16, border: `1px solid ${q.color}33` }}>
                    <Tag label={q.label} color={q.color} />
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace", margin: "8px 0" }}>{q.desc}</div>
                    {q.items.length === 0
                      ? <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>None</div>
                      : q.items.map(i => <div key={i} style={{ fontSize: 12, color: C.text, padding: "3px 0", borderBottom: `1px solid ${C.border}` }}>{i}</div>)
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RAILS TAB ── */}
        {activeTab === "rails" && (
          <div className="fade-in">
            <SectionHead title="Rail Cost & Performance Analysis" sub="Multi-rail infrastructure economics" />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={RAIL_DATA} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} />
                  <XAxis dataKey="rail" tick={{ fill: C.muted, fontSize: 11, fontFamily: "'DM Mono', monospace" }} />
                  <YAxis yAxisId="left" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} tickFormatter={v => `$${v}`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: C.muted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} tickFormatter={v => `${v}%`} domain={[88, 100]} />
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="unitCost" name="Unit Cost ($)" radius={[4, 4, 0, 0]}>
                    {RAIL_DATA.map((r) => <Cell key={r.rail} fill={r.unitCost < 1 ? C.green : r.unitCost < 10 ? C.amber : C.red} />)}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="stpRate" stroke={C.accent} strokeWidth={2} dot={{ fill: C.accent, r: 4 }} name="STP Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {RAIL_DATA.map(r => (
                <div key={r.rail} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.text, marginBottom: 12 }}>{r.rail}</div>
                  {[
                    { label: "Unit Cost", value: `$${r.unitCost}`, color: r.unitCost < 1 ? C.green : r.unitCost < 10 ? C.amber : C.red },
                    { label: "Volume", value: `${r.volume.toLocaleString()} txns` },
                    { label: "Total Cost", value: fmt(r.totalCost) },
                    { label: "Avg Ticket", value: fmt(r.avgTicket) },
                    { label: "STP Rate", value: `${r.stpRate}%` },
                    { label: "Settlement", value: r.settlementHrs < 1 ? `${(r.settlementHrs * 60).toFixed(0)} min` : `${r.settlementHrs}h` },
                  ].map(m => (
                    <div key={m.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>{m.label}</span>
                      <span style={{ fontSize: 12, color: m.color || C.text, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TRENDS TAB ── */}
        {activeTab === "trends" && (
          <div className="fade-in">
            <SectionHead title="Portfolio Performance Trends" sub="12-month rolling margin and exception analysis" />
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>REVENUE VS NET MARGIN TREND ($000s)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={MONTHLY_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} />
                    <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11, fontFamily: "'DM Mono', monospace" }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} tickFormatter={v => `$${v}K`} />
                    <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 11 }} formatter={v => [`$${v}K`]} />
                    <Line type="monotone" dataKey="revenue" stroke={C.accent} strokeWidth={2} dot={{ fill: C.accent, r: 3 }} name="Gross Revenue" />
                    <Line type="monotone" dataKey="margin" stroke={C.green} strokeWidth={2} dot={{ fill: C.green, r: 3 }} name="Net Margin" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>EXCEPTION COST TREND ($000s)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={MONTHLY_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} />
                    <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11, fontFamily: "'DM Mono', monospace" }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} tickFormatter={v => `$${v}K`} />
                    <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 11 }} formatter={v => [`$${v}K`]} />
                    <Bar dataKey="exceptions" radius={[3, 3, 0, 0]} name="Exception Cost">
                      {MONTHLY_TREND.map((m) => <Cell key={m.month} fill={m.exceptions > 50 ? C.red : m.exceptions > 40 ? C.amber : C.green} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ marginTop: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <SectionHead title="AI Trend Narrative" sub="Model-generated strategic assessment" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {[
                  { icon: "↗", color: C.green, title: "Revenue Momentum", body: "Gross revenue grew 62.0% over the 12-month period with net margin compressing from 22.0% to 21.8% — slight margin pressure despite strong volume growth, consistent with rail cost inflation on SWIFT MX flows." },
                  { icon: "⚠", color: C.amber, title: "Margin Compression Risk", body: "October exception spike of $61K correlates with new corridor onboarding. Exception costs have since trended down 49% — structural improvement, not seasonal. Recommend STP target of 97.5% for SWIFT corridors." },
                  { icon: "◎", color: C.accent, title: "Optimization Opportunity", body: "FedNow and RTP adoption remain underweight relative to eligible volume. Migrating 20% of low-value wire volume to instant rails would reduce rail cost by an estimated $118K annually at current volumes." },
                ].map(n => (
                  <div key={n.title} style={{ background: C.surface, borderRadius: 8, padding: 16, border: `1px solid ${n.color}33` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18, color: n.color }}>{n.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.text }}>{n.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{n.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>PAYMENT PROFITABILITY ENGINE · MODEL 01 · CARLOS UREÑA PAYMENTS STRATEGY PORTFOLIO</span>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace" }}>PROTOTYPE · SYNTHETIC DATA · Q1 2025</span>
      </div>
    </div>
  );
}
