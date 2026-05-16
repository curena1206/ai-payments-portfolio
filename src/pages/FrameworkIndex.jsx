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
    font-family: Georgia, serif;
    font-size: 17px;
    line-height: 1.6;
    color: ${S.ink};
    background: ${S.white};
  }
  .fi-root *, .fi-root *::before, .fi-root *::after { box-sizing: border-box; }
  .fi-root p { color: ${S.mid}; font-family: Georgia, serif; font-size: 17px; }
  .fi-nav {
    background: #0f1f3d;
    border-bottom: 3px solid #b7882c;
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
    max-width: 1100px;
    margin: 0 auto;
    padding: 56px 28px 72px;
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
    font-size: 32px;
    font-weight: normal;
    color: #0f1f3d;
    margin: 0 0 16px;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }
  .fi-hero-sub {
    font-size: 17px;
    color: #4a5568;
    line-height: 1.65;
    margin: 0 0 20px;
  }
  .fi-system-statement {
    font-size: 17px;
    color: #4a5568;
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
    font-size: 13px;
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
    font-size: 11.5px;
    color: #9ca3af;
    line-height: 1.6;
    margin-bottom: 12px;
    padding: 6px 10px;
    background: #fafbfc;
    border-left: 1px solid #e2e8f0;
  }
  .fi-model-min-data strong { color: #6b7280; }
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
    margin-top: 0;
  }
  @media (min-width: 640px) {
    .fi-grid { grid-template-columns: 1fr 1fr; }
    .fi-h1 { font-size: 32px; }
    .fi-margin-tier { grid-template-columns: 200px 1fr; }
  }
`

const MODELS = [
  {
    num: '01',
    group: 'Revenue Layer',
    layer: 'Layer 1 — Economic Core',
    name: 'Payment Profitability Engine',
    route: '/models/01-profitability',
    desc: 'Evaluates how pricing structure and transaction economics evolve across clients, rails, and payment flows over time. Applies across domestic and cross-border payment activity.',
    reveals: 'Where pricing discipline and transaction economics may no longer be evolving consistently across the portfolio.',
    usedIn: 'Diagnostic outputs · PFI scoring',
  },
  {
    num: '02',
    group: 'Cost & Processing Layer',
    layer: 'Layer 2 — Infrastructure Intelligence',
    name: 'Rail Economics Analyzer',
    route: '/models/02-rail-optimizer',
    desc: 'Maps how transactions move across rails, including routing decisions, cost layers, and execution patterns by volume and flow type. Optimizes routing decisions across all payment types (ACH, wires, RTP, cross-border).',
    reveals: 'Which routing structures may be operationally efficient and which may warrant deeper economic or servicing review.',
    usedIn: 'Diagnostic outputs · PFI scoring',
  },
  {
    num: '03',
    group: 'Cost & Processing Layer',
    layer: 'Layer 3 — Flow Intelligence',
    name: 'Payment Flow Analyzer',
    route: '/models/03-corridor-analyzer',
    desc: 'This model applies to all payment flows. Cross-border is one instance within a broader flow-level operating structure. Evaluates how network, funding, compliance, servicing, and operational layers interact across payment flows and client structures.',
    reveals: 'which payment flows may warrant deeper review once servicing structure, operational complexity, and flow characteristics are evaluated together.',
    usedIn: 'Diagnostic outputs',
  },
  {
    num: '04',
    group: 'Balance Sheet Layer',
    layer: 'Layer 4 — Behavioral Intelligence',
    name: 'Client Payment Behavior Engine',
    route: '/models/04-client-behavior',
    desc: 'Analyzes how client behavior, including volume patterns, rail usage, and pricing compliance, drives margin outcomes across the portfolio. Applies across domestic, real-time, and cross-border payment flows.',
    reveals: 'Where client behavior, pricing structure, or servicing patterns may be contributing to uneven portfolio conditions.',
    usedIn: 'PFI scoring · Prioritization logic',
  },
  {
    num: '05',
    group: 'Optimization Layer',
    layer: 'Layer 5 — Executive Decision Layer',
    name: 'Payments Portfolio Decision Engine',
    route: '/models/05-portfolio-scorecard',
    desc: 'Synthesizes outputs from all upstream models into a prioritized management review framework. Applies across payment types, servicing models, and flow structures.',
    reveals: 'Which areas may warrant management attention first based on operating maturity, servicing complexity, and portfolio coordination.',
    usedIn: 'Prioritization logic · 90-day roadmap',
  },
  {
    num: '06',
    group: 'Optimization Layer',
    layer: 'Layer 6 — Strategic Positioning Layer',
    name: 'Network Participation Economics',
    route: '/models/06-money-movement',
    desc: 'Evaluates how payment network participation aligns with servicing requirements, infrastructure complexity, liquidity structure, and portfolio strategy across the franchise.',
    reveals: 'Which network relationships appear strategically aligned and which may warrant deeper operational or economic review.',
    usedIn: 'Diagnostic outputs · Prioritization logic',
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
          <a href="https://carlosurena.com/consulting.html">Diagnostic</a>
          <a href="https://carlosurena.com/pfi.html">PFI</a>
          <a href="https://models.carlosurena.com" className="active" style={{color:'#b7882c'}}>Models</a>
          <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </nav>

      <main className="fi-wrap">

        <div className="fi-hero">
          <div className="fi-eyebrow">Payments Strategy Analytics</div>
          <h1 className="fi-h1">Payment franchises cannot be understood through a single metric. They are shaped by how pricing, governance, servicing, liquidity, routing, and portfolio management interact over time.</h1>
          <p className="fi-hero-sub">Each model evaluates a different dimension of the franchise. Together, they help explain how portfolio conditions evolve across flows, clients, rails, and servicing structures.</p>
          <div className="fi-system-statement">
            No single model explains how a payments franchise operates. Each evaluates a different layer: pricing discipline, flow behavior, cost structure, infrastructure coordination, servicing complexity, and portfolio management. Together, they help interpret where operating maturity and portfolio alignment may require deeper review.
          </div>
          <p className="fi-hero-sub" style={{borderLeft:'3px solid #b7882c',paddingLeft:'16px',marginTop:'16px',fontStyle:'normal'}}><strong>Operating patterns become easier to interpret. Areas of portfolio pressure become easier to evaluate before they compound.</strong></p>

          <div className="fi-margin-callout">
            <div className="fi-margin-callout-label">How portfolio conditions are evaluated</div>
            <p className="fi-margin-callout-intro">Portfolio conditions can be evaluated at multiple levels depending on the depth and quality of operational, servicing, liquidity, and cost data available:</p>
            <div className="fi-margin-tier">
              <div className="fi-margin-tier-label">Transaction-level economics</div>
              <div className="fi-margin-tier-desc">Directional evaluation of pricing structure, network cost, and processing economics at the transaction level</div>
            </div>
            <div className="fi-margin-tier">
              <div className="fi-margin-tier-label">Liquidity-adjusted margin</div>
              <div className="fi-margin-tier-desc">Evaluation of transaction economics alongside funding usage, liquidity structure, and balance sheet interaction where visibility exists</div>
            </div>
            <div className="fi-margin-tier">
              <div className="fi-margin-tier-label">Fully loaded margin</div>
              <div className="fi-margin-tier-desc">Broader operational view incorporating servicing complexity, exception intensity, and operational support structure</div>
            </div>
            <div className="fi-margin-callout-footer">Interpretive depth increases as operational visibility, servicing data, and balance sheet attribution become more mature.</div>
          </div>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">How it works</div>
          <p className="fi-p">The franchise is evaluated across six interconnected operating dimensions.</p>
          <p className="fi-p">Each model evaluates a different portfolio pattern, management condition, or servicing dynamic that may warrant deeper review.</p>
          <p className="fi-p">Outputs are synthesized into a single portfolio view with prioritized management considerations and areas requiring further analysis.</p>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">The Six Models</div>
          <div className="fi-grid">
            {MODELS.map((m,i) => (
              <Link key={i} to={m.route} className="fi-model-card">
                <div className="fi-model-num">{m.num}</div>
                <div className="fi-model-layer" style={{fontSize:'10.5px',color:'#9ca3af',letterSpacing:'0.03em'}}>{m.layer}</div>
                <div className="fi-model-name">{m.name}</div>
                <div className="fi-model-desc">{m.desc}</div>
                <div style={{marginTop:'10px',paddingTop:'10px',borderTop:'1px solid #e2e8f0'}}>
                  <div style={{fontFamily:'Georgia,serif',fontSize:'10px',fontWeight:'bold',letterSpacing:'0.08em',textTransform:'uppercase',color:'#b7882c',marginBottom:'4px'}}>Reveals</div>
                  <div style={{fontFamily:'Georgia,serif',fontSize:'13px',color:'#4a5568',lineHeight:'1.55'}}>{m.reveals}</div>
                </div>
                <div style={{marginTop:'10px',paddingTop:'8px',borderTop:'1px solid #f3f4f6',fontFamily:'Georgia,serif',fontSize:'10.5px',color:'#9ca3af',letterSpacing:'0.02em'}}>Used in: {m.usedIn}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">Deployment</div>
          <p className="fi-p">Designed to operate using existing reporting structures and available portfolio data.</p>
          <p className="fi-p">Does not require full integration to support directional operating interpretation. Analytical depth increases as data quality and servicing visibility improve. Certain analytical layers require deeper operational and cost attribution data to support full decomposition.</p>
        </div>

        <div className="fi-section-block">
          <div className="fi-section-label">About This Work</div>
          <p className="fi-p">This is how payment franchises are understood beyond financial reporting alone.</p>
          <div className="fi-system-statement" style={{marginTop:'20px'}}>
            The Diagnostic surfaces patterns. The Index evaluates franchise maturity. These models help interpret the underlying drivers. The output helps clarify where management attention may be required.
          </div>
          <div className="fi-links">
            <a href="https://carlosurena.com/consulting.html">Diagnostic &#8599;</a>
            <a href="https://carlosurena.com/pfi.html">Payments Franchise Index &#8599;</a>
            <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer">LinkedIn &#8599;</a>
          </div>
        </div>

        <footer className="fi-footer" style={{borderTop:'3px solid #b7882c',background:'#0f1f3d',padding:'0 24px',height:'48px',display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'40px'}}>
          <span style={{fontFamily:'Georgia, serif',fontSize:'13px',color:'rgba(255,255,255,0.7)'}}>Built from real operating conditions inside payments franchises</span>
          <span style={{fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>
            <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer" style={{color:'#b7882c',textDecoration:'none'}}>LinkedIn</a>
            <span style={{margin:'0 6px'}}>·</span>
            <a href="mailto:carlos@carlosurena.com" style={{color:'#b7882c',textDecoration:'none'}}>Email</a>
            <span style={{margin:'0 6px'}}>·</span> © 2026
          </span>
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
