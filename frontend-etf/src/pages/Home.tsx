import React from 'react'
import { TrendingUp, DollarSign, BarChart2, Users, ArrowUpRight } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Vegais ETF
          </h1>
          <p className="text-xl mb-6">
            Professional sports betting fund platform, making investment simpler and returns more stable
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
              Start Investing
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600">
              Learn More
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
              <p className="text-sm font-medium text-gray-600">Total Return Rate</p>
              <p className="text-2xl font-bold text-gray-900">+18.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assets Under Management</p>
              <p className="text-2xl font-bold text-gray-900">$2.5M</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annual Return</p>
              <p className="text-2xl font-bold text-gray-900">15.2%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Investors</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular ETFs */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular ETFs</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Stable Profit ETF</h3>
                <p className="text-sm text-gray-600">Low risk stable returns</p>
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
            </div>
            <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              Invest Now
            </button>
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
            </div>
            <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              Invest Now
            </button>
          </div>
        </div>
      </div>

      {/* Investment Advantages */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Professional Management</h3>
            <p className="text-gray-600">Managed by professional team, based on AI algorithms and data analysis</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Stable Returns</h3>
            <p className="text-gray-600">Diversified investment, reduced risk, pursuing stable returns</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Transparent & Open</h3>
            <p className="text-gray-600">All transaction records are public and transparent, updated in real-time</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 