import React from 'react'

const Matches: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Match Information</h1>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Leagues</option>
            <option>Premier League</option>
            <option>La Liga</option>
            <option>Bundesliga</option>
            <option>Serie A</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Status</option>
            <option>Starting Soon</option>
            <option>In Progress</option>
            <option>Finished</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Premier League</span>
            <span className="text-sm text-green-600">Starting Soon</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔴</span>
              </div>
              <div>
                <h3 className="font-semibold">Manchester United</h3>
                <p className="text-sm text-gray-600">Home</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Today 20:30</p>
              <p className="text-lg font-bold">VS</p>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-semibold text-right">Liverpool</h3>
                <p className="text-sm text-gray-600 text-right">Away</p>
              </div>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔴</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Home Win: 2.50</span>
              <span>Draw: 3.20</span>
              <span>Away Win: 2.80</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">NBA Regular Season</span>
            <span className="text-sm text-green-600">Starting Soon</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏀</span>
              </div>
              <div>
                <h3 className="font-semibold">Lakers</h3>
                <p className="text-sm text-gray-600">Home</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Tomorrow 09:00</p>
              <p className="text-lg font-bold">VS</p>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-semibold text-right">Warriors</h3>
                <p className="text-sm text-gray-600 text-right">Away</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏀</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Home Win: 1.85</span>
              <span>Away Win: 2.15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Matches 