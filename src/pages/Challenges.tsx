import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Star,
  Plus,
  Filter,
  TrendingUp,
  Droplets,
  TreePine,
  Utensils
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { localChallengeService, type Challenge, type ChallengeParticipation } from '../services/localChallengeService';
import LoadingSpinner from '../components/LoadingSpinner';


const Challenges = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userParticipations, setUserParticipations] = useState<ChallengeParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'joined' | 'available'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [joiningChallenge, setJoiningChallenge] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
  }, [currentUser]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      console.log('🔄 Loading challenges...');
      // Load challenges from local storage
      const allChallenges = localChallengeService.getActiveChallenges();
      console.log('📊 Loaded challenges:', allChallenges.length);

      setChallenges(allChallenges);

      // Load user participations only if user is authenticated
      if (currentUser) {
        const userParticipations = localChallengeService.getUserParticipations(currentUser.uid);
        setUserParticipations(userParticipations);
      } else {
        setUserParticipations([]);
      }
    } catch (error) {
      console.error('❌ Error loading challenges:', error);
      setErrorMessage('Failed to load challenges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!currentUser) {
      setErrorMessage('Please sign in to join challenges.');
      return;
    }

    try {
      console.log('🎯 Checking challenge participation for:', challengeId, 'user:', currentUser.uid);

      // Check if user is already participating
      const existingParticipation = localChallengeService.getUserChallengeParticipation(challengeId, currentUser.uid);
      if (existingParticipation) {
        console.log('✅ User already participating, redirecting to progress page');
        navigate(`/challenges/${challengeId}`);
        return;
      }

      // Join the challenge directly (no modal needed for local storage)
      await localChallengeService.joinChallenge(challengeId, currentUser.uid);
      console.log('✅ Successfully joined challenge');

      // Refresh data to update UI
      await loadChallenges();

      setSuccessMessage('Successfully joined challenge! Check your progress in the tracker.');

      // Redirect to challenge progress tracker
      navigate(`/challenges/${challengeId}`);
    } catch (error) {
      console.error('❌ Error joining challenge:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to join challenge. Please try again.');
    }
  };

  const handleCreateChallenge = () => {
    if (!currentUser) {
      setErrorMessage('Please sign in to create challenges.');
      return;
    }

    // For now, just show a simple prompt
    const title = prompt('Enter challenge title:');
    const description = prompt('Enter challenge description:');

    if (title && description) {
      handleQuickChallenge(title, description);
    }
  };

  const handleQuickChallenge = async (title: string, description: string, category: 'carbon_reduction' | 'water_saving' | 'plant_based' | 'zero_waste' | 'local_food' = 'plant_based') => {
    if (!currentUser) {
      setErrorMessage('Please sign in to create a challenge');
      return;
    }

    try {
      console.log('🎯 Creating quick challenge:', title);

      const challengeData = {
        title,
        description,
        type: category,
        target: 7,
        unit: 'days',
        duration: 7,
        difficulty: 'medium' as const,
        points: 100,
        isActive: true,
        createdBy: currentUser.uid,
        instructions: [
          'Complete the challenge requirements daily',
          'Track your progress in the app',
          'Stay consistent for the full duration',
          'Share your achievements with the community'
        ]
      };

      const newChallenge = localChallengeService.createChallenge(challengeData);
      console.log('✅ Challenge created:', newChallenge.id);

      // Join the challenge
      await localChallengeService.joinChallenge(newChallenge.id, currentUser.uid);
      console.log('✅ Successfully joined challenge');

      setSuccessMessage(`Challenge "${title}" created and joined successfully!`);
      await loadChallenges(); // Refresh the challenges list

      // Redirect to challenge progress tracker
      navigate(`/challenges/${newChallenge.id}`);

    } catch (error) {
      console.error('❌ Error creating challenge:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create challenge. Please try again.');
    }
  };

  // Helper functions
  const isUserParticipating = (challengeId: string) => {
    return userParticipations.some(uc => uc.challengeId === challengeId);
  };

  const getUserProgress = (challengeId: string) => {
    return userParticipations.find(uc => uc.challengeId === challengeId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'carbon_reduction': return TreePine;
      case 'water_saving': return Droplets;
      case 'plant_based': return Utensils;
      case 'zero_waste': return TrendingUp;
      default: return Target;
    }
  };

  const getCategoryImage = (type: string) => {
    switch (type) {
      case 'carbon_reduction': return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
      case 'water_saving': return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
      case 'plant_based': return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
      case 'zero_waste': return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
      default: return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'joined' && !isUserParticipating(challenge.id)) return false;
    if (filter === 'available' && isUserParticipating(challenge.id)) return false;
    if (categoryFilter !== 'all' && challenge.type !== categoryFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Sustainability <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Challenges</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-4">Join challenges, compete with others, and make a positive impact!</p>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>🎯 Create Your Own Challenge!</strong> Any user can create custom challenges and invite the community to participate.
                  Share your sustainability goals and inspire others to join your mission!
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
              <button
                onClick={handleCreateChallenge}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Create Challenge</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Start Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Start Challenges</h2>
              <p className="text-gray-600 mt-1">Start these popular sustainability challenges with one click!</p>
            </div>

          </div>

          {/* Filters - Positioned right below the description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>

              {/* Combined Filters in Single Row */}
              {['all', 'joined', 'available', 'carbon_reduction', 'water_saving', 'plant_based', 'zero_waste'].map((filterOption) => {
                const isStatusFilter = ['all', 'joined', 'available'].includes(filterOption);
                const isCategoryFilter = ['carbon_reduction', 'water_saving', 'plant_based', 'zero_waste'].includes(filterOption);
                const isActive = isStatusFilter ? filter === filterOption : categoryFilter === filterOption;

                return (
                  <button
                    key={filterOption}
                    onClick={() => {
                      if (isStatusFilter) {
                        setFilter(filterOption as any);
                        // Reset category filter when changing status
                        if (filterOption !== 'all') {
                          setCategoryFilter('all');
                        }
                      } else if (isCategoryFilter) {
                        setCategoryFilter(filterOption);
                        // Reset status filter when selecting specific category
                        setFilter('all');
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Plant-Based Week",
                description: "Go plant-based for 7 days",
                category: "plant_based" as const,
                icon: "🥗"
              },
              {
                title: "Water Saver",
                description: "Reduce water usage by taking shorter showers",
                category: "water_saving" as const,
                icon: "💧"
              },
              {
                title: "Carbon Cutter",
                description: "Walk or bike instead of driving for short trips",
                category: "carbon_reduction" as const,
                icon: "🚴"
              },
              {
                title: "Zero Waste Week",
                description: "Minimize waste for 7 consecutive days",
                category: "zero_waste" as const,
                icon: "🔄"
              }
            ].map((quickChallenge, index) => (
              <motion.div
                key={quickChallenge.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300 group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{quickChallenge.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{quickChallenge.title}</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">{quickChallenge.description}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🔘 Quick challenge button clicked:', quickChallenge.title);
                      handleQuickChallenge(quickChallenge.title, quickChallenge.description, quickChallenge.category);
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Start Challenge
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => {
            const IconComponent = getCategoryIcon(challenge.type);
            const isParticipating = isUserParticipating(challenge.id);
            const userProgress = getUserProgress(challenge.id);
            const daysLeft = challenge.duration;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isParticipating ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {/* Challenge Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getCategoryImage(challenge.type)}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    {isParticipating && (
                      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-green-600 fill-current" />
                        <span className="text-xs font-medium text-green-600">Joined</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                        <p className="text-sm text-gray-500">by Community</p>
                      </div>
                    </div>
                  </div>

                  {/* Challenge Description */}
                  <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

                  {/* Challenge Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-700">{challenge.participants.length}</div>
                      <div className="text-xs text-green-600">Participants</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-700">{challenge.points}</div>
                      <div className="text-xs text-blue-600">Points</div>
                    </div>
                  </div>

                {/* Progress Bar (if participating) */}
                {isParticipating && userProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{Math.round(userProgress.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${userProgress.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {userProgress.currentValue} / {challenge.target} {challenge.unit}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-auto">
                  {isParticipating ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate(`/challenges/${challenge.id}`)}
                        className="w-full btn-primary text-sm py-2"
                      >
                        View Progress & Track Days
                      </button>
                      {userProgress?.isCompleted && (
                        <div className="flex items-center justify-center space-x-1 text-green-600 mt-2">
                          <Trophy className="h-4 w-4" />
                          <span className="text-xs font-medium">Completed!</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔘 Join challenge button clicked:', challenge.id);
                        handleJoinChallenge(challenge.id);
                      }}
                      className="w-full btn-primary text-sm py-2"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new challenge!</p>
          </motion.div>
        )}


      </div>
    </div>
  );
};

export default Challenges;
