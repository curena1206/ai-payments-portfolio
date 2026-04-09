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
    margin: 0 0 20px;
  }
  .fi-system-statement {
    font-size: 15px;
    color: #4a5568;
    max-width: 680px;
    line-height: 1.7;
    margin: 0;
    padding: 16px 20px;
    border-left: 3px solid #b7882c;
    background: #f7f9fc;
  }
  .fi-margin-callout {
    margin: 40px 0 0;
    padding: 24px 28px;
    border: 1px solid #e2e8f0;
    border-top: 3px solid #b7882c;
    background: #fff;
  }
  .fi-margin-callout-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b7882c;
    margin-bottom: 12px;
  }
  .fi-margin-callout-intro {
    font-size: 14px;
    color: #4a5568;
    line-height: 1.65;
    margin-bottom: 14px;
  }
  .fi-margin-tier {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 8px 20px;
    margin-bottom: 8px;
    font-size: 13.5px;
  }
  .fi-margin-tier-label {
    font-weight: 600;
    color: #0f1f3d;
  }
  .fi-margin-tier-desc {
    color: #4a5568;
    line-height: 1.6;
  }
  .fi-margin-callout-footer {
    font-size: 13px;
    color: #6b7280;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #e2e8f0;
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
  .fi-model-min-data {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: #f7f9fc;
    border-left: 2px solid #e2e8f0;
  }
  .fi-model-min-data strong { color: #4a5568; }
  .fi-maturity-row {
    margin-bottom: 6px;
    font-size: 12.5px;
    line-height: 1.6;
  }
  .fi-maturity-label {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #b7882c;
    margin-bottom: 2px;
  }
  .fi-maturity-desc { color: #4a5568; }
  .fi-model-tells {
    font-size: 12.5px;
    color: #4a5568;
    line-height: 1.65;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #f3f4f6;
  }
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
    .fi-margin-tier { grid-template-columns: 200px 1fr; }
  }
`

const MODELS = [
  {
    num: '01',
    layer: 'Layer 1 — Economic Core',
    name: 'Payment Profitability Engine',
    route: '/models/01-profitability',
    desc: 'Calculates where revenue is generated and where margin is lost across clients, rails, and flows. The economic anchor of the system. Every downstream model draws on its outputs.',
    minData: 'Transaction extract with client ID, rail, destination corridor, amount, and fee charged (partial completeness is sufficient). Standard pricing schedule by rail and corridor.',
    maturity: [
      { label: 'Immediate visibility', desc: 'Revenue ranking by client, flow, and rail. Pricing exception concentration. Where the portfolio generates the most and least revenue.' },
      { label: 'Economic precision', desc: 'Margin by flow and corridor using rate-card-based cost estimates across four cost layers: network and scheme fees, correspondent and intermediary costs, liquidity and prefunding cost, and operational and exception cost. Balance sheet linkage where available.' },
      { label: 'Portfolio optimization', desc: 'True net margin at the transaction level. Full cost attribution across flows. Pricing leakage quantified as recoverable revenue.' },
    ],
    tells: 'Where revenue is made and lost. Where pricing exceptions are eroding margin silently. Which clients are under-monetized relative to internal peers on the same flow and rail. Which corridors are likely margin-negative even under conservative cost assumptions.',
    connection: '',
  },
  {
    num: '02',
    layer: 'Layer 2 — Infrastructure Intelligence',
    name: 'Rail Economics Analyzer',
    route: '/models/02-rail-optimizer',
    desc: 'Evaluates the cost, revenue, and margin contribution of each payment rail across the portfolio. Identifies where the rail mix is suboptimal and what product, pricing, or client migration strategies would improve economics.',
    minData: 'Volume and revenue by rail. Processing cost per rail — even a flat estimate. STP rate by rail where available.',
    maturity: [
      { label: 'Immediate visibility', desc: 'Revenue and volume by rail. Cost efficiency comparison across rails. Where portfolio concentration creates economic risk.' },
      { label: 'Economic precision', desc: 'Margin contribution by rail. Client segments where rail usage is economically misaligned. Where pricing adjustments would improve rail economics.' },
      { label: 'Portfolio optimization', desc: 'Rail migration strategy by client segment. Where product packaging — bundles, tiers, incentives — can shift rail behavior profitably. Where the rail mix can be influenced through pricing, product design, and client engagement.' },
    ],
    tells: 'Which rails are generating margin and which are not. Where pricing adjustments would improve rail economics. Quantifies the economic impact of shifting volume across rails at the portfolio and client segment level. This is a portfolio-level strategic tool, not a real-time routing system.',
    connection: 'Consumes rail cost benchmarks and STP rates from Model 01.',
  },
  {
    num: '03',
    layer: 'Layer 3 — Network Intelligence',
    name: 'Payment Flow & Corridor Analyzer',
    route: '/models/03-corridor-analyzer',
    desc: 'Maps the economics of payment flows, including corridor-level performance where relevant, comparing revenue against estimated cost and classifying each into four strategic categories: Grow, Defend, Optimize, or De-prioritize.',
    minData: 'Volume and revenue by corridor. Average cost estimate per corridor — derived from correspondent fee schedules, GL entries, or SWIFT benchmarks where formal claims data is unavailable.',
    maturity: [
      { label: 'Immediate visibility', desc: 'Corridor classification by revenue and volume. Which corridors are building the franchise and which are diluting it directionally.' },
      { label: 'Economic precision', desc: 'Corridor margin waterfall across four cost layers: network and scheme fees, correspondent and intermediary costs, liquidity and prefunding cost, and operational and exception cost. FX spread capture analysis by corridor.' },
      { label: 'Portfolio optimization', desc: 'Full corridor profitability with repricing recommendations. Minimum pricing thresholds by corridor to prevent structurally loss-making flows. Corridor de-prioritization and investment decisions supported by margin modeling. Correspondent relationship rationalization opportunities.' },
    ],
    tells: 'Which payment flows are margin-positive and which are margin-negative after cost allocation, even using estimated costs. Flows that appear profitable on revenue but are likely loss-making once the full cost stack is applied. That finding is actionable without perfect data.',
    connection: 'Feeds corridor classifications and margin data to Models 04 and 05.',
  },
  {
    num: '04',
    layer: 'Layer 4 — Behavioral Intelligence',
    name: 'Client Payment Behavior Engine',
    route: '/models/04-client-behavior',
    desc: 'Identifies where client behavior is driving margin risk, pricing leakage, or revenue opportunity across the portfolio.',
    minData: 'Transaction history by client over 12 to 24 months. Rail and corridor usage by client.',
    maturity: [
      { label: 'Immediate visibility', desc: 'Client growth and decline patterns. Rail and corridor concentration risk. Early signals of volume migration away from the bank.' },
      { label: 'Economic precision', desc: 'Under-monetized clients identified by comparing revenue per payment against internal peer groups on the same flow and rail — no external benchmarks required. Pricing inconsistencies across similar client profiles. Early indicators of pricing leakage at the client level.' },
      { label: 'Portfolio optimization', desc: 'Estimated revenue at risk combining volume decline, pricing compression, and concentration signals. Outputs structured for relationship manager action — identifying which clients require repricing, migration, or retention intervention, and the associated revenue impact.' },
    ],
    tells: 'Where client relationships are deepening, where they are stable, and where volume is migrating. The model quantifies the signal. The relationship explains the cause.',
    connection: 'Weighted by client net margin from Model 01. Corridor risk from Model 03 elevates migration flags.',
  },
  {
    num: '05',
    layer: 'Layer 5 — Executive Decision Layer',
    name: 'Payments Portfolio Decision Engine',
    route: '/models/05-portfolio-scorecard',
    desc: 'Synthesizes all upstream model outputs into a single portfolio health view and translates that view into ranked, sequenced interventions with estimated revenue impact. This is where analysis translates into prioritized economic action.',
    minData: 'Outputs from Models 01 through 04 at whatever maturity level is available. Management targets and KPIs where accessible.',
    maturity: [
      { label: 'Visibility', desc: 'Consolidated portfolio view across six dimensions: pricing governance, rail economics, corridor profitability, client retention risk, revenue concentration, and operational drag. Identification of where the most significant issues exist.' },
      { label: 'Prioritization', desc: 'Issues ranked by revenue impact and intervention complexity. Top actions with estimated revenue uplift, time to impact, and execution difficulty. Portfolio health index — a composite view translating multiple KPIs into a single economic signal — scored across all six dimensions with transparent methodology.' },
      { label: 'Scenario and trade-off', desc: 'Three scenario models: base case if nothing changes, optimized if priority interventions are implemented, and stress case under adverse flow or pricing conditions. Trade-off analysis across competing interventions.' },
    ],
    tells: 'Not just where the problems are — but which ones to fix first, in what sequence, and what the revenue impact of each intervention is. Executives do not fund diagnostics. They fund ranked interventions with clear economic outcomes.',
    connection: 'Synthesis layer. Receives inputs from all four upstream models.',
  },
  {
    num: '06',
    layer: 'Layer 6 — Strategic Positioning Layer',
    name: 'Network Participation Economics',
    route: '/models/06-money-movement',
    desc: 'Evaluates the bank\'s participation economics across push payment networks — RTP, FedNow, Visa Direct, Mastercard Move — assessing whether volume, pricing, and corridor coverage are generating adequate return on infrastructure investment.',
    minData: 'Volume and revenue by network. Network participation costs — membership, settlement, connectivity. Internal processing cost per network transaction.',
    maturity: [
      { label: 'Immediate visibility', desc: 'Revenue versus cost by network. Which networks are generating positive economics at current volumes.' },
      { label: 'Economic precision', desc: 'Margin trajectory by network as volume scales, including estimated breakeven thresholds and time to profitability. Pricing leverage points where fee adjustments would materially change network economics. Flow coverage gaps where participation is incomplete.' },
      { label: 'Portfolio optimization', desc: 'Each network classified by strategic role: Core profit driver, Strategic enabler, Defensive necessity, or Value-destructive. Investment and exit decisions supported by margin modeling and strategic positioning analysis, supporting capital allocation and investment prioritization decisions.' },
    ],
    tells: 'Whether each network justifies its infrastructure investment — and whether that participation is a profit driver, a strategic entry point, a competitive defense, or a value drain. RTP may be loss-making today but protecting the deposit franchise. This model makes that trade-off explicit and quantifiable.',
    connection: 'Extends the economic framework to network participation decisions.',
  },
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
          <div className="fi-eyebrow">Payments Strategy Analytics · V1 · 2025</div>
          <h1 className="fi-h1">Payments Portfolio<br />Management System</h1>
          <p className="fi-hero-sub">A six-model system for managing payments portfolio economics — from transaction-level profitability through client behavior signals to executive decision support. Built on 20 years in payments across Citi, Deutsche Bank, HSBC, and Mashreq, including direct P&amp;L leadership in wire and cross-border businesses.</p>
          <div className="fi-system-statement">
            In most payments businesses, economic decisions are constrained by fragmented data.

This system generates decision-grade insight immediately and increases precision as data improves.

It does not replace reporting. It translates it into economic decisions.
          </div>

          <div className="fi-margin-callout">
            <div className="fi-margin-callout-label">Economic Measurement Framework</div>
            <p className="fi-margin-callout-intro">Payments portfolio economics are measured across three levels, depending on data availability and decision context:</p>
            <div className="fi-margin-tier">
              <div className="fi-margin-tier-label">Contribution margin</div>
              <div className="fi-margin-tier-desc">Transaction-level economics including pricing, network, and processing cost</div>
            </div>
            <div className="fi-margin-tier">
              <div className="fi-margin-tier-label">Liquidity-adjusted margin</div>
              <div className="fi-margin-tier-desc">Contribution margin plus balance sheet impact, including prefunding, nostro balances, and NII contribution</div>
            </div>
            <div className="fi-margin-tier">
              <div className="fi-margin-tier-label">Fully loaded margin</div>
              <div className="fi-margin-tier-desc">Liquidity-adjusted margin plus operational and exception cost</div>
            </div>
            <div className="fi-margin-callout-footer">The system surfaces insight at each level, and increases precision as cost and balance sheet data mature.</div>
          </div>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">System Architecture</div>
          {[
            {n:'1', title:'Payment Data Foundation', desc:'Transaction-level data across rails, corridors, clients, pricing, and operational performance. Source layer for all models.'},
            {n:'2', title:'Economic Core', desc:'The profitability engine that calculates revenue and margin at the client, rail, and corridor level. The anchor for all downstream analysis.'},
            {n:'3', title:'Infrastructure Intelligence', desc:'Rail economics analysis — where the rail mix is suboptimal, what the margin impact is, and what product, pricing, or migration strategy would improve it.'},
            {n:'4', title:'Network and Behavioral Intelligence', desc:'Models that map corridor economics, analyze client payment behavior, and surface migration risk and monetization gaps across the portfolio.'},
            {n:'5', title:'Executive Decision Layer', desc:'Portfolio synthesis that translates all upstream outputs into ranked interventions with estimated revenue impact. Where analysis translates into prioritized economic action.'},
            {n:'6', title:'Strategic Positioning Layer', desc:'Network participation economics — evaluating whether each network the bank participates in justifies its infrastructure investment and classifying each by strategic role.'},
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
          <div className="fi-section-label">The Six Models</div>
          <div className="fi-grid">
            {MODELS.map((m,i) => (
              <Link key={i} to={m.route} className="fi-model-card">
                <div className="fi-model-num">{m.num}</div>
                <div className="fi-model-layer">{m.layer}</div>
                <div className="fi-model-name">{m.name}</div>
                <div className="fi-model-desc">{m.desc}</div>
                <div className="fi-model-min-data"><strong>Minimum data:</strong> {m.minData}</div>
                {m.maturity.map((t,j) => (
                  <div key={j} className="fi-maturity-row">
                    <div className="fi-maturity-label">{t.label}</div>
                    <div className="fi-maturity-desc">{t.desc}</div>
                  </div>
                ))}
                <div className="fi-model-tells">{m.tells}</div>
                <div className="fi-model-connection">{m.connection}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">Layer 1 — Data Foundation</div>
          <h2 className="fi-h2">What real deployment looks like</h2>
          <p className="fi-p">This system runs on existing bank infrastructure and does not require new systems. Data requirements are incremental, not all-or-nothing.</p>
          <p className="fi-p">All six models run on synthetic data in prototype form. A production deployment would require field-level data from the source systems below — with defined ingestion patterns, data quality standards, and governance ownership for each. Models 01–05 draw on bank-side source systems. Model 06 additionally requires network-side data: scheme transaction logs, corridor settlement records, and network participation cost data.</p>
          <div className="fi-source-grid">
            {[
              {sys:'Payment Processing', ex:'Temenos, Volante, Form3, ACI UP'},
              {sys:'Core Banking / GL', ex:'Temenos T24, Finacle, FLEXCUBE'},
              {sys:'FX & Treasury', ex:'Murex, FIS Quantum, ION Treasury'},
              {sys:'SWIFT MX / Correspondent', ex:'SWIFT Alliance, correspondent statements'},
              {sys:'Liquidity Management', ex:'Finastra Fusion, proprietary systems'},
              {sys:'CRM & Operations', ex:'Salesforce FSC, ServiceNow, NICE Actimize'},
              {sys:'Network Scheme Data', ex:'RTP, FedNow, Visa Direct, Mastercard Move'},
              {sys:'Pricing & Exception Data', ex:'Internal pricing systems, exception logs'},
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
          <p className="fi-p">This system reflects how a senior payments executive thinks about portfolio performance — where margin is made and lost, how client behavior signals strategic risk, and how multi-rail infrastructure decisions translate into P&amp;L outcomes.</p>
          <p className="fi-p">The system is designed to work with available data. It does not require a data warehouse project or systems integration to produce useful findings. The first output is directional. Precision compounds as data quality improves.</p>
          <p className="fi-p">The Payments Portfolio Diagnostic — published separately — provides the qualitative entry point. Together they form a complete framework: one that diagnoses the franchise, the other that quantifies it.</p>
          <div className="fi-links">
            <a href="https://carlosurena.com">&#8592; carlosurena.com</a>
            <a href="https://carlosurena.com/payments-portfolio-diagnostic/">Payments Portfolio Diagnostic &#8599;</a>
            <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer">LinkedIn &#8599;</a>
          </div>
        </div>

        <footer className="fi-footer">
          <span>Payments Portfolio Management System · V1 · Carlos Ure&#241;a · 2025</span>
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
