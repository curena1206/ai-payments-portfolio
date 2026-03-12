import { useState, useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Area
} from "recharts";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
// Aesthetic: Rich midnight blue with gold accents — cartographic, premium, global
const T = {
  bg:        "#0D1117",
  surface:   "#161B22",
  card:      "#1C2333",
  border:    "#2D3748",
  borderLt:  "#3D4F6B",
  gold:      "#D4A843",
  goldLt:    "#F5E6B8",
  goldDim:   "#8A6C27",
  teal:      "#2DD4BF",
  tealDim:   "#0D9488",
  red:       "#F87171",
  redDim:    "#991B1B",
  amber:     "#FBBF24",
  green:     "#34D399",
  greenDim:  "#065F46",
  blue:      "#60A5FA",
  blueDim:   "#1D4ED8",
  text:      "#E2E8F0",
  textMid:   "#94A3B8",
  textFaint: "#4B5563",
  grid:      "#1E2A3A",
};

// ─── CORRIDOR DATA ──────────────────────────────────────────────────────────
// Full economics per corridor — built on Model 01 corridor P&L foundation
const CORRIDORS = [
  {
    id: "US-EU", from: "United States", to: "Eurozone", flag_from: "🇺🇸", flag_to: "🇪🇺",
    currency: "USD/EUR", fxPair: "EURUSD",
    volume: 14200, avgTicket: 129577, grossFee: 1840000, fxMargin: 420000,
    railCost: 198000, nostro: 145000, correspondent: 68000, compliance: 38000, exceptions: 42000,
    fxVolatility: 7.2, competitorCount: 8, marketSharePct: 12.4,
    growthRate: 14.2, regulatoryRisk: "Low", corridorMaturity: "Mature",
    keyDrivers: ["EUR trade flows", "Intra-company transfers", "EU payroll"],
    fxSpreadBps: 18, nostroTurnDays: 1.8, exceptionRatePct: 2.1,
    trend: [380,410,395,428,442,460,448,471,490,512,498,420],
  },
  {
    id: "US-UK", from: "United States", to: "United Kingdom", flag_from: "🇺🇸", flag_to: "🇬🇧",
    currency: "USD/GBP", fxPair: "GBPUSD",
    volume: 8900, avgTicket: 125843, grossFee: 1120000, fxMargin: 280000,
    railCost: 148000, nostro: 98000, correspondent: 44000, compliance: 29000, exceptions: 28000,
    fxVolatility: 8.8, competitorCount: 10, marketSharePct: 9.8,
    growthRate: 8.4, regulatoryRisk: "Medium", corridorMaturity: "Mature",
    keyDrivers: ["Post-Brexit trade", "Financial services", "Real estate"],
    fxSpreadBps: 15, nostroTurnDays: 1.2, exceptionRatePct: 1.8,
    trend: [210,224,218,235,242,251,238,261,270,284,268,253],
  },
  {
    id: "US-SG", from: "United States", to: "Singapore", flag_from: "🇺🇸", flag_to: "🇸🇬",
    currency: "USD/SGD", fxPair: "USDSGD",
    volume: 4100, avgTicket: 173170, grossFee: 710000, fxMargin: 195000,
    railCost: 108000, nostro: 88000, correspondent: 52000, compliance: 42000, exceptions: 31000,
    fxVolatility: 4.2, competitorCount: 6, marketSharePct: 14.2,
    growthRate: 22.8, regulatoryRisk: "Low", corridorMaturity: "Growing",
    keyDrivers: ["APAC treasury hubs", "Tech sector", "Private wealth"],
    fxSpreadBps: 22, nostroTurnDays: 2.1, exceptionRatePct: 2.8,
    trend: [98,105,112,118,128,136,142,151,162,174,180,195],
  },
  {
    id: "US-IN", from: "United States", to: "India", flag_from: "🇺🇸", flag_to: "🇮🇳",
    currency: "USD/INR", fxPair: "USDINR",
    volume: 3800, avgTicket: 126315, grossFee: 480000, fxMargin: 92000,
    railCost: 118000, nostro: 112000, correspondent: 78000, compliance: 58000, exceptions: 64000,
    fxVolatility: 6.8, competitorCount: 14, marketSharePct: 4.2,
    growthRate: 18.4, regulatoryRisk: "High", corridorMaturity: "Growing",
    keyDrivers: ["IT services", "Remittance", "Shared service centers"],
    fxSpreadBps: 28, nostroTurnDays: 3.4, exceptionRatePct: 7.8,
    trend: [62,68,72,78,82,88,84,92,96,98,102,104],
  },
  {
    id: "US-AE", from: "United States", to: "UAE", flag_from: "🇺🇸", flag_to: "🇦🇪",
    currency: "USD/AED", fxPair: "USDAED",
    volume: 2900, avgTicket: 213793, grossFee: 620000, fxMargin: 148000,
    railCost: 98000, nostro: 95000, correspondent: 48000, compliance: 48000, exceptions: 38000,
    fxVolatility: 0.8, competitorCount: 7, marketSharePct: 11.2,
    growthRate: 28.4, regulatoryRisk: "Medium", corridorMaturity: "Growing",
    keyDrivers: ["Energy sector", "Real estate", "Trade finance"],
    fxSpreadBps: 12, nostroTurnDays: 1.4, exceptionRatePct: 3.8,
    trend: [88,95,102,110,118,124,132,140,148,158,164,174],
  },
  {
    id: "US-MX", from: "United States", to: "Mexico", flag_from: "🇺🇸", flag_to: "🇲🇽",
    currency: "USD/MXN", fxPair: "USDMXN",
    volume: 6200, avgTicket: 62903, grossFee: 390000, fxMargin: 58000,
    railCost: 68000, nostro: 42000, correspondent: 28000, compliance: 28000, exceptions: 22000,
    fxVolatility: 14.8, competitorCount: 18, marketSharePct: 5.8,
    growthRate: 6.2, regulatoryRisk: "Medium", corridorMaturity: "Mature",
    keyDrivers: ["USMCA trade", "Manufacturing payroll", "Nearshoring"],
    fxSpreadBps: 35, nostroTurnDays: 1.1, exceptionRatePct: 2.2,
    trend: [58,62,60,64,66,68,65,70,72,68,71,73],
  },
  {
    id: "US-JP", from: "United States", to: "Japan", flag_from: "🇺🇸", flag_to: "🇯🇵",
    currency: "USD/JPY", fxPair: "USDJPY",
    volume: 2100, avgTicket: 276190, grossFee: 580000, fxMargin: 168000,
    railCost: 88000, nostro: 78000, correspondent: 42000, compliance: 35000, exceptions: 18000,
    fxVolatility: 11.2, competitorCount: 5, marketSharePct: 16.8,
    growthRate: 4.8, regulatoryRisk: "Low", corridorMaturity: "Mature",
    keyDrivers: ["Automotive supply chain", "Electronics", "Investment flows"],
    fxSpreadBps: 14, nostroTurnDays: 1.6, exceptionRatePct: 1.2,
    trend: [118,124,130,136,142,148,144,150,156,162,158,154],
  },
  {
    id: "US-HK", from: "United States", to: "Hong Kong", flag_from: "🇺🇸", flag_to: "🇭🇰",
    currency: "USD/HKD", fxPair: "USDHKD",
    volume: 1800, avgTicket: 272222, grossFee: 490000, fxMargin: 145000,
    railCost: 78000, nostro: 72000, correspondent: 38000, compliance: 38000, exceptions: 14000,
    fxVolatility: 0.5, competitorCount: 6, marketSharePct: 18.4,
    growthRate: 3.2, regulatoryRisk: "Medium", corridorMaturity: "Mature",
    keyDrivers: ["Capital markets", "Private banking", "Trade finance"],
    fxSpreadBps: 8, nostroTurnDays: 1.2, exceptionRatePct: 1.0,
    trend: [108,112,116,120,124,128,122,128,132,135,132,130],
  },
  {
    id: "US-BR", from: "United States", to: "Brazil", flag_from: "🇺🇸", flag_to: "🇧🇷",
    currency: "USD/BRL", fxPair: "USDBRL",
    volume: 2400, avgTicket: 129166, grossFee: 310000, fxMargin: 42000,
    railCost: 88000, nostro: 95000, correspondent: 62000, compliance: 68000, exceptions: 72000,
    fxVolatility: 18.4, competitorCount: 12, marketSharePct: 3.8,
    growthRate: 9.8, regulatoryRisk: "High", corridorMaturity: "Developing",
    keyDrivers: ["Commodities", "Consumer goods", "Agribusiness"],
    fxSpreadBps: 48, nostroTurnDays: 4.2, exceptionRatePct: 9.4,
    trend: [38,40,42,44,48,46,50,52,48,54,52,56],
  },
  {
    id: "US-NG", from: "United States", to: "Nigeria", flag_from: "🇺🇸", flag_to: "🇳🇬",
    currency: "USD/NGN", fxPair: "USDNGN",
    volume: 820, avgTicket: 353658, grossFee: 290000, fxMargin: 48000,
    railCost: 78000, nostro: 112000, correspondent: 88000, compliance: 88000, exceptions: 98000,
    fxVolatility: 32.8, competitorCount: 4, marketSharePct: 8.2,
    growthRate: 14.8, regulatoryRisk: "Very High", corridorMaturity: "Developing",
    keyDrivers: ["Energy sector", "Trade finance", "Diaspora flows"],
    fxSpreadBps: 68, nostroTurnDays: 6.8, exceptionRatePct: 14.2,
    trend: [28,30,32,34,36,34,38,36,40,38,42,44],
  },
];

// ─── DERIVED ANALYTICS ──────────────────────────────────────────────────────
const withAnalytics = CORRIDORS.map(c => {
  const totalCost = c.railCost + c.nostro + c.correspondent + c.compliance + c.exceptions;
  const grossRevenue = c.grossFee + c.fxMargin;
  const net = grossRevenue - totalCost;
  const netMarginPct = (net / grossRevenue) * 100;
  const costRatioPct = (totalCost / grossRevenue) * 100;
  const revenuePerTxn = grossRevenue / c.volume;
  const costPerTxn = totalCost / c.volume;
  const netPerTxn = net / c.volume;

  // Strategic classification
  let classification, classColor, classDesc;
  if (netMarginPct > 40 && c.growthRate > 10) {
    classification = "GROW"; classColor = T.green;
    classDesc = "High margin + high growth — invest aggressively";
  } else if (netMarginPct > 40 && c.growthRate <= 10) {
    classification = "DEFEND"; classColor = T.teal;
    classDesc = "High margin, mature — protect pricing and share";
  } else if (netMarginPct > 20 && c.growthRate > 10) {
    classification = "OPTIMIZE"; classColor = T.amber;
    classDesc = "Growth corridor — improve cost structure to unlock margin";
  } else if (netMarginPct > 20) {
    classification = "OPTIMIZE"; classColor = T.amber;
    classDesc = "Adequate margin — operational efficiency opportunity";
  } else {
    classification = "EXIT / RESTRUCTURE"; classColor = T.red;
    classDesc = "Below threshold — renegotiate or exit";
  }

  return { ...c, totalCost, grossRevenue, net, netMarginPct, costRatioPct, revenuePerTxn, costPerTxn, netPerTxn, classification, classColor, classDesc };
});

// Portfolio totals
const portfolio = withAnalytics.reduce((acc, c) => ({
  grossRevenue: acc.grossRevenue + c.grossRevenue,
  totalCost: acc.totalCost + c.totalCost,
  net: acc.net + c.net,
  volume: acc.volume + c.volume,
  fxMargin: acc.fxMargin + c.fxMargin,
}), { grossRevenue: 0, totalCost: 0, net: 0, volume: 0, fxMargin: 0 });
portfolio.netMarginPct = (portfolio.net / portfolio.grossRevenue) * 100;

// Classification counts
const classCounts = { GROW: 0, DEFEND: 0, OPTIMIZE: 0, "EXIT / RESTRUCTURE": 0 };
withAnalytics.forEach(c => classCounts[c.classification]++);

// ─── HELPERS ────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n.toFixed(0)}`;
const fmtPct = (n) => `${n.toFixed(1)}%`;

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────
const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <div style={{ width: 2, height: 16, background: T.gold }} />
      <h2 style={{ margin: 0, fontSize: 10, fontWeight: 600, color: T.gold, fontFamily: "'Space Mono', monospace", letterSpacing: "0.16em", textTransform: "uppercase" }}>{children}</h2>
    </div>
    {sub && <div style={{ fontSize: 11, color: T.textFaint, fontFamily: "'Space Mono', monospace", paddingLeft: 12 }}>{sub}</div>}
  </div>
);

const ClassBadge = ({ label, color }) => (
  <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 2, background: `${color}18`, color, border: `1px solid ${color}44`, fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", fontWeight: 600 }}>{label}</span>
);

const KpiCard = ({ label, value, sub, accent, wide }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 20px", borderLeft: `3px solid ${accent || T.gold}`, gridColumn: wide ? "span 2" : "span 1" }}>
    <div style={{ fontSize: 9, color: T.textFaint, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em" }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: T.textFaint, fontFamily: "'Space Mono', monospace", marginTop: 4 }}>{sub}</div>}
  </div>
);

const WaterfallRow = ({ label, value, isPositive, isNet, base }) => {
  const pct = Math.min(Math.abs(value / base) * 100, 100);
  const color = isNet ? T.gold : isPositive ? T.green : T.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
      <div style={{ width: 160, fontSize: 10, color: T.textFaint, textAlign: "right", fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 22, background: T.surface, borderRadius: 3, overflow: "hidden", position: "relative" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: isNet ? `linear-gradient(90deg, ${T.goldDim}, ${T.gold})` : color, opacity: 0.85, borderRadius: 3, transition: "width 0.7s ease" }} />
        <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: T.text, fontFamily: "'Space Mono', monospace", fontWeight: isNet ? 700 : 400 }}>
          {isPositive ? "+" : ""}{fmt(value)}
        </div>
      </div>
    </div>
  );
};

// Sparkline mini component
const Sparkline = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 80;
    const y = 20 - ((v - min) / (max - min)) * 18;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="80" height="22" style={{ flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={pts.split(" ").pop().split(",")[0]} cy={pts.split(" ").pop().split(",")[1]} r="2.5" fill={color} />
    </svg>
  );
};

// Custom scatter tooltip
const CorridorTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 16px", fontFamily: "'Space Mono', monospace" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, marginBottom: 6 }}>{d.flag_from} → {d.flag_to} {d.currency}</div>
      <div style={{ fontSize: 10, color: T.textMid }}>Net Margin: <span style={{ color: d.classColor, fontWeight: 600 }}>{fmtPct(d.netMarginPct)}</span></div>
      <div style={{ fontSize: 10, color: T.textMid }}>Growth Rate: <span style={{ color: T.teal }}>{fmtPct(d.growthRate)}</span></div>
      <div style={{ fontSize: 10, color: T.textMid }}>Volume: <span style={{ color: T.text }}>{d.volume.toLocaleString()} txns</span></div>
      <div style={{ marginTop: 6 }}><ClassBadge label={d.classification} color={d.classColor} /></div>
    </div>
  );
};

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function CorridorEconomicsAnalyzer() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCorridor, setSelectedCorridor] = useState(withAnalytics[0]);
  const [sortBy, setSortBy] = useState("net");
  const [filterClass, setFilterClass] = useState("all");

  const sorted = useMemo(() => {
    let list = filterClass === "all" ? withAnalytics : withAnalytics.filter(c => c.classification === filterClass);
    return [...list].sort((a, b) =>
      sortBy === "net" ? b.net - a.net :
      sortBy === "margin" ? b.netMarginPct - a.netMarginPct :
      sortBy === "growth" ? b.growthRate - a.growthRate :
      b.volume - a.volume
    );
  }, [sortBy, filterClass]);

  // Cost breakdown chart data for selected corridor
  const costBreakdown = selectedCorridor ? [
    { name: "Rail Cost",     value: selectedCorridor.railCost,       color: T.red   },
    { name: "Nostro Funding",value: selectedCorridor.nostro,         color: T.amber },
    { name: "Correspondent", value: selectedCorridor.correspondent,  color: T.blue  },
    { name: "Compliance",    value: selectedCorridor.compliance,     color: "#A78BFA"},
    { name: "Exceptions",    value: selectedCorridor.exceptions,     color: T.red   },
  ] : [];

  // Scatter data: x=growthRate, y=netMarginPct, z=volume
  const scatterData = withAnalytics.map(c => ({
    ...c, x: c.growthRate, y: c.netMarginPct, z: c.volume / 200
  }));

  const tabs = ["overview", "corridors", "deep-dive", "matrix"];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: ${T.bg}; } ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 10px 20px; font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.2s; border-bottom: 2px solid transparent; white-space: nowrap; }
        .tab-btn:hover { color: ${T.gold} !important; }
        .corr-row { cursor: pointer; transition: all 0.15s; }
        .corr-row:hover { background: ${T.card} !important; }
        .filter-btn { cursor: pointer; background: none; border: 1px solid ${T.border}; color: ${T.textFaint}; padding: 4px 12px; border-radius: 3px; font-size: 9px; font-family: 'Space Mono', monospace; letter-spacing: 0.1em; transition: all 0.15s; }
        .filter-btn.active { border-color: ${T.gold}; color: ${T.gold}; background: ${T.gold}12; }
        .filter-btn:hover { border-color: ${T.gold}66; color: ${T.textMid}; }
        .sort-btn { cursor: pointer; background: none; border: 1px solid ${T.border}; color: ${T.textFaint}; padding: 3px 10px; border-radius: 3px; font-size: 9px; font-family: 'Space Mono', monospace; letter-spacing: 0.08em; transition: all 0.15s; }
        .sort-btn.active { border-color: ${T.gold}; color: ${T.gold}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, #0D1117 0%, #161B2E 100%)`, borderBottom: `1px solid ${T.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${T.goldDim}, ${T.gold})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 14 }}>🌐</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: T.gold, letterSpacing: "0.06em" }}>CORRIDOR ECONOMICS ANALYZER</div>
              <div style={{ fontSize: 9, color: T.textFaint, fontFamily: "'Space Mono', monospace", letterSpacing: "0.12em" }}>MODEL 03 — NETWORK INTELLIGENCE</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { l: "CORRIDORS", v: CORRIDORS.length },
              { l: "TOTAL VOLUME", v: `${(portfolio.volume/1000).toFixed(0)}K txns` },
              { l: "PORTFOLIO NET", v: fmt(portfolio.net) },
              { l: "AVG NET MARGIN", v: fmtPct(portfolio.netMarginPct) },
            ].map(m => (
              <div key={m.l} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.gold, fontFamily: "'Cormorant Garamond', serif" }}>{m.v}</div>
                <div style={{ fontSize: 8, color: T.textFaint, fontFamily: "'Space Mono', monospace", letterSpacing: "0.12em" }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ────────────────────────────────────────────────────────── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex" }}>
          {tabs.map(t => (
            <button key={t} className="tab-btn" onClick={() => setActiveTab(t)}
              style={{ color: activeTab === t ? T.gold : T.textFaint, borderBottomColor: activeTab === t ? T.gold : "transparent", fontWeight: activeTab === t ? 700 : 400 }}>
              {t === "overview" ? "Portfolio Overview" : t === "corridors" ? "Corridor Rankings" : t === "deep-dive" ? "Corridor Deep Dive" : "Strategy Matrix"}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 32px" }}>

        {/* ══ OVERVIEW ═══════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="fade-up">
            {/* KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
              <KpiCard label="Gross Revenue" value={fmt(portfolio.grossRevenue)} sub="Fees + FX margin" accent={T.gold} />
              <KpiCard label="FX Margin" value={fmt(portfolio.fxMargin)} sub={fmtPct(portfolio.fxMargin/portfolio.grossRevenue*100) + " of gross revenue"} accent={T.teal} />
              <KpiCard label="Total Cost Base" value={fmt(portfolio.totalCost)} sub="Rail + nostro + compliance + exceptions" accent={T.red} />
              <KpiCard label="Net Contribution" value={fmt(portfolio.net)} sub={fmtPct(portfolio.netMarginPct) + " net margin"} accent={T.green} />
              <KpiCard label="Total Volume" value={`${(portfolio.volume/1000).toFixed(1)}K`} sub="Transactions across all corridors" accent={T.blue} />
            </div>

            {/* Growth vs margin scatter + classification counts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 20 }}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 24 }}>
                <SectionTitle sub="Bubble size = transaction volume">Growth Rate vs. Net Margin — Corridor Positioning</SectionTitle>
                <ResponsiveContainer width="100%" height={320}>
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.grid} />
                    <XAxis dataKey="x" name="Growth Rate" unit="%" type="number" domain={[0, 35]}
                      tick={{ fill: T.textFaint, fontSize: 10, fontFamily: "'Space Mono', monospace" }}
                      label={{ value: "Annual Growth Rate (%)", position: "insideBottom", offset: -10, style: { fill: T.textFaint, fontSize: 10, fontFamily: "'Space Mono', monospace" } }} />
                    <YAxis dataKey="y" name="Net Margin" unit="%" type="number" domain={[0, 65]}
                      tick={{ fill: T.textFaint, fontSize: 10, fontFamily: "'Space Mono', monospace" }}
                      label={{ value: "Net Margin (%)", angle: -90, position: "insideLeft", style: { fill: T.textFaint, fontSize: 10, fontFamily: "'Space Mono', monospace" } }} />
                    <ZAxis dataKey="z" range={[40, 400]} />
                    <Tooltip content={<CorridorTooltip />} />
                    {/* Quadrant lines */}
                    <Scatter data={scatterData} shape={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={Math.sqrt(payload.z) * 2.5} fill={payload.classColor} fillOpacity={0.2} stroke={payload.classColor} strokeWidth={1.5} />
                          <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fill={T.text} fontFamily="'Space Mono', monospace">{payload.flag_to}</text>
                        </g>
                      );
                    }} />
                  </ScatterChart>
                </ResponsiveContainer>
                {/* Quadrant labels */}
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
                  {[["GROW",T.green],["DEFEND",T.teal],["OPTIMIZE",T.amber],["EXIT / RESTRUCTURE",T.red]].map(([l,c]) => (
                    <span key={l} style={{ fontSize: 9, color: c, fontFamily: "'Space Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />{l} ({classCounts[l]})
                    </span>
                  ))}
                </div>
              </div>

              {/* Classification summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <SectionTitle>Strategy Classification</SectionTitle>
                {[
                  { cls: "GROW", color: T.green, corridors: withAnalytics.filter(c=>c.classification==="GROW"), desc: "High margin + high growth — invest" },
                  { cls: "DEFEND", color: T.teal, corridors: withAnalytics.filter(c=>c.classification==="DEFEND"), desc: "Mature + profitable — protect" },
                  { cls: "OPTIMIZE", color: T.amber, corridors: withAnalytics.filter(c=>c.classification==="OPTIMIZE"), desc: "Margin pressure — restructure costs" },
                  { cls: "EXIT / RESTRUCTURE", color: T.red, corridors: withAnalytics.filter(c=>c.classification==="EXIT / RESTRUCTURE"), desc: "Below threshold — act now" },
                ].map(q => (
                  <div key={q.cls} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px", borderLeft: `3px solid ${q.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <ClassBadge label={q.cls} color={q.color} />
                      <span style={{ fontSize: 18, fontWeight: 700, color: q.color, fontFamily: "'Cormorant Garamond', serif" }}>{q.corridors.length}</span>
                    </div>
                    <div style={{ fontSize: 10, color: T.textFaint, fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>{q.desc}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {q.corridors.map(c => (
                        <span key={c.id} style={{ fontSize: 10, color: T.textMid }}>{c.flag_from}→{c.flag_to}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio waterfall */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 24 }}>
              <SectionTitle>Portfolio Corridor Margin Waterfall</SectionTitle>
              <WaterfallRow label="Gross Fee Revenue" value={withAnalytics.reduce((s,c)=>s+c.grossFee,0)} isPositive base={portfolio.grossRevenue} />
              <WaterfallRow label="+ FX Margin" value={portfolio.fxMargin} isPositive base={portfolio.grossRevenue} />
              <div style={{ borderTop: `1px dashed ${T.border}`, margin: "10px 0" }} />
              <WaterfallRow label="− Rail Costs" value={-withAnalytics.reduce((s,c)=>s+c.railCost,0)} base={portfolio.grossRevenue} />
              <WaterfallRow label="− Nostro Funding" value={-withAnalytics.reduce((s,c)=>s+c.nostro,0)} base={portfolio.grossRevenue} />
              <WaterfallRow label="− Correspondent Charges" value={-withAnalytics.reduce((s,c)=>s+c.correspondent,0)} base={portfolio.grossRevenue} />
              <WaterfallRow label="− Compliance Costs" value={-withAnalytics.reduce((s,c)=>s+c.compliance,0)} base={portfolio.grossRevenue} />
              <WaterfallRow label="− Exception Costs" value={-withAnalytics.reduce((s,c)=>s+c.exceptions,0)} base={portfolio.grossRevenue} />
              <div style={{ borderTop: `1px solid ${T.gold}44`, margin: "10px 0" }} />
              <WaterfallRow label="NET CONTRIBUTION" value={portfolio.net} isNet base={portfolio.grossRevenue} />
            </div>
          </div>
        )}

        {/* ══ CORRIDOR RANKINGS ══════════════════════════════════════════ */}
        {activeTab === "corridors" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <SectionTitle>Corridor P&L Rankings</SectionTitle>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, color: T.textFaint, fontFamily: "'Space Mono', monospace" }}>FILTER:</span>
                {["all","GROW","DEFEND","OPTIMIZE","EXIT / RESTRUCTURE"].map(f => (
                  <button key={f} className={`filter-btn ${filterClass===f?"active":""}`} onClick={()=>setFilterClass(f)}>
                    {f === "all" ? "ALL" : f === "EXIT / RESTRUCTURE" ? "EXIT" : f}
                  </button>
                ))}
                <div style={{ width: 1, height: 16, background: T.border, margin: "0 4px" }} />
                <span style={{ fontSize: 9, color: T.textFaint, fontFamily: "'Space Mono', monospace" }}>SORT:</span>
                {[["net","NET $"],["margin","MARGIN %"],["growth","GROWTH"],["volume","VOLUME"]].map(([k,l])=>(
                  <button key={k} className={`sort-btn ${sortBy===k?"active":""}`} onClick={()=>setSortBy(k)}>{l}</button>
                ))}
              </div>
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0A0E14" }}>
                    {["#","Corridor","Currency","Volume","Gross Rev","FX Margin","Total Cost","Net","Margin %","Growth","FX Volatility","Classification","Trend"].map(h=>(
                      <th key={h} style={{ padding:"9px 12px", textAlign:"left", fontSize:8, color:T.textFaint, fontFamily:"'Space Mono', monospace", letterSpacing:"0.1em", borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((c, i) => (
                    <tr key={c.id} className="corr-row"
                      onClick={() => { setSelectedCorridor(c); setActiveTab("deep-dive"); }}
                      style={{ background: selectedCorridor?.id===c.id ? `${T.gold}08` : i%2===0 ? T.card : T.surface, borderBottom:`1px solid ${T.grid}`, borderLeft: selectedCorridor?.id===c.id ? `3px solid ${T.gold}` : "3px solid transparent" }}>
                      <td style={{ padding:"11px 12px", fontSize:10, color:T.textFaint, fontFamily:"'Space Mono', monospace" }}>{String(i+1).padStart(2,"0")}</td>
                      <td style={{ padding:"11px 12px" }}>
                        <div style={{ fontSize:13, fontWeight:500, color:T.text }}>{c.flag_from} → {c.flag_to}</div>
                        <div style={{ fontSize:9, color:T.textFaint, fontFamily:"'Space Mono', monospace" }}>{c.from} → {c.to}</div>
                      </td>
                      <td style={{ padding:"11px 12px", fontSize:10, color:T.textMid, fontFamily:"'Space Mono', monospace" }}>{c.currency}</td>
                      <td style={{ padding:"11px 12px", fontSize:10, color:T.text, fontFamily:"'Space Mono', monospace" }}>{c.volume.toLocaleString()}</td>
                      <td style={{ padding:"11px 12px", fontSize:11, color:T.text, fontFamily:"'Space Mono', monospace" }}>{fmt(c.grossRevenue)}</td>
                      <td style={{ padding:"11px 12px", fontSize:11, color:T.teal, fontFamily:"'Space Mono', monospace" }}>{fmt(c.fxMargin)}</td>
                      <td style={{ padding:"11px 12px", fontSize:11, color:T.red, fontFamily:"'Space Mono', monospace" }}>{fmt(c.totalCost)}</td>
                      <td style={{ padding:"11px 12px", fontSize:12, fontWeight:700, color:c.net>0?T.green:T.red, fontFamily:"'Cormorant Garamond', serif" }}>{fmt(c.net)}</td>
                      <td style={{ padding:"11px 12px", fontSize:11, color:c.netMarginPct>35?T.green:c.netMarginPct>20?T.amber:T.red, fontFamily:"'Space Mono', monospace" }}>{fmtPct(c.netMarginPct)}</td>
                      <td style={{ padding:"11px 12px", fontSize:11, color:c.growthRate>15?T.green:c.growthRate>8?T.amber:T.textMid, fontFamily:"'Space Mono', monospace" }}>+{fmtPct(c.growthRate)}</td>
                      <td style={{ padding:"11px 12px" }}>
                        <div style={{ fontSize:9, color:c.fxVolatility>15?T.red:c.fxVolatility>8?T.amber:T.green, fontFamily:"'Space Mono', monospace" }}>σ {c.fxVolatility}%</div>
                      </td>
                      <td style={{ padding:"11px 12px" }}><ClassBadge label={c.classification} color={c.classColor} /></td>
                      <td style={{ padding:"11px 12px" }}><Sparkline data={c.trend} color={c.classColor} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop:12, fontSize:10, color:T.textFaint, fontFamily:"'Space Mono', monospace" }}>Click any corridor to open the Deep Dive analysis →</div>
          </div>
        )}

        {/* ══ DEEP DIVE ══════════════════════════════════════════════════ */}
        {activeTab === "deep-dive" && selectedCorridor && (
          <div className="fade-up">
            {/* Corridor header */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 24, marginBottom: 20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:28, fontWeight:700, fontFamily:"'Cormorant Garamond', serif", color:T.text, marginBottom:4 }}>
                    {selectedCorridor.flag_from} {selectedCorridor.from} → {selectedCorridor.flag_to} {selectedCorridor.to}
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:11, color:T.textFaint, fontFamily:"'Space Mono', monospace" }}>{selectedCorridor.currency} · {selectedCorridor.fxPair} · {selectedCorridor.corridorMaturity}</span>
                    <ClassBadge label={selectedCorridor.classification} color={selectedCorridor.classColor} />
                    <span style={{ fontSize:10, color:T.textFaint, fontFamily:"'Space Mono', monospace" }}>Regulatory Risk: <span style={{ color: selectedCorridor.regulatoryRisk==="Low"?T.green:selectedCorridor.regulatoryRisk==="Medium"?T.amber:T.red }}>{selectedCorridor.regulatoryRisk}</span></span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:32, fontWeight:700, fontFamily:"'Cormorant Garamond', serif", color:selectedCorridor.net>0?T.green:T.red }}>{fmt(selectedCorridor.net)}</div>
                  <div style={{ fontSize:10, color:T.textFaint, fontFamily:"'Space Mono', monospace" }}>net contribution · {fmtPct(selectedCorridor.netMarginPct)} margin</div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
                {[
                  { l:"Volume", v:selectedCorridor.volume.toLocaleString() },
                  { l:"Avg Ticket", v:fmt(selectedCorridor.avgTicket) },
                  { l:"FX Spread", v:`${selectedCorridor.fxSpreadBps} bps` },
                  { l:"FX Volatility", v:`σ ${selectedCorridor.fxVolatility}%` },
                  { l:"Nostro Turn Days", v:`${selectedCorridor.nostroTurnDays}d` },
                  { l:"Exception Rate", v:`${selectedCorridor.exceptionRatePct}%` },
                ].map(m=>(
                  <div key={m.l} style={{ background:T.card, borderRadius:6, padding:"10px 12px" }}>
                    <div style={{ fontSize:9, color:T.textFaint, fontFamily:"'Space Mono', monospace", marginBottom:4 }}>{m.l}</div>
                    <div style={{ fontSize:14, fontWeight:600, color:T.text, fontFamily:"'Space Mono', monospace" }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              {/* Cost waterfall */}
              <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:24 }}>
                <SectionTitle>Corridor Margin Waterfall</SectionTitle>
                <WaterfallRow label="Fee Revenue" value={selectedCorridor.grossFee} isPositive base={selectedCorridor.grossRevenue} />
                <WaterfallRow label="+ FX Margin" value={selectedCorridor.fxMargin} isPositive base={selectedCorridor.grossRevenue} />
                <div style={{ borderTop:`1px dashed ${T.border}`, margin:"8px 0" }} />
                <WaterfallRow label="− Rail Costs" value={-selectedCorridor.railCost} base={selectedCorridor.grossRevenue} />
                <WaterfallRow label="− Nostro Funding" value={-selectedCorridor.nostro} base={selectedCorridor.grossRevenue} />
                <WaterfallRow label="− Correspondent" value={-selectedCorridor.correspondent} base={selectedCorridor.grossRevenue} />
                <WaterfallRow label="− Compliance" value={-selectedCorridor.compliance} base={selectedCorridor.grossRevenue} />
                <WaterfallRow label="− Exceptions" value={-selectedCorridor.exceptions} base={selectedCorridor.grossRevenue} />
                <div style={{ borderTop:`1px solid ${T.gold}44`, margin:"8px 0" }} />
                <WaterfallRow label="NET CONTRIBUTION" value={selectedCorridor.net} isNet base={selectedCorridor.grossRevenue} />
              </div>

              {/* Cost mix + trend */}
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:24, flex:1 }}>
                  <SectionTitle>Cost Structure Breakdown</SectionTitle>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={costBreakdown} layout="vertical" barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.grid} horizontal={false} />
                      <XAxis type="number" tick={{ fill:T.textFaint, fontSize:9, fontFamily:"'Space Mono', monospace" }} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
                      <YAxis type="category" dataKey="name" tick={{ fill:T.textMid, fontSize:9, fontFamily:"'Space Mono', monospace" }} width={110} />
                      <Tooltip contentStyle={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:6, fontFamily:"'Space Mono', monospace", fontSize:10 }} formatter={v=>[fmt(v)]} />
                      <Bar dataKey="value" radius={[0,3,3,0]}>
                        {costBreakdown.map((d,i)=><Cell key={i} fill={d.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:24 }}>
                  <SectionTitle>12-Month Revenue Trend</SectionTitle>
                  <ResponsiveContainer width="100%" height={100}>
                    <ComposedChart data={selectedCorridor.trend.map((v,i)=>({ month:["J","F","M","A","M","J","J","A","S","O","N","D"][i], value:v }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.grid} />
                      <XAxis dataKey="month" tick={{ fill:T.textFaint, fontSize:9, fontFamily:"'Space Mono', monospace" }} />
                      <YAxis tick={{ fill:T.textFaint, fontSize:9, fontFamily:"'Space Mono', monospace" }} tickFormatter={v=>`$${v}K`} />
                      <Tooltip contentStyle={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:6, fontFamily:"'Space Mono', monospace", fontSize:10 }} formatter={v=>[`$${v}K`]} />
                      <Area type="monotone" dataKey="value" stroke={selectedCorridor.classColor} fill={`${selectedCorridor.classColor}18`} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* AI Strategic Assessment */}
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:24 }}>
              <SectionTitle>AI Strategic Assessment</SectionTitle>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
                {[
                  {
                    label:"Strategic Recommendation",
                    color: selectedCorridor.classColor,
                    icon: selectedCorridor.classification==="GROW"?"↗":selectedCorridor.classification==="DEFEND"?"◎":selectedCorridor.classification==="OPTIMIZE"?"⚙":"⚠",
                    body: `${selectedCorridor.classDesc}. At ${fmtPct(selectedCorridor.netMarginPct)} net margin and ${fmtPct(selectedCorridor.growthRate)} annual growth, this corridor ${selectedCorridor.classification==="GROW"?"warrants incremental volume investment and competitive pricing discipline":selectedCorridor.classification==="DEFEND"?"is a core franchise asset — prioritise retention over new acquisition":selectedCorridor.classification==="OPTIMIZE"?"requires cost structure review before additional volume investment":"should be reviewed for restructuring or exit within 2 quarters"}.`
                  },
                  {
                    label:"Largest Cost Lever",
                    color: T.amber,
                    icon: "◈",
                    body: (() => {
                      const costs = { "Nostro Funding": selectedCorridor.nostro, "Exceptions": selectedCorridor.exceptions, "Correspondent Charges": selectedCorridor.correspondent, "Compliance": selectedCorridor.compliance };
                      const top = Object.entries(costs).sort((a,b)=>b[1]-a[1])[0];
                      return `${top[0]} is the primary cost driver at ${fmt(top[1])} — ${fmtPct(top[1]/selectedCorridor.grossRevenue*100)} of gross revenue. ${top[0]==="Nostro Funding"?`Nostro turn days of ${selectedCorridor.nostroTurnDays}d suggest prefunding optimisation opportunity. A 20% reduction in nostro balance requirement would save ${fmt(selectedCorridor.nostro*0.20)} annually.`:top[0]==="Exceptions"?`Exception rate of ${selectedCorridor.exceptionRatePct}% is above portfolio average. Root cause is likely data quality in payment instructions. Structured remediation could recover ${fmt(selectedCorridor.exceptions*0.40)}.`:`Renegotiate correspondent banking terms at next renewal cycle.`}`;
                    })()
                  },
                  {
                    label:"FX & Risk Profile",
                    color: T.teal,
                    icon: "⇌",
                    body: `FX volatility of σ ${selectedCorridor.fxVolatility}% is ${selectedCorridor.fxVolatility>15?"elevated — margin at risk in adverse rate scenarios. Consider dynamic FX spread floors to protect revenue":selectedCorridor.fxVolatility>8?"moderate. Current spread of "+selectedCorridor.fxSpreadBps+"bps is adequate but should be reviewed quarterly against rate movements":"low — the pegged or managed rate environment provides stable margin visibility. FX spread of "+selectedCorridor.fxSpreadBps+"bps can be maintained without dynamic adjustment"}. Regulatory risk is rated ${selectedCorridor.regulatoryRisk}.`
                  },
                ].map(n=>(
                  <div key={n.label} style={{ background:T.card, borderRadius:8, padding:18, borderTop:`3px solid ${n.color}` }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                      <span style={{ fontSize:18, color:n.color, fontFamily:"'Space Mono', monospace" }}>{n.icon}</span>
                      <span style={{ fontSize:11, fontWeight:600, color:T.text }}>{n.label}</span>
                    </div>
                    <p style={{ fontSize:11, color:T.textMid, lineHeight:1.7, margin:0 }}>{n.body}</p>
                  </div>
                ))}
              </div>
              {/* Key drivers */}
              <div style={{ marginTop:14, padding:"10px 16px", background:`${T.gold}08`, borderRadius:8, border:`1px solid ${T.gold}22`, display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ fontSize:10, color:T.gold, fontFamily:"'Space Mono', monospace", fontWeight:700, flexShrink:0 }}>KEY FLOW DRIVERS:</span>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {selectedCorridor.keyDrivers.map(d=>(
                    <span key={d} style={{ fontSize:10, padding:"2px 10px", background:`${T.gold}18`, color:T.goldLt, borderRadius:3, fontFamily:"'Space Mono', monospace" }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ STRATEGY MATRIX ════════════════════════════════════════════ */}
        {activeTab === "matrix" && (
          <div className="fade-up">
            <SectionTitle sub="AI-generated investment priorities and action plan for each corridor classification">Portfolio Strategy Matrix — Investment Allocation Framework</SectionTitle>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              {[
                {
                  cls:"GROW", color:T.green, icon:"↗",
                  corridors: withAnalytics.filter(c=>c.classification==="GROW"),
                  actions: ["Increase sales coverage and volume targets","Maintain competitive pricing — do not discount","Invest in corridor STP automation to scale without proportional cost growth","Consider dedicated nostro optimisation for high-volume routes"],
                  metric: "Target: 20%+ volume growth YoY"
                },
                {
                  cls:"DEFEND", color:T.teal, icon:"◎",
                  corridors: withAnalytics.filter(c=>c.classification==="DEFEND"),
                  actions: ["Anchor pricing at current spread — resist client pressure to reduce","Focus on wallet share growth within existing client base","Monitor competitive entry — these corridors attract attention","Build switching costs through workflow integration and liquidity structures"],
                  metric: "Target: Hold margin within 2% of current"
                },
                {
                  cls:"OPTIMIZE", color:T.amber, icon:"⚙",
                  corridors: withAnalytics.filter(c=>c.classification==="OPTIMIZE"),
                  actions: ["Conduct full cost audit: nostro, correspondent, compliance, exceptions","Renegotiate correspondent banking terms at next renewal","Set STP improvement targets — reduce exception rate by 30%","Evaluate whether FX spread is adequately capturing risk"],
                  metric: "Target: Lift net margin by 8–12pp in 12 months"
                },
                {
                  cls:"EXIT / RESTRUCTURE", color:T.red, icon:"⚠",
                  corridors: withAnalytics.filter(c=>c.classification==="EXIT / RESTRUCTURE"),
                  actions: ["Prepare restructuring case: repricing or volume minimum commitments","Engage clients on new pricing terms within 60 days","If restructuring fails, begin managed wind-down — no new volume acquisition","Reassign nostro and correspondent capacity to GROW corridors"],
                  metric: "Decision point: 90 days"
                },
              ].map(q=>(
                <div key={q.cls} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:24, borderTop:`3px solid ${q.color}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:24, color:q.color }}>{q.icon}</span>
                      <ClassBadge label={q.cls} color={q.color} />
                    </div>
                    <span style={{ fontSize:12, color:q.color, fontFamily:"'Space Mono', monospace", fontWeight:700 }}>{q.corridors.length} corridor{q.corridors.length!==1?"s":""}</span>
                  </div>

                  {/* Corridor tags */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                    {q.corridors.map(c=>(
                      <div key={c.id} style={{ background:T.card, borderRadius:6, padding:"6px 10px", border:`1px solid ${q.color}33`, cursor:"pointer" }}
                        onClick={()=>{ setSelectedCorridor(c); setActiveTab("deep-dive"); }}>
                        <div style={{ fontSize:12 }}>{c.flag_from}→{c.flag_to}</div>
                        <div style={{ fontSize:9, color:q.color, fontFamily:"'Space Mono', monospace" }}>{fmtPct(c.netMarginPct)} · +{fmtPct(c.growthRate)}</div>
                      </div>
                    ))}
                    {q.corridors.length===0 && <span style={{ fontSize:11, color:T.textFaint, fontFamily:"'Space Mono', monospace" }}>None currently</span>}
                  </div>

                  {/* Actions */}
                  <div style={{ marginBottom:12 }}>
                    {q.actions.map((a,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                        <span style={{ color:q.color, fontSize:11, flexShrink:0, fontFamily:"'Space Mono', monospace" }}>{"0"+(i+1)}</span>
                        <span style={{ fontSize:11, color:T.textMid, lineHeight:1.6 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:"8px 12px", background:`${q.color}10`, borderRadius:6, border:`1px solid ${q.color}22` }}>
                    <span style={{ fontSize:10, color:q.color, fontFamily:"'Space Mono', monospace", fontWeight:700 }}>{q.metric}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Connection callouts */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={{ padding:"12px 16px", background:`${T.blue}10`, borderRadius:8, border:`1px solid ${T.blue}22`, display:"flex", gap:12, alignItems:"flex-start" }}>
                <span style={{ fontSize:14, color:T.blue, flexShrink:0 }}>⟵</span>
                <div>
                  <span style={{ fontSize:10, color:T.blue, fontFamily:"'Space Mono', monospace", fontWeight:700 }}>MODEL 01 CONNECTION: </span>
                  <span style={{ fontSize:11, color:T.textMid }}>Corridor P&L builds on the Model 01 margin waterfall. Gross revenue, rail cost, and exception data are sourced from the Profitability Engine baseline, ensuring consistent economic accounting across the framework.</span>
                </div>
              </div>
              <div style={{ padding:"12px 16px", background:`${T.teal}10`, borderRadius:8, border:`1px solid ${T.teal}22`, display:"flex", gap:12, alignItems:"flex-start" }}>
                <span style={{ fontSize:14, color:T.teal, flexShrink:0 }}>⟶</span>
                <div>
                  <span style={{ fontSize:10, color:T.teal, fontFamily:"'Space Mono', monospace", fontWeight:700 }}>MODEL 04 CONNECTION: </span>
                  <span style={{ fontSize:11, color:T.textMid }}>Corridor growth rates and classification feed into the Client Behavior Engine (Model 04). Clients active in GROW corridors are flagged as expansion targets; clients concentrated in EXIT corridors are elevated as retention risks.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:`1px solid ${T.border}`, padding:"14px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20 }}>
        <span style={{ fontSize:9, color:T.textFaint, fontFamily:"'Space Mono', monospace", letterSpacing:"0.1em" }}>CORRIDOR ECONOMICS ANALYZER · MODEL 03 · CARLOS UREÑA PAYMENTS STRATEGY PORTFOLIO</span>
        <span style={{ fontSize:9, color:T.textFaint, fontFamily:"'Space Mono', monospace" }}>PROTOTYPE · SYNTHETIC DATA · 10 CORRIDORS · Q1 2025</span>
      </div>
    </div>
  );
}
