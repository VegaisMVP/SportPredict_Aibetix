import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from 'react-query'
import { api, endpoints } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import StrategyList from '../components/Sportsbook/StrategyList'
import StrategyDesigner from '../components/Sportsbook/StrategyDesigner'
import UserDashboard from '../components/Sportsbook/UserDashboard'

const Sportsbook: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'strategies' | 'designer' | 'dashboard'>('strategies')

  const { data: strategies, isLoading } = useQuery(
    ['strategies'],
    () => api.get(endpoints.strategies),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sportsbook</h1>
          <p className="text-gray-600 mt-2">
            Advanced betting strategies and automated execution
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-sm text-gray-600">
              Strategy slots: {user.role === 'strategist' ? 'Unlimited' : '2/2'}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('strategies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'strategies'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Strategy Marketplace
          </button>
          <button
            onClick={() => setActiveTab('designer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'designer'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Strategy Designer
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Dashboard
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'strategies' && (
          <StrategyList 
            strategies={strategies?.data || []} 
            isLoading={isLoading}
          />
        )}
        {activeTab === 'designer' && <StrategyDesigner />}
        {activeTab === 'dashboard' && <UserDashboard />}
      </div>
    </div>
  )
}

export default Sportsbook 