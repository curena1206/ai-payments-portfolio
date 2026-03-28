import { useState, useMemo } from "react";
import { ModelBackBar } from '../pages/FrameworkIndex';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend, AreaChart, Area,
  ScatterChart, Scatter, ZAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg:       '#0a0f1a',
  surface:  '#0f1824',
  card:     '#141e2e',
  cardHov:  '#1a2640',
  border:   '#1e2d45',
  borderHi: '#2a4060',
  gold:     '#c9a84c',
  goldDim:  '#8a6f30',
  goldSoft: 'rgba(201,168,76,0.12)',
  goldGlow: 'rgba(201,168,76,0.06)',
  teal:     '#2dd4bf',
  tealDim:  '#0d9488',
  tealSoft: 'rgba(45,212,191,0.12)',
  red:      '#f87171',
  redSoft:  'rgba(248,113,113,0.12)',
  amber:    '#fbbf24',
  amberSoft:'rgba(251,191,36,0.1)',
  green:    '#34d399',
  greenSoft:'rgba(52,211,153,0.1)',
  text:     '#e2e8f0',
  textMid:  '#94a3b8',
  textDim:  '#64748b',
  navy:     '#0f1f3d',
  serif:    "'Playfair Display', Georgia, serif",
  mono:     "'IBM Plex Mono', 'Courier New', monospace",
  sans:     "'Inter', system-ui, sans-serif",
};

// ── CORRIDORS DATA ─────────────────────────────────────────────────────────────
const CORRIDORS = [
  { id:'US→MX', name:'US → Mexico',     region:'LATAM',  vol:2840, rev:18.4, rpm:6.48, fx:1.85, settle:0.82, net:4.81, growth:14.2, plan:12.0, status:'Grow',     trend:[12,13,14,13,15,16,15,17,18,17,18,18] },
  { id:'US→PH', name:'US → Philippines',region:'APMEA',  vol:1920, rev:14.2, rpm:7.40, fx:2.10, settle:0.95, net:4.35, growth:22.8, plan:18.0, status:'Grow',     trend:[8,9,10,11,12,12,13,14,15,16,17,19] },
  { id:'US→IN', name:'US → India',       region:'APMEA',  vol:3210, rev:19.8, rpm:6.17, fx:1.60, settle:0.78, net:3.79, growth:18.4, plan:15.0, status:'Grow',     trend:[14,15,15,16,17,17,18,19,20,21,22,27] },
  { id:'US→NG', name:'US → Nigeria',     region:'APMEA',  vol:640,  rev:6.8,  rpm:10.63,fx:3.20, settle:1.40, net:5.03, growth:31.5, plan:25.0, status:'Grow',     trend:[3,4,4,5,5,6,6,7,7,8,8,5] },
  { id:'US→BR', name:'US → Brazil',      region:'LATAM',  vol:1480, rev:10.2, rpm:6.89, fx:1.95, settle:0.90, net:4.04, growth:8.6,  plan:10.0, status:'Defend',   trend:[10,11,11,12,12,12,12,13,13,13,12,12] },
  { id:'UK→IN', name:'UK → India',       region:'APMEA',  vol:1140, rev:8.9,  rpm:7.81, fx:2.30, settle:1.05, net:4.46, growth:16.2, plan:14.0, status:'Grow',     trend:[7,7,8,8,9,9,9,10,10,10,11,9] },
  { id:'EU→NG', name:'EU → Nigeria',     region:'APMEA',  vol:380,  rev:4.1,  rpm:10.79,fx:3.40, settle:1.55, net:4.84, growth:4.2,  plan:12.0, status:'Optimize', trend:[3,3,4,4,4,4,4,4,4,4,4,3] },
  { id:'SG→PH', name:'SG → Philippines', region:'APMEA',  vol:590,  rev:4.8,  rpm:8.14, fx:2.45, settle:1.10, net:4.59, growth:19.8, plan:16.0, status:'Grow',     trend:[3,3,4,4,4,5,5,5,5,5,6,5] },
];

// ── USE CASES DATA ─────────────────────────────────────────────────────────────
const USE_CASES = [
  {
    id:'B2B',
    name:'B2B Cross-Border Disbursements',
    icon:'⬡',
    tam:32000,
    penetration:4.2,
    customers:{ banks:42, fintechs:28, platforms:15, corporates:31 },
    monthlyVol:[820,890,940,1020,1080,1150,1210,1290,1380,1440,1520,1610],
    revenueVsTarget:[88,90,91,93,95,96,97,99,101,103,105,108],
    status:'On Track',
    insight:'Fastest revenue ramp. MC Move Commercial Payments driving bank channel adoption. 12 new bank clients onboarded Q4.',
    corridors:['US→MX','US→IN','UK→IN','EU→NG'],
  },
  {
    id:'GIG',
    name:'Gig & Creator Payouts',
    icon:'◈',
    tam:8500,
    penetration:6.8,
    customers:{ banks:12, fintechs:48, platforms:62, corporates:8 },
    monthlyVol:[640,680,720,780,840,910,980,1060,1140,1230,1320,1420],
    revenueVsTarget:[92,94,95,97,98,100,102,104,107,109,112,115],
    status:'Ahead',
    insight:'Stablecoin payout pilot with 3 platforms launched Q3. Creator economy driving outsized growth in US→PH and SG→PH corridors.',
    corridors:['US→PH','SG→PH','US→MX'],
  },
  {
    id:'P2P',
    name:'Consumer P2P Remittance',
    icon:'◎',
    tam:905000,
    penetration:0.8,
    customers:{ banks:88, fintechs:34, platforms:22, corporates:0 },
    monthlyVol:[2840,2910,2880,2950,3020,3080,3150,3210,3280,3320,3390,3450],
    revenueVsTarget:[96,95,94,95,96,97,97,98,99,99,100,101],
    status:'On Track',
    insight:'Largest volume corridor. Bank channel dominates. Digital app share growing — potential fee compression risk if direct-to-consumer rails gain traction.',
    corridors:['US→MX','US→PH','US→IN','US→NG'],
  },
  {
    id:'GOV',
    name:'Government & Insurance Payouts',
    icon:'◇',
    tam:4200,
    penetration:2.1,
    customers:{ banks:18, fintechs:6, platforms:4, corporates:22 },
    monthlyVol:[180,190,200,210,225,240,255,270,285,300,315,330],
    revenueVsTarget:[78,80,82,84,85,87,88,90,91,93,94,96],
    status:'Behind',
    insight:'Regulatory complexity slowing onboarding in NG and BR corridors. Two government contracts in final procurement stage. Expected to close H1.',
    corridors:['US→NG','US→BR','EU→NG'],
  },
];

// ── GTM PIPELINE DATA ─────────────────────────────────────────────────────────
const PIPELINE = [
  { id:'P001', client:'Banco Santander Mexico',  type:'Bank',    useCase:'B2B',  corridor:'US→MX', stage:'Contracting', vol:850,  rev:5.5,  days:18, risk:'Low' },
  { id:'P002', client:'GCash / Mynt',            type:'Fintech', useCase:'GIG',  corridor:'US→PH', stage:'Contracting', vol:620,  rev:4.6,  days:24, risk:'Low' },
  { id:'P003', client:'HDFC Bank',               type:'Bank',    useCase:'B2B',  corridor:'US→IN', stage:'Solutioning', vol:1200, rev:7.2,  days:45, risk:'Med' },
  { id:'P004', client:'Nubank Brazil',           type:'Fintech', useCase:'P2P',  corridor:'US→BR', stage:'Solutioning', vol:480,  rev:3.3,  days:38, risk:'Med' },
  { id:'P005', client:'Access Bank Nigeria',     type:'Bank',    useCase:'GOV',  corridor:'US→NG', stage:'Qualified',   vol:320,  rev:3.4,  days:62, risk:'High' },
  { id:'P006', client:'Grab Financial',          type:'Platform',useCase:'GIG',  corridor:'SG→PH', stage:'Contracting', vol:410,  rev:3.3,  days:12, risk:'Low' },
  { id:'P007', client:'Standard Chartered UK',  type:'Bank',    useCase:'B2B',  corridor:'UK→IN', stage:'Live',        vol:890,  rev:7.0,  days:0,  risk:'None' },
  { id:'P008', client:'Wise Platform',           type:'Fintech', useCase:'P2P',  corridor:'EU→NG', stage:'Qualified',   vol:210,  rev:2.3,  days:55, risk:'High' },
  { id:'P009', client:'Remitly',                 type:'Fintech', useCase:'P2P',  corridor:'US→PH', stage:'Live',        vol:740,  rev:5.5,  days:0,  risk:'None' },
  { id:'P010', client:'Corpay Cross-Border',     type:'Corporate',useCase:'B2B', corridor:'US→MX', stage:'Solutioning', vol:560,  rev:3.9,  days:41, risk:'Med' },
];

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n, dec=1) => n >= 1000 ? `${(n/1000).toFixed(1)}B` : `${n.toFixed(dec)}M`;
const fmtK = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n;
const pct = n => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;

const statusColor = s => ({ Grow:'#34d399', Defend:'#fbbf24', Optimize:'#f87171', Exit:'#94a3b8' }[s] || T.textDim);
const stageColor  = s => ({ Live:'#34d399', Contracting:'#2dd4bf', Solutioning:'#fbbf24', Qualified:'#f87171', Prospect:'#94a3b8' }[s] || T.textDim);
const riskColor   = r => ({ Low:'#34d399', Med:'#fbbf24', High:'#f87171', None:'#64748b' }[r] || T.textDim);

function KPI({ label, value, sub, accent = T.gold }) {
  return (
    <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:'16px 20px' }}>
      <div style={{ fontFamily:T.mono, fontSize:10, color:T.textDim, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:T.mono, fontSize:22, color:accent, fontWeight:600, marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontFamily:T.sans, fontSize:12, color:T.textMid }}>{sub}</div>}
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{ background:`${color}20`, border:`1px solid ${color}50`, color, borderRadius:4, padding:'2px 8px', fontFamily:T.mono, fontSize:10, fontWeight:600, letterSpacing:'0.06em' }}>
      {label}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:6, padding:'10px 14px' }}>
      <div style={{ fontFamily:T.mono, fontSize:11, color:T.gold, marginBottom:6 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ fontFamily:T.mono, fontSize:11, color:p.color || T.text }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </div>
      ))}
    </div>
  );
};

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'corridors', label:'Corridor Revenue' },
  { id:'usecases',  label:'Use Case Adoption' },
  { id:'pricing',   label:'Transaction Economics' },
  { id:'gtm',       label:'GTM Pipeline' },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Model06() {
  const [tab, setTab] = useState('corridors');
  const [selectedCorridor, setSelectedCorridor] = useState(CORRIDORS[0]);
  const [selectedUseCase, setSelectedUseCase] = useState(USE_CASES[0]);
  const [sortCol, setSortCol] = useState('rev');

  const totalVol = CORRIDORS.reduce((s,c) => s+c.vol, 0);
  const totalRev = CORRIDORS.reduce((s,c) => s+c.rev, 0);
  const avgGrowth = (CORRIDORS.reduce((s,c) => s+c.growth, 0) / CORRIDORS.length).toFixed(1);
  const growCorridors = CORRIDORS.filter(c => c.status === 'Grow').length;

  const pipelineVol = PIPELINE.reduce((s,p) => s+p.vol, 0);
  const pipelineRev = PIPELINE.reduce((s,p) => s+p.rev, 0);
  const liveDeals = PIPELINE.filter(p => p.stage === 'Live').length;
  const atRisk = PIPELINE.filter(p => p.risk === 'High').length;

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.sans, color:T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        .m06-tab { cursor:pointer; transition: all 0.15s; }
        .m06-tab:hover { color: ${T.gold} !important; }
        .m06-row:hover { background: ${T.cardHov} !important; }
        .m06-card:hover { border-color: ${T.gold} !important; cursor:pointer; }
        .m06-pipe:hover { background: ${T.cardHov} !important; }
        .m06-cor:hover { background: ${T.cardHov} !important; cursor:pointer; }
      `}</style>

      <ModelBackBar />

      {/* HEADER */}
      <div style={{ borderBottom:`1px solid ${T.border}`, padding:'32px 32px 0', background:T.surface }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:10 }}>
            Model 06 · Layer 6 · Strategic Positioning Layer
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24 }}>
            <div>
              <h1 style={{ fontFamily:T.serif, fontSize:'clamp(24px,3vw,36px)', fontWeight:500, color:T.text, lineHeight:1.2, marginBottom:8 }}>
                Network Participation<br />Economics
              </h1>
              <p style={{ fontFamily:T.sans, fontSize:14, color:T.textMid, maxWidth:520, lineHeight:1.65 }}>
                Evaluates the bank's participation economics across push payment networks — assessing whether volume, pricing, and corridor coverage are generating an adequate return on infrastructure investment.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, minWidth:480 }}>
              <KPI label="Total Volume" value={`${(totalVol/1000).toFixed(1)}B`} sub="Monthly transactions" />
              <KPI label="Net Revenue" value={`$${totalRev.toFixed(0)}M`} sub="Monthly run rate" />
              <KPI label="Avg Growth" value={pct(parseFloat(avgGrowth))} sub="vs prior period" accent={T.teal} />
              <KPI label="Grow Corridors" value={`${growCorridors}/8`} sub="On expansion track" accent={T.green} />
            </div>
          </div>

          {/* TABS */}
          <div style={{ display:'flex', gap:0, borderTop:`1px solid ${T.border}` }}>
            {TABS.map(t => (
              <button key={t.id} className="m06-tab"
                onClick={() => setTab(t.id)}
                style={{ background:'none', border:'none', padding:'14px 24px', fontFamily:T.mono, fontSize:12, letterSpacing:'0.04em', cursor:'pointer', borderBottom: tab === t.id ? `2px solid ${T.gold}` : '2px solid transparent', color: tab === t.id ? T.gold : T.textDim, transition:'all 0.15s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 32px' }}>

        {/* ── TAB 1: CORRIDORS ── */}
        {tab === 'corridors' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
              {/* Corridor list */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, overflow:'hidden' }}>
                <div style={{ padding:'14px 20px', borderBottom:`1px solid ${T.border}`, fontFamily:T.mono, fontSize:11, color:T.gold, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  Corridor Rankings — Net Revenue
                </div>
                {[...CORRIDORS].sort((a,b) => b.net - a.net).map((c,i) => (
                  <div key={c.id} className="m06-cor"
                    onClick={() => setSelectedCorridor(c)}
                    style={{ padding:'12px 20px', borderBottom:`1px solid ${T.border}`, display:'grid', gridTemplateColumns:'28px 1fr 60px 70px 80px', gap:12, alignItems:'center', background: selectedCorridor.id === c.id ? T.cardHov : 'transparent', transition:'background 0.15s' }}>
                    <div style={{ fontFamily:T.mono, fontSize:11, color:T.textDim }}>{String(i+1).padStart(2,'0')}</div>
                    <div>
                      <div style={{ fontFamily:T.sans, fontSize:13, color:T.text, fontWeight:500, marginBottom:2 }}>{c.name}</div>
                      <div style={{ fontFamily:T.mono, fontSize:10, color:T.textDim }}>{c.region}</div>
                    </div>
                    <div style={{ fontFamily:T.mono, fontSize:12, color:T.textMid, textAlign:'right' }}>${c.net.toFixed(2)}</div>
                    <div style={{ fontFamily:T.mono, fontSize:12, color: c.growth >= c.plan ? T.green : T.amber, textAlign:'right' }}>{pct(c.growth)}</div>
                    <div style={{ textAlign:'right' }}><Tag label={c.status} color={statusColor(c.status)} /></div>
                  </div>
                ))}
              </div>

              {/* Selected corridor detail */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ background:T.card, border:`1px solid ${T.gold}30`, borderRadius:8, padding:20 }}>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>
                    {selectedCorridor.name} — Deep Dive
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
                    {[
                      { l:'Monthly Volume', v:`${fmtK(selectedCorridor.vol)}`, u:'transactions' },
                      { l:'Revenue / Txn', v:`$${selectedCorridor.rpm.toFixed(2)}`, u:'gross' },
                      { l:'Net / Txn', v:`$${selectedCorridor.net.toFixed(2)}`, u:'after costs' },
                      { l:'FX Spread', v:`$${selectedCorridor.fx.toFixed(2)}`, u:'per txn' },
                      { l:'Settlement Cost', v:`$${selectedCorridor.settle.toFixed(2)}`, u:'per txn' },
                      { l:'Growth vs Plan', v:`${pct(selectedCorridor.growth - selectedCorridor.plan)}`, u:'variance' },
                    ].map((m,i) => (
                      <div key={i} style={{ background:T.surface, borderRadius:6, padding:'10px 12px' }}>
                        <div style={{ fontFamily:T.mono, fontSize:9, color:T.textDim, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>{m.l}</div>
                        <div style={{ fontFamily:T.mono, fontSize:16, color:T.gold, fontWeight:500 }}>{m.v}</div>
                        <div style={{ fontFamily:T.sans, fontSize:10, color:T.textDim }}>{m.u}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:11, color:T.textMid, marginBottom:8 }}>12-Month Volume Trend</div>
                  <ResponsiveContainer width="100%" height={80}>
                    <AreaChart data={selectedCorridor.trend.map((v,i) => ({ m:MONTHS[i], v }))}>
                      <defs>
                        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={T.gold} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={T.gold} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke={T.gold} strokeWidth={2} fill="url(#cg)" dot={false} />
                      <XAxis dataKey="m" tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue waterfall bar */}
                <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>
                    Revenue Waterfall — Per Transaction
                  </div>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={[
                      { name:'Gross Fee', v:selectedCorridor.rpm, fill:T.gold },
                      { name:'FX Spread', v:selectedCorridor.fx, fill:T.teal },
                      { name:'Settle Cost', v:-selectedCorridor.settle, fill:T.red },
                      { name:'Other Cost', v:-(selectedCorridor.rpm - selectedCorridor.fx - selectedCorridor.net - selectedCorridor.settle), fill:T.amber },
                      { name:'Net Rev', v:selectedCorridor.net, fill:T.green },
                    ]} layout="vertical" margin={{ left:10, right:10 }}>
                      <XAxis type="number" tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} width={70} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="v" radius={[0,3,3,0]}>
                        {[
                          { fill:T.gold }, { fill:T.teal }, { fill:T.red }, { fill:T.amber }, { fill:T.green }
                        ].map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Growth vs Plan chart */}
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                All Corridors — Growth vs Plan
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={CORRIDORS.map(c => ({ name:c.id, actual:c.growth, plan:c.plan }))} barGap={4}>
                  <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontFamily:T.mono, fontSize:10, fill:T.textDim }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily:T.mono, fontSize:10, fill:T.textDim }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily:T.mono, fontSize:10, color:T.textDim }} />
                  <Bar dataKey="actual" name="Actual Growth" fill={T.teal} radius={[3,3,0,0]} />
                  <Bar dataKey="plan" name="Plan" fill={T.border} radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── TAB 2: USE CASES ── */}
        {tab === 'usecases' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
              {USE_CASES.map(u => (
                <div key={u.id} className="m06-card"
                  onClick={() => setSelectedUseCase(u)}
                  style={{ background:T.card, border:`1px solid ${selectedUseCase.id === u.id ? T.gold : T.border}`, borderRadius:8, padding:18, cursor:'pointer', transition:'border-color 0.15s' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div style={{ fontFamily:T.mono, fontSize:18, color:T.gold }}>{u.icon}</div>
                    <Tag label={u.status} color={u.status === 'Ahead' ? T.green : u.status === 'On Track' ? T.teal : T.red} />
                  </div>
                  <div style={{ fontFamily:T.sans, fontSize:13, color:T.text, fontWeight:500, marginBottom:6, lineHeight:1.4 }}>{u.name}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10 }}>
                    <div>
                      <div style={{ fontFamily:T.mono, fontSize:9, color:T.textDim, letterSpacing:'0.08em', textTransform:'uppercase' }}>TAM</div>
                      <div style={{ fontFamily:T.mono, fontSize:13, color:T.gold }}>{fmt(u.tam)}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily:T.mono, fontSize:9, color:T.textDim, letterSpacing:'0.08em', textTransform:'uppercase' }}>Penetration</div>
                      <div style={{ fontFamily:T.mono, fontSize:13, color:T.teal }}>{u.penetration}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {/* Adoption curve */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>
                  {selectedUseCase.name}
                </div>
                <div style={{ fontFamily:T.sans, fontSize:12, color:T.textMid, marginBottom:16, lineHeight:1.6 }}>{selectedUseCase.insight}</div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.textDim, marginBottom:8 }}>Monthly Transaction Volume (000s)</div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={selectedUseCase.monthlyVol.map((v,i) => ({ m:MONTHS[i], v }))}>
                    <defs>
                      <linearGradient id="ucg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={T.teal} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={T.teal} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="2 4" />
                    <Area type="monotone" dataKey="v" stroke={T.teal} strokeWidth={2} fill="url(#ucg)" dot={false} />
                    <XAxis dataKey="m" tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue vs target */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                  Revenue vs Target Index (100 = Plan)
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={selectedUseCase.revenueVsTarget.map((v,i) => ({ m:MONTHS[i], v, plan:100 }))}>
                    <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="2 4" />
                    <Line type="monotone" dataKey="v" stroke={T.gold} strokeWidth={2} dot={false} name="Actual" />
                    <Line type="monotone" dataKey="plan" stroke={T.border} strokeWidth={1} strokeDasharray="4 4" dot={false} name="Plan" />
                    <XAxis dataKey="m" tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} domain={[70,120]} />
                    <Tooltip content={<CustomTooltip />} />
                  </LineChart>
                </ResponsiveContainer>

                {/* Customer segment breakdown */}
                <div style={{ marginTop:16 }}>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textDim, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Customer Segment Mix</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                    {Object.entries(selectedUseCase.customers).map(([k,v]) => (
                      <div key={k} style={{ background:T.surface, borderRadius:6, padding:'8px 10px', textAlign:'center' }}>
                        <div style={{ fontFamily:T.mono, fontSize:14, color:T.teal, fontWeight:500 }}>{v}</div>
                        <div style={{ fontFamily:T.sans, fontSize:10, color:T.textDim, textTransform:'capitalize' }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* All use cases revenue vs target bar */}
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20, marginTop:20 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                Use Case Performance vs Plan — Current Month
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={USE_CASES.map(u => ({ name:u.name.split(' ').slice(0,2).join(' '), actual:u.revenueVsTarget[11], plan:100 }))} barGap={4}>
                  <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} domain={[0,130]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="actual" name="vs Plan Index" radius={[3,3,0,0]}>
                    {USE_CASES.map((u,i) => <Cell key={i} fill={u.revenueVsTarget[11] >= 100 ? T.teal : T.amber} />)}
                  </Bar>
                  <Bar dataKey="plan" name="Plan (100)" fill={T.border} radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── TAB 3: PRICING ── */}
        {tab === 'pricing' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
              <KPI label="Avg Gross Fee / Txn" value="$7.60" sub="Portfolio average" />
              <KPI label="Avg Net Rev / Txn"   value="$4.51" sub="After all costs" accent={T.teal} />
              <KPI label="Net Margin"           value="59.3%" sub="Net / Gross ratio" accent={T.green} />
              <KPI label="FX Capture Rate"      value="28.4%" sub="Of gross fee" accent={T.amber} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
              {/* Net revenue per transaction by corridor */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                  Net Revenue / Transaction by Corridor
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[...CORRIDORS].sort((a,b) => b.net - a.net).map(c => ({ name:c.id, net:c.net, fx:c.fx, settle:c.settle }))} layout="vertical">
                    <CartesianGrid horizontal={false} stroke={T.border} strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontFamily:T.mono, fontSize:9, fill:T.textDim }} axisLine={false} tickLine={false} unit="$" />
                    <YAxis type="category" dataKey="name" tick={{ fontFamily:T.mono, fontSize:10, fill:T.textDim }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="net" name="Net Rev" radius={[0,3,3,0]}>
                      {CORRIDORS.map((c,i) => <Cell key={i} fill={c.net >= 4.5 ? T.green : c.net >= 4.0 ? T.teal : T.amber} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sensitivity analysis */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                  Sensitivity Analysis — Net Revenue Impact
                </div>
                <div style={{ fontFamily:T.sans, fontSize:12, color:T.textMid, marginBottom:16 }}>
                  Impact on monthly net revenue ($M) from cost and pricing changes
                </div>
                {[
                  { scenario:'FX spread compresses -10bps',     impact:-1.8, type:'risk' },
                  { scenario:'Settlement cost +5%',              impact:-0.9, type:'risk' },
                  { scenario:'Volume +10% across all corridors', impact:+8.7, type:'opp'  },
                  { scenario:'Scheme fee +$0.25/txn',            impact:+3.2, type:'opp'  },
                  { scenario:'New corridor launch (US→CN)',       impact:+4.5, type:'opp'  },
                  { scenario:'Compliance cost +15%',             impact:-1.2, type:'risk' },
                ].map((s,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${T.border}` }}>
                    <div style={{ fontFamily:T.sans, fontSize:12, color:T.textMid, maxWidth:280 }}>{s.scenario}</div>
                    <div style={{ fontFamily:T.mono, fontSize:13, color: s.impact > 0 ? T.green : T.red, fontWeight:500, minWidth:60, textAlign:'right' }}>
                      {s.impact > 0 ? '+' : ''}{s.impact.toFixed(1)}M
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing governance scorecard */}
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                Pricing Governance Scorecard
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                      {['Corridor','Scheme Fee','FX Model','Review Status','Exception','Last Review','Next Review'].map(h => (
                        <th key={h} style={{ fontFamily:T.mono, fontSize:9, color:T.textDim, letterSpacing:'0.08em', textTransform:'uppercase', padding:'8px 12px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CORRIDORS.map((c,i) => (
                      <tr key={c.id} className="m06-row" style={{ borderBottom:`1px solid ${T.border}`, transition:'background 0.1s' }}>
                        <td style={{ padding:'10px 12px', fontFamily:T.sans, fontSize:12, color:T.text, fontWeight:500 }}>{c.name}</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:11, color:T.textMid }}>${c.rpm.toFixed(2)}</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:11, color:T.textMid }}>{c.fx > 2.0 ? 'Dynamic' : 'Fixed'}</td>
                        <td style={{ padding:'10px 12px' }}><Tag label={i < 5 ? 'Approved' : i === 5 ? 'Under Review' : 'Exception'} color={i < 5 ? T.green : i === 5 ? T.amber : T.red} /></td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:11, color: i === 6 ? T.red : T.textDim }}>{i === 6 ? '2 Open' : 'None'}</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:10, color:T.textDim }}>Q3 2025</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:10, color:T.textDim }}>Q1 2026</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: GTM ── */}
        {tab === 'gtm' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
              <KPI label="Pipeline Volume"   value={`${(pipelineVol/1000).toFixed(1)}B`} sub="Total expected monthly" />
              <KPI label="Pipeline Revenue"  value={`$${pipelineRev.toFixed(1)}M`}        sub="Weighted monthly rev" accent={T.teal} />
              <KPI label="Live Clients"      value={liveDeals}                             sub="Generating revenue" accent={T.green} />
              <KPI label="At Risk"           value={atRisk}                                sub="Deals need attention" accent={T.red} />
            </div>

            {/* Pipeline funnel */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                  Pipeline by Stage
                </div>
                {['Live','Contracting','Solutioning','Qualified','Prospect'].map(stage => {
                  const deals = PIPELINE.filter(p => p.stage === stage);
                  const rev = deals.reduce((s,p) => s+p.rev, 0);
                  const maxRev = 20;
                  return (
                    <div key={stage} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <Tag label={stage} color={stageColor(stage)} />
                          <span style={{ fontFamily:T.mono, fontSize:11, color:T.textDim }}>{deals.length} deals</span>
                        </div>
                        <span style={{ fontFamily:T.mono, fontSize:11, color:T.textMid }}>${rev.toFixed(1)}M</span>
                      </div>
                      <div style={{ height:6, background:T.surface, borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${Math.min(100,(rev/maxRev)*100)}%`, background:stageColor(stage), borderRadius:3, transition:'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Commercialization scorecard */}
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                  Commercialization Scorecard
                </div>
                {[
                  { metric:'Sales Enablement Coverage', value:'84%',  status:'green', note:'8/10 regions covered' },
                  { metric:'RFP Win Rate',               value:'62%',  status:'teal',  note:'vs 55% target' },
                  { metric:'Avg Time to Revenue',        value:'47d',  status:'amber', note:'Target: 40 days' },
                  { metric:'Partner NPS',                value:'72',   status:'green', note:'Above benchmark' },
                  { metric:'Regional Adoption Index',    value:'0.78', status:'teal',  note:'NAM leading' },
                  { metric:'Pipeline Coverage Ratio',    value:'3.2x', status:'green', note:'vs 2.5x target' },
                ].map((m,i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 60px 1fr', alignItems:'center', padding:'9px 0', borderBottom:`1px solid ${T.border}`, gap:12 }}>
                    <div style={{ fontFamily:T.sans, fontSize:12, color:T.textMid }}>{m.metric}</div>
                    <div style={{ fontFamily:T.mono, fontSize:14, color:T[m.status], fontWeight:600, textAlign:'right' }}>{m.value}</div>
                    <div style={{ fontFamily:T.sans, fontSize:11, color:T.textDim }}>{m.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline table */}
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:8, padding:20 }}>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                Active Pipeline — All Deals
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                      {['Client','Type','Use Case','Corridor','Stage','Vol (K/mo)','Rev ($M/mo)','Days in Stage','Risk'].map(h => (
                        <th key={h} style={{ fontFamily:T.mono, fontSize:9, color:T.textDim, letterSpacing:'0.06em', textTransform:'uppercase', padding:'8px 12px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PIPELINE.map((p,i) => (
                      <tr key={p.id} className="m06-pipe" style={{ borderBottom:`1px solid ${T.border}`, transition:'background 0.1s' }}>
                        <td style={{ padding:'10px 12px', fontFamily:T.sans, fontSize:12, color:T.text, fontWeight:500, whiteSpace:'nowrap' }}>{p.client}</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:10, color:T.textDim }}>{p.type}</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:10, color:T.textMid }}>{p.useCase}</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:11, color:T.gold }}>{p.corridor}</td>
                        <td style={{ padding:'10px 12px' }}><Tag label={p.stage} color={stageColor(p.stage)} /></td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:11, color:T.textMid, textAlign:'right' }}>{fmtK(p.vol)}</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:11, color:T.teal, textAlign:'right' }}>${p.rev.toFixed(1)}</td>
                        <td style={{ padding:'10px 12px', fontFamily:T.mono, fontSize:11, color: p.days > 50 ? T.red : p.days > 30 ? T.amber : T.textDim, textAlign:'right' }}>{p.days > 0 ? `${p.days}d` : '—'}</td>
                        <td style={{ padding:'10px 12px' }}><Tag label={p.risk} color={riskColor(p.risk)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ borderTop:`1px solid ${T.border}`, padding:'20px 32px', marginTop:20 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:T.mono, fontSize:10, color:T.textDim }}>
            Network Participation Economics · Model 06 · Strategic Positioning Layer · Carlos Ureña Payments Strategy
          </span>
          <span style={{ fontFamily:T.mono, fontSize:10, color:T.textDim }}>
            Synthetic data calibrated to network-scale industry ranges · carlosurena.com
          </span>
        </div>
      </div>
    </div>
  );
}
