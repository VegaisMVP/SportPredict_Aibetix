import React from 'react'
import { TrendingUp, Calendar, Newspaper, Users } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Vegais Sports Predict
          </h1>
          <p className="text-xl mb-6">
            Professional sports information platform providing real-time match data, AI prediction analysis, and latest sports news
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
              Start Exploring
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Calendar className="w-8 h-8 text-primary-600" />
            <h3 className="ml-3 text-lg font-semibold">Live Matches</h3>
          </div>
          <p className="text-gray-600">
            Get the latest match information, schedules, and real-time score data
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            <h3 className="ml-3 text-lg font-semibold">AI Predictions</h3>
          </div>
          <p className="text-gray-600">
            Machine learning-based intelligent prediction analysis providing professional match result forecasts
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Newspaper className="w-8 h-8 text-primary-600" />
            <h3 className="ml-3 text-lg font-semibold">Sports News</h3>
          </div>
          <p className="text-gray-600">
            Latest sports information, player updates, and event coverage
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-primary-600" />
            <h3 className="ml-3 text-lg font-semibold">Community Interaction</h3>
          </div>
          <p className="text-gray-600">
            Exchange and discuss with other sports enthusiasts, share opinions and insights
          </p>
        </div>
      </div>

      {/* Popular Matches */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-6">Popular Matches</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">⚽</span>
              </div>
              <div>
                <h3 className="font-semibold">Manchester United vs Liverpool</h3>
                <p className="text-sm text-gray-600">Premier League</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Today 20:30</p>
              <p className="text-sm text-primary-600">Starting Soon</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">🏀</span>
              </div>
              <div>
                <h3 className="font-semibold">Lakers vs Warriors</h3>
                <p className="text-sm text-gray-600">NBA Regular Season</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tomorrow 09:00</p>
              <p className="text-sm text-primary-600">Starting Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 