import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { localProfileService, type ExtendedUserProfile } from '../services/localProfileService'
import { localMealService } from '../services/localMealService'
import { motion } from 'framer-motion'
import { User, Award, Target, Settings, Calendar, TrendingUp, BarChart3 } from 'lucide-react'
import ProgressChart from '../components/ProgressChart'

const ProfileSimple = () => {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'achievements'>('overview')

  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        try {
          // Create or get profile
          let userProfile = localProfileService.getUserProfile(currentUser.uid)

          if (!userProfile) {
            userProfile = await localProfileService.createOrUpdateProfile(currentUser.uid, {
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'User',
              photoURL: currentUser.photoURL || undefined
            })
          }

          setProfile(userProfile)

          // Generate sample progress data
          const meals = localMealService.getUserMeals(currentUser.uid)
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return date.toISOString().split('T')[0]
          })

          const progressData = last7Days.map(date => {
            const dayMeals = meals.filter(meal =>
              meal.createdAt.toISOString().split('T')[0] === date
            )
            const co2Saved = dayMeals.reduce((sum, meal) => sum + meal.carbonFootprint, 0)
            return {
              date,
              value: co2Saved,
              target: 2.0 // Daily target of 2kg CO2 saved
            }
          })

          setProgressData(progressData)
        } catch (error) {
          console.error('Error loading profile:', error)
        }
      }
      setLoading(false)
    }

    loadProfile()
  }, [currentUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Signed In</h1>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">Unable to load your profile.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
        </motion.div>

        {/* User Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6 mb-6"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{profile.displayName}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">Level {profile.stats.level} • Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-white rounded-lg shadow-md p-1">
            <div className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'progress', label: 'Progress', icon: BarChart3 },
                { id: 'achievements', label: 'Achievements', icon: Award }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
                {/* Statistics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
            >
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{profile.stats.totalMeals}</p>
            <p className="text-sm text-gray-600 mt-1">Total Meals</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{profile.stats.streakDays}</p>
            <p className="text-sm text-gray-600 mt-1">Streak Days</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-red-600">{profile.stats.totalCO2Saved.toFixed(1)}kg</p>
            <p className="text-sm text-gray-600 mt-1">CO₂ Saved</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{profile.stats.totalWaterSaved.toLocaleString()}L</p>
            <p className="text-sm text-gray-600 mt-1">Water Saved</p>
          </div>
        </motion.div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6 mb-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Award className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Badges</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.badges.map((badge) => (
                <div key={badge.id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <h3 className="font-medium text-gray-900 text-sm">{badge.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">Your Goals</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{profile.goals.dailyCO2Target}kg</p>
                  <p className="text-sm text-gray-600">Daily CO₂ Target</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{profile.goals.weeklyMealsTarget}</p>
                  <p className="text-sm text-gray-600">Weekly Meals Target</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{profile.goals.monthlyPointsTarget}</p>
                  <p className="text-sm text-gray-600">Monthly Points Target</p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressChart
                data={progressData}
                title="Daily CO₂ Impact"
                unit="kg"
                color="green"
                showTrend={true}
              />

              <ProgressChart
                data={progressData.map(d => ({ ...d, value: d.value * 500, target: 1000 }))}
                title="Water Saved"
                unit="L"
                color="blue"
                showTrend={true}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{progressData.reduce((sum, d) => sum + d.value, 0).toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Total CO₂ Saved</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{(progressData.reduce((sum, d) => sum + d.value, 0) * 500).toFixed(0)}</p>
                  <p className="text-sm text-gray-600">Water Saved (L)</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{progressData.filter(d => d.value > 0).length}</p>
                  <p className="text-sm text-gray-600">Active Days</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{Math.round((progressData.filter(d => d.value >= d.target).length / 7) * 100)}%</p>
                  <p className="text-sm text-gray-600">Goal Achievement</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Badges */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900">Earned Badges</h2>
              </div>
              {profile.badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {profile.badges.map((badge) => (
                    <div key={badge.id} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h3 className="font-medium text-gray-900 text-sm">{badge.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Earned {new Date(badge.earnedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No badges earned yet. Complete challenges to earn your first badge!</p>
                </div>
              )}
            </div>

            {/* Achievement Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Progress</h3>
              <div className="space-y-4">
                {[
                  { name: 'Eco Warrior', description: 'Complete 10 challenges', progress: Math.min(profile.stats.challengesCompleted, 10), target: 10 },
                  { name: 'Meal Master', description: 'Track 50 meals', progress: Math.min(profile.stats.totalMeals, 50), target: 50 },
                  { name: 'Carbon Saver', description: 'Save 100kg CO₂', progress: Math.min(profile.stats.totalCO2Saved, 100), target: 100 },
                  { name: 'Streak Champion', description: 'Maintain 30-day streak', progress: Math.min(profile.stats.streakDays, 30), target: 30 }
                ].map((achievement, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                      <span className="text-sm text-gray-600">{achievement.progress}/{achievement.target}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProfileSimple
