import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../utils/api'
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi'

const Profile = () => {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState({
    riskLevel: 'Medium',
    goal: 'Balanced',
    investmentHorizon: 'Medium'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await userAPI.getPreferences()
      setPreferences(response.data.preferences)
    } catch (error) {
      console.error('Error fetching preferences:', error)
    }
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSavePreferences = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)

    try {
      await userAPI.updatePreferences(preferences)
      setMessage({ type: 'success', text: 'Preferences updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update preferences' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <div className="inline-block bg-primary-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-600">
                <FiUser className="mr-3" />
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiMail className="mr-3" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center text-gray-600">
                  <FiPhone className="mr-3" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Member since:</span>{' '}
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Investment Preferences */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Preferences</h2>
            
            <p className="text-gray-600 mb-6">
              Help us personalize your experience by setting your investment preferences. 
              This will help us recommend stocks that match your goals.
            </p>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-6">
              {/* Risk Level */}
              <div>
                <label className="label">Risk Tolerance</label>
                <p className="text-sm text-gray-600 mb-3">
                  How much risk are you willing to take with your investments?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {['Low', 'Medium', 'High'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handlePreferenceChange('riskLevel', level)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        preferences.riskLevel === level
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-800">{level}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {level === 'Low' && 'Conservative'}
                        {level === 'Medium' && 'Moderate'}
                        {level === 'High' && 'Aggressive'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment Goal */}
              <div>
                <label className="label">Investment Goal</label>
                <p className="text-sm text-gray-600 mb-3">
                  What is your primary investment objective?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {['Income', 'Balanced', 'Growth'].map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handlePreferenceChange('goal', goal)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        preferences.goal === goal
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-800">{goal}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {goal === 'Income' && 'Regular returns'}
                        {goal === 'Balanced' && 'Mix of both'}
                        {goal === 'Growth' && 'Capital appreciation'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment Horizon */}
              <div>
                <label className="label">Investment Horizon</label>
                <p className="text-sm text-gray-600 mb-3">
                  How long do you plan to stay invested?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {['Short', 'Medium', 'Long'].map(horizon => (
                    <button
                      key={horizon}
                      type="button"
                      onClick={() => handlePreferenceChange('investmentHorizon', horizon)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        preferences.investmentHorizon === horizon
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-800">{horizon}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {horizon === 'Short' && '< 2 years'}
                        {horizon === 'Medium' && '2-5 years'}
                        {horizon === 'Long' && '> 5 years'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center"
                disabled={loading}
              >
                <FiSave className="mr-2" />
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-700">
                💡 <span className="font-semibold">Tip:</span> Your preferences help us recommend 
                stocks that align with your investment strategy. You can update these anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
