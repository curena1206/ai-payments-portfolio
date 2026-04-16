import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis, Area, AreaChart,
  ComposedChart, ReferenceLine
} from "recharts";
import { ModelBackBar } from '../pages/FrameworkIndex';

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
const T = {
  bg:        '#0a0d14',
  surface:   '#0f1520',
  card:      '#141c2a',
  cardHov:   '#1a2438',
  border:    '#1e2d45',
  borderHi:  '#2a4060',
  navy:      '#0f1f3d',
  gold:      '#c9a84c',
  goldDim:   '#8a6f30',
  goldSoft:  'rgba(201,168,76,0.10)',
  teal:      '#2dd4bf',
  tealSoft:  'rgba(45,212,191,0.10)',
  red:       '#f87171',
  redSoft:   'rgba(248,113,113,0.10)',
  amber:     '#fbbf24',
  amberSoft: 'rgba(251,191,36,0.08)',
  green:     '#34d399',
  greenSoft: 'rgba(52,211,153,0.08)',
  blue:      '#60a5fa',
  blueSoft:  'rgba(96,165,250,0.08)',
  text:      '#e2e8f0',
  textMid:   '#94a3b8',
  textDim:   '#64748b',
  mono:      "'IBM Plex Mono', 'Courier New', monospace",
  sans:      "'Inter', system-ui, sans-serif",
  serif:     "'Playfair Display', Georgia, serif",
};

// ── SYNTHETIC CLIENT DATA ──────────────────────────────────────────────────
// 12 clients with 24 months of behavioral data
// Revenue per payment benchmarked internally by segment + flow
const CLIENTS = [
  {
    id: 'C01', name: 'Meridian Industries', segment: 'Corporate',
    relationship: 'Core', rm: 'Sarah Chen',
    rails: ['Wire', 'ACH'], flows: ['US→EU', 'US→UK'],
    avgRevenuePerPmt: 158, segmentPeerAvg: 142,
    monthlyVolume:  [18,19,20,21,22,21,23,24,22,20,19,18, 17,16,15,14,13,12,11,10,10,9,9,8],
    monthlyRevenue: [2840,2960,3100,3240,3380,3220,3540,3680,3380,3080,2960,2840, 2680,2520,2340,2180,2020,1880,1720,1580,1560,1420,1400,1280],
    railMix: { Wire: 72, ACH: 28 },
    pricingTier: 'Standard',
    lastRepriced: '2023-Q2',
    signal: 'MIGRATION_RISK',
    signalStrength: 'HIGH',
    revenueAtRisk: 380000,
    insight: 'Volume declining 11 months consecutively. Wire-to-ACH shift suggests treasury team optimizing costs. Peer clients in same segment generating 11% more revenue per payment.',
    action: 'REPRICE',
    actionDetail: 'Schedule repricing conversation. Peer benchmark shows $16/payment gap. Retention offer: enhanced FX rate in exchange for volume commitment.',
  },
  {
    id: 'C02', name: 'Apex Global Trade', segment: 'Corporate',
    relationship: 'Strategic', rm: 'Marcus Williams',
    rails: ['SWIFT', 'Wire'], flows: ['US→AE', 'US→IN', 'US→HK'],
    avgRevenuePerPmt: 339, segmentPeerAvg: 298,
    monthlyVolume:  [9,10,11,12,13,14,15,16,17,18,19,20, 21,22,23,24,25,26,27,28,29,30,31,32],
    monthlyRevenue: [3050,3380,3720,4060,4390,4720,5060,5390,5720,6060,6390,6720, 7060,7390,7720,8060,8390,8720,9060,9390,9720,10060,10390,10720],
    railMix: { SWIFT: 65, Wire: 35 },
    pricingTier: 'Premium',
    lastRepriced: '2024-Q1',
    signal: 'DEEPENING',
    signalStrength: 'HIGH',
    revenueAtRisk: 0,
    insight: 'Consistent volume growth 24 months. New flows added Q3. Revenue per payment 14% above segment peer average — strong pricing position. Expansion opportunity in US→SG.',
    action: 'EXPAND',
    actionDetail: 'Propose US→SG flow activation. Client has Singapore subsidiary. Estimated incremental revenue $180K annually at current ticket size.',
  },
  {
    id: 'C03', name: 'Northgate Capital', segment: 'FI',
    relationship: 'Core', rm: 'Jennifer Park',
    rails: ['Wire', 'SWIFT'], flows: ['US→EU', 'US→CH'],
    avgRevenuePerPmt: 382, segmentPeerAvg: 401,
    monthlyVolume:  [5,5,5,5,5,6,6,6,6,6,6,6, 6,6,6,6,5,5,5,5,5,5,5,5],
    monthlyRevenue: [1890,1910,1930,1950,1970,2280,2290,2300,2310,2320,2330,2340, 2340,2350,2350,2350,1960,1950,1940,1940,1930,1930,1920,1910],
    railMix: { Wire: 45, SWIFT: 55 },
    pricingTier: 'Standard',
    lastRepriced: '2022-Q4',
    signal: 'UNDER_MONETIZED',
    signalStrength: 'MEDIUM',
    revenueAtRisk: 114000,
    insight: 'Revenue per payment is $19 below FI segment peer average. Pricing has not been reviewed since 2022. Volume stable — low churn risk but clear monetization gap.',
    action: 'REPRICE',
    actionDetail: 'Pricing review overdue. Bring to segment average would recover $114K annually. Low relationship risk given stable volumes and no competitor signals.',
  },
  {
    id: 'C04', name: 'Solara Payments', segment: 'Fintech',
    relationship: 'Growth', rm: 'David Okafor',
    rails: ['RTP', 'ACH', 'FedNow'], flows: ['US DOM'],
    avgRevenuePerPmt: 0.48, segmentPeerAvg: 0.52,
    monthlyVolume:  [142,158,174,190,210,228,248,268,290,312,336,360, 385,412,440,468,498,530,562,596,632,668,706,746],
    monthlyRevenue: [68,76,84,91,101,110,119,129,139,150,162,173, 185,198,212,225,240,255,270,286,304,321,340,358],
    railMix: { RTP: 48, ACH: 38, FedNow: 14 },
    pricingTier: 'Volume',
    lastRepriced: '2024-Q3',
    signal: 'DEEPENING',
    signalStrength: 'HIGH',
    revenueAtRisk: 0,
    insight: 'Volume growing 18% month-on-month. FedNow adoption increasing. Revenue per payment slightly below fintech peer average — volume discount justified at current scale.',
    action: 'MONITOR',
    actionDetail: 'Review pricing at 800K monthly transactions. Current volume discount appropriate. Watch FedNow adoption — potential to renegotiate rail mix terms at next tier.',
  },
  {
    id: 'C05', name: 'Crescent Logistics', segment: 'Mid-Market',
    relationship: 'Standard', rm: 'Amy Torres',
    rails: ['ACH', 'Wire'], flows: ['US→MX', 'US→BR'],
    avgRevenuePerPmt: 88, segmentPeerAvg: 76,
    monthlyVolume:  [8,8,8,8,7,7,7,7,7,7,8,8, 8,7,7,7,6,6,6,6,6,5,5,5],
    monthlyRevenue: [700,702,705,702,618,620,621,618,622,624,704,706, 705,620,619,618,531,530,529,531,530,443,442,441],
    railMix: { ACH: 62, Wire: 38 },
    pricingTier: 'Standard',
    lastRepriced: '2023-Q1',
    signal: 'MIGRATION_RISK',
    signalStrength: 'MEDIUM',
    revenueAtRisk: 124000,
    insight: 'Volume declining 6 months. US→BR flow showing elevated exception rates. Revenue per payment above peer average — pricing not the issue. Operational friction likely driving migration.',
    action: 'RETAIN',
    actionDetail: 'Escalate US→BR exception issues to operations. Schedule RM touchpoint. Exception rate of 9.4% on Brazil flow is double portfolio average — fix this before repricing.',
  },
  {
    id: 'C06', name: 'Atlas Commodities', segment: 'Corporate',
    relationship: 'Core', rm: 'Sarah Chen',
    rails: ['SWIFT'], flows: ['US→NG', 'US→ZA', 'US→IN'],
    avgRevenuePerPmt: 565, segmentPeerAvg: 298,
    monthlyVolume:  [4,4,4,3,3,4,4,4,4,4,3,3, 3,3,4,4,4,4,4,4,4,4,4,4],
    monthlyRevenue: [2240,2250,2240,1680,1680,2260,2260,2250,2260,2260,1680,1680, 1680,1680,2260,2260,2260,2260,2250,2260,2260,2250,2260,2260],
    railMix: { SWIFT: 100 },
    pricingTier: 'Premium',
    lastRepriced: '2024-Q2',
    signal: 'STABLE',
    signalStrength: 'LOW',
    revenueAtRisk: 0,
    insight: 'Revenue per payment 90% above corporate peer average — driven by complex emerging market flows. Volume stable. Single-rail dependency is a concentration risk worth monitoring.',
    action: 'MONITOR',
    actionDetail: 'No action required. Strong pricing position. Consider introducing wire as backup rail to reduce SWIFT dependency and protect against network disruption.',
  },
  {
    id: 'C07', name: 'Veritas Healthcare', segment: 'Mid-Market',
    relationship: 'Standard', rm: 'Amy Torres',
    rails: ['ACH'], flows: ['US DOM'],
    avgRevenuePerPmt: 0.62, segmentPeerAvg: 0.76,
    monthlyVolume:  [48,49,50,51,52,52,53,54,54,55,56,57, 58,59,60,61,62,63,64,65,66,67,68,69],
    monthlyRevenue: [30,30,31,32,32,32,33,33,33,34,35,35, 36,37,37,38,38,39,40,40,41,42,42,43],
    railMix: { ACH: 100 },
    pricingTier: 'Standard',
    lastRepriced: '2022-Q3',
    signal: 'UNDER_MONETIZED',
    signalStrength: 'MEDIUM',
    revenueAtRisk: 89000,
    insight: 'Revenue per payment is $0.14 below mid-market domestic peer average — pricing not reviewed in 2+ years. Volume growing steadily. Low churn risk. Straightforward repricing opportunity.',
    action: 'REPRICE',
    actionDetail: 'Bring pricing to peer average. Incremental $89K annually at current volumes. Growth trajectory means this gap widens every month without action.',
  },
  {
    id: 'C08', name: 'Pinnacle Asset Mgmt', segment: 'FI',
    relationship: 'Core', rm: 'Jennifer Park',
    rails: ['Wire', 'SWIFT'], flows: ['US→EU', 'US→JP', 'US→UK'],
    avgRevenuePerPmt: 400, segmentPeerAvg: 401,
    monthlyVolume:  [4,4,5,5,5,5,5,5,5,5,5,5, 5,5,5,5,5,5,6,6,6,6,6,6],
    monthlyRevenue: [1600,1600,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000, 2000,2000,2000,2000,2000,2000,2400,2400,2400,2400,2400,2400],
    railMix: { Wire: 50, SWIFT: 50 },
    pricingTier: 'Premium',
    lastRepriced: '2024-Q1',
    signal: 'STABLE',
    signalStrength: 'LOW',
    revenueAtRisk: 0,
    insight: 'Revenue per payment exactly at FI segment peer average. Volume gradually increasing. New flow (US→JP) added Q4. Well-positioned relationship — no immediate action needed.',
    action: 'MONITOR',
    actionDetail: 'Relationship performing to benchmark. Review at next QBR. Watch US→JP volumes for growth — if they scale, pricing review may be warranted.',
  },
  {
    id: 'C09', name: 'TerraFin Services', segment: 'Fintech',
    relationship: 'Growth', rm: 'David Okafor',
    rails: ['FedNow', 'RTP'], flows: ['US DOM'],
    avgRevenuePerPmt: 0.51, segmentPeerAvg: 0.52,
    monthlyVolume:  [210,224,238,254,270,288,306,326,348,370,394,420, 448,478,508,540,574,610,648,688,730,774,820,868],
    monthlyRevenue: [107,114,121,129,138,147,156,166,177,189,201,214, 228,244,259,275,293,311,330,350,372,395,418,443],
    railMix: { FedNow: 60, RTP: 40 },
    pricingTier: 'Volume',
    lastRepriced: '2024-Q2',
    signal: 'DEEPENING',
    signalStrength: 'HIGH',
    revenueAtRisk: 0,
    insight: 'Fastest growing client in portfolio. FedNow-first routing. Revenue per payment at fintech peer average. Volume doubling approximately every 14 months.',
    action: 'MONITOR',
    actionDetail: 'Flag for strategic account upgrade at 1M monthly transactions. Current pricing appropriate. FedNow-native client — potential reference case for instant rail adoption.',
  },
  {
    id: 'C10', name: 'Orion Energy Corp', segment: 'Corporate',
    relationship: 'Core', rm: 'Marcus Williams',
    rails: ['SWIFT', 'Wire'], flows: ['US→NO', 'US→SA', 'US→QA'],
    avgRevenuePerPmt: 310, segmentPeerAvg: 298,
    monthlyVolume:  [6,6,6,7,7,7,7,7,6,6,6,6, 6,7,7,7,7,7,7,6,6,6,6,6],
    monthlyRevenue: [1860,1860,1860,2170,2170,2170,2170,2170,1860,1860,1860,1860, 1860,2170,2170,2170,2170,2170,2170,1860,1860,1860,1860,1860],
    railMix: { SWIFT: 70, Wire: 30 },
    pricingTier: 'Standard',
    lastRepriced: '2023-Q3',
    signal: 'STABLE',
    signalStrength: 'LOW',
    revenueAtRisk: 0,
    insight: 'Revenue per payment 4% above corporate peer average. Volume driven by energy cycle — Q2/Q3 seasonal uplift consistent. Stable relationship. Nordic and Gulf flows performing well.',
    action: 'MONITOR',
    actionDetail: 'No action required. Consider pricing review at next contract renewal in Q3 2025 — opportunity to move from Standard to Premium tier given flow complexity.',
  },
  {
    id: 'C11', name: 'Pacific Trade Finance', segment: 'FI',
    relationship: 'Growth', rm: 'Jennifer Park',
    rails: ['SWIFT', 'Wire'], flows: ['US→SG', 'US→HK', 'US→JP'],
    avgRevenuePerPmt: 285, segmentPeerAvg: 401,
    monthlyVolume:  [2,2,3,3,3,4,4,4,4,5,5,5, 5,5,6,6,6,6,7,7,7,7,8,8],
    monthlyRevenue: [570,570,855,855,855,1140,1140,1140,1140,1425,1425,1425, 1425,1425,1710,1710,1710,1710,1995,1995,1995,1995,2280,2280],
    railMix: { SWIFT: 80, Wire: 20 },
    pricingTier: 'Standard',
    lastRepriced: '2023-Q4',
    signal: 'UNDER_MONETIZED',
    signalStrength: 'HIGH',
    revenueAtRisk: 462000,
    insight: 'Revenue per payment is $116 below FI segment peer average — the largest monetization gap in the portfolio. Volume growing strongly. Client was onboarded at introductory pricing that was never reviewed.',
    action: 'REPRICE',
    actionDetail: 'Highest priority repricing in portfolio. Introductory pricing expired. $116/payment gap vs FI peer average represents $462K annual revenue opportunity at current volumes.',
  },
  {
    id: 'C12', name: 'Zenith Manufacturing', segment: 'Mid-Market',
    relationship: 'Standard', rm: 'Amy Torres',
    rails: ['ACH', 'Wire'], flows: ['US→MX'],
    avgRevenuePerPmt: 52, segmentPeerAvg: 76,
    monthlyVolume:  [12,12,11,11,11,10,10,10,9,9,9,8, 8,8,7,7,7,6,6,6,5,5,5,4],
    monthlyRevenue: [620,624,572,572,572,520,520,520,468,468,468,416, 416,416,364,364,364,312,312,312,260,260,260,208],
    railMix: { ACH: 75, Wire: 25 },
    pricingTier: 'Standard',
    lastRepriced: '2021-Q2',
    signal: 'MIGRATION_RISK',
    signalStrength: 'HIGH',
    revenueAtRisk: 208000,
    insight: 'Volume declining 18 months consecutively — 67% reduction from peak. Revenue per payment $24 below mid-market peer average. Likely moving US→MX flows to a lower-cost provider.',
    action: 'RETAIN',
    actionDetail: 'Urgent retention intervention required. Schedule senior RM call. Consider competitive repricing offer — at $24 below peer average, pricing is not the issue. Investigate competitor.',
  },
];

// ── PORTFOLIO AGGREGATES ────────────────────────────────────────────────────
const MONTHS_24 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
                   'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_12 = MONTHS_24.slice(12);

// Signal summary
const signalCounts = {
  DEEPENING: CLIENTS.filter(c => c.signal === 'DEEPENING').length,
  STABLE: CLIENTS.filter(c => c.signal === 'STABLE').length,
  MIGRATION_RISK: CLIENTS.filter(c => c.signal === 'MIGRATION_RISK').length,
  UNDER_MONETIZED: CLIENTS.filter(c => c.signal === 'UNDER_MONETIZED').length,
};

// Total revenue at risk
const totalRevenueAtRisk = CLIENTS.reduce((s, c) => s + c.revenueAtRisk, 0);

// Action queue
const actionQueue = CLIENTS
  .filter(c => c.action !== 'MONITOR')
  .map(c => ({
    ...c,
    priority: c.signalStrength === 'HIGH' ? 1 : c.signalStrength === 'MEDIUM' ? 2 : 3,
  }))
  .sort((a, b) => a.priority - b.priority || b.revenueAtRisk - a.revenueAtRisk);

// ── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n.toFixed(0)}`;
const fmtK = n => n >= 1000 ? `${(n/1000).toFixed(0)}K` : n;

const signalColor = s => ({
  DEEPENING: T.green,
  STABLE: T.teal,
  MIGRATION_RISK: T.red,
  UNDER_MONETIZED: T.amber,
}[s] || T.textDim);

const signalLabel = s => ({
  DEEPENING: 'Deepening',
  STABLE: 'Stable',
  MIGRATION_RISK: 'Migration Risk',
  UNDER_MONETIZED: 'Under-Monetized',
}[s] || s);

const actionColor = a => ({
  EXPAND: T.green,
  MONITOR: T.teal,
  REPRICE: T.amber,
  RETAIN: T.red,
}[a] || T.textDim);

const strengthColor = s => ({
  HIGH: T.red,
  MEDIUM: T.amber,
  LOW: T.teal,
}[s] || T.textDim);

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
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

// Mini sparkline
const Spark = ({ data, color, height = 32, width = 80 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = (height - 4) - ((v - min) / range) * (height - 8) + 2;
    return `${x},${y}`;
  }).join(' ');
  const last = pts.split(' ').pop().split(',');
  return (
    <svg width={width} height={height} style={{ flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  );
};

// ── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Portfolio Overview' },
  { id: 'clients',   label: 'Client Rankings' },
  { id: 'signals',   label: 'Behavioral Signals' },
  { id: 'actions',   label: 'RM Action Queue' },
];

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function ClientPaymentBehaviorEngine() {
  const [tab, setTab] = useState('overview');
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);
  const [filterSignal, setFilterSignal] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [sortBy, setSortBy] = useState('revenueAtRisk');

  const filteredClients = useMemo(() => {
    let list = filterSignal === 'all' ? CLIENTS : CLIENTS.filter(c => c.signal === filterSignal);
    return [...list].sort((a, b) => {
      if (sortBy === 'revenueAtRisk') return b.revenueAtRisk - a.revenueAtRisk;
      if (sortBy === 'volume') return b.monthlyVolume[23] - a.monthlyVolume[23];
      if (sortBy === 'revenue') return b.monthlyRevenue[23] - a.monthlyRevenue[23];
      if (sortBy === 'gap') return (b.segmentPeerAvg - b.avgRevenuePerPmt) - (a.segmentPeerAvg - a.avgRevenuePerPmt);
      return 0;
    });
  }, [filterSignal, sortBy]);

  // Portfolio trend — last 12 months
  const portfolioTrend = MONTHS_12.map((m, i) => ({
    month: m,
    revenue: CLIENTS.reduce((s, c) => s + c.monthlyRevenue[12 + i], 0) / 1000,
    volume: CLIENTS.reduce((s, c) => s + c.monthlyVolume[12 + i], 0),
  }));

  // Monetization gap scatter data
  const scatterData = CLIENTS.map(c => ({
    ...c,
    gap: c.segmentPeerAvg - c.avgRevenuePerPmt,
    volumeTrend: ((c.monthlyVolume[23] - c.monthlyVolume[12]) / c.monthlyVolume[12]) * 100,
    x: c.avgRevenuePerPmt,
    y: ((c.monthlyVolume[23] - c.monthlyVolume[12]) / c.monthlyVolume[12]) * 100,
    z: c.monthlyRevenue[23] / 500,
  }));

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.sans, color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        .c04-tab { cursor: pointer; transition: all 0.15s; background: none; border: none; }
        .c04-tab:hover { color: ${T.gold} !important; }
        .c04-row { cursor: pointer; transition: background 0.12s; }
        .c04-row:hover { background: ${T.cardHov} !important; }
        .c04-card:hover { border-color: ${T.gold} !important; cursor: pointer; }
        .filter-btn { cursor: pointer; background: none; border: 1px solid ${T.border}; color: ${T.textDim}; padding: 3px 10px; border-radius: 3px; font-size: 9px; font-family: ${T.mono}; letter-spacing: 0.08em; transition: all 0.15s; }
        .filter-btn.active { border-color: ${T.gold}; color: ${T.gold}; background: ${T.goldSoft}; }
        .filter-btn:hover { border-color: ${T.gold}66; }
        .sort-btn { cursor: pointer; background: none; border: 1px solid ${T.border}; color: ${T.textDim}; padding: 3px 10px; border-radius: 3px; font-size: 9px; font-family: ${T.mono}; letter-spacing: 0.08em; transition: all 0.15s; }
        .sort-btn.active { border-color: ${T.gold}; color: ${T.gold}; }
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
                Model 04 · Layer 4 · Behavioral Intelligence
              </div>
              <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 500, color: T.text, lineHeight: 1.2, marginBottom: 8 }}>
                Client Payment<br />Behavior Engine
              </h1>
              <p style={{ fontFamily: T.sans, fontSize: 13, color: T.textMid, maxWidth: 480, lineHeight: 1.65 }}>
                Analyzes client payment patterns to surface volume migration risk, monetization gaps relative to internal peers, and relationship deepening signals across the portfolio.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, minWidth: 480, paddingBottom: 24 }}>
              <KPI label="Revenue at Risk" value={fmt(totalRevenueAtRisk)} sub="Identified gap" accent={T.red} />
              <KPI label="Migration Risk" value={signalCounts.MIGRATION_RISK} sub="Clients declining" accent={T.red} />
              <KPI label="Under-Monetized" value={signalCounts.UNDER_MONETIZED} sub="Below peer average" accent={T.amber} />
              <KPI label="Deepening" value={signalCounts.DEEPENING} sub="Growing relationships" accent={T.green} />
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: 0, borderTop: `1px solid ${T.border}` }}>
            {TABS.map(t => (
              <button key={t.id} className="c04-tab"
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

        {/* ── TAB 1: OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="fade-up">

            {/* Signal summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { signal: 'DEEPENING', count: signalCounts.DEEPENING, desc: 'Volume growing, relationship expanding', color: T.green, icon: '↗' },
                { signal: 'STABLE', count: signalCounts.STABLE, desc: 'Consistent usage, no significant change', color: T.teal, icon: '→' },
                { signal: 'MIGRATION_RISK', count: signalCounts.MIGRATION_RISK, desc: 'Volume declining, possible competitor activity', color: T.red, icon: '↘' },
                { signal: 'UNDER_MONETIZED', count: signalCounts.UNDER_MONETIZED, desc: 'Below internal peer average revenue per payment', color: T.amber, icon: '◈' },
              ].map(s => (
                <div key={s.signal} className="c04-card"
                  style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20, borderTop: `3px solid ${s.color}`, cursor: 'pointer', transition: 'border-color 0.15s' }}
                  onClick={() => { setFilterSignal(s.signal); setTab('clients'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 20, color: s.color }}>{s.icon}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 28, color: s.color, fontWeight: 600 }}>{s.count}</div>
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: s.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {signalLabel(s.signal)}
                  </div>
                  <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Portfolio revenue trend */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="Portfolio Revenue Trend — Last 12 Months" sub="Aggregate across all clients ($K)" />
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={portfolioTrend}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={T.gold} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={T.gold} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontFamily: T.mono, fontSize: 9, fill: T.textDim }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontFamily: T.mono, fontSize: 9, fill: T.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue ($K)" stroke={T.gold} strokeWidth={2} fill="url(#revGrad)" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue per payment vs peer benchmark scatter */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="Revenue / Payment vs Volume Trend" sub="Bubble = current monthly revenue · color = signal" />
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                    <XAxis dataKey="x" name="Rev/Payment" type="number"
                      tick={{ fontFamily: T.mono, fontSize: 9, fill: T.textDim }}
                      label={{ value: 'Rev / Payment ($)', position: 'insideBottom', offset: -5, style: { fill: T.textDim, fontSize: 9, fontFamily: T.mono } }} />
                    <YAxis dataKey="y" name="Volume Trend"
                      tick={{ fontFamily: T.mono, fontSize: 9, fill: T.textDim }}
                      label={{ value: 'Vol Trend (%)', angle: -90, position: 'insideLeft', style: { fill: T.textDim, fontSize: 9, fontFamily: T.mono } }} />
                    <ZAxis dataKey="z" range={[40, 300]} />
                    <ReferenceLine y={0} stroke={T.border} strokeDasharray="4 4" />
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: T.mono, fontSize: 11 }}>
                          <div style={{ color: T.gold, marginBottom: 4 }}>{d.name}</div>
                          <div style={{ color: T.textMid }}>Rev/Pmt: <span style={{ color: T.text }}>${d.avgRevenuePerPmt}</span></div>
                          <div style={{ color: T.textMid }}>Peer avg: <span style={{ color: T.teal }}>${d.segmentPeerAvg}</span></div>
                          <div style={{ color: T.textMid }}>Vol trend: <span style={{ color: d.y >= 0 ? T.green : T.red }}>{d.y?.toFixed(1)}%</span></div>
                          <div style={{ marginTop: 6 }}><Tag label={signalLabel(d.signal)} color={signalColor(d.signal)} small /></div>
                        </div>
                      );
                    }} />
                    <Scatter data={scatterData} shape={(props) => {
                      const { cx, cy, payload } = props;
                      const r = Math.sqrt(payload.z) * 2;
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={r} fill={signalColor(payload.signal)} fillOpacity={0.25} stroke={signalColor(payload.signal)} strokeWidth={1.5} />
                          <text x={cx} y={cy + 3} textAnchor="middle" fontSize={8} fill={T.text} fontFamily={T.mono}>{payload.name.split(' ')[0]}</text>
                        </g>
                      );
                    }} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monetization gap summary */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
              <SectionHead title="Internal Peer Benchmark — Revenue Per Payment vs Segment Average" sub="No external benchmarks required — comparison uses internal client portfolio by segment and flow" />
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: T.surface }}>
                      {['Client', 'Segment', 'Rev / Payment', 'Segment Peer Avg', 'Gap', 'Signal', 'Revenue at Risk'].map(h => (
                        <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: '0.1em', borderBottom: `1px solid ${T.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...CLIENTS].sort((a, b) => (b.segmentPeerAvg - b.avgRevenuePerPmt) - (a.segmentPeerAvg - a.avgRevenuePerPmt)).map((c, i) => {
                      const gap = c.segmentPeerAvg - c.avgRevenuePerPmt;
                      return (
                        <tr key={c.id} className="c04-row"
                          onClick={() => { setSelectedClient(c); setTab('signals'); }}
                          style={{ background: i % 2 === 0 ? T.card : T.surface, borderBottom: `1px solid ${T.border}` }}>
                          <td style={{ padding: '10px 14px', fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 500 }}>{c.name}</td>
                          <td style={{ padding: '10px 14px' }}><Tag label={c.segment} color={T.blue} small /></td>
                          <td style={{ padding: '10px 14px', fontFamily: T.mono, fontSize: 12, color: T.text }}>${c.avgRevenuePerPmt.toFixed(2)}</td>
                          <td style={{ padding: '10px 14px', fontFamily: T.mono, fontSize: 12, color: T.teal }}>${c.segmentPeerAvg.toFixed(2)}</td>
                          <td style={{ padding: '10px 14px', fontFamily: T.mono, fontSize: 12, color: gap > 0 ? T.amber : T.green, fontWeight: 600 }}>
                            {gap > 0 ? `−$${gap.toFixed(2)}` : `+$${Math.abs(gap).toFixed(2)}`}
                          </td>
                          <td style={{ padding: '10px 14px' }}><Tag label={signalLabel(c.signal)} color={signalColor(c.signal)} small /></td>
                          <td style={{ padding: '10px 14px', fontFamily: T.mono, fontSize: 12, color: c.revenueAtRisk > 0 ? T.red : T.textDim, fontWeight: c.revenueAtRisk > 0 ? 600 : 400 }}>
                            {c.revenueAtRisk > 0 ? fmt(c.revenueAtRisk) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12, padding: '10px 14px', background: T.goldSoft, borderRadius: 6, border: `1px solid ${T.gold}22` }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.gold, fontWeight: 600 }}>NOTE: </span>
                <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>
                  Peer averages are calculated from internal portfolio data — clients in the same segment transacting on the same flows. No external market data required.
                  The model surfaces where to look and what the revenue implication is. That context comes from the relationship.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: CLIENT RANKINGS ── */}
        {tab === 'clients' && (
          <div className="fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <SectionHead title="Client Behavioral Rankings" sub="24-month volume and revenue patterns with migration signals" />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>SIGNAL:</span>
                {['all', 'MIGRATION_RISK', 'UNDER_MONETIZED', 'DEEPENING', 'STABLE'].map(f => (
                  <button key={f} className={`filter-btn ${filterSignal === f ? 'active' : ''}`} onClick={() => setFilterSignal(f)}>
                    {f === 'all' ? 'ALL' : f === 'MIGRATION_RISK' ? 'MIGRATION' : f === 'UNDER_MONETIZED' ? 'UNDER-MON.' : f}
                  </button>
                ))}
                <div style={{ width: 1, height: 16, background: T.border, margin: '0 4px' }} />
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>SORT:</span>
                {[['revenueAtRisk', 'REV AT RISK'], ['volume', 'VOLUME'], ['revenue', 'REVENUE'], ['gap', 'PEER GAP']].map(([k, l]) => (
                  <button key={k} className={`sort-btn ${sortBy === k ? 'active' : ''}`} onClick={() => setSortBy(k)}>{l}</button>
                ))}
              </div>
            </div>

            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: T.surface }}>
                    {['#', 'Client', 'Segment', 'RM', 'Rails', 'Rev/Pmt', 'Peer Avg', 'Gap', 'Vol (12m)', 'Rev (12m)', 'Trend', 'Signal', 'Strength', 'Action'].map(h => (
                      <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: '0.08em', borderBottom: `1px solid ${T.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((c, i) => {
                    const gap = c.segmentPeerAvg - c.avgRevenuePerPmt;
                    const vol12 = c.monthlyVolume.slice(12).reduce((s, v) => s + v, 0);
                    const rev12 = c.monthlyRevenue.slice(12).reduce((s, v) => s + v, 0);
                    return (
                      <tr key={c.id} className="c04-row"
                        onClick={() => { setSelectedClient(c); setTab('signals'); }}
                        style={{ background: selectedClient?.id === c.id ? `${T.gold}08` : i % 2 === 0 ? T.card : T.surface, borderBottom: `1px solid ${T.border}`, borderLeft: selectedClient?.id === c.id ? `3px solid ${T.gold}` : '3px solid transparent' }}>
                        <td style={{ padding: '10px 12px', fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{String(i + 1).padStart(2, '0')}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 500 }}>{c.name}</div>
                          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 2 }}>{c.flows.join(' · ')}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}><Tag label={c.segment} color={T.blue} small /></td>
                        <td style={{ padding: '10px 12px', fontFamily: T.sans, fontSize: 11, color: T.textMid }}>{c.rm}</td>
                        <td style={{ padding: '10px 12px', fontFamily: T.mono, fontSize: 10, color: T.textMid }}>{c.rails.join('+')}</td>
                        <td style={{ padding: '10px 12px', fontFamily: T.mono, fontSize: 11, color: T.text }}>${c.avgRevenuePerPmt.toFixed(2)}</td>
                        <td style={{ padding: '10px 12px', fontFamily: T.mono, fontSize: 11, color: T.teal }}>${c.segmentPeerAvg.toFixed(2)}</td>
                        <td style={{ padding: '10px 12px', fontFamily: T.mono, fontSize: 11, color: gap > 0 ? T.amber : T.green, fontWeight: 600 }}>
                          {gap > 0 ? `−$${gap.toFixed(2)}` : `+$${Math.abs(gap).toFixed(2)}`}
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: T.mono, fontSize: 11, color: T.text }}>{fmtK(vol12)}</td>
                        <td style={{ padding: '10px 12px', fontFamily: T.mono, fontSize: 11, color: T.text }}>{fmt(rev12)}</td>
                        <td style={{ padding: '10px 12px' }}><Spark data={c.monthlyVolume} color={signalColor(c.signal)} /></td>
                        <td style={{ padding: '10px 12px' }}><Tag label={signalLabel(c.signal)} color={signalColor(c.signal)} small /></td>
                        <td style={{ padding: '10px 12px' }}><Tag label={c.signalStrength} color={strengthColor(c.signalStrength)} small /></td>
                        <td style={{ padding: '10px 12px' }}><Tag label={c.action} color={actionColor(c.action)} small /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
              Click any client to open behavioral deep dive →
            </div>
          </div>
        )}

        {/* ── TAB 3: BEHAVIORAL SIGNALS ── */}
        {tab === 'signals' && selectedClient && (
          <div className="fade-up">

            {/* Client header */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: T.serif, fontSize: 24, color: T.text, fontWeight: 500, marginBottom: 6 }}>{selectedClient.name}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Tag label={selectedClient.segment} color={T.blue} />
                    <Tag label={selectedClient.relationship} color={T.teal} small />
                    <Tag label={`RM: ${selectedClient.rm}`} color={T.textMid} small />
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
                      {selectedClient.flows.join(' · ')} · {selectedClient.rails.join(' + ')}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag label={signalLabel(selectedClient.signal)} color={signalColor(selectedClient.signal)} />
                  <div style={{ marginTop: 6 }}>
                    <Tag label={`${selectedClient.signalStrength} SIGNAL`} color={strengthColor(selectedClient.signalStrength)} small />
                  </div>
                </div>
              </div>

              {/* Key metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
                {[
                  { l: 'Rev / Payment', v: `$${selectedClient.avgRevenuePerPmt.toFixed(2)}` },
                  { l: 'Segment Peer Avg', v: `$${selectedClient.segmentPeerAvg.toFixed(2)}` },
                  { l: 'Peer Gap', v: selectedClient.segmentPeerAvg > selectedClient.avgRevenuePerPmt ? `−$${(selectedClient.segmentPeerAvg - selectedClient.avgRevenuePerPmt).toFixed(2)}` : `+$${(selectedClient.avgRevenuePerPmt - selectedClient.segmentPeerAvg).toFixed(2)}` },
                  { l: 'Pricing Tier', v: selectedClient.pricingTier },
                  { l: 'Last Repriced', v: selectedClient.lastRepriced },
                  { l: 'Rev at Risk', v: selectedClient.revenueAtRisk > 0 ? fmt(selectedClient.revenueAtRisk) : 'None' },
                ].map((m, i) => (
                  <div key={i} style={{ background: T.surface, borderRadius: 6, padding: '10px 12px' }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{m.l}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 14, color: i === 2 ? (selectedClient.segmentPeerAvg > selectedClient.avgRevenuePerPmt ? T.amber : T.green) : i === 5 && selectedClient.revenueAtRisk > 0 ? T.red : T.text, fontWeight: 500 }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Volume trend 24 months */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="24-Month Volume Trend" sub="Monthly transaction count" />
                <ResponsiveContainer width="100%" height={180}>
                  <ComposedChart data={selectedClient.monthlyVolume.map((v, i) => ({ month: MONTHS_24[i], volume: v, period: i < 12 ? 'Y-1' : 'Current' }))}>
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={signalColor(selectedClient.signal)} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={signalColor(selectedClient.signal)} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontFamily: T.mono, fontSize: 8, fill: T.textDim }} axisLine={false} tickLine={false}
                      tickFormatter={(v, i) => i % 3 === 0 ? v : ''} />
                    <YAxis tick={{ fontFamily: T.mono, fontSize: 9, fill: T.textDim }} axisLine={false} tickLine={false} />
                    <ReferenceLine x="Jan" stroke={T.border} strokeDasharray="4 4" label={{ value: 'Year 2', fill: T.textDim, fontSize: 9, fontFamily: T.mono }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="volume" name="Volume" stroke={signalColor(selectedClient.signal)} strokeWidth={2} fill="url(#volGrad)" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue trend 24 months */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="24-Month Revenue Trend" sub="Monthly revenue ($)" />
                <ResponsiveContainer width="100%" height={180}>
                  <ComposedChart data={selectedClient.monthlyRevenue.map((v, i) => ({ month: MONTHS_24[i], revenue: v }))}>
                    <defs>
                      <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={T.gold} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={T.gold} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontFamily: T.mono, fontSize: 8, fill: T.textDim }} axisLine={false} tickLine={false}
                      tickFormatter={(v, i) => i % 3 === 0 ? v : ''} />
                    <YAxis tick={{ fontFamily: T.mono, fontSize: 9, fill: T.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                    <ReferenceLine x="Jan" stroke={T.border} strokeDasharray="4 4" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke={T.gold} strokeWidth={2} fill="url(#rGrad)" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rail mix + AI assessment */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
              {/* Rail mix */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
                <SectionHead title="Rail Mix" />
                {Object.entries(selectedClient.railMix).map(([rail, pct]) => (
                  <div key={rail} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.text }}>{rail}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.gold }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: T.surface, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: T.gold, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Pricing Tier</div>
                  <Tag label={selectedClient.pricingTier} color={T.teal} />
                </div>
              </div>

              {/* AI insight + recommended action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: T.card, border: `1px solid ${signalColor(selectedClient.signal)}33`, borderRadius: 8, padding: 20, borderTop: `3px solid ${signalColor(selectedClient.signal)}` }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: signalColor(selectedClient.signal), letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Behavioral Signal</span>
                    <Tag label={selectedClient.signalStrength} color={strengthColor(selectedClient.signalStrength)} small />
                  </div>
                  <p style={{ fontFamily: T.sans, fontSize: 13, color: T.textMid, lineHeight: 1.7, margin: 0 }}>{selectedClient.insight}</p>
                </div>

                <div style={{ background: T.card, border: `1px solid ${actionColor(selectedClient.action)}33`, borderRadius: 8, padding: 20, borderTop: `3px solid ${actionColor(selectedClient.action)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: actionColor(selectedClient.action), letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Recommended Action</span>
                    <Tag label={selectedClient.action} color={actionColor(selectedClient.action)} />
                  </div>
                  <p style={{ fontFamily: T.sans, fontSize: 13, color: T.textMid, lineHeight: 1.7, margin: 0 }}>{selectedClient.actionDetail}</p>
                  {selectedClient.revenueAtRisk > 0 && (
                    <div style={{ marginTop: 12, padding: '8px 12px', background: T.redSoft, borderRadius: 6, border: `1px solid ${T.red}22` }}>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.red, fontWeight: 600 }}>Revenue at risk: </span>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.text }}>{fmt(selectedClient.revenueAtRisk)} annually at current volumes</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Client selector */}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, alignSelf: 'center' }}>SWITCH CLIENT:</span>
              {CLIENTS.map(c => (
                <button key={c.id} onClick={() => setSelectedClient(c)}
                  style={{ cursor: 'pointer', background: selectedClient.id === c.id ? T.goldSoft : 'none', border: `1px solid ${selectedClient.id === c.id ? T.gold : T.border}`, color: selectedClient.id === c.id ? T.gold : T.textDim, padding: '3px 10px', borderRadius: 3, fontFamily: T.mono, fontSize: 9, letterSpacing: '0.06em', transition: 'all 0.15s' }}>
                  {c.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: RM ACTION QUEUE ── */}
        {tab === 'actions' && (
          <div className="fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <SectionHead title="RM Action Queue" sub="Ranked by revenue impact and signal strength — outputs structured for relationship manager action" />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>ACTION:</span>
                {['all', 'REPRICE', 'RETAIN', 'EXPAND'].map(f => (
                  <button key={f} className={`filter-btn ${filterAction === f ? 'active' : ''}`} onClick={() => setFilterAction(f)}>{f}</button>
                ))}
              </div>
            </div>

            {/* Summary KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              <KPI label="Total Rev Opportunity" value={fmt(totalRevenueAtRisk)} sub="Across all action items" accent={T.amber} />
              <KPI label="Reprice Actions" value={actionQueue.filter(c => c.action === 'REPRICE').length} sub="Pricing gap identified" accent={T.amber} />
              <KPI label="Retain Actions" value={actionQueue.filter(c => c.action === 'RETAIN').length} sub="Migration risk flagged" accent={T.red} />
              <KPI label="Expand Actions" value={actionQueue.filter(c => c.action === 'EXPAND').length} sub="Growth opportunity" accent={T.green} />
            </div>

            {/* Action cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(filterAction === 'all' ? actionQueue : actionQueue.filter(c => c.action === filterAction)).map((c, i) => (
                <div key={c.id} className="c04-card"
                  onClick={() => { setSelectedClient(c); setTab('signals'); }}
                  style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20, borderLeft: `4px solid ${actionColor(c.action)}`, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 160px 160px 200px 140px', gap: 16, alignItems: 'center' }}>
                    <div style={{ fontFamily: T.mono, fontSize: 12, color: T.textDim }}>{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <div style={{ fontFamily: T.sans, fontSize: 14, color: T.text, fontWeight: 500, marginBottom: 4 }}>{c.name}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Tag label={c.segment} color={T.blue} small />
                        <Tag label={`RM: ${c.rm}`} color={T.textMid} small />
                        <Tag label={signalLabel(c.signal)} color={signalColor(c.signal)} small />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Rev at Risk</div>
                      <div style={{ fontFamily: T.mono, fontSize: 16, color: c.revenueAtRisk > 0 ? T.red : T.green, fontWeight: 600 }}>
                        {c.revenueAtRisk > 0 ? fmt(c.revenueAtRisk) : 'Growth'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Signal Strength</div>
                      <Tag label={c.signalStrength} color={strengthColor(c.signalStrength)} />
                    </div>
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Action Detail</div>
                      <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>
                        {c.actionDetail.substring(0, 80)}...
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Tag label={c.action} color={actionColor(c.action)} />
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 6 }}>Click for full detail →</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Model connections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 }}>
              <div style={{ padding: '12px 16px', background: T.blueSoft, borderRadius: 8, border: `1px solid ${T.blue}22`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, color: T.blue, flexShrink: 0 }}>⟵</span>
                <div>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.blue, fontWeight: 700 }}>MODEL 01 CONNECTION: </span>
                  <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>Client net margin from the Profitability Engine weights the behavioral signals here. Clients generating the highest margin per payment receive elevated attention in the action queue.</span>
                </div>
              </div>
              <div style={{ padding: '12px 16px', background: T.tealSoft, borderRadius: 8, border: `1px solid ${T.teal}22`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, color: T.teal, flexShrink: 0 }}>⟵</span>
                <div>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.teal, fontWeight: 700 }}>MODEL 03 CONNECTION: </span>
                  <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid }}>Flow classification from the Flow Analyzer elevates migration risk signals. Clients concentrated in DE-PRIORITIZE / EXIT flows receive higher signal strength ratings.</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: '16px 32px', marginTop: 20 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
            CLIENT PAYMENT BEHAVIOR ENGINE · MODEL 04 · BEHAVIORAL INTELLIGENCE · CARLOS UREÑA PAYMENTS STRATEGY
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
            PROTOTYPE · SYNTHETIC DATA · 12 CLIENTS · 24-MONTH HISTORY
          </span>
        </div>
      </div>
    </div>
  );
}
