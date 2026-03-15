import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './index.css'

// Pages
import FrameworkIndex from './pages/FrameworkIndex'

// Models
import Model01 from './models/Model01_ProfitabilityEngine'
import Model02 from './models/Model02_RailOptimizer'
import Model03 from './models/Model03_CorridorAnalyzer'
import Model04 from './models/Model04_ClientBehavior'
import Model05 from './models/Model05_PortfolioScorecard'
import Model06 from './models/Model06_MoneyMovement'

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<FrameworkIndex />} />

        {/* Individual models */}
        <Route path="/models/01-profitability"       element={<Model01 />} />
        <Route path="/models/02-rail-optimizer"      element={<Model02 />} />
        <Route path="/models/03-corridor-analyzer"   element={<Model03 />} />
        <Route path="/models/04-client-behavior"     element={<Model04 />} />
        <Route path="/models/05-portfolio-scorecard" element={<Model05 />} />
        <Route path="/models/06-money-movement" element={<Model06 />} />

        {/* Catch-all back to index */}
        <Route path="*" element={<FrameworkIndex />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)