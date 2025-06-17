import React from 'react'

const Predictions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Prediction Analysis</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          Get New Prediction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Manchester United vs Liverpool</h3>
            <span className="text-sm text-green-600">AI Prediction</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Home Win Probability</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Draw Probability</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <span className="text-sm font-medium">28%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Away Win Probability</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '27%' }}></div>
                </div>
                <span className="text-sm font-medium">27%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>AI Analysis:</strong> Manchester United has clear home advantage and good recent form, recommend focusing on home win.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Lakers vs Warriors</h3>
            <span className="text-sm text-green-600">AI Prediction</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Home Win Probability</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '52%' }}></div>
                </div>
                <span className="text-sm font-medium">52%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Away Win Probability</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
                <span className="text-sm font-medium">48%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>AI Analysis:</strong> Both teams are evenly matched, Lakers have slight home advantage.
            </p>
          </div>
        </div>
      </div>

      {/* Prediction History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">Prediction History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Match</th>
                <th className="text-left py-2">Predicted Result</th>
                <th className="text-left py-2">Actual Result</th>
                <th className="text-left py-2">Accuracy</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Real Madrid vs Barcelona</td>
                <td className="py-2">Home Win</td>
                <td className="py-2">Home Win</td>
                <td className="py-2 text-green-600">✓ Correct</td>
                <td className="py-2">2024-01-15</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Bayern vs Dortmund</td>
                <td className="py-2">Home Win</td>
                <td className="py-2">Draw</td>
                <td className="py-2 text-red-600">✗ Wrong</td>
                <td className="py-2">2024-01-14</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Predictions 