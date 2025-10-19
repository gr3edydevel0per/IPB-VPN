import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { marketAPI } from '../utils/api'
import { formatCurrency, formatPercentage, getProfitColor } from '../utils/helpers'
import { FiSearch } from 'react-icons/fi'

const Market = () => {
  const [stocks, setStocks] = useState([])
  const [filteredStocks, setFilteredStocks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    sector: '',
    riskLevel: '',
    marketCap: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStocks()
  }, [filters])

  useEffect(() => {
    handleSearch()
  }, [searchQuery, stocks])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await marketAPI.getAllStocks(filters)
      setStocks(response.data.stocks)
      setFilteredStocks(response.data.stocks)
    } catch (error) {
      console.error('Error fetching stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredStocks(stocks)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = stocks.filter(stock =>
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query) ||
      stock.sector.toLowerCase().includes(query)
    )
    setFilteredStocks(filtered)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === prev[filterType] ? '' : value
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Stock Market</h1>

      {/* Search and Filters */}
      <div className="card mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search stocks by name, symbol, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Sector:</p>
            <div className="flex flex-wrap gap-2">
              {['IT', 'Banking', 'FMCG', 'Pharma', 'Automobile'].map(sector => (
                <button
                  key={sector}
                  onClick={() => handleFilterChange('sector', sector)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.sector === sector
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Risk Level:</p>
            <div className="flex flex-wrap gap-2">
              {['Low', 'Medium', 'High'].map(risk => (
                <button
                  key={risk}
                  onClick={() => handleFilterChange('riskLevel', risk)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.riskLevel === risk
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Market Cap:</p>
            <div className="flex flex-wrap gap-2">
              {['Large Cap', 'Mid Cap', 'Small Cap'].map(cap => (
                <button
                  key={cap}
                  onClick={() => handleFilterChange('marketCap', cap)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.marketCap === cap
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {filteredStocks.length} Stocks
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStocks.map((stock) => (
                <tr key={stock._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{stock.symbol}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{stock.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{stock.sector}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(stock.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getProfitColor(stock.changePercent)}`}>
                      {formatPercentage(stock.changePercent)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      stock.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      stock.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stock.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/stock/${stock.symbol}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No stocks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Market
