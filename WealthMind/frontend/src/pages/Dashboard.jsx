import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { portfolioAPI, recommendationAPI } from '../utils/api'
import { formatCurrency, formatPercentage, getProfitColor } from '../utils/helpers'
import { FiTrendingUp, FiTrendingDown, FiBriefcase, FiArrowRight } from 'react-icons/fi'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const Dashboard = () => {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [portfolioRes, recsRes, statsRes] = await Promise.all([
        portfolioAPI.getPortfolio(),
        recommendationAPI.getRecommendations(user.id),
        portfolioAPI.getStats()
      ])

      setPortfolio(portfolioRes.data.portfolio)
      setRecommendations(recsRes.data.recommendations)
      setStats(statsRes.data.stats)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#0ea5e9', '#00d09c', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  const getSectorData = () => {
    if (!stats?.sectorAllocation) return []
    return Object.entries(stats.sectorAllocation).map(([name, value]) => ({
      name,
      value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-600 mt-2">Here's your investment overview</p>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Total Invested</h3>
            <FiBriefcase className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(portfolio?.totalInvested || 0)}</p>
        </div>

        <div className="card bg-gradient-to-br from-success to-green-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Current Value</h3>
            <FiTrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(portfolio?.currentValue || 0)}</p>
        </div>

        <div className={`card ${portfolio?.totalProfitLoss >= 0 ? 'bg-gradient-to-br from-success to-green-600' : 'bg-gradient-to-br from-danger to-red-600'} text-white`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Total P&L</h3>
            {portfolio?.totalProfitLoss >= 0 ? (
              <FiTrendingUp className="w-6 h-6 opacity-75" />
            ) : (
              <FiTrendingDown className="w-6 h-6 opacity-75" />
            )}
          </div>
          <p className="text-3xl font-bold">{formatCurrency(portfolio?.totalProfitLoss || 0)}</p>
          <p className="text-sm opacity-90 mt-2">{formatPercentage(portfolio?.totalProfitLossPercent || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Allocation */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Sector Allocation</h2>
          {getSectorData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getSectorData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getSectorData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No investments yet</p>
              <Link to="/market" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                Start investing →
              </Link>
            </div>
          )}
        </div>

        {/* Top Holdings */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Top Holdings</h2>
            <Link to="/portfolio" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          {portfolio?.holdings?.length > 0 ? (
            <div className="space-y-4">
              {portfolio.holdings.slice(0, 5).map((holding, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{holding.symbol}</p>
                    <p className="text-sm text-gray-600">{holding.quantity} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatCurrency(holding.currentValue)}</p>
                    <p className={`text-sm ${getProfitColor(holding.profitLoss)}`}>
                      {formatPercentage(holding.profitLossPercent)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No holdings yet</p>
              <Link to="/market" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                Explore Market →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
        </div>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.slice(0, 4).map((stock, index) => (
              <Link
                key={index}
                to={`/stock/${stock.symbol}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{stock.symbol}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stock.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                    stock.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {stock.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 truncate">{stock.name}</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(stock.price)}</p>
                <p className={`text-sm ${getProfitColor(stock.changePercent)}`}>
                  {formatPercentage(stock.changePercent)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Complete your profile to get personalized recommendations</p>
            <Link to="/profile" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
              Complete Profile →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
