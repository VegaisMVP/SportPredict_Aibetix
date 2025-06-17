import React from 'react'
import { User, Settings, Shield, CreditCard, BarChart2, Calendar, TrendingUp } from 'lucide-react'

const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Center</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Zhang San</h3>
                  <p className="text-gray-600">Investor</p>
                  <p className="text-sm text-gray-500">Registration Date: 2024-01-01</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value="etf_investor"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value="investor@etf.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value="138****8888"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membership Level
                  </label>
                  <input
                    type="text"
                    value="Gold Member"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Investment Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6">Investment Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className="text-lg font-bold text-green-600">+$1,580</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Profit Rate</p>
                <p className="text-lg font-bold">+14.3%</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Investment Days</p>
                <p className="text-lg font-bold">45 days</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-sm text-gray-600">Holdings</p>
                <p className="text-lg font-bold">4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Settings className="w-5 h-5 text-gray-600" />
                <span>Account Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Shield className="w-5 h-5 text-gray-600" />
                <span>Security Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span>Payment Management</span>
              </button>
            </div>
          </div>

          {/* Wallet Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4">Wallet Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Available Balance</span>
                <span className="font-semibold">$2,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frozen Amount</span>
                <span className="font-semibold">$0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Assets</span>
                <span className="font-semibold">$15,080</span>
              </div>
              <div className="pt-3 border-t">
                <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
                  Deposit
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Purchased Stable Profit ETF</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Account deposit $1,000</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Sold Technology Themed ETF</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 