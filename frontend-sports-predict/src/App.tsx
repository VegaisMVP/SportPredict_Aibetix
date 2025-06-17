import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Matches from './pages/Matches'
import Predictions from './pages/Predictions'
import News from './pages/News'
import Profile from './pages/Profile'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/news" element={<News />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App 