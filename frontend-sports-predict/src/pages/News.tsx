import React from 'react'

const News: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sports News</h1>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Categories</option>
            <option>Football</option>
            <option>Basketball</option>
            <option>Tennis</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Card */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">News Image</span>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-2">
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Football</span>
              <span className="text-xs text-gray-500 ml-2">2 hours ago</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Manchester United announces new signing, fans look forward to new season
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Manchester United officially announced a new signing today. This young player will bring new energy to the team...
            </p>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Read more →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">News Image</span>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Basketball</span>
              <span className="text-xs text-gray-500 ml-2">4 hours ago</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              NBA Playoffs in Full Swing, Teams Compete Fiercely
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              The NBA playoffs are heating up, with many teams fiercely competing and exciting games happening continuously...
            </p>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Read more →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">News Image</span>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Tennis</span>
              <span className="text-xs text-gray-500 ml-2">6 hours ago</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Grand Slam Tournament About to Begin, Top Players Ready
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              The annual Grand Slam tournament is about to start, and the world's top players are ready...
            </p>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Read more →
            </button>
          </div>
        </div>
      </div>

      {/* Hot News */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">Hot News</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500">Img</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Champions League Final Tickets Sold Out Quickly</h3>
              <p className="text-sm text-gray-600">Champions League final tickets sold out within an hour of release...</p>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500">Img</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Olympics Preparation Progressing Smoothly</h3>
              <p className="text-sm text-gray-600">Preparations for the next Olympics are proceeding in an orderly manner...</p>
            </div>
            <span className="text-xs text-gray-500">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News 