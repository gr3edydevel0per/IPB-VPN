import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { marketAPI, orderAPI } from '../utils/api'
import { formatCurrency, formatPercentage, getProfitColor } from '../utils/helpers'
import { FiArrowLeft, FiTrendingUp } from 'react-icons/fi'

const StockDetail = () => {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [stock, setStock] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [orderType, setOrderType] = useState('BUY')
  const [loading, setLoading] = useState(true)
  const [orderLoading, setOrderLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchStockDetails()
  }, [symbol])

  const fetchStockDetails = async () => {
    try {
      setLoading(true)
      const response = await marketAPI.getStockBySymbol(symbol)
      setStock(response.data.stock)
    } catch (error) {
      console.error('Error fetching stock details:', error)
      setMessage({ type: 'error', text: 'Failed to load stock details' })
    } finally {
      setLoading(false)
    }
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setOrderLoading(true)

    try {
      const orderData = {
        symbol: stock.symbol,
        quantity: parseInt(quantity)
      }

      if (orderType === 'BUY') {
        await orderAPI.buy(orderData)
        setMessage({ type: 'success', text: `Successfully purchased ${quantity} shares of ${stock.symbol}!` })
      } else {
        await orderAPI.sell(orderData)
        setMessage({ type: 'success', text: `Successfully sold ${quantity} shares of ${stock.symbol}!` })
      }

      setQuantity(1)
      setTimeout(() => {
        navigate('/portfolio')
      }, 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Transaction failed'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setOrderLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!stock) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Stock not found</p>
          <button onClick={() => navigate('/market')} className="btn-primary mt-4">
            Back to Market
          </button>
        </div>
      </div>
    )
  }

  const totalAmount = stock.price * quantity

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/market')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back to Market
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{stock.symbol}</h1>
                <p className="text-gray-600 mt-1">{stock.name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                stock.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                stock.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {stock.riskLevel} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(stock.price)}</p>
                <p className={`text-lg font-semibold ${getProfitColor(stock.changePercent)}`}>
                  {formatPercentage(stock.changePercent)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Sector</p>
                <p className="font-semibold text-gray-800">{stock.sector}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Market Cap</p>
                <p className="font-semibold text-gray-800">{stock.marketCap}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">P/E Ratio</p>
                <p className="font-semibold text-gray-800">{stock.pe_ratio?.toFixed(2) || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Avg Return</p>
                <p className="font-semibold text-gray-800">{stock.avgReturn?.toFixed(2)}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Volatility</p>
                <p className="font-semibold text-gray-800">{stock.volatility?.toFixed(2)}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Dividend Yield</p>
                <p className="font-semibold text-gray-800">{stock.dividendYield?.toFixed(2)}%</p>
              </div>
            </div>

            {stock.description && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">{stock.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Place Order</h2>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="label">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('BUY')}
                    className={`py-2 rounded-lg font-semibold transition-colors ${
                      orderType === 'BUY'
                        ? 'bg-success text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('SELL')}
                    className={`py-2 rounded-lg font-semibold transition-colors ${
                      orderType === 'SELL'
                        ? 'bg-danger text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="input-field"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per share:</span>
                  <span className="font-semibold">{formatCurrency(stock.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full ${orderType === 'BUY' ? 'btn-success' : 'btn-danger'}`}
                disabled={orderLoading}
              >
                {orderLoading ? 'Processing...' : `${orderType === 'BUY' ? 'Buy' : 'Sell'} ${quantity} Share${quantity > 1 ? 's' : ''}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockDetail
