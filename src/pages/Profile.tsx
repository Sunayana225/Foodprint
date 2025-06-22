import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  Edit3,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { localProfileService, type ExtendedUserProfile } from '../services/localProfileService'

const Profile = () => {
  console.log('🔍 Profile component rendering...')

  const { currentUser } = useAuth()
  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editedProfile, setEditedProfile] = useState({
    displayName: '',
    location: '',
    dietaryPreference: '',
    goals: {
      carbonReduction: 25,
      waterSaving: 30,
      plantBasedMeals: 4
    }
  })

  console.log('🔍 Profile state - currentUser:', !!currentUser)
  console.log('🔍 Profile state - userProfile:', !!userProfile)
  console.log('🔍 Profile state - loading:', loading)
  console.log('🔍 Profile state - error:', error)

  // Load user profile from local storage
  useEffect(() => {
    if (currentUser) {
      console.log('🔍 Loading profile for user:', currentUser.uid)
      try {
        const profile = localProfileService.getUserProfile(currentUser.uid)
        if (profile) {
          console.log('✅ Profile loaded successfully:', profile)
          setUserProfile(profile)
          setError(null)
        } else {
          console.log('⚠️ No profile found, creating one...')
          // Create profile if it doesn't exist
          const newProfile = localProfileService.createOrUpdateProfile(currentUser.uid, {
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'User',
            photoURL: currentUser.photoURL
          })
          setUserProfile(newProfile)
        }
      } catch (error) {
        console.error('❌ Error loading profile:', error)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
  }, [currentUser])

  // Debug logging
  useEffect(() => {
    console.log('🔍 Profile Debug - Current User:', currentUser?.email)
    console.log('🔍 Profile Debug - User Profile:', userProfile)
    console.log('🔍 Profile Debug - Loading:', loading)
  }, [currentUser, userProfile, loading])

  // Initialize edited profile when userProfile loads
  useEffect(() => {
    if (userProfile) {
      console.log('✅ Profile loaded successfully:', userProfile)
      setEditedProfile({
        displayName: userProfile.displayName || '',
        location: '', // Add location to UserProfile interface if needed
        dietaryPreference: '', // Add dietary preference to UserProfile interface if needed
        goals: {
          carbonReduction: 25,
          waterSaving: 30,
          plantBasedMeals: 4
        }
      })
      setLoading(false)
      setError(null)
    } else if (currentUser) {
      console.log('⚠️ User authenticated but no profile found')
      setError('Profile not found. Please try refreshing the page.')
      setLoading(false)
    }
  }, [userProfile, currentUser])

  // Handle loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && currentUser) {
        console.log('⏰ Profile loading timeout')
        setError('Profile loading is taking longer than expected. Please try refreshing the page.')
        setLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeout)
  }, [loading, currentUser])

  // Format join date
  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long'
    }).format(new Date(date))
  }

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Logged your first meal', earned: true, date: 'Mar 15, 2024' },
    { id: 2, title: 'Week Warrior', description: 'Maintained streak for 7 days', earned: true, date: 'Mar 22, 2024' },
    { id: 3, title: 'Plant Power', description: 'Ate 10 plant-based meals', earned: true, date: 'Apr 2, 2024' },
    { id: 4, title: 'Water Saver', description: 'Saved 10,000L of water', earned: true, date: 'May 10, 2024' },
    { id: 5, title: 'Carbon Crusher', description: 'Reduced CO₂ by 50kg', earned: false, progress: 90 },
    { id: 6, title: 'Consistency King', description: 'Log meals for 30 days straight', earned: false, progress: 40 }
  ]

  const handleSave = async () => {
    try {
      if (currentUser && userProfile) {
        const updatedProfile = localProfileService.createOrUpdateProfile(currentUser.uid, {
          email: currentUser.email || '',
          displayName: editedProfile.displayName,
          photoURL: currentUser.photoURL
        })
        setUserProfile(updatedProfile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  // Show loading state if user data is not available
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Please sign in to view your profile...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  const handleCreateProfile = async () => {
    if (!currentUser) return

    setLoading(true)
    setError(null)

    try {
      console.log('🔧 Manually creating profile...')
      const newProfile = localProfileService.createOrUpdateProfile(currentUser.uid, {
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'User',
        photoURL: currentUser.photoURL
      })

      if (newProfile) {
        console.log('✅ Profile created successfully!')
        setUserProfile(newProfile)
        setError(null)
      } else {
        setError('Profile creation failed. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error creating profile:', error)
      setError(`Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestFirestore = async () => {
    if (!currentUser) return

    try {
      console.log('🧪 Testing Firestore connection...')
      const { db } = await import('../config/firebase')
      const { doc, getDoc } = await import('firebase/firestore')

      // Try to read a document (this will test permissions)
      const testDoc = await getDoc(doc(db, 'users', currentUser.uid))
      console.log('🧪 Firestore test result:', testDoc.exists() ? 'Document exists' : 'Document does not exist')
      console.log('🧪 Firestore connection: OK')
    } catch (error) {
      console.error('🧪 Firestore test failed:', error)
    }
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-600 text-2xl">📝</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Setup Required</h2>
          <p className="text-gray-600 mb-4">
            Your profile needs to be created. This usually happens automatically, but you can create it manually.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleCreateProfile}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline w-full"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleTestFirestore}
                className="btn-outline w-full text-sm"
              >
                🧪 Test Firestore Connection
              </button>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Signed in as: {currentUser?.email}</p>
            <p>User ID: {currentUser?.uid}</p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-left">
                <p><strong>Debug Info:</strong></p>
                <p>Display Name: {currentUser?.displayName || 'None'}</p>
                <p>Email Verified: {currentUser?.emailVerified ? 'Yes' : 'No'}</p>
                <p>Provider: {currentUser?.providerData?.[0]?.providerId || 'Unknown'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  console.log('🔍 Profile rendering main content...')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Track your progress and manage your sustainability journey</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  {isEditing ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {userProfile.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {userProfile.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="text-lg font-semibold text-gray-900">{userProfile.displayName || 'User'}</div>
                <div className="text-sm text-gray-500">Eco Warrior • Level {Math.floor(userProfile.stats.totalMeals / 20) + 1}</div>
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editedProfile.displayName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, displayName: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={currentUser.email || ''}
                        disabled
                        className="input-field bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
                      <select
                        value={editedProfile.dietaryPreference}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, dietaryPreference: e.target.value }))}
                        className="input-field"
                      >
                        <option value="Omnivore">Omnivore</option>
                        <option value="Flexitarian">Flexitarian</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                    </div>
                    <button onClick={handleSave} className="w-full btn-primary flex items-center justify-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email</span>
                      <span className="text-gray-900">{currentUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="text-gray-900">{formatJoinDate(userProfile.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login</span>
                      <span className="text-gray-900">{formatJoinDate(userProfile.lastLoginAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dietary Restrictions</span>
                      <span className="text-gray-900">
                        {userProfile.preferences.dietaryRestrictions.length > 0
                          ? userProfile.preferences.dietaryRestrictions.join(', ')
                          : 'None specified'
                        }
                      </span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{userProfile.stats.totalMeals}</div>
                  <div className="text-sm text-gray-500">Meals Logged</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">{userProfile.stats.streakDays}</div>
                  <div className="text-sm text-gray-500">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userProfile.stats.totalCO2Saved.toFixed(1)}kg</div>
                  <div className="text-sm text-gray-500">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userProfile.stats.totalWaterSaved.toLocaleString()}L</div>
                  <div className="text-sm text-gray-500">Water Saved</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Goals & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Total Meals Logged</span>
                    <span className="text-sm font-medium">{userProfile.stats.totalMeals}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((userProfile.stats.totalMeals / 100) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-green-500 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Goal: 100 meals</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Current Streak</span>
                    <span className="text-sm font-medium">{userProfile.stats.streakDays} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((userProfile.stats.streakDays / 30) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="bg-blue-500 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Goal: 30 day streak</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Sustainability Goals</span>
                    <span className="text-sm font-medium">{userProfile.preferences.sustainabilityGoals.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((userProfile.preferences.sustainabilityGoals.length / 5) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="bg-purple-500 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Set up to 5 goals</p>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.earned
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Award className={`h-8 w-8 ${
                        achievement.earned ? 'text-yellow-500' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        {achievement.earned ? (
                          <p className="text-xs text-yellow-600 mt-1">Earned {achievement.date}</p>
                        ) : (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-primary-500 h-1 rounded-full"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{achievement.progress}% complete</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
