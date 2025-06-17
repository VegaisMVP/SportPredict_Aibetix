import React from 'react'
import { TrendingUp, Users, BarChart2, Star, ArrowUpRight } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Vegais Sportsbook
          </h1>
          <p className="text-xl mb-6">
            Professional sports strategy and betting platform, supporting strategy following, auto betting, and profit analysis
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
              Start Strategy
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600">
              View Follows
            </button>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">+15.8%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">78.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Strategies</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Strategies */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Strategies</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Stable Profit Strategy</h3>
                <p className="text-sm text-gray-600">by Strategist Zhang San</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm">4.8</span>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Profit</span>
                <span className="font-medium text-green-600">+12.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Win Rate</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Followers</span>
                <span className="font-medium">234</span>
              </div>
            </div>
            <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              Follow Now
            </button>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Aggressive Growth Strategy</h3>
                <p className="text-sm text-gray-600">by Strategist Li Si</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm">4.6</span>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Profit</span>
                <span className="font-medium text-green-600">+28.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Win Rate</span>
                <span className="font-medium">72%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Followers</span>
                <span className="font-medium">156</span>
              </div>
            </div>
            <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              Follow Now
            </button>
          </div>
        </div>
      </div>

      {/* My Strategies */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Strategies</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Create Strategy →
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">My Stable Strategy</h3>
                <p className="text-sm text-gray-600">Created on 2024-01-15</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Profit</p>
              <p className="text-lg font-bold text-green-600">+8.2%</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Test Strategy</h3>
                <p className="text-sm text-gray-600">Created on 2024-01-10</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Profit</p>
              <p className="text-lg font-bold text-red-600">-2.1%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 