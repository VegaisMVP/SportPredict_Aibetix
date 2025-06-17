import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Strategies from './pages/Strategies'
import Follow from './pages/Follow'
import Bet from './pages/Bet'
import Profile from './pages/Profile'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/follow" element={<Follow />} />
          <Route path="/bet" element={<Bet />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App 