import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Filter, Search } from 'lucide-react'

const Market: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ETF Market</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ETFs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Types</option>
            <option>Conservative</option>
            <option>Growth</option>
            <option>Balanced</option>
          </select>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Return</p>
              <p className="text-2xl font-bold text-gray-900">+15.8%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">$5.2M</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active ETFs</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Max Drawdown</p>
              <p className="text-2xl font-bold text-gray-900">-8.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ETF List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">All ETF Products</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-2 py-1 text-sm">
              <option>Return Rate</option>
              <option>Size</option>
              <option>Investor Count</option>
              <option>Launch Date</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* ETF Card */}
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Conservative Return ETF</h3>
                <p className="text-sm text-gray-600">Low-risk stable returns</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">+12.5%</p>
                <p className="text-sm text-gray-600">Annual Return</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Price</span>
                <span className="font-medium">$1.25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assets Under Management</span>
                <span className="font-medium">$850K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Investors</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Risk Level</span>
                <span className="font-medium text-green-600">Low</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 text-sm">
                Invest Now
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Details
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Growth ETF</h3>
                <p className="text-sm text-gray-600">High growth potential</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">+28.3%</p>
                <p className="text-sm text-gray-600">Annual Return</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Price</span>
                <span className="font-medium">$2.15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assets Under Management</span>
                <span className="font-medium">$1.2M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Investors</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Risk Level</span>
                <span className="font-medium text-yellow-600">Medium</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 text-sm">
                Invest Now
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Details
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Balanced Investment ETF</h3>
                <p className="text-sm text-gray-600">Risk-return balance</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">+18.7%</p>
                <p className="text-sm text-gray-600">Annual Return</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Price</span>
                <span className="font-medium">$1.68</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assets Under Management</span>
                <span className="font-medium">$950K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Investors</span>
                <span className="font-medium">189</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Risk Level</span>
                <span className="font-medium text-blue-600">Low-Medium</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 text-sm">
                Invest Now
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Details
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Technology Theme ETF</h3>
                <p className="text-sm text-gray-600">Technology stock investment</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">+35.2%</p>
                <p className="text-sm text-gray-600">Annual Return</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Price</span>
                <span className="font-medium">$3.45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assets Under Management</span>
                <span className="font-medium">$750K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Investors</span>
                <span className="font-medium">98</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Risk Level</span>
                <span className="font-medium text-red-600">High</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 text-sm">
                Invest Now
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Details
              </button>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-primary-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Market 