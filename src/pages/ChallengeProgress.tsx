import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Circle,
  Flame,
  Trophy,
  Target,
  ArrowLeft,
  Star,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { localChallengeService, type Challenge, type ChallengeParticipation } from '../services/localChallengeService';
import LoadingSpinner from '../components/LoadingSpinner';

interface DayProgress {
  date: Date;
  completed: boolean;
  dayNumber: number;
}

const ChallengeProgress = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participation, setParticipation] = useState<ChallengeParticipation | null>(null);
  const [loading, setLoading] = useState(true);
  const [dayProgress, setDayProgress] = useState<DayProgress[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (challengeId && currentUser) {
      loadChallengeData();
    }
  }, [challengeId, currentUser]);

  const loadChallengeData = async () => {
    if (!challengeId || !currentUser) return;

    try {
      setLoading(true);

      // Load challenge details
      const challengeData = localChallengeService.getChallengeById(challengeId);
      if (!challengeData) {
        navigate('/challenges');
        return;
      }
      setChallenge(challengeData);

      // Load user participation
      const userParticipation = localChallengeService.getUserChallengeParticipation(challengeId, currentUser.uid);
      setParticipation(userParticipation);

      // Generate day progress array
      if (userParticipation) {
        generateDayProgress(challengeData, userParticipation);
      }

    } catch (error) {
      console.error('Error loading challenge data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDayProgress = (challenge: Challenge, participation: ChallengeParticipation) => {
    const days: DayProgress[] = [];
    const startDate = new Date(participation.joinedAt);

    // Calculate total days in challenge (use challenge duration)
    const totalDays = challenge.duration;

    // Get daily progress from participation data
    const dailyProgress = participation.dailyProgress || {};

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      days.push({
        date: currentDate,
        completed: Boolean(dailyProgress[dateKey]),
        dayNumber: i + 1
      });
    }

    setDayProgress(days);

    // Set streaks from participation data
    setCurrentStreak(participation.currentStreak || 0);
    setLongestStreak(participation.longestStreak || 0);
  };



  const markDayComplete = async (dayIndex: number) => {
    if (!challenge || !participation || !currentUser) {
      console.error('❌ Missing required data:', { challenge: !!challenge, participation: !!participation, currentUser: !!currentUser });
      setSuccessMessage('Missing required data. Please refresh the page.');
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    try {
      const day = dayProgress[dayIndex];
      const dateKey = day.date.toISOString().split('T')[0]; // YYYY-MM-DD format

      console.log('🎯 Marking day complete:', {
        dayIndex,
        day: day.dayNumber,
        date: dateKey,
        challengeId: challenge.id,
        userId: currentUser.uid
      });

      // Update daily progress in local storage
      localChallengeService.updateDailyProgress(challenge.id, currentUser.uid, dateKey, true);
      console.log('✅ Successfully updated daily progress in service');

      // Update local state immediately for better UX
      const updatedDays = [...dayProgress];
      updatedDays[dayIndex].completed = true;
      setDayProgress(updatedDays);

      // Calculate new progress
      const completedDays = updatedDays.filter(day => day.completed).length;
      const newProgress = (completedDays / challenge.target) * 100;

      console.log('📊 Progress calculation:', {
        completedDays,
        target: challenge.target,
        newProgress
      });

      // Update participation state
      const updatedParticipation = {
        ...participation,
        currentValue: completedDays,
        progress: newProgress,
        isCompleted: newProgress >= 100,
        dailyProgress: {
          ...participation.dailyProgress,
          [dateKey]: true
        }
      };
      setParticipation(updatedParticipation);

      // Recalculate and update streaks
      const dailyProgressMap: { [key: string]: boolean } = {};
      updatedDays.forEach(d => {
        const key = d.date.toISOString().split('T')[0];
        dailyProgressMap[key] = d.completed;
      });

      console.log('🔥 Daily progress map for streak calculation:', dailyProgressMap);

      const { currentStreak: newCurrentStreak, longestStreak: newLongestStreak } = calculateStreaksFromMap(dailyProgressMap);

      console.log('📈 Calculated streaks:', {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak
      });

      setCurrentStreak(newCurrentStreak);
      setLongestStreak(newLongestStreak);

      setSuccessMessage(`Day ${day.dayNumber} marked as complete! 🎉 Current streak: ${newCurrentStreak} days`);
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
      console.error('❌ Error updating progress:', error);
      setSuccessMessage('Failed to update progress. Please try again.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };



  const calculateStreaksFromMap = (dailyProgressMap: { [key: string]: boolean }) => {
    const dates = Object.keys(dailyProgressMap).sort();
    let currentStreak = 0;
    let longestStreak = 0;

    console.log('🔥 Calculating streaks from map:', dailyProgressMap);
    console.log('📅 Sorted dates:', dates);

    if (dates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Calculate longest streak by going through all dates
    let tempStreak = 0;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      if (dailyProgressMap[date]) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate current streak by going backwards from today
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];

    // Start from today and go backwards to find consecutive completed days
    let checkDate = new Date(today);
    currentStreak = 0;

    // Check if today is completed first
    if (dailyProgressMap[todayKey]) {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);

      // Continue backwards for consecutive days
      while (checkDate >= new Date(dates[0])) {
        const dateKey = checkDate.toISOString().split('T')[0];
        if (dailyProgressMap[dateKey]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      // If today is not completed, check if yesterday was the end of a streak
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayKey = checkDate.toISOString().split('T')[0];

      if (dailyProgressMap[yesterdayKey]) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);

        // Continue backwards for consecutive days
        while (checkDate >= new Date(dates[0])) {
          const dateKey = checkDate.toISOString().split('T')[0];
          if (dailyProgressMap[dateKey]) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    console.log('📈 Calculated streaks:', {
      currentStreak,
      longestStreak,
      todayKey,
      todayCompleted: dailyProgressMap[todayKey]
    });

    return { currentStreak, longestStreak };
  };

  const getDaysLeft = () => {
    if (!challenge || !participation) return 0;
    const now = new Date();
    const startDate = new Date(participation.joinedAt);
    const endDate = new Date(startDate.getTime() + challenge.duration * 24 * 60 * 60 * 1000);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!challenge || !participation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenge not found</h2>
          <button
            onClick={() => navigate('/challenges')}
            className="btn-primary"
          >
            Back to Challenges
          </button>
        </div>
      </div>
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
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Challenges
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{getDaysLeft()}</div>
                <div className="text-sm text-gray-500">Days Left</div>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(participation.progress)}%</div>
                <div className="text-sm text-orange-700">Progress</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{participation.currentValue}</div>
                <div className="text-sm text-blue-700">Days Completed</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{currentStreak}</div>
                <div className="text-sm text-red-700">Current Streak</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{longestStreak}</div>
                <div className="text-sm text-green-700">Best Streak</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg"
          >
            <p className="text-green-800 font-medium">{successMessage}</p>
          </motion.div>
        )}

        {/* Daily Progress Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-orange-600" />
            Daily Progress Tracker
          </h2>

          <div className="grid grid-cols-7 gap-3">
            {dayProgress.map((day, index) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const isPast = day.date < new Date();
              const canComplete = isPast || isToday;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${day.completed
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : canComplete
                        ? 'bg-gray-50 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }
                    ${isToday ? 'ring-2 ring-orange-400' : ''}
                  `}
                  onClick={() => canComplete && !day.completed && markDayComplete(index)}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center justify-center">
                      {day.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="text-xs font-medium mt-1">Day {day.dayNumber}</div>
                  </div>

                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Click on today's or past days to mark them as complete and build your streak! 🔥
          </div>
        </motion.div>

        {/* Manual Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-orange-600" />
            Manual Progress Tracking
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>

              <button
                onClick={async () => {
                  console.log('🔘 Mark Today Complete button clicked');
                  const today = new Date();
                  console.log('📅 Today:', today.toDateString());
                  console.log('📊 Day progress:', dayProgress.map(d => ({
                    date: d.date.toDateString(),
                    completed: d.completed,
                    dayNumber: d.dayNumber
                  })));

                  const todayIndex = dayProgress.findIndex(day => {
                    const dayDateString = day.date.toDateString();
                    const todayDateString = today.toDateString();
                    console.log(`🔍 Comparing: ${dayDateString} === ${todayDateString} = ${dayDateString === todayDateString}`);
                    return dayDateString === todayDateString;
                  });

                  console.log('📍 Today index found:', todayIndex);

                  if (todayIndex !== -1) {
                    const todayDay = dayProgress[todayIndex];
                    console.log('📋 Today day data:', todayDay);

                    if (!todayDay.completed) {
                      console.log('✅ Marking today as complete...');
                      await markDayComplete(todayIndex);
                    } else {
                      console.log('⚠️ Today is already completed');
                      setSuccessMessage('Today is already marked as complete!');
                      setTimeout(() => setSuccessMessage(null), 3000);
                    }
                  } else {
                    console.log('❌ Today not found in day progress');
                    setSuccessMessage('Today is not available in this challenge period.');
                    setTimeout(() => setSuccessMessage(null), 3000);
                  }
                }}
                disabled={!dayProgress.some(day => {
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const notCompleted = !day.completed;
                  console.log(`🔍 Day ${day.dayNumber}: isToday=${isToday}, notCompleted=${notCompleted}`);
                  return isToday && notCompleted;
                })}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Mark Today Complete</span>
              </button>


            </div>

            {/* Streak Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Streak Information</h3>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Streak</span>
                  <div className="flex items-center space-x-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-lg font-bold text-orange-600">{currentStreak} days</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Best Streak</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-lg font-bold text-yellow-600">{longestStreak} days</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Streak Tips</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Complete consecutive days to build your streak</li>
                  <li>• Missing a day will reset your current streak</li>
                  <li>• Your best streak is always saved</li>
                  <li>• Click on past days to mark them complete</li>
                </ul>
              </div>

              {/* Streak Management */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Streak Management</h4>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset your current streak? This action cannot be undone.')) {
                      setCurrentStreak(0);
                      setSuccessMessage('Current streak has been reset.');
                      setTimeout(() => setSuccessMessage(null), 3000);
                    }
                  }}
                  disabled={currentStreak === 0}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <span>🔄</span>
                  <span>Reset Current Streak</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dayProgress.filter(day => day.completed).length}
                </div>
                <div className="text-sm text-gray-500">Days Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dayProgress.length - dayProgress.filter(day => day.completed).length}
                </div>
                <div className="text-sm text-gray-500">Days Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(participation.progress)}%
                </div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {challenge.points}
                </div>
                <div className="text-sm text-gray-500">Points Available</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Challenge Completion */}
        {participation.isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center"
          >
            <Trophy className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Challenge Completed! 🎉</h2>
            <p className="text-green-100 mb-4">
              Congratulations! You've successfully completed the {challenge.title} challenge.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1" />
                <span>{challenge.points} Points Earned</span>
              </div>
              {challenge.rewards.badge && (
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 mr-1" />
                  <span>{challenge.rewards.badge} Badge</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChallengeProgress;
