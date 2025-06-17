import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api, endpoints } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import { toast } from 'react-hot-toast'
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'

const ETF: React.FC = () => {
  const { user } = useAuth()
  const { connected, publicKey } = useWallet()
  const queryClient = useQueryClient()
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const { data: etfData, isLoading } = useQuery(
    ['etf-balance'],
    () => api.get(endpoints.etfBalance),
    {
      staleTime: 30 * 1000, // 30 seconds
    }
  )

  const { data: history } = useQuery(
    ['etf-history'],
    () => api.get(endpoints.etfHistory),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const depositMutation = useMutation(
    (amount: number) => api.post(endpoints.etfDeposit, { amount }),
    {
      onSuccess: () => {
        toast.success('Deposit successful!')
        queryClient.invalidateQueries(['etf-balance'])
        setDepositAmount('')
      },
      onError: () => {
        toast.error('Deposit failed. Please try again.')
      },
    }
  )

  const withdrawMutation = useMutation(
    (amount: number) => api.post(endpoints.etfWithdraw, { amount }),
    {
      onSuccess: () => {
        toast.success('Withdrawal successful!')
        queryClient.invalidateQueries(['etf-balance'])
        setWithdrawAmount('')
      },
      onError: () => {
        toast.error('Withdrawal failed. Please try again.')
      },
    }
  )

  const handleDeposit = () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    depositMutation.mutate(amount)
  }

  const handleWithdraw = () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    withdrawMutation.mutate(amount)
  }

  const balance = etfData?.data || {
    totalDeposited: 0,
    currentBalance: 0,
    totalEarnings: 0,
    dailyReturn: 0,
    allocation: {
      football: 0,
      basketball: 0,
      tennis: 0,
      other: 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vegais ETF</h1>
        <p className="text-gray-600 mt-2">
          Passive income sports betting fund
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Deposited</p>
              <p className="text-2xl font-bold text-gray-900">
                ${balance.totalDeposited.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUpIcon className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${balance.currentBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUpIcon className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-success-600">
                +${balance.totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-warning-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Daily Return</p>
              <p className="text-2xl font-bold text-warning-600">
                {balance.dailyReturn > 0 ? '+' : ''}{balance.dailyReturn.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Deposit</h3>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="input-field"
            />
            <button
              onClick={handleDeposit}
              disabled={depositMutation.isLoading || !connected}
              className="btn-primary w-full"
            >
              {depositMutation.isLoading ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Withdraw</h3>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="input-field"
            />
            <button
              onClick={handleWithdraw}
              disabled={withdrawMutation.isLoading || !connected}
              className="btn-primary w-full"
            >
              {withdrawMutation.isLoading ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Allocation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {balance.allocation.football}%
            </div>
            <div className="text-sm text-gray-500">Football</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {balance.allocation.basketball}%
            </div>
            <div className="text-sm text-gray-500">Basketball</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              {balance.allocation.tennis}%
            </div>
            <div className="text-sm text-gray-500">Tennis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600">
              {balance.allocation.other}%
            </div>
            <div className="text-sm text-gray-500">Other</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history?.data?.map((transaction: any) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ETF 