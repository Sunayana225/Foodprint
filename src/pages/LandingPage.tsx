import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Target,
  Award,
  ArrowRight,
  Plus,
  LogIn,
  UserPlus
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'

const LandingPage = () => {
  const { currentUser } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const features = [
    {
      icon: BarChart3,
      title: 'Track Your Impact',
      description: 'Monitor your carbon footprint, water usage, and land impact with beautiful visualizations.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Set Goals',
      description: 'Create personalized environmental goals and track your progress over time.',
      color: 'from-primary-600 to-primary-700'
    },
    {
      icon: Award,
      title: 'Join Challenges',
      description: 'Participate in community challenges or create your own. Anyone can create and join sustainability challenges!',
      color: 'from-secondary-600 to-accent-600'
    }
  ]

  // const stats = [
  //   { icon: Droplets, value: '2,500L', label: 'Water Saved', color: 'text-blue-600' },
  //   { icon: TreePine, value: '15kg', label: 'CO₂ Reduced', color: 'text-primary-700' },
  //   { icon: Recycle, value: '89%', label: 'Eco Score', color: 'text-secondary-700' }
  // ]

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80"
            alt="Fresh Salad Ingredients Background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50"></div>
          {/* Subtle warm overlay to maintain food theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent"></div>
        </div>



        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="flex flex-col items-center text-center">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              <div className="inline-block bg-white/90 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
                <span className="text-amber-800 font-medium">🌱 Premium Sustainability Tracking</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                A Premium{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 drop-shadow-none">
                  And Sustainable
                </span>{' '}
                Food Experience
              </h1>

              <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                Discover the environmental impact of every meal with our premium tracking platform.
                Make conscious choices that nourish both you and the planet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                {currentUser ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group"
                    >
                      <span>Go to Dashboard</span>
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/add-meal"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-800 font-semibold rounded-xl hover:bg-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      <span>Add Meal</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(217, 119, 6, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openAuthModal('signup')}
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg group"
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      <span>Start Your Journey</span>
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openAuthModal('login')}
                      className="inline-flex items-center justify-center px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-800 font-semibold rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      <span>Sign In</span>
                    </motion.button>
                  </>
                )}
              </div>

              {/* Premium Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                {[
                  { number: '10K+', label: 'Premium Users', icon: '👥' },
                  { number: '50K+', label: 'Meals Analyzed', icon: '🍽️' },
                  { number: '2.5M', label: 'CO₂ Reduced', icon: '🌍' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    className="text-center group bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-amber-800 mb-1">{stat.number}</div>
                    <div className="text-gray-700 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Solid Food Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Healthy Food, <span className="text-primary-700">Healthy Planet</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover delicious, sustainable meals that nourish both your body and the environment.
                Every choice you make creates a positive impact.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-700 mb-2">500+</div>
                  <div className="text-gray-600">Healthy Recipes</div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="text-3xl font-bold text-secondary-700 mb-2">95%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200"
                      alt="Fresh Salad Bowl"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900">Fresh Salads</h3>
                      <p className="text-sm text-primary-600 mt-2">Low carbon footprint</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200"
                      alt="Fresh Avocados and Superfoods"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900">Superfoods</h3>
                      <p className="text-sm text-primary-600 mt-2">Nutrient dense</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200"
                      alt="Fresh Apples"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900">Fresh Fruits</h3>
                      <p className="text-sm text-primary-600 mt-2">Locally sourced</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200"
                      alt="Fresh Vegetables"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900">Vegetables</h3>
                      <p className="text-sm text-primary-600 mt-2">Organic options</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Categories Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Track Your <span className="text-primary-700">Food Impact</span>
            </h2>
            <p className="text-lg text-gray-600">
              See how your food choices affect the environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250"
                alt="Plant-Based Bowl"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Plant-Based Foods</h3>
                <p className="text-gray-600 mb-4">Vegetables, fruits, and grains with minimal environmental impact</p>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Low Carbon Footprint
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250"
                alt="Grilled Salmon"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Proteins</h3>
                <p className="text-gray-600 mb-4">Fish, legumes, and responsibly sourced proteins</p>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  Moderate Impact
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250"
                alt="Plant-Based Milk"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Dairy Alternatives</h3>
                <p className="text-gray-600 mb-4">Plant-based milks and sustainable dairy options</p>
                <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  Water Efficient
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-16 bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">
                Sustainable Eating Made <span className="text-accent-300">Simple</span>
              </h2>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Discover how your food choices impact the environment. Track your carbon footprint,
                find eco-friendly alternatives, and join a community committed to sustainable living.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-300 mb-2">50K+</div>
                  <div className="text-primary-200">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-300 mb-2">1M+</div>
                  <div className="text-primary-200">Meals Tracked</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Today's Impact</h3>
                      <p className="text-gray-600">Your eco-friendly choices</p>
                    </div>
                  </div>

                  {/* Food Items with Impact */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
                          alt="Quinoa Salad"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">Quinoa Salad</span>
                      </div>
                      <span className="text-xs font-bold text-green-600">-0.8kg CO₂</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
                          alt="Avocado Toast"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">Avocado Toast</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">-45L Water</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
                          alt="Apple Snack"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">Apple Snack</span>
                      </div>
                      <span className="text-xs font-bold text-purple-600">+5 Eco Points</span>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Carbon Saved</span>
                      <span className="font-bold text-primary-700">2.3 kg CO₂</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Water Saved</span>
                      <span className="font-bold text-blue-600">150 L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Eco Score</span>
                      <span className="font-bold text-secondary-600">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-center">
              Everything You Need for <span className="gradient-text">Sustainable Living</span>
            </h2>
            <p className="section-subtitle">
              Powerful tools and insights to help you make eco-friendly food choices every day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="feature-card text-center"
                >
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${feature.color} p-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Healthy Food Gallery */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Make Every Meal <span className="text-primary-700">Count</span>
            </h2>
            <p className="text-lg text-gray-600">
              See how delicious and sustainable eating can go hand in hand
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250"
                alt="Plant-Based Wrap"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plant-Based Wraps</h3>
                <p className="text-gray-600 mb-4">Delicious and nutritious wraps packed with fresh vegetables and plant proteins.</p>
                <div className="flex justify-center space-x-4 text-sm">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">Low Carbon</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Water Efficient</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250"
                alt="Healthy Bowl"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainable Bowls</h3>
                <p className="text-gray-600 mb-4">Colorful grain bowls with locally sourced ingredients and minimal environmental impact.</p>
                <div className="flex justify-center space-x-4 text-sm">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Local Sourced</span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">Nutrient Dense</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1622597467836-f3285f2131b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250"
                alt="Green Smoothie"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Green Smoothies</h3>
                <p className="text-gray-600 mb-4">Refreshing smoothies made with organic fruits and vegetables for optimal health.</p>
                <div className="flex justify-center space-x-4 text-sm">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">Organic</span>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full">Antioxidant Rich</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Challenges Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Create & Join <span className="text-primary-700">Community Challenges</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Be part of a vibrant community where anyone can create sustainability challenges.
                Set goals, invite friends, and compete to make the biggest positive impact on our planet.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Create custom challenges for any sustainability goal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Join challenges created by other community members</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Track progress and compete with friends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Earn rewards and recognition for achievements</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400"
                alt="Community working together"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Popular Challenge Types</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🌱</span>
                      <span className="text-gray-700">Plant-based meals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💧</span>
                      <span className="text-gray-700">Water conservation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🚲</span>
                      <span className="text-gray-700">Carbon reduction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🏆</span>
                      <span className="text-gray-700">Daily streaks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-white via-primary-50 to-primary-100 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Ready to Make a <span className="text-primary-700">Difference?</span>
            </h2>
            <p className="text-2xl text-gray-700 mb-12 max-w-2xl mx-auto">
              Join thousands of eco-warriors making conscious food choices for a better planet.
            </p>
            {!currentUser ? (
              <button
                onClick={() => openAuthModal('signup')}
                className="btn-primary-large group"
              >
                <span>Get Started Today</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="btn-primary-large group"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  )
}

export default LandingPage
