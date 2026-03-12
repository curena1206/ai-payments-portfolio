import { Link } from 'react-router-dom'

// ── SITE DESIGN TOKENS (matching carlosurena.com) ────────────────────────────
const S = {
  maxW:    '760px',
  maxWide: '960px',
  ink:     '#1a1a1a',
  mid:     '#444444',
  dim:     '#888888',
  faint:   '#bbbbbb',
  border:  '#e4e4e0',
  bg:      '#fafaf8',
  white:   '#ffffff',
  serif:   "'EB Garamond', Georgia, serif",
  mono:    "'DM Mono', 'Courier New', monospace",
  sans:    "'DM Sans', system-ui, sans-serif",
}

// ── MODEL REGISTRY ───────────────────────────────────────────────────────────
const MODELS = [
  {
    num: '01',
    layer: 'Layer 2 — Economic Intelligence',
    name: 'Payment Profitability Engine',
    route: '/models/01-profitability',
    desc: 'Diagnoses payment P&L at transaction, client, corridor, and rail level. Identifies where margin is made and lost across the portfolio.',
    outputs: ['Margin waterfall by corridor and rail', 'Client P&L ranking with drill-down', 'Rail cost efficiency matrix', 'Exception cost attribution'],
    connection: 'Anchors the economic foundation. Every upstream model draws on its cost and margin outputs.',
  },
  {
    num: '02',
    layer: 'Layer 4 — Decision Intelligence',
    name: 'Rail Selection Optimizer',
    route: '/models/02-rail-optimizer',
    desc: 'Scores and recommends the optimal payment rail for every transaction based on cost, speed, STP rate, and client SLA requirements.',
    outputs: ['Real-time rail scoring (cost · speed · STP · finality)', 'Payment queue with optimised routing', 'Portfolio-level rail savings analysis', 'Instant rail adoption tracking'],
    connection: 'Consumes rail cost benchmarks and STP rates from Model 01.',
  },
  {
    num: '03',
    layer: 'Layer 3 — Network Intelligence',
    name: 'Cross-Border Corridor Analyzer',
    route: '/models/03-corridor-analyzer',
    desc: 'Maps the full economics of every payment corridor: fee revenue, FX spread, nostro funding cost, correspondent charges, compliance drag, and exception burden.',
    outputs: ['Full corridor P&L waterfall', 'Grow / Defend / Optimise / Exit classification', 'FX spread and nostro efficiency analysis', 'Corridor trend and strategy matrix'],
    connection: 'Feeds corridor classifications and P&L data to Models 04 and 05.',
  },
  {
    num: '04',
    layer: 'Layer 3 — Behavioral Intelligence',
    name: 'Client Payment Behavior Engine',
    route: '/models/04-client-behavior',
    desc: 'Analyses client payment patterns, rail adoption, churn risk signals, and expansion opportunity indicators across the full client base.',
    outputs: ['Churn risk scoring with driver attribution', 'Expansion opportunity pipeline', 'RM action queue — AI-prioritised interventions', 'Client relationship brief per account'],
    connection: 'Weighted by client net margin from Model 01. Corridor risk from Model 03 elevates churn flags.',
  },
  {
    num: '05',
    layer: 'Layer 5 — Strategic Optimization',
    name: 'Portfolio Strategic Scorecard',
    route: '/models/05-portfolio-scorecard',
    desc: 'Synthesises all model outputs into a single Portfolio Health Index with three-scenario modelling, board-level KPIs, and a strategic action register.',
    outputs: ['Portfolio Health Index (PHI) — composite score 0–100', 'Base / Optimised / Stress scenario modelling', 'Six-dimension radar vs industry benchmark', 'Strategic action register with value estimates'],
    connection: 'Synthesis model. Receives inputs from all four upstream models. The only model genuinely dependent on the full stack.',
  },
]

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      borderBottom: `1px solid ${S.border}`,
      padding: '0 32px',
      position: 'sticky', top: 0,
      background: S.white,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: S.maxWide, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
        <a href="https://carlosurena.com" style={{ fontFamily: S.mono, fontSize: 12, color: S.ink, letterSpacing: '0.04em', border: 'none' }}>
          Carlos Ureña
        </a>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="https://carlosurena.com" style={{ fontFamily: S.mono, fontSize: 11, color: S.dim, border: 'none', letterSpacing: '0.04em' }}>← Home</a>
          <a href="https://carlosurena.com/payments-portfolio-diagnostic/" style={{ fontFamily: S.mono, fontSize: 11, color: S.dim, border: 'none', letterSpacing: '0.04em' }}>Diagnostic</a>
          <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer" style={{ fontFamily: S.mono, fontSize: 11, color: S.dim, border: 'none', letterSpacing: '0.04em' }}>LinkedIn</a>
        </div>
      </div>
    </nav>
  )
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FrameworkIndex() {
  return (
    <div style={{ background: S.white, minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO ── */}
      <div style={{ maxWidth: S.maxW, margin: '0 auto', padding: '72px 32px 56px' }}>

        {/* Eyebrow */}
        <div style={{ fontFamily: S.mono, fontSize: 11, color: S.dim, letterSpacing: '0.06em', marginBottom: 24 }}>
          AI Payments Strategy · Framework V1 · 2025
        </div>

        <h1 style={{ fontFamily: S.serif, fontWeight: 400, fontSize: 'clamp(34px, 4vw, 50px)', lineHeight: 1.15, color: S.ink, marginBottom: 24 }}>
          AI-Powered Payments<br />Strategy Framework
        </h1>

        <div style={{ height: 1, background: S.border, marginBottom: 28 }} />

        <p style={{ fontSize: 17, color: S.mid, lineHeight: 1.8, marginBottom: 16, fontWeight: 300 }}>
          A five-model AI framework that transforms payment data into layered strategic intelligence — from transaction-level economics through behavioral signals to board-level portfolio decisions.
        </p>
        <p style={{ fontSize: 17, color: S.mid, lineHeight: 1.8, marginBottom: 0, fontWeight: 300 }}>
          Built on 20 years of payments P&L ownership across Citi, Deutsche Bank, HSBC, and Mashreq. Each model reflects how decisions are actually made inside a commercial payments franchise — not how they are reported.
        </p>
      </div>

      {/* ── ARCHITECTURE OVERVIEW ── */}
      <div style={{ maxWidth: S.maxW, margin: '0 auto', padding: '0 32px 64px' }}>

        <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
          Framework Architecture
        </div>

        {/* Layer summary — same numbered style as the Diagnostic pillars */}
        {[
          { n: '1', title: 'Payment Data Foundation', desc: 'Transaction-level data across rails, corridors, clients, pricing, and operational performance. The source layer for all models.' },
          { n: '2', title: 'Economic Intelligence', desc: 'Models that diagnose payment profitability, cost structures, and revenue leakage at transaction, client, and corridor level.' },
          { n: '3', title: 'Behavioral Intelligence', desc: 'Models that analyse client payment behavior, adoption patterns, churn signals, and corridor dynamics.' },
          { n: '4', title: 'Decision Intelligence', desc: 'Models that recommend optimal actions — payment rail selection, routing decisions, cost optimisation.' },
          { n: '5', title: 'Strategic Optimization', desc: 'Models that evaluate overall payments portfolio performance and simulate strategic scenarios for leadership.' },
        ].map((layer, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 20, padding: '20px 0', borderBottom: `1px solid ${S.border}` }}>
            <div style={{ fontFamily: S.mono, fontSize: 13, color: S.faint, paddingTop: 2 }}>0{layer.n}</div>
            <div>
              <div style={{ fontSize: 15, color: S.ink, marginBottom: 4, fontWeight: 400 }}>{layer.title}</div>
              <div style={{ fontSize: 14, color: S.dim, lineHeight: 1.65, fontWeight: 300 }}>{layer.desc}</div>
            </div>
          </div>
        ))}

        <div style={{ paddingTop: 20 }}>
          <p style={{ fontFamily: S.mono, fontSize: 11, color: S.dim, lineHeight: 1.7, letterSpacing: '0.02em' }}>
            Design principle — Each model builds on insights produced by the previous layer. They are not independent tools. Together they represent a cohesive AI-powered payments strategy system that evolves from diagnostic insight to decision support to strategic optimisation.
          </p>
        </div>
      </div>

      {/* ── MODELS ── */}
      <div style={{ borderTop: `1px solid ${S.border}`, background: S.bg }}>
        <div style={{ maxWidth: S.maxW, margin: '0 auto', padding: '64px 32px' }}>

          <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            The Models
          </div>
          <h2 style={{ fontFamily: S.serif, fontWeight: 400, fontSize: 28, color: S.ink, marginBottom: 8 }}>
            Five working prototypes
          </h2>
          <p style={{ fontSize: 14, color: S.dim, marginBottom: 48, lineHeight: 1.7, fontWeight: 300 }}>
            Each model is a fully interactive application built on synthetic data calibrated to realistic industry ranges. Click any model to open it.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MODELS.map((model, i) => (
              <ModelRow key={i} model={model} />
            ))}
          </div>
        </div>
      </div>

      {/* ── DATA FOUNDATION ── */}
      <div style={{ borderTop: `1px solid ${S.border}`, background: S.white }}>
        <div style={{ maxWidth: S.maxW, margin: '0 auto', padding: '64px 32px' }}>

          <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            Layer 1 — Data Foundation
          </div>

          <h2 style={{ fontFamily: S.serif, fontWeight: 400, fontSize: 26, color: S.ink, marginBottom: 16 }}>
            What real deployment looks like
          </h2>

          <p style={{ fontSize: 15, color: S.mid, lineHeight: 1.8, marginBottom: 20, fontWeight: 300 }}>
            All five models run on synthetic data in prototype form. The Layer 1 Data Foundation document defines exactly what a production deployment would require — the specific data fields, source systems, ingestion patterns, data quality standards, and governance model for each model.
          </p>
          <p style={{ fontSize: 15, color: S.mid, lineHeight: 1.8, marginBottom: 32, fontWeight: 300 }}>
            In a live deployment at a bank or fintech, each data field traces to a named source system — payment processing platform, FX system, nostro ledger, operations platform, CRM. The document bridges the prototype and production gap explicitly.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${S.border}` }}>
            {[
              { sys: 'Payment Processing', ex: 'Temenos, Volante, Form3, ACI UP' },
              { sys: 'Core Banking / GL', ex: 'Temenos T24, Finacle, FLEXCUBE' },
              { sys: 'FX & Treasury', ex: 'Murex, FIS Quantum, ION Treasury' },
              { sys: 'SWIFT MX / Correspondent', ex: 'SWIFT Alliance, correspondent statements' },
              { sys: 'Liquidity Management', ex: 'Finastra Fusion, proprietary systems' },
              { sys: 'CRM & Operations', ex: 'Salesforce FSC, ServiceNow, NICE Actimize' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '14px 18px',
                borderBottom: i < 4 ? `1px solid ${S.border}` : 'none',
                borderRight: i % 2 === 0 ? `1px solid ${S.border}` : 'none',
              }}>
                <div style={{ fontSize: 13, color: S.ink, marginBottom: 3, fontWeight: 400 }}>{s.sys}</div>
                <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim }}>{s.ex}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28 }}>
            <a
              href="/layer1-data-foundation.docx"
              style={{ fontFamily: S.mono, fontSize: 11, color: S.ink, letterSpacing: '0.04em', borderBottom: `1px solid ${S.border}` }}>
              ↓ Download Layer 1 Data Foundation document
            </a>
          </div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div style={{ borderTop: `1px solid ${S.border}`, background: S.bg }}>
        <div style={{ maxWidth: S.maxW, margin: '0 auto', padding: '64px 32px' }}>

          <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            About This Work
          </div>

          <p style={{ fontSize: 15, color: S.mid, lineHeight: 1.85, marginBottom: 16, fontWeight: 300 }}>
            This framework is not academic. It reflects how a senior payments executive thinks about portfolio performance — where margin is made and lost, how client behavior signals strategic risk, and how multi-rail infrastructure decisions translate into P&L outcomes.
          </p>
          <p style={{ fontSize: 15, color: S.mid, lineHeight: 1.85, marginBottom: 16, fontWeight: 300 }}>
            The models are built as practical prototypes that could realistically be deployed by a bank, fintech, or payment platform. The goal is to demonstrate how AI changes the economics of payment strategy — not to replace the operator judgment that has to sit behind it.
          </p>
          <p style={{ fontSize: 15, color: S.mid, lineHeight: 1.85, marginBottom: 0, fontWeight: 300 }}>
            The Payments Portfolio Diagnostic tool — published separately — provides the qualitative entry point. These five models provide the quantitative and predictive layer on top of it. Together they form a complete strategic advisory arc.
          </p>

          <div style={{ marginTop: 36, display: 'flex', gap: 28 }}>
            <a href="https://carlosurena.com" style={{ fontFamily: S.mono, fontSize: 11, color: S.ink, letterSpacing: '0.04em' }}>← carlosurena.com</a>
            <a href="https://carlosurena.com/payments-portfolio-diagnostic/" style={{ fontFamily: S.mono, fontSize: 11, color: S.dim, letterSpacing: '0.04em', borderBottomColor: S.border }}>Payments Portfolio Diagnostic ↗</a>
            <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer" style={{ fontFamily: S.mono, fontSize: 11, color: S.dim, letterSpacing: '0.04em', borderBottomColor: S.border }}>LinkedIn ↗</a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px solid ${S.border}`, background: S.white }}>
        <div style={{ maxWidth: S.maxW, margin: '0 auto', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: S.mono, fontSize: 10, color: S.dim }}>
            AI Payments Strategy Framework · V1 · Carlos Ureña · 2025
          </span>
          <span style={{ fontFamily: S.mono, fontSize: 10, color: S.faint }}>
            Prototype — synthetic data calibrated to realistic industry ranges
          </span>
        </div>
      </div>
    </div>
  )
}

// ── MODEL ROW COMPONENT ──────────────────────────────────────────────────────
function ModelRow({ model }) {
  return (
    <Link
      to={model.route}
      style={{
        display: 'block',
        padding: '24px 0',
        borderBottom: `1px solid ${S.border}`,
        textDecoration: 'none',
        border: 'none',
        color: 'inherit',
      }}
      onMouseEnter={e => e.currentTarget.style.background = S.bg}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 20, alignItems: 'start', padding: '0 2px' }}>

        {/* Number */}
        <div style={{ fontFamily: S.mono, fontSize: 13, color: S.faint, paddingTop: 3 }}>
          {model.num}
        </div>

        {/* Content */}
        <div>
          <div style={{ fontFamily: S.mono, fontSize: 10, color: S.dim, letterSpacing: '0.08em', marginBottom: 6 }}>
            {model.layer}
          </div>
          <div style={{ fontSize: 18, color: S.ink, fontFamily: S.serif, fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>
            {model.name}
          </div>
          <p style={{ fontSize: 14, color: S.dim, lineHeight: 1.7, marginBottom: 12, fontWeight: 300, maxWidth: 560 }}>
            {model.desc}
          </p>
          {/* Outputs — inline list */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 0' }}>
            {model.outputs.map((o, i) => (
              <span key={i} style={{ fontFamily: S.mono, fontSize: 10, color: S.dim }}>
                {o}{i < model.outputs.length - 1 ? <span style={{ color: S.faint, padding: '0 8px' }}>·</span> : null}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontFamily: S.mono, fontSize: 13, color: S.faint, paddingTop: 3 }}>
          →
        </div>
      </div>

      {/* Connection note */}
      <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 20, marginTop: 10 }}>
        <div />
        <div style={{ fontFamily: S.mono, fontSize: 10, color: S.faint, lineHeight: 1.6, letterSpacing: '0.02em' }}>
          {model.connection}
        </div>
      </div>
    </Link>
  )
}
