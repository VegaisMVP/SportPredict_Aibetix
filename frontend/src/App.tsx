import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import SportsPredict from './pages/SportsPredict'
import Sportsbook from './pages/Sportsbook'
import ETF from './pages/ETF'
import Home from './pages/Home'

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict/*" element={<SportsPredict />} />
            <Route path="/sportsbook/*" element={<Sportsbook />} />
            <Route path="/etf/*" element={<ETF />} />
          </Routes>
        </Layout>
      </WalletProvider>
    </AuthProvider>
  )
}

export default App 