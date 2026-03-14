import { Link } from 'react-router-dom'

const S = {
  maxW:    '760px',
  maxWide: '960px',
  navy:    '#0f1f3d',
  gold:    '#C9A84C',
  goldDim: '#7A6028',
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

const MODELS = [
  { num:'01', layer:'Layer 2 — Economic Intelligence', name:'Payment Profitability Engine', route:'/models/01-profitability', desc:'Diagnoses payment P&L at transaction, client, corridor, and rail level. Identifies where margin is made and lost across the portfolio.', outputs:['Margin waterfall by corridor and rail','Client P&L ranking with drill-down','Rail cost efficiency matrix','Exception cost attribution'], connection:'Anchors the economic foundation. Every upstream model draws on its cost and margin outputs.' },
  { num:'02', layer:'Layer 4 — Decision Intelligence', name:'Rail Selection Optimizer', route:'/models/02-rail-optimizer', desc:'Scores and recommends the optimal payment rail for every transaction based on cost, speed, STP rate, and client SLA requirements.', outputs:['Real-time rail scoring (cost · speed · STP · finality)','Payment queue with optimised routing','Portfolio-level rail savings analysis','Instant rail adoption tracking'], connection:'Consumes rail cost benchmarks and STP rates from Model 01.' },
  { num:'03', layer:'Layer 3 — Network Intelligence', name:'Cross-Border Corridor Analyzer', route:'/models/03-corridor-analyzer', desc:'Maps the full economics of every payment corridor: fee revenue, FX spread, nostro funding cost, correspondent charges, compliance drag, and exception burden.', outputs:['Full corridor P&L waterfall','Grow / Defend / Optimise / Exit classification','FX spread and nostro efficiency analysis','Corridor trend and strategy matrix'], connection:'Feeds corridor classifications and P&L data to Models 04 and 05.' },
  { num:'04', layer:'Layer 3 — Behavioral Intelligence', name:'Client Payment Behavior Engine', route:'/models/04-client-behavior', desc:'Analyses client payment patterns, rail adoption, churn risk signals, and expansion opportunity indicators across the full client base.', outputs:['Churn risk scoring with driver attribution','Expansion opportunity pipeline','RM action queue — AI-prioritised interventions','Client relationship brief per account'], connection:'Weighted by client net margin from Model 01. Corridor risk from Model 03 elevates churn flags.' },
  { num:'05', layer:'Layer 5 — Strategic Optimization', name:'Portfolio Strategic Scorecard', route:'/models/05-portfolio-scorecard', desc:'Synthesises all model outputs into a single Portfolio Health Index with three-scenario modelling, board-level KPIs, and a strategic action register.', outputs:['Portfolio Health Index (PHI) — composite score 0–100','Base / Optimised / Stress scenario modelling','Six-dimension radar vs industry benchmark','Strategic action register with value estimates'], connection:'Synthesis model. Receives inputs from all four upstream models. The only model genuinely dependent on the full stack.' },
]

function Nav() {
  return (
    <nav style={{ background:'#0f1f3d', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
      <div style={{ maxWidth:'960px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:52 }}>
        <a href="https://carlosurena.com" style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:'#C9A84C', letterSpacing:'0.06em', border:'none', textDecoration:'none' }}>Carlos Ureña</a>
        <div style={{ display:'flex', gap:28, alignItems:'center' }}>
          {[{l:'← Home',h:'https://carlosurena.com'},{l:'Diagnostic',h:'https://carlosurena.com/payments-portfolio-diagnostic/'},{l:'LinkedIn',h:'https://www.linkedin.com/in/carlosurena/',ext:true}].map(link=>(
            <a key={link.l} href={link.h} target={link.ext?'_blank':undefined} rel={link.ext?'noreferrer':undefined}
              style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.65)', border:'none', textDecoration:'none', letterSpacing:'0.04em' }}
              onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.65)'}
            >{link.l}</a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default function FrameworkIndex() {
  return (
    <div style={{ background:'#ffffff', minHeight:'100vh' }}>
      <Nav />

      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'72px 32px 56px' }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#C9A84C', letterSpacing:'0.08em', marginBottom:24 }}>Payments Strategy Analytics · Framework V1 · 2025</div>
        <h1 style={{ fontFamily:"'EB Garamond',Georgia,serif", fontWeight:400, fontSize:'clamp(34px,4vw,50px)', lineHeight:1.15, color:'#1a1a1a', marginBottom:24 }}>Payments Strategy<br />Analytics Framework</h1>
        <div style={{ height:1, background:'#e4e4e0', marginBottom:28 }} />
        <p style={{ fontSize:17, color:'#444', lineHeight:1.8, marginBottom:16, fontWeight:300 }}>A five-model analytical framework that transforms payment data into layered strategic intelligence — from transaction-level economics through behavioral signals to board-level portfolio decisions.</p>
        <p style={{ fontSize:17, color:'#444', lineHeight:1.8, marginBottom:0, fontWeight:300 }}>Built on 20 years of payments P&L ownership across Citi, Deutsche Bank, HSBC, and Mashreq. Each model reflects how decisions are actually made inside a commercial payments franchise — not how they are reported.</p>
      </div>

      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'0 32px 64px' }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:20 }}>Framework Architecture</div>
        {[
          {n:'1',title:'Payment Data Foundation',desc:'Transaction-level data across rails, corridors, clients, pricing, and operational performance. The source layer for all models.'},
          {n:'2',title:'Economic Intelligence',desc:'Models that diagnose payment profitability, cost structures, and revenue leakage at transaction, client, and corridor level.'},
          {n:'3',title:'Behavioral Intelligence',desc:'Models that analyse client payment behavior, adoption patterns, churn signals, and corridor dynamics.'},
          {n:'4',title:'Decision Intelligence',desc:'Models that recommend optimal actions — payment rail selection, routing decisions, cost optimisation.'},
          {n:'5',title:'Strategic Optimization',desc:'Models that evaluate overall payments portfolio performance and simulate strategic scenarios for leadership.'},
        ].map((layer,i)=>(
          <div key={i} style={{ display:'grid', gridTemplateColumns:'32px 1fr', gap:20, padding:'20px 0', borderBottom:'1px solid #e4e4e0' }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:'#C9A84C', paddingTop:2 }}>0{layer.n}</div>
            <div>
              <div style={{ fontSize:15, color:'#1a1a1a', marginBottom:4, fontWeight:400 }}>{layer.title}</div>
              <div style={{ fontSize:14, color:'#888', lineHeight:1.65, fontWeight:300 }}>{layer.desc}</div>
            </div>
          </div>
        ))}
        <div style={{ paddingTop:20 }}>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#888', lineHeight:1.7 }}>Design principle — Each model builds on insights produced by the previous layer. They are not independent tools. Together they represent a cohesive AI-powered payments strategy system.</p>
        </div>
      </div>

      <div style={{ borderTop:'1px solid #e4e4e0', background:'#fafaf8' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto', padding:'64px 32px' }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:8 }}>The Analytical Models</div>
          <h2 style={{ fontFamily:"'EB Garamond',Georgia,serif", fontWeight:400, fontSize:28, color:'#1a1a1a', marginBottom:8 }}>Five working analytical models</h2>
          <p style={{ fontSize:14, color:'#888', marginBottom:48, lineHeight:1.7, fontWeight:300 }}>Each model is a fully interactive analytical application built on synthetic data calibrated to realistic industry ranges. Click any model to open it.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {MODELS.map((model,i)=><ModelRow key={i} model={model}/>)}
          </div>
        </div>
      </div>

      <div style={{ borderTop:'1px solid #e4e4e0', background:'#ffffff' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto', padding:'64px 32px' }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:20 }}>About This Work</div>
          <p style={{ fontSize:15, color:'#444', lineHeight:1.85, marginBottom:16, fontWeight:300 }}>This framework is not academic. It reflects how a senior payments executive thinks about portfolio performance — where margin is made and lost, how client behavior signals strategic risk, and how multi-rail infrastructure decisions translate into P&L outcomes.</p>
          <p style={{ fontSize:15, color:'#444', lineHeight:1.85, marginBottom:0, fontWeight:300 }}>The models are built as practical analytical tools that could realistically be deployed by a bank, payment network, or fintech platform. The Payments Portfolio Diagnostic — published separately — provides the qualitative entry point. Together they form a complete strategic framework: one that diagnoses the franchise, the other that quantifies it.</p>
          <div style={{ marginTop:36, display:'flex', gap:28 }}>
            <a href="https://carlosurena.com" style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#1a1a1a', textDecoration:'none', borderBottom:'1px solid #e4e4e0' }}>← carlosurena.com</a>
            <a href="https://carlosurena.com/payments-portfolio-diagnostic/" style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#888', textDecoration:'none', borderBottom:'1px solid #e4e4e0' }}>Payments Portfolio Diagnostic ↗</a>
            <a href="https://www.linkedin.com/in/carlosurena/" target="_blank" rel="noreferrer" style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#888', textDecoration:'none', borderBottom:'1px solid #e4e4e0' }}>LinkedIn ↗</a>
          </div>
        </div>
      </div>

      <div style={{ background:'#0f1f3d', borderTop:'1px solid #e4e4e0' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto', padding:'28px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C' }}>Payments Strategy Analytics Framework · V1 · Carlos Ureña · 2025</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.3)' }}>Prototype — synthetic data calibrated to realistic industry ranges</span>
        </div>
      </div>
    </div>
  )
}

function ModelRow({ model }) {
  return (
    <Link to={model.route} style={{ display:'block', textDecoration:'none', color:'inherit', borderBottom:'1px solid #e4e4e0' }}
      onMouseEnter={e=>e.currentTarget.style.background='#f0f0ec'}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <div style={{ display:'grid', gridTemplateColumns:'32px 1fr auto', gap:20, alignItems:'start', padding:'24px 2px 12px' }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:'#C9A84C', paddingTop:3 }}>{model.num}</div>
        <div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', letterSpacing:'0.08em', marginBottom:6 }}>{model.layer}</div>
          <div style={{ fontSize:18, color:'#1a1a1a', fontFamily:"'EB Garamond',Georgia,serif", fontWeight:400, marginBottom:8, lineHeight:1.3 }}>{model.name}</div>
          <p style={{ fontSize:14, color:'#888', lineHeight:1.7, marginBottom:12, fontWeight:300, maxWidth:560 }}>{model.desc}</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 0' }}>
            {model.outputs.map((o,i)=>(
              <span key={i} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#888' }}>
                {o}{i<model.outputs.length-1?<span style={{ color:'#bbb', padding:'0 8px' }}>·</span>:null}
              </span>
            ))}
          </div>
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:'#C9A84C', paddingTop:3 }}>→</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'32px 1fr', gap:20, paddingBottom:16 }}>
        <div/>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#bbb', lineHeight:1.6 }}>{model.connection}</div>
      </div>
    </Link>
  )
}

export function ModelBackBar() {
  return (
    <div style={{ background:'#0f1f3d', padding:'0 28px', display:'flex', alignItems:'center', justifyContent:'space-between', height:44, position:'sticky', top:0, zIndex:200 }}>
      <Link to="/" style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.65)', textDecoration:'none', letterSpacing:'0.04em', border:'none', display:'flex', alignItems:'center', gap:6 }}
        onMouseEnter={e=>e.currentTarget.style.color='#C9A84C'}
        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.65)'}>
        ← All Models
      </Link>
      <a href="https://carlosurena.com" style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.35)', textDecoration:'none', border:'none', letterSpacing:'0.04em' }}>carlosurena.com</a>
    </div>
  )
}