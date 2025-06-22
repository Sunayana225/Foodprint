import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import {
  ChefHat,
  Search,
  User,
  Plus,
  TreePine,
  Droplets,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Users,
  Calendar,
  Zap,
  Heart,
  Leaf,
  Award,
  BarChart3
} from 'lucide-react'
import { localMealService, type MealStats, type Meal } from '../services/localMealService'
import { localProfileService, type ExtendedUserProfile } from '../services/localProfileService'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

const Dashboard = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [mealStats, setMealStats] = useState<MealStats | null>(null)
  const [recentMeals, setRecentMeals] = useState<Meal[]>([])
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null)

  // Function to refresh data
  const refreshData = () => {
    if (currentUser) {
      const stats = localMealService.getUserStats(currentUser.uid)
      const meals = localMealService.getUserMeals(currentUser.uid).slice(0, 3) // Get 3 most recent
      const profile = localProfileService.getUserProfile(currentUser.uid)

      setMealStats(stats)
      setRecentMeals(meals)
      setUserProfile(profile)

      console.log('📊 Dashboard data refreshed - CO2 Saved:', profile?.stats?.totalCO2Saved || 0)
    }
  }

  useEffect(() => {
    refreshData()
  }, [currentUser])

  // Refresh data when component becomes visible (user returns from other pages)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [currentUser])



  const availableFeatures = [
    {
      title: 'Add Meal',
      description: 'Track your meals and see their environmental impact',
      icon: Plus,
      path: '/add-meal',
      color: 'bg-green-500'
    },
    {
      title: 'Recipe Generator',
      description: 'Generate personalized recipes based on your ingredients',
      icon: ChefHat,
      path: '/recipe-generator',
      color: 'bg-blue-500'
    },
    {
      title: 'Challenges',
      description: 'Join sustainability challenges and compete with others',
      icon: Trophy,
      path: '/challenges',
      color: 'bg-orange-500'
    },
    {
      title: 'Profile',
      description: 'View your eco-stats, badges, and achievements',
      icon: User,
      path: '/profile',
      color: 'bg-purple-500'
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank among other eco-warriors',
      icon: Users,
      path: '/leaderboard',
      color: 'bg-red-500'
    }
  ]

  const FeatureCard = ({ feature, index }: { feature: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
      onClick={() => navigate(feature.path)}
    >
      <div className="text-center">
        <div className={`p-4 rounded-lg ${feature.color} mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <feature.icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
        <p className="text-gray-600 text-sm">{feature.description}</p>
      </div>
    </motion.div>
  )

  const StatCard = ({ icon: Icon, title, value, unit, trend, color = 'green' }: any) => {
    const colorClasses = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          {trend !== undefined && trend !== 0 && (
            <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="text-sm font-medium">{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          <span className="text-gray-500 font-medium">{unit}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome back, <span className="gradient-text">{currentUser?.displayName || 'User'}</span>
          </h1>
          <p className="text-xl text-gray-600">Track your meals, join challenges, and make a positive impact!</p>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/challenges')}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              <Trophy className="h-4 w-4 mr-2" />
              View Challenges
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>


        </motion.div>

        {/* Quick Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Eco Score</p>
                  <p className="text-2xl font-bold">
                    {mealStats ? Math.round((mealStats.totalMeals * 85) / 10) * 10 : 85}
                  </p>
                </div>
                <Leaf className="h-8 w-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Streak</p>
                  <p className="text-2xl font-bold">{mealStats ? Math.min(mealStats.totalMeals, 7) : 0}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Level</p>
                  <p className="text-2xl font-bold">{mealStats ? Math.floor(mealStats.totalMeals / 5) + 1 : 1}</p>
                </div>
                <Award className="h-8 w-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Points</p>
                  <p className="text-2xl font-bold">{mealStats ? mealStats.totalMeals * 50 : 0}</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meal Statistics */}
        {mealStats && mealStats.totalMeals > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Environmental Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={TreePine}
                title="CO₂ Saved"
                value={(userProfile?.stats?.totalCO2Saved || 0).toFixed(1)}
                unit="kg"
                trend={mealStats.weeklyTrend.co2Change}
                color="green"
              />
              <StatCard
                icon={Droplets}
                title="Water Saved"
                value={(userProfile?.stats?.totalWaterSaved || 0).toFixed(0)}
                unit="liters"
                trend={mealStats.weeklyTrend.waterChange}
                color="blue"
              />
              <StatCard
                icon={ChefHat}
                title="Meals Tracked"
                value={mealStats.totalMeals}
                unit="total"
                color="orange"
              />
            </div>
          </motion.div>
        )}

        {/* Recent Meals */}
        {recentMeals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Meals</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                {recentMeals.map((meal, index) => (
                  <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{meal.name}</h3>
                      <p className="text-sm text-gray-500">
                        {meal.createdAt.toLocaleDateString()} • {meal.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {meal.carbonFootprint.toFixed(1)} kg CO₂
                      </div>
                      <div className="text-xs text-gray-500">
                        Eco Score: {meal.ecoScore}/100
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Dashboard */}
        {showAnalytics && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            <AnalyticsDashboard userId={currentUser.uid} timeframe={30} />
          </motion.div>
        )}

        {/* Available Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{currentUser?.displayName || 'User'}</h3>
              <p className="text-gray-600">{currentUser?.email}</p>
              {mealStats && (
                <p className="text-sm text-blue-600 mt-1">
                  📊 {mealStats.totalMeals} meals tracked • All features available
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
