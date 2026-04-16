import { useState, useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LineChart, Line, Area, AreaChart, ComposedChart, ReferenceLine, Legend
} from "recharts";
import { ModelBackBar } from '../pages/FrameworkIndex';

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
const T = {
  bg:        '#08090f',
  surface:   '#0d1117',
  card:      '#111827',
  cardHov:   '#161f2e',
  border:    '#1e2d3d',
  borderHi:  '#2a3f55',
  gold:      '#c9a84c',
  goldDim:   '#8a6f30',
  goldSoft:  'rgba(201,168,76,0.10)',
  goldGlow:  'rgba(201,168,76,0.04)',
  teal:      '#2dd4bf',
  tealSoft:  'rgba(45,212,191,0.08)',
  red:       '#f87171',
  redSoft:   'rgba(248,113,113,0.08)',
  amber:     '#fbbf24',
  amberSoft: 'rgba(251,191,36,0.08)',
  green:     '#34d399',
  greenSoft: 'rgba(52,211,153,0.08)',
  blue:      '#60a5fa',
  blueSoft:  'rgba(96,165,250,0.08)',
  purple:    '#a78bfa',
  text:      '#e2e8f0',
  textMid:   '#94a3b8',
  textDim:   '#4b5563',
  mono:      "'IBM Plex Mono', 'Courier New', monospace",
  sans:      "'Inter', system-ui, sans-serif",
  serif:     "'Playfair Display', Georgia, serif",
};

// ── PORTFOLIO HEALTH INDEX ─────────────────────────────────────────────────
// Six dimensions scored 0–100. Transparent methodology shown to user.
const PHI_DIMENSIONS = [
  {
    id: 'pricing',
    label: 'Pricing Governance',
    score: 58,
    weight: 0.20,
    color: T.amber,
    description: 'Pricing exception rate, time since last review, tier consistency across segment peers',
    issues: ['14% of payments processed at exception pricing', 'Average pricing review lag: 18 months', '3 clients below segment peer average by >20%'],
    levers: ['Systematic exception review and approval workflow', 'Annual repricing cycle for all Standard tier clients', 'Peer benchmark alert at >15% gap'],
  },
  {
    id: 'flow',
    label: 'Flow Economics',
    score: 71,
    weight: 0.20,
    color: T.teal,
    description: 'Net margin by flow type and structure, cost structure efficiency, Grow / Defend / Optimize / Exit classification',
    issues: ['2 flows below 10% net margin (DE-PRIORITIZE / EXIT)', 'US→BR and US→NG exception rates 3x portfolio average', 'Liquidity cost funding cost elevated on 3 emerging market flows'],
    levers: ['Restructure pricing on loss-making flows within 90 days', 'Exception root cause analysis on US→BR and US→NG', 'Liquidity cost optimization on NG, IN, BR flows'],
  },
  {
    id: 'rail',
    label: 'Rail Economics',
    score: 64,
    weight: 0.15,
    color: T.blue,
    description: 'Rail mix efficiency, STP rates, cost per transaction by rail, migration opportunity',
    issues: ['$8.50 wire transactions for payments eligible for $0.06 instant rails', 'FedNow adoption at 14% of eligible volume', 'SWIFT MX STP rate 91.2% — below 95% target'],
    levers: ['Instant rail migration program for sub-$500K domestic payments', 'SWIFT MX data quality initiative to lift STP above 95%', 'Client incentive structure for RTP/FedNow adoption'],
  },
  {
    id: 'client',
    label: 'Client Retention',
    score: 62,
    weight: 0.20,
    color: T.red,
    description: 'Volume migration signals, concentration risk, monetization gaps relative to internal peers',
    issues: ['3 clients showing consecutive volume decline >6 months', '$1.37M revenue at risk from migration and pricing gaps', 'Top 2 clients represent 38% of total portfolio revenue'],
    levers: ['Urgent retention intervention for Meridian and Zenith', 'Pacific Trade Finance repricing — $462K annual opportunity', 'Client concentration risk: diversification target'],
  },
  {
    id: 'revenue',
    label: 'Revenue Concentration',
    score: 55,
    weight: 0.15,
    color: T.purple,
    description: 'Revenue distribution across clients, flows, and rails — concentration and diversification risk',
    issues: ['Top 3 clients = 44% of total revenue', 'US→EU flow = 28% of flow revenue', 'Single-rail clients represent 31% of volume'],
    levers: ['New client acquisition target: 20% revenue from new logos in 18 months', 'Flow diversification: grow APAC to 25% of revenue', 'Multi-rail product packaging to reduce single-rail concentration'],
  },
  {
    id: 'operational',
    label: 'Operational Drag',
    score: 67,
    weight: 0.10,
    description: 'Exception rate, repair cost, STP performance — operational cost eroding margin silently',
    color: T.gold,
    issues: ['Exception costs represent 6.2% of gross revenue', 'Manual repair rate on SWIFT flows: 8.8%', 'October exception spike pattern repeating — not resolved'],
    levers: ['STP improvement program: target 97.5% across all SWIFT flows', 'Exception root cause database — tag and track by flow', 'Operational cost allocation by flow to surface true drag'],
  },
];

// Composite PHI score — weighted average
const PHI_SCORE = Math.round(
  PHI_DIMENSIONS.reduce((s, d) => s + d.score * d.weight, 0)
);

// ── SCENARIO MODELS ────────────────────────────────────────────────────────
const SCENARIOS = {
  base: {
    label: 'Base Case',
    description: 'No interventions. Current trajectory continues.',
    color: T.textMid,
    phiProjected: [PHI_SCORE, 61, 59, 57, 55, 53],
    revenueProjected: [16.2, 16.0, 15.7, 15.3, 14.8, 14.2],
    marginProjected: [31.2, 30.8, 30.1, 29.4, 28.5, 27.4],
    keyRisk: 'Pricing exceptions compound. Migration clients lost. Flow economics deteriorate without intervention.',
  },
  optimized: {
    label: 'Priority Interventions',
    description: 'Top 5 ranked interventions executed within 90 days.',
    color: T.green,
    phiProjected: [PHI_SCORE, 66, 71, 75, 78, 81],
    revenueProjected: [16.2, 17.1, 18.4, 19.6, 20.8, 22.1],
    marginProjected: [31.2, 33.4, 35.8, 37.2, 38.6, 40.1],
    keyRisk: 'Execution risk on repricing conversations. Flow restructuring requires internal alignment.',
  },
  stress: {
    label: 'Stress Case',
    description: 'Two major clients migrate. Key flow margin compression.',
    color: T.red,
    phiProjected: [PHI_SCORE, 56, 50, 44, 40, 37],
    revenueProjected: [16.2, 14.8, 13.1, 11.8, 10.9, 10.2],
    marginProjected: [31.2, 28.4, 25.1, 22.8, 21.0, 19.6],
    keyRisk: 'Meridian and Zenith volume fully migrates. US→BR flow exits. Rail cost inflation continues.',
  },
};

const SCENARIO_MONTHS = ['Now', 'Q2', 'Q3', 'Q4', 'Q1+1', 'Q2+1'];

// ── ACTION REGISTER ────────────────────────────────────────────────────────
const ACTIONS = [
  {
    rank: 1,
    category: 'Client',
    action: 'Pacific Trade Finance repricing',
    detail: 'Revenue per payment $116 below FI segment peer average. Introductory pricing never reviewed. Scheduled repricing conversation with RM Jennifer Park.',
    revenueUplift: 462000,
    timeToImpact: '30–60 days',
    complexity: 'LOW',
    dimension: 'client',
    owner: 'Jennifer Park (RM)',
    status: 'READY',
  },
  {
    rank: 2,
    category: 'Client',
    action: 'Zenith Manufacturing retention intervention',
    detail: 'Volume down 67% from peak over 18 months. Urgent senior RM call required. Competitive repricing offer and relationship review.',
    revenueUplift: 208000,
    timeToImpact: '14–30 days',
    complexity: 'MEDIUM',
    dimension: 'client',
    owner: 'Amy Torres (RM)',
    status: 'URGENT',
  },
  {
    rank: 3,
    category: 'Pricing',
    action: 'Veritas Healthcare and Northgate Capital repricing',
    detail: 'Both clients below segment peer average. Combined recovery $203K annually. Low relationship risk — stable volumes, no competitor signals.',
    revenueUplift: 203000,
    timeToImpact: '30–60 days',
    complexity: 'LOW',
    dimension: 'pricing',
    owner: 'Product & RM Teams',
    status: 'READY',
  },
  {
    rank: 4,
    category: 'Flow',
    action: 'US→BR and US→NG flow restructuring',
    detail: 'Both below 10% net margin after full cost allocation. Exception rates 3x portfolio average. Reprice or de-prioritize within 90 days.',
    revenueUplift: 180000,
    timeToImpact: '60–90 days',
    complexity: 'HIGH',
    dimension: 'flow',
    owner: 'Flow Strategy + Finance',
    status: 'IN PROGRESS',
  },
  {
    rank: 5,
    category: 'Rail',
    action: 'Instant rail migration — domestic wire to RTP/FedNow',
    detail: '$8.50 wire transactions for payments eligible for $0.06 instant rails. Migrating 20% of eligible volume reduces rail cost by $118K annually.',
    revenueUplift: 118000,
    timeToImpact: '90–120 days',
    complexity: 'MEDIUM',
    dimension: 'rail',
    owner: 'Product + Technology',
    status: 'PLANNING',
  },
  {
    rank: 6,
    category: 'Pricing',
    action: 'Meridian Industries repricing and volume commitment',
    detail: 'Volume declining 11 consecutive months. Peer benchmark shows $16/payment gap. Retention offer: enhanced FX rate in exchange for volume commitment.',
    revenueUplift: 96000,
    timeToImpact: '30–60 days',
    complexity: 'MEDIUM',
    dimension: 'client',
    owner: 'Sarah Chen (RM)',
    status: 'READY',
  },
  {
    rank: 7,
    category: 'Operational',
    action: 'SWIFT MX STP improvement program',
    detail: 'STP rate at 91.2% vs 95% target. Each percentage point improvement reduces operational cost by approximately $28K annually at current volumes.',
    revenueUplift: 112000,
    timeToImpact: '90–180 days',
    complexity: 'HIGH',
    dimension: 'operational',
    owner: 'Operations + Technology',
    status: 'PLANNING',
  },
  {
    rank: 8,
    category: 'Revenue',
    action: 'Apex Global Trade — US→SG flow expansion',
    detail: 'Client has Singapore subsidiary. Not currently routing through the bank. Estimated incremental revenue $180K annually at current ticket size.',
    revenueUplift: 180000,
    timeToImpact: '45–90 days',
    complexity: 'LOW',
    dimension: 'revenue',
    owner: 'Marcus Williams (RM)',
    status: 'READY',
  },
];

const totalUplift = ACTIONS.reduce((s, a) => s + a.revenueUplift, 0);

// ── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n.toFixed(0)}`;
const fmtM = n => `$${n.toFixed(1)}M`;

const complexityColor = c => ({ LOW: T.green, MEDIUM: T.amber, HIGH: T.red }[c] || T.textDim);
const statusColor = s => ({ READY: T.green, URGENT: T.red, 'IN PROGRESS': T.teal, PLANNING: T.amber }[s] || T.textDim);
const dimensionColor = d => PHI_DIMENSIONS.find(p => p.id === d)?.color || T.gold;

// ── SUBCOMPONENTS ───────────────────────────────────────────────────────────
const Tag = ({ label, color, small }) => (
  <span style={{
    background: `${color}18`, border: `1px solid ${color}44`, color,
    borderRadius: 3, padding: small ? '1px 6px' : '2px 8px',
    fontFamily: T.mono, fontSize: small ? 9 : 10, fontWeight: 600, letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
  }}>{label}</span>
);

const KPI = ({ label, value, sub, accent = T.gold }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: '16px 20px' }}>
    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: T.mono, fontSize: 22, color: accent, fontWeight: 600, marginBottom: 4 }}>{value}</div>
    {sub && <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid }}>{sub}</div>}
  </div>
);

const SectionHead = ({ title, sub }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <div style={{ width: 2, height: 16, background: T.gold }} />
      <h2 style={{ margin: 0, fontSize: 10, fontWeight: 600, color: T.gold, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{title}</h2>
    </div>
    {sub && <div style={{ fontSize: 11, color: T.textDim, fontFamily: T.mono, paddingLeft: 12 }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: '10px 14px' }}>
      <div style={{ fontFamily: T.mono, fontSize: 11, color: T.gold, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontFamily: T.mono, fontSize: 11, color: p.color || T.text }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </div>
      ))}
    </div>
  );
};

// PHI Score gauge
const PHIGauge = ({ score }) => {
  const color = score >= 75 ? T.green : score >= 60 ? T.amber : T.red;
  const label = score >= 75 ? 'HEALTHY' : score >= 60 ? 'NEEDS ATTENTION' : 'AT RISK';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={54} fill="none" stroke={T.border} strokeWidth={10} />
        <circle cx={70} cy={70} r={54} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x={70} y={65} textAnchor="middle" fontFamily={T.mono} fontSize={32} fontWeight={600} fill={color}>{score}</text>
        <text x={70} y={84} textAnchor="middle" fontFamily={T.mono} fontSize={9} fill={T.textDim} letterSpacing="0.1em">/100</text>
      </svg>
      <Tag label={label} color={color} />
      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: '0.08em', textAlign: 'center' }}>
        PORTFOLIO HEALTH INDEX
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, textAlign: 'center', maxWidth: 180 }}>
        A composite view translating multiple KPIs into a single economic signal
      </div>
    </div>
  );
};

// ── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard', label: 'Portfolio Health' },
  { id: 'dimensions', label: 'Six Dimensions' },
  { id: 'scenarios', label: 'Scenario Modeling' },
  { id: 'actions', label: 'Action Register' },
];

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function PaymentsPortfolioDecisionEngine() {
  const [tab, setTab] = useState('dashboard');
  const [selectedDimension, setSelectedDimension] = useState(PHI_DIMENSIONS[0]);
  const [activeScenario, setActiveScenario] = useState('optimized');
  const [filterCategory, setFilterCategory] = useState('all');

  const radarData = PHI_DIMENSIONS.map(d => ({ dimension: d.label.split(' ')[0], score: d.score, target: 80 }));

  const scenarioChartData = SCENARIO_MONTHS.map((m, i) => ({
    month: m,
    base: SCENARIOS.base.phiProjected[i],
    optimized: SCENARIOS.optimized.phiProjected[i],
    stress: SCENARIOS.stress.phiProjected[i],
  }));

  const revenueChartData = SCENARIO_MONTHS.map((m, i) => ({
    month: m,
    base: SCENARIOS.base.revenueProjected[i],
    optimized: SCENARIOS.optimized.revenueProjected[i],
    stress: SCENARIOS.stress.revenueProjected[i],
  }));

  const filteredActions = filterCategory === 'all'
    ? ACTIONS
    : ACTIONS.filter(a => a.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.sans, color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        .p05-tab { cursor: pointer; transition: all 0.15s; background: none; border: none; }
        .p05-tab:hover { color: ${T.gold} !important; }
        .p05-dim:hover { border-color: ${T.gold} !important; cursor: pointer; }
        .p05-action:hover { background: ${T.cardHov} !important; cursor: pointer; }
        .p05-scenario:hover { border-color: ${T.gold} !important; cursor: pointer; }
        .filter-btn { cursor: pointer; background: none; border: 1px solid ${T.border}; color: ${T.textDim}; padding: 3px 10px; border-radius: 3px; font-size: 9px; font-family: ${T.mono}; letter-spacing: 0.08em; transition: all 0.15s; }
        .filter-btn.active { border-color: ${T.gold}; color: ${T.gold}; background: ${T.goldSoft}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      <ModelBackBar />

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: '0 32px', background: T.surface }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '24px 0 0' }}>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.gold, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                Model 05 · Layer 5 · Executive Decision Layer
              </div>
              <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 500, color: T.text, lineHeight: 1.2, marginBottom: 8 }}>
                Payments Portfolio<br />Decision Engine
              </h1>
              <p style={{ fontFamily: T.sans, fontSize: 13, color: T.textMid, maxWidth: 480, lineHeight: 1.65 }}>
                Synthesizes all upstream model outputs into a single portfolio health view and translates that view into ranked, sequenced interventions with estimated revenue impact. This is where analysis becomes action.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, minWidth: 480, paddingBottom: 24 }}>
              <KPI label="Portfolio Health Index" value={PHI_SCORE} sub="Composite across 6 dimensions" accent={PHI_SCORE >= 75 ? T.green : PHI_SCORE >= 60 ? T.amber : T.red} />
              <KPI label="Revenue Opportunity" value={fmt(totalUplift)} sub="8 ranked interventions" accent={T.green} />
              <KPI label="Urgent Actions" value={ACTIONS.filter(a => a.status === 'URGENT').length} sub="Require immediate attention" accent={T.red} />
              <KPI label="Ready to Execute" value={ACTIONS.filter(a => a.status === 'READY').length} sub="No blockers identified" accent={T.teal} />
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: 0, borderTop: `1px solid ${T.border}` }}>
            {TABS.map(t => (
              <button key={t.id} className="p05-tab"
                onClick={() => setTab(t.id)}
                style={{
                  padding: '13px 24px', fontFamily: T.mono, fontSize: 11, letterSpacing: '0.06em',
                  color: tab === t.id ? T.gold : T.textDim,
                  borderBottom: tab === t.id ? `2px solid ${T.gold}` : '2px solid transparent',
                  transition: 'all 0.15s',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px' }}>

        {/* ── TAB 1: PORTFOLIO HEALTH DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="fade-up">
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 340px', gap: 20, marginBottom: 24 }}>

              {/* PHI Gauge */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <PHIGauge score={PHI_SCORE} />
              </div>

              {/* Radar */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="Six-Dimension Portfolio Radar" sub="Current score vs 80-point target across all dimensions" />
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke={T.border} />
                    <PolarAngleAxis dataKey="dimension"
                      tick={{ fontFamily: T.mono, fontSize: 10, fill: T.textMid }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Target" dataKey="target" stroke={T.border} fill={T.border} fillOpacity={0.15} strokeDasharray="4 4" />
                    <Radar name="Current" dataKey="score" stroke={T.gold} fill={T.gold} fillOpacity={0.15} strokeWidth={2}
                      dot={{ fill: T.gold, r: 4 }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Dimension scores */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="Dimension Scores" sub="Click to drill down" />
                {PHI_DIMENSIONS.map(d => (
                  <div key={d.id} className="p05-dim"
                    onClick={() => { setSelectedDimension(d); setTab('dimensions'); }}
                    style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.surface, transition: 'border-color 0.15s', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.text }}>{d.label}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 13, color: d.color, fontWeight: 600 }}>{d.score}</span>
                    </div>
                    <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${d.score}%`, height: '100%', background: d.color, borderRadius: 2, transition: 'width 0.8s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>Weight: {(d.weight * 100).toFixed(0)}%</span>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: d.score < 65 ? T.red : d.score < 75 ? T.amber : T.green }}>
                        {d.score < 65 ? '▼ Needs action' : d.score < 75 ? '◆ Watch' : '▲ On track'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHI methodology note */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <SectionHead title="PHI Scoring Methodology" sub="Transparent and independently defensible" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
                {PHI_DIMENSIONS.map(d => (
                  <div key={d.id} style={{ background: T.surface, borderRadius: 6, padding: '12px 14px', borderTop: `2px solid ${d.color}` }}>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: d.color, fontWeight: 600, marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.gold, marginBottom: 6 }}>{d.score}/100</div>
                    <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{d.description}</div>
                    <div style={{ marginTop: 6, fontFamily: T.mono, fontSize: 9, color: T.textDim }}>Weight: {(d.weight * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: '10px 14px', background: T.goldSoft, borderRadius: 6, border: `1px solid ${T.gold}22` }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.gold, fontWeight: 600 }}>METHODOLOGY: </span>
                <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>
                  Each dimension is scored independently on a 0–100 scale using observable portfolio metrics. The composite PHI is a weighted average. Weights reflect the relative impact of each dimension on portfolio economics — pricing and client retention carry the highest weight at 20% each because they are the most direct drivers of revenue outcome. The methodology is transparent: a score of 65 on Pricing Governance means 65% of the maximum possible pricing discipline has been achieved, measured against the specific indicators listed in each dimension.
                </span>
              </div>
            </div>

            {/* Top 3 priority actions preview */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <SectionHead title="Top Priority Actions" sub="Ranked by revenue impact — executives do not fund diagnostics, they fund interventions" />
                <button onClick={() => setTab('actions')} style={{ cursor: 'pointer', background: T.goldSoft, border: `1px solid ${T.gold}44`, color: T.gold, padding: '6px 14px', borderRadius: 4, fontFamily: T.mono, fontSize: 10, letterSpacing: '0.06em' }}>
                  VIEW ALL 8 →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ACTIONS.slice(0, 3).map((a, i) => (
                  <div key={a.rank} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px 140px 120px 120px', gap: 14, alignItems: 'center', padding: '12px 16px', background: T.surface, borderRadius: 6, border: `1px solid ${T.border}`, borderLeft: `3px solid ${dimensionColor(a.dimension)}` }}>
                    <div style={{ fontFamily: T.mono, fontSize: 14, color: T.gold, fontWeight: 600 }}>#{a.rank}</div>
                    <div>
                      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 500, marginBottom: 3 }}>{a.action}</div>
                      <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>{a.detail.substring(0, 70)}...</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 3 }}>UPLIFT</div>
                      <div style={{ fontFamily: T.mono, fontSize: 14, color: T.green, fontWeight: 600 }}>{fmt(a.revenueUplift)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 3 }}>TIME TO IMPACT</div>
                      <div style={{ fontFamily: T.sans, fontSize: 11, color: T.text }}>{a.timeToImpact}</div>
                    </div>
                    <Tag label={a.complexity} color={complexityColor(a.complexity)} />
                    <Tag label={a.status} color={statusColor(a.status)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: SIX DIMENSIONS ── */}
        {tab === 'dimensions' && (
          <div className="fade-up">
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>

              {/* Dimension selector */}
              <div>
                <SectionHead title="Select Dimension" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PHI_DIMENSIONS.map(d => (
                    <div key={d.id} className="p05-dim"
                      onClick={() => setSelectedDimension(d)}
                      style={{ padding: '12px 16px', background: selectedDimension.id === d.id ? T.goldSoft : T.card, border: `1px solid ${selectedDimension.id === d.id ? T.gold : T.border}`, borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text, fontWeight: selectedDimension.id === d.id ? 600 : 400 }}>{d.label}</span>
                        <span style={{ fontFamily: T.mono, fontSize: 14, color: d.color, fontWeight: 600 }}>{d.score}</span>
                      </div>
                      <div style={{ height: 3, background: T.border, borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${d.score}%`, height: '100%', background: d.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimension detail */}
              <div>
                <div style={{ background: T.card, border: `1px solid ${selectedDimension.color}44`, borderRadius: 8, padding: 24, borderTop: `3px solid ${selectedDimension.color}`, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: selectedDimension.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                        {selectedDimension.label}
                      </div>
                      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.textMid, maxWidth: 480, lineHeight: 1.6 }}>
                        {selectedDimension.description}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 48, color: selectedDimension.color, fontWeight: 600, lineHeight: 1 }}>{selectedDimension.score}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>/ 100 · Weight {(selectedDimension.weight * 100).toFixed(0)}%</div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div style={{ height: 8, background: T.surface, borderRadius: 4, overflow: 'hidden', marginBottom: 20 }}>
                    <div style={{ width: `${selectedDimension.score}%`, height: '100%', background: `linear-gradient(90deg, ${selectedDimension.color}88, ${selectedDimension.color})`, borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Issues */}
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.red, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>What Is Pulling the Score Down</div>
                      {selectedDimension.issues.map((issue, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                          <span style={{ color: T.red, fontFamily: T.mono, fontSize: 12, flexShrink: 0, marginTop: 1 }}>▼</span>
                          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.6 }}>{issue}</span>
                        </div>
                      ))}
                    </div>

                    {/* Levers */}
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.green, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Levers to Improve the Score</div>
                      {selectedDimension.levers.map((lever, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                          <span style={{ color: T.green, fontFamily: T.mono, fontSize: 12, flexShrink: 0, marginTop: 1 }}>▲</span>
                          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.6 }}>{lever}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Relevant actions for this dimension */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                  <SectionHead title={`Actions Linked to ${selectedDimension.label}`} />
                  {ACTIONS.filter(a => a.dimension === selectedDimension.id).length === 0 ? (
                    <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textDim }}>No active actions for this dimension.</div>
                  ) : (
                    ACTIONS.filter(a => a.dimension === selectedDimension.id).map(a => (
                      <div key={a.rank} style={{ padding: '12px 14px', background: T.surface, borderRadius: 6, border: `1px solid ${T.border}`, marginBottom: 8, display: 'grid', gridTemplateColumns: '1fr 100px 120px 100px', gap: 12, alignItems: 'center' }}>
                        <div>
                          <div style={{ fontFamily: T.sans, fontSize: 12, color: T.text, fontWeight: 500, marginBottom: 2 }}>{a.action}</div>
                          <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>{a.owner}</div>
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 13, color: T.green, fontWeight: 600 }}>{fmt(a.revenueUplift)}</div>
                        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>{a.timeToImpact}</div>
                        <Tag label={a.status} color={statusColor(a.status)} small />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: SCENARIO MODELING ── */}
        {tab === 'scenarios' && (
          <div className="fade-up">
            {/* Scenario selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
              {Object.entries(SCENARIOS).map(([key, s]) => (
                <div key={key} className="p05-scenario"
                  onClick={() => setActiveScenario(key)}
                  style={{ background: T.card, border: `2px solid ${activeScenario === key ? s.color : T.border}`, borderRadius: 8, padding: 20, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <Tag label={s.label} color={s.color} />
                    <div style={{ fontFamily: T.mono, fontSize: 22, color: s.color, fontWeight: 600 }}>
                      {s.phiProjected[s.phiProjected.length - 1]}
                    </div>
                  </div>
                  <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5, marginBottom: 10 }}>{s.description}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 6 }}>PHI IN 6 QUARTERS</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{PHI_SCORE}</span>
                    <div style={{ flex: 1, height: 2, background: T.border }} />
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: s.color, fontWeight: 600 }}>{s.phiProjected[s.phiProjected.length - 1]}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: s.phiProjected[s.phiProjected.length - 1] > PHI_SCORE ? T.green : T.red }}>
                      {s.phiProjected[s.phiProjected.length - 1] > PHI_SCORE ? '▲' : '▼'} {Math.abs(s.phiProjected[s.phiProjected.length - 1] - PHI_SCORE)}pts
                    </span>
                  </div>
                  <div style={{ marginTop: 12, padding: '8px 10px', background: `${s.color}10`, borderRadius: 4, border: `1px solid ${s.color}22` }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: s.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Key Risk</div>
                    <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>{s.keyRisk}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scenario charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* PHI trajectory */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="Portfolio Health Index — All Scenarios" sub="6-quarter forward projection" />
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={scenarioChartData}>
                    <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontFamily: T.mono, fontSize: 10, fill: T.textDim }} axisLine={false} tickLine={false} />
                    <YAxis domain={[30, 90]} tick={{ fontFamily: T.mono, fontSize: 10, fill: T.textDim }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={PHI_SCORE} stroke={T.border} strokeDasharray="4 4" label={{ value: 'Now', fill: T.textDim, fontSize: 9, fontFamily: T.mono }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="optimized" name="Priority Interventions" stroke={T.green} strokeWidth={2} dot={{ fill: T.green, r: 3 }} />
                    <Line type="monotone" dataKey="base" name="Base Case" stroke={T.textMid} strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="stress" name="Stress Case" stroke={T.red} strokeWidth={2} strokeDasharray="2 3" dot={false} />
                    <Legend wrapperStyle={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue trajectory */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="Monthly Revenue — All Scenarios ($M)" sub="6-quarter forward projection" />
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontFamily: T.mono, fontSize: 10, fill: T.textDim }} axisLine={false} tickLine={false} />
                    <YAxis domain={[8, 24]} tick={{ fontFamily: T.mono, fontSize: 10, fill: T.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="optimized" name="Priority Interventions" stroke={T.green} strokeWidth={2} dot={{ fill: T.green, r: 3 }} />
                    <Line type="monotone" dataKey="base" name="Base Case" stroke={T.textMid} strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="stress" name="Stress Case" stroke={T.red} strokeWidth={2} strokeDasharray="2 3" dot={false} />
                    <Legend wrapperStyle={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trade-off analysis */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
              <SectionHead title="Trade-Off Analysis" sub="What moves if we fix pricing vs flow mix vs rail economics — sequencing matters" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[
                  {
                    label: 'If we fix Pricing first',
                    color: T.amber,
                    phi: '+8 pts in 60 days',
                    revenue: '+$761K annually',
                    tradeoff: 'Some client relationship friction during repricing conversations. Low operational dependency — can execute in parallel with other initiatives.',
                    sequence: 'Start here. Highest ROI, lowest complexity. Creates budget for operational investments.',
                  },
                  {
                    label: 'If we fix Flows first',
                    color: T.teal,
                    phi: '+5 pts in 90 days',
                    revenue: '+$180K annually',
                    tradeoff: 'Requires Finance alignment and potentially difficult client conversations on US→BR and US→NG. Slower to impact PHI but removes structural drag.',
                    sequence: 'Second priority. Removes the floor from flow economics before volume grows further.',
                  },
                  {
                    label: 'If we fix Rail Mix first',
                    color: T.blue,
                    phi: '+4 pts in 120 days',
                    revenue: '+$118K annually',
                    tradeoff: 'Requires technology and product investment. Longer time to impact. Client incentive program needed to shift rail behavior.',
                    sequence: 'Third priority. Important for long-term unit economics but not the most urgent. Build alongside pricing and flow work.',
                  },
                ].map((t, i) => (
                  <div key={i} style={{ background: T.surface, borderRadius: 6, padding: 18, borderTop: `2px solid ${t.color}` }}>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: t.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>{t.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <div style={{ background: T.card, borderRadius: 4, padding: '8px 10px' }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 3 }}>PHI IMPACT</div>
                        <div style={{ fontFamily: T.mono, fontSize: 13, color: t.color, fontWeight: 600 }}>{t.phi}</div>
                      </div>
                      <div style={{ background: T.card, borderRadius: 4, padding: '8px 10px' }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 3 }}>REVENUE</div>
                        <div style={{ fontFamily: T.mono, fontSize: 13, color: T.green, fontWeight: 600 }}>{t.revenue}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.6, marginBottom: 10 }}>{t.tradeoff}</div>
                    <div style={{ padding: '8px 10px', background: `${t.color}10`, borderRadius: 4, border: `1px solid ${t.color}22` }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: t.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>Sequencing Recommendation</div>
                      <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>{t.sequence}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: ACTION REGISTER ── */}
        {tab === 'actions' && (
          <div className="fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <SectionHead title="Ranked Intervention Register"
                sub={`Total revenue opportunity: ${fmt(totalUplift)} · Executives do not fund diagnostics. They fund ranked interventions with clear economic outcomes.`} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>CATEGORY:</span>
                {['all', 'Client', 'Pricing', 'Flow', 'Rail', 'Operational', 'Revenue'].map(f => (
                  <button key={f} className={`filter-btn ${filterCategory === f ? 'active' : ''}`}
                    onClick={() => setFilterCategory(f)}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
              <KPI label="Total Opportunity" value={fmt(totalUplift)} sub="Across all 8 interventions" accent={T.green} />
              <KPI label="Avg Time to Impact" value="45–90d" sub="For top 5 actions" accent={T.teal} />
              <KPI label="Low Complexity" value={`${ACTIONS.filter(a => a.complexity === 'LOW').length} actions`} sub="No blocker — execute now" accent={T.green} />
              <KPI label="High Complexity" value={`${ACTIONS.filter(a => a.complexity === 'HIGH').length} actions`} sub="Require cross-team alignment" accent={T.amber} />
            </div>

            {/* Action cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredActions.map((a, i) => (
                <div key={a.rank} className="p05-action"
                  style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20, borderLeft: `4px solid ${dimensionColor(a.dimension)}`, transition: 'background 0.12s' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 120px 160px 120px 120px 120px', gap: 14, alignItems: 'center' }}>
                    {/* Rank */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 20, color: T.gold, fontWeight: 600 }}>#{a.rank}</div>
                    </div>

                    {/* Action detail */}
                    <div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontFamily: T.sans, fontSize: 14, color: T.text, fontWeight: 500 }}>{a.action}</span>
                        <Tag label={a.category} color={dimensionColor(a.dimension)} small />
                      </div>
                      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5 }}>{a.detail}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 6 }}>Owner: {a.owner}</div>
                    </div>

                    {/* Revenue uplift */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Revenue Uplift</div>
                      <div style={{ fontFamily: T.mono, fontSize: 18, color: T.green, fontWeight: 600 }}>{fmt(a.revenueUplift)}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>annually</div>
                    </div>

                    {/* Time to impact */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Time to Impact</div>
                      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.text }}>{a.timeToImpact}</div>
                    </div>

                    {/* Complexity */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Complexity</div>
                      <Tag label={a.complexity} color={complexityColor(a.complexity)} />
                    </div>

                    {/* Status */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</div>
                      <Tag label={a.status} color={statusColor(a.status)} />
                    </div>

                    {/* PHI dimension */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dimension</div>
                      <Tag label={PHI_DIMENSIONS.find(d => d.id === a.dimension)?.label.split(' ')[0] || a.dimension} color={dimensionColor(a.dimension)} small />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cumulative uplift chart */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20, marginTop: 20 }}>
              <SectionHead title="Cumulative Revenue Uplift by Action Sequence" sub="If executed in ranked order" />
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={ACTIONS.map((a, i) => ({
                  action: `#${a.rank}`,
                  uplift: a.revenueUplift / 1000,
                  cumulative: ACTIONS.slice(0, i + 1).reduce((s, x) => s + x.revenueUplift, 0) / 1000,
                }))}>
                  <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="action" tick={{ fontFamily: T.mono, fontSize: 10, fill: T.textDim }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: T.mono, fontSize: 9, fill: T.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="uplift" name="Uplift ($K)" radius={[3, 3, 0, 0]}>
                    {ACTIONS.map((a, i) => <Cell key={i} fill={dimensionColor(a.dimension)} />)}
                  </Bar>
                  <Line type="monotone" dataKey="cumulative" name="Cumulative ($K)" stroke={T.gold} strokeWidth={2} dot={{ fill: T.gold, r: 3 }} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ padding: '8px 16px', background: T.greenSoft, borderRadius: 6, border: `1px solid ${T.green}22` }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.green, fontWeight: 600 }}>Total: {fmt(totalUplift)} </span>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>annual revenue recovery if all 8 actions executed</span>
                </div>
              </div>
            </div>

            {/* Model connections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 20 }}>
              {[
                { model: 'MODEL 01', label: 'Profitability Engine', color: T.blue, desc: 'Pricing governance and margin waterfall inputs. Exception cost data feeding operational drag score.' },
                { model: 'MODEL 02', label: 'Rail Economics', color: T.teal, desc: 'Rail mix efficiency and STP rate inputs. Instant rail migration opportunity quantified here.' },
                { model: 'MODEL 03', label: 'Flow Analyzer', color: T.gold, desc: 'Flow classification and margin data. DE-PRIORITIZE / EXIT flows reflected in flow dimension score.' },
                { model: 'MODEL 04', label: 'Behavior Engine', color: T.purple, desc: 'Client migration signals and monetization gaps. Revenue at risk and RM action items feed client retention score.' },
              ].map(m => (
                <div key={m.model} style={{ padding: '12px 14px', background: `${m.color}08`, borderRadius: 8, border: `1px solid ${m.color}22` }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: m.color }}>⟵</span>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: m.color, fontWeight: 700, letterSpacing: '0.06em' }}>{m.model}</span>
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: m.color, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: '16px 32px', marginTop: 20 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
            PAYMENTS PORTFOLIO DECISION ENGINE · MODEL 05 · EXECUTIVE DECISION LAYER · CARLOS UREÑA PAYMENTS STRATEGY
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
            PROTOTYPE · SYNTHETIC DATA · PHI V1 · 6-DIMENSION SCORING
          </span>
        </div>
      </div>
    </div>
  );
}
