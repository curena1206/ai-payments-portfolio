import { Link } from 'react-router-dom'

const S = {
  maxW:    '760px',
  maxWide: '960px',
  navy:    '#0f1f3d',
  gold:    '#C9A84C',
  ink:     '#1a2332',
  mid:     '#4a5568',
  dim:     '#6b7280',
  faint:   '#9ca3af',
  border:  '#e2e8f0',
  bg:      '#f7f9fc',
  white:   '#ffffff',
  serif:   'Georgia, serif',
  mono:    "'IBM Plex Mono', 'Courier New', monospace",
  sans:    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');
  .fi-root {
    margin: 0;
    font-family: ${S.sans};
    font-size: 15px;
    line-height: 1.6;
    color: ${S.ink};
    background: ${S.white};
  }
  .fi-root *, .fi-root *::before, .fi-root *::after { box-sizing: border-box; }
  .fi-root p { color: ${S.mid}; }
  .fi-nav {
    background: #0f1f3d;
    border-bottom: 2px solid #b7882c;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .fi-nav-name {
    font-family: Georgia, serif;
    font-size: 14px;
    font-weight: 400;
    color: #fff !important;
    letter-spacing: 0.01em;
    text-decoration: none !important;
  }
  .fi-nav-links { display: flex; gap: 24px; }
  .fi-nav-links a {
    font-size: 13px;
    color: rgba(255,255,255,0.75) !important;
    text-decoration: none !important;
    letter-spacing: 0.02em;
    transition: color 0.15s;
  }
  .fi-nav-links a:hover { color: #b7882c !important; }
  .fi-nav-links a.active { color: #b7882c !important; }
  .fi-wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 56px 24px 72px;
  }
  .fi-hero {
    padding-bottom: 40px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 48px;
  }
  .fi-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b7882c;
    margin-bottom: 12px;
  }
  .fi-h1 {
    font-family: Georgia, serif;
    font-size: 38px;
    font-weight: normal;
    color: #0f1f3d;
    margin: 0 0 16px;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }
  .fi-hero-sub {
    font-size: 16px;
    color: #4a5568;
    max-width: 680px;
    line-height: 1.65;
    margin: 0;
  }
  .fi-section-block { margin-bottom: 48px; }
  .fi-section-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b7882c;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .fi-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  .fi-h2 {
    font-family: Georgia, serif;
    font-size: 22px;
    font-weight: normal;
    color: #0f1f3d;
    margin: 0 0 14px;
  }
  .fi-p { margin: 0 0 12px; color: #4a5568; }
  .fi-p:last-child { margin-bottom: 0; }
  .fi-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .fi-model-card {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 20px 22px;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    text-decoration: none !important;
    color: inherit;
    display: block;
  }
  .fi-model-card:hover {
    border-color: #b7882c;
    box-shadow: 0 4px 16px rgba(15,31,61,0.10);
  }
  .fi-model-num {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b7882c;
    margin-bottom: 4px;
  }
  .fi-model-layer {
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 6px;
    letter-spacing: 0.03em;
  }
  .fi-model-name {
    font-family: Georgia, serif;
    font-size: 18px;
    font-weight: normal;
    color: #0f1f3d;
    margin-bottom: 8px;
  }
  .fi-model-desc { font-size: 13.5px; color: #4a5568; line-height: 1.65; margin-bottom: 10px; }
  .fi-model-outputs { font-size: 12px; color: #6b7280; line-height: 1.6; }
  .fi-model-connection {
    font-size: 11.5px;
    color: #9ca3af;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #f3f4f6;
    line-height: 1.55;
  }
  .fi-model-network {
    display: inline-block;
    margin-top: 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #b7882c;
    background: rgba(183,136,44,0.08);
    border: 1px solid rgba(183,136,44,0.3);
    border-radius: 4px;
    padding: 2px 8px;
  }
  .fi-arch-row {
    display: grid;
    grid-template-columns: 36px 1fr;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  .fi-arch-num {
    font-family: Georgia, serif;
    font-size: 18px;
    font-weight: normal;
    color: #b7882c;
    padding-top: 1px;
  }
  .fi-arch-title { font-size: 14px; font-weight: 600; color: #1a2332; margin-bottom: 3px; }
  .fi-arch-desc { font-size: 13.5px; color: #4a5568; line-height: 1.6; }
  .fi-source-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 16px;
  }
  .fi-source-cell {
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
  }
  .fi-source-cell:nth-child(even) { border-right: none; }
  .fi-source-cell:nth-last-child(-n+2) { border-bottom: none; }
  .fi-source-name { font-size: 13px; font-weight: 600; color: #1a2332; margin-bottom: 2px; }
  .fi-source-ex { font-size: 11.5px; color: #6b7280; }
  .fi-links { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 20px; }
  .fi-links a {
    font-size: 13.5px;
    color: #0f1f3d;
    text-decoration: none !important;
    border-bottom: 1px solid #b7882c;
    padding-bottom: 1px;
    transition: color 0.15s;
  }
  .fi-links a:hover { color: #b7882c; }
  .fi-footer {
    margin-top: 56px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
    font-size: 12.5px;
    color: #6b7280;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  @media (min-width: 640px) {
    .fi-grid { grid-template-columns: 1fr 1fr; }
    .fi-h1 { font-size: 44px; }
  }
`

const MODELS = [
  { num:'01', layer:'Layer 2 — Economic Intelligence', name:'Payment Profitability Engine', route:'/models/01-profitability', desc:'Diagnoses payment P&L at transaction, client, corridor, and rail level. Identifies where margin is made and lost across the portfolio.', outputs:'Margin waterfall · Client P&L ranking · Rail cost efficiency matrix · Exception cost attribution', connection:'Anchors the economic foundation. Every upstream model draws on its cost and margin outputs.' },
  { num:'02', layer:'Layer 4 — Decision Intelligence', name:'Rail Selection Optimizer', route:'/models/02-rail-optimizer', desc:'Scores and recommends the optimal payment rail for every transaction based on cost, speed, STP rate, and client SLA requirements.', outputs:'Rail scoring (cost · speed · STP · finality) · Payment queue · Rail savings analysis · Instant rail adoption', connection:'Consumes rail cost benchmarks and STP rates from Model 01.' },
  { num:'03', layer:'Layer 3 — Network Intelligence', name:'Cross-Border Corridor Analyzer', route:'/models/03-corridor-analyzer', desc:'Maps the full economics of every payment corridor: fee revenue, FX spread, nostro funding cost, correspondent charges, compliance drag, and exception burden.', outputs:'Corridor P&L waterfall · Grow / Defend / Optimise / Exit classification · FX spread analysis · Strategy matrix', connection:'Feeds corridor classifications and P&L data to Models 04 and 05.' },
  { num:'04', layer:'Layer 3 — Behavioral Intelligence', name:'Client Payment Behavior Engine', route:'/models/04-client-behavior', desc:'Analyses client payment patterns, rail adoption, churn risk signals, and expansion opportunity indicators across the full client base.', outputs:'Churn risk scoring · Expansion opportunity pipeline · RM action queue · Client relationship briefs', connection:'Weighted by client net margin from Model 01. Corridor risk from Model 03 elevates churn flags.' },
  { num:'05', layer:'Layer 5 — Strategic Optimization', name:'Portfolio Strategic Scorecard', route:'/models/05-portfolio-scorecard', desc:'Synthesises all model outputs into a single Portfolio Health Index with three-scenario modelling, board-level KPIs, and a strategic action register.', outputs:'Portfolio Health Index (PHI) · Base / Optimised / Stress scenarios · Six-dimension radar · Action register', connection:'Synthesis model. Receives inputs from all four upstream models.' },
  { num:'06', layer:'Layer 4–5 — Network & Commercialization Intelligence', name:'Money Movement Commercialization Engine', route:'/models/06-money-movement', desc:'Network-scale commercialization intelligence across corridors, use cases, transaction economics, and GTM pipeline — built for Mastercard Move and Visa Direct operators.', outputs:'Corridor revenue & growth vs plan · Use case adoption curves · Transaction economics · GTM pipeline scorecard', connection:'Network counterpart to Models 01–05. Where the bank models diagnose the franchise from inside, this model tracks commercialization from the network side.', network:true },
]

export default function FrameworkIndex() {
  return (
    <div className="fi-root">
      <style>{css}</style>

      <nav className="fi-nav">
        <a href="https://carlosurena.com" className="fi-nav-name">Carlos Ure&#241;a</a>
        <div className="fi-nav-links">
          <a href="https://carlosurena.com">Home</a>
          <a href="https://carlosurena.com/payments-portfolio-diagnostic/">Diagnostic</a>
          <a href="https://models.carlosurena.com" className="active" style={{color:'#b7882c'}}>Analytics</a>
          <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </nav>

      <main className="fi-wrap">

        <div className="fi-hero">
          <div className="fi-eyebrow">Payments Strategy Analytics · Framework V1 · 2025</div>
          <h1 className="fi-h1">Payments Strategy<br />Analytics Framework</h1>
          <p className="fi-hero-sub">A six-model analytical framework that transforms payment data into layered strategic intelligence — from transaction-level economics through behavioral signals to board-level portfolio decisions and network-scale commercialization. Built on 20 years of payments P&amp;L ownership across Citi, Deutsche Bank, HSBC, and Mashreq.</p>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">Framework Architecture</div>
          {[
            {n:'1', title:'Payment Data Foundation', desc:'Transaction-level data across rails, corridors, clients, pricing, and operational performance. The source layer for all models.'},
            {n:'2', title:'Economic Intelligence', desc:'Models that diagnose payment profitability, cost structures, and revenue leakage at transaction, client, and corridor level.'},
            {n:'3', title:'Behavioral & Network Intelligence', desc:'Models that analyse client payment behavior, adoption patterns, churn signals, corridor dynamics, and cross-border corridor economics.'},
            {n:'4', title:'Decision Intelligence', desc:'Models that recommend optimal actions — payment rail selection, routing decisions, cost optimisation, and network commercialization strategy.'},
            {n:'5', title:'Strategic Optimization', desc:'Models that evaluate overall portfolio performance, simulate strategic scenarios for leadership, and track GTM pipeline at network scale.'},
            {n:'6', title:'Network Commercialization', desc:'Model 06 extends the framework to the network perspective — tracking how Mastercard Move and Visa Direct operators commercialize across corridors, use cases, and partner pipelines.'},
          ].map((l,i) => (
            <div key={i} className="fi-arch-row">
              <div className="fi-arch-num">0{l.n}</div>
              <div>
                <div className="fi-arch-title">{l.title}</div>
                <div className="fi-arch-desc">{l.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">The Analytical Models</div>
          <div className="fi-grid">
            {MODELS.map((m,i) => (
              <Link key={i} to={m.route} className="fi-model-card">
                <div className="fi-model-num">{m.num}</div>
                <div className="fi-model-layer">{m.layer}</div>
                <div className="fi-model-name">{m.name}</div>
                <div className="fi-model-desc">{m.desc}</div>
                <div className="fi-model-outputs">{m.outputs}</div>
                <div className="fi-model-connection">{m.connection}</div>
                {m.network && <div className="fi-model-network">Network Model — Mastercard Move · Visa Direct</div>}
              </Link>
            ))}
          </div>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">Layer 1 — Data Foundation</div>
          <h2 className="fi-h2">What real deployment looks like</h2>
          <p className="fi-p">All six models run on synthetic data in prototype form. A production deployment would require field-level data from the source systems below — with defined ingestion patterns, data quality standards, and governance ownership for each. Models 01–05 draw on bank-side source systems. Model 06 additionally requires network-side data: scheme transaction logs, corridor settlement records, partner onboarding systems, and GTM pipeline data.</p>
          <div className="fi-source-grid">
            {[
              {sys:'Payment Processing', ex:'Temenos, Volante, Form3, ACI UP'},
              {sys:'Core Banking / GL', ex:'Temenos T24, Finacle, FLEXCUBE'},
              {sys:'FX & Treasury', ex:'Murex, FIS Quantum, ION Treasury'},
              {sys:'SWIFT MX / Correspondent', ex:'SWIFT Alliance, correspondent statements'},
              {sys:'Liquidity Management', ex:'Finastra Fusion, proprietary systems'},
              {sys:'CRM & Operations', ex:'Salesforce FSC, ServiceNow, NICE Actimize'},
              {sys:'Network Scheme Data', ex:'Mastercard Move APIs, Visa Direct transaction logs'},
              {sys:'GTM Pipeline', ex:'Salesforce CRM, partner onboarding platforms'},
            ].map((s,i) => (
              <div key={i} className="fi-source-cell">
                <div className="fi-source-name">{s.sys}</div>
                <div className="fi-source-ex">{s.ex}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">About This Work</div>
          <p className="fi-p">This framework reflects how a senior payments executive thinks about portfolio performance — where margin is made and lost, how client behavior signals strategic risk, and how multi-rail infrastructure decisions translate into P&amp;L outcomes.</p>
          <p className="fi-p">Models 01–05 are built from the bank operator perspective. Model 06 extends the framework to the network side — tracking how Mastercard Move and Visa Direct operators commercialize into those same banks. Together the six models represent both sides of the transaction.</p>
          <p className="fi-p">The Payments Portfolio Diagnostic — published separately — provides the qualitative entry point. Together they form a complete strategic framework: one that diagnoses the franchise, the other that quantifies it.</p>
          <div className="fi-links">
            <a href="https://carlosurena.com">&#8592; carlosurena.com</a>
            <a href="https://carlosurena.com/payments-portfolio-diagnostic/">Payments Portfolio Diagnostic &#8599;</a>
            <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer">LinkedIn &#8599;</a>
          </div>
        </div>

        <footer className="fi-footer">
          <span>Payments Strategy Analytics Framework · V1 · Carlos Ure&#241;a · 2025</span>
          <span>Synthetic data calibrated to realistic industry ranges</span>
        </footer>

      </main>
    </div>
  )
}

export function ModelBackBar() {
  return (
    <div style={{
      background: '#0f1f3d',
      borderBottom: '2px solid #b7882c',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 48,
      position: 'sticky',
      top: 0,
      zIndex: 200,
    }}>
      <Link to="/"
        style={{ fontFamily:'Georgia, serif', fontSize:14, color:'rgba(255,255,255,0.75)', textDecoration:'none', letterSpacing:'0.01em', border:'none' }}
        onMouseEnter={e => e.currentTarget.style.color = '#b7882c'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
      >
        &#8592; All Models
      </Link>
      <a href="https://carlosurena.com"
        style={{ fontFamily:'Georgia, serif', fontSize:14, color:'rgba(255,255,255,0.4)', textDecoration:'none', border:'none', letterSpacing:'0.01em' }}
      >
        carlosurena.com
      </a>
    </div>
  )
}