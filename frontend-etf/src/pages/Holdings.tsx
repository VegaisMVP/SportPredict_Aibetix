import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Calendar, Eye } from 'lucide-react'

const Holdings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Holdings</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          View Market
        </button>
      </div>

      {/* Holdings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">$12,580</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Return</p>
              <p className="text-2xl font-bold text-green-600">+$1,580</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Return Rate</p>
              <p className="text-2xl font-bold text-gray-900">+14.3%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Holdings Count</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-6">Holdings Details</h2>
        <div className="space-y-6">
          {/* Holding Item */}
          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Conservative Return ETF</h3>
                <p className="text-sm text-gray-600">Low-risk stable returns</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Holding Time:</p>
                <p className="text-sm">45 days</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Shares Held</p>
                <p className="font-semibold">800 shares</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Cost</p>
                <p className="font-semibold">$1.20</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="font-semibold">$1,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Return</p>
                <p className="font-semibold text-green-600">+$40 (+4.0%)</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Sell
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Growth ETF</h3>
                <p className="text-sm text-gray-600">High growth potential</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Holding Time:</p>
                <p className="text-sm">32 days</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Shares Held</p>
                <p className="font-semibold">500 shares</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Cost</p>
                <p className="font-semibold">$2.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="font-semibold">$1,075</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Return</p>
                <p className="font-semibold text-green-600">+$75 (+7.5%)</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Sell
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Balanced Investment ETF</h3>
                <p className="text-sm text-gray-600">Risk-return balance</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Holding Time:</p>
                <p className="text-sm">28 days</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Shares Held</p>
                <p className="font-semibold">600 shares</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Cost</p>
                <p className="font-semibold">$1.65</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="font-semibold">$1,008</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Return</p>
                <p className="font-semibold text-green-600">+$18 (+1.8%)</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Sell
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Technology Theme ETF</h3>
                <p className="text-sm text-gray-600">Technology stock investment</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Holding Time:</p>
                <p className="text-sm">15 days</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Shares Held</p>
                <p className="font-semibold">200 shares</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Cost</p>
                <p className="font-semibold">$3.20</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="font-semibold">$690</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Return</p>
                <p className="font-semibold text-red-600">-$50 (-6.8%)</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Types</option>
              <option>Buy</option>
              <option>Sell</option>
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
                <th className="text-left py-3 px-4">ETF Name</th>
                <th className="text-left py-3 px-4">Transaction Type</th>
                <th className="text-left py-3 px-4">Quantity</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Conservative Return ETF</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Buy
                  </span>
                </td>
                <td className="py-3 px-4">300 shares</td>
                <td className="py-3 px-4">$1.20</td>
                <td className="py-3 px-4">$360</td>
                <td className="py-3 px-4 text-sm text-gray-600">2024-01-15</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4">Growth ETF</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Buy
                  </span>
                </td>
                <td className="py-3 px-4">200 shares</td>
                <td className="py-3 px-4">$2.00</td>
                <td className="py-3 px-4">$400</td>
                <td className="py-3 px-4 text-sm text-gray-600">2024-01-10</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4">Technology Theme ETF</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    Sell
                  </span>
                </td>
                <td className="py-3 px-4">100 shares</td>
                <td className="py-3 px-4">$3.45</td>
                <td className="py-3 px-4">$345</td>
                <td className="py-3 px-4 text-sm text-gray-600">2024-01-08</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Holdings 