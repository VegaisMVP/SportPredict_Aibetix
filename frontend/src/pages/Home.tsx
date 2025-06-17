import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  TrendingUpIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline'

const Home: React.FC = () => {
  const products = [
    {
      name: 'Vegais Sports Predict',
      description: 'AI-powered sports predictions and betting strategies for regular users',
      icon: ChartBarIcon,
      href: '/predict',
      features: [
        'Real-time match predictions',
        'AI-powered analysis',
        'Betting strategy recommendations',
        'Interactive chat with AI agent'
      ]
    },
    {
      name: 'Vegais Sportsbook',
      description: 'Advanced betting platform with automated strategy execution',
      icon: CurrencyDollarIcon,
      href: '/sportsbook',
      features: [
        'Automated betting strategies',
        'Multi-platform odds comparison',
        'Strategy marketplace',
        'Performance tracking'
      ]
    },
    {
      name: 'Vegais ETF',
      description: 'Passive income sports betting fund for hands-off investors',
      icon: TrendingUpIcon,
      href: '/etf',
      features: [
        'Automated fund management',
        'Diversified betting portfolio',
        'Transparent performance tracking',
        'Easy deposit/withdrawal'
      ]
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to{' '}
          <span className="text-primary-600">Vegais Sports Platform</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          The future of sports betting powered by AI and blockchain technology
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/predict"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.name} className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <product.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              {product.description}
            </p>
            <ul className="mt-6 space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary-600 rounded-full mt-2"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">{feature}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                to={product.href}
                className="btn-primary w-full text-center"
              >
                Explore {product.name}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">10,000+</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600">85%</div>
            <div className="text-sm text-gray-500">Prediction Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600">$2.5M</div>
            <div className="text-sm text-gray-500">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary-600">500+</div>
            <div className="text-sm text-gray-500">Active Strategies</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 