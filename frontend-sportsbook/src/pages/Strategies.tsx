import React from 'react'
import { Star, TrendingUp, Users, Calendar, Filter } from 'lucide-react'

const Strategies: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Strategy Square</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          Create Strategy
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filter: </span>
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Types</option>
            <option>Conservative</option>
            <option>Aggressive</option>
            <option>Balanced</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Returns</option>
            <option>0-10%</option>
            <option>10-20%</option>
            <option>20%+</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Win Rates</option>
            <option>60-70%</option>
            <option>70-80%</option>
            <option>80%+</option>
          </select>
        </div>
      </div>

      {/* Strategy List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Strategy Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
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
              <span className="text-gray-600">Total Return</span>
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
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Running Time</span>
              <span className="font-medium">45 days</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 text-sm">
              Follow Now
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
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
              <span className="text-gray-600">Total Return</span>
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
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Running Time</span>
              <span className="font-medium">32 days</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 text-sm">
              Follow Now
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Balanced Investment Strategy</h3>
              <p className="text-sm text-gray-600">by Strategist Wang Wu</p>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm">4.9</span>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Return</span>
              <span className="font-medium text-green-600">+18.7%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Win Rate</span>
              <span className="font-medium">79%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Followers</span>
              <span className="font-medium">189</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Running Time</span>
              <span className="font-medium">28 days</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 text-sm">
              Follow Now
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Previous Page
          </button>
          <button className="px-3 py-2 bg-primary-600 text-white rounded-lg">1</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Next Page
          </button>
        </nav>
      </div>
    </div>
  )
}

export default Strategies 