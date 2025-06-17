import React from 'react'
import { BarChart2, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react'

const Bet: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Betting Center</h1>
        <div className="flex space-x-2">
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Manual Betting
          </button>
          <button className="border border-primary-600 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50">
            Auto Betting
          </button>
        </div>
      </div>

      {/* Betting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">+$1,250</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">78.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bet Amount</p>
              <p className="text-2xl font-bold text-gray-900">$5,200</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bet Count</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Betting History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Betting History</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Status</option>
              <option>Settled</option>
              <option>In Progress</option>
              <option>Cancelled</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Match</th>
                <th className="text-left py-3 px-4">Bet Content</th>
                <th className="text-left py-3 px-4">Bet Amount</th>
                <th className="text-left py-3 px-4">Odds</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Profit</th>
                <th className="text-left py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">Manchester United vs Liverpool</p>
                    <p className="text-sm text-gray-600">Premier League</p>
                  </div>
                </td>
                <td className="py-3 px-4">Home Win</td>
                <td className="py-3 px-4">$100</td>
                <td className="py-3 px-4">2.50</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Settled
                  </span>
                </td>
                <td className="py-3 px-4 text-green-600">+$150</td>
                <td className="py-3 px-4 text-sm text-gray-600">2024-01-15</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">Lakers vs Warriors</p>
                    <p className="text-sm text-gray-600">NBA Regular Season</p>
                  </div>
                </td>
                <td className="py-3 px-4">Away Win</td>
                <td className="py-3 px-4">$80</td>
                <td className="py-3 px-4">2.15</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    Settled
                  </span>
                </td>
                <td className="py-3 px-4 text-red-600">-$80</td>
                <td className="py-3 px-4 text-sm text-gray-600">2024-01-14</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">Real Madrid vs Barcelona</p>
                    <p className="text-sm text-gray-600">La Liga</p>
                  </div>
                </td>
                <td className="py-3 px-4">Draw</td>
                <td className="py-3 px-4">$120</td>
                <td className="py-3 px-4">3.20</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    In Progress
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">--</td>
                <td className="py-3 px-4 text-sm text-gray-600">2024-01-16</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
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
    </div>
  )
}

export default Bet 