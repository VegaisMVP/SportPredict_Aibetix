import React from 'react'
import { TrendingUp, Users, Calendar, DollarSign, Eye } from 'lucide-react'

const Follow: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Follows</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          Find Strategies
        </button>
      </div>

      {/* Follow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">+8.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Followed Strategies</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Invested Capital</p>
              <p className="text-2xl font-bold text-gray-900">$2,500</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Follow Days</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Follow List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-6">Follow Details</h2>
        <div className="space-y-6">
          {/* Follow Item */}
          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Stable Profit Strategy</h3>
                <p className="text-sm text-gray-600">by Strategist Zhang San</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Follow Time: </span>
                <span className="text-sm">2024-01-10</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Invested Capital</p>
                <p className="font-semibold">$1,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Profit</p>
                <p className="font-semibold text-green-600">+$125</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit Rate</p>
                <p className="font-semibold text-green-600">+12.5%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Follow Days</p>
                <p className="font-semibold">10 days</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Stop Following
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Aggressive Growth Strategy</h3>
                <p className="text-sm text-gray-600">by Strategist Li Si</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Follow Time: </span>
                <span className="text-sm">2024-01-05</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Invested Capital</p>
                <p className="font-semibold">$800</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Profit</p>
                <p className="font-semibold text-red-600">-$16</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit Rate</p>
                <p className="font-semibold text-red-600">-2.0%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Follow Days</p>
                <p className="font-semibold">15 days</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Stop Following
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Balanced Investment Strategy</h3>
                <p className="text-sm text-gray-600">by Strategist Wang Wu</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Follow Time: </span>
                <span className="text-sm">2024-01-12</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Invested Capital</p>
                <p className="font-semibold">$700</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Profit</p>
                <p className="font-semibold text-green-600">+$131</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit Rate</p>
                <p className="font-semibold text-green-600">+18.7%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Follow Days</p>
                <p className="font-semibold">8 days</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Stop Following
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Follow 