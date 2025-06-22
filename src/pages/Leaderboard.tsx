import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Star,
  Flame
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { localLeaderboardService, type LeaderboardEntry } from '../services/localLeaderboardService';
import LoadingSpinner from '../components/LoadingSpinner';

const Leaderboard = () => {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = localLeaderboardService.getLeaderboard({
        timeframe: timeFilter === 'all' ? 'all_time' : timeFilter === 'month' ? 'this_month' : 'this_week',
        category: 'points',
        limit: 100
      });
      setLeaderboard(data);

      // Find current user's rank
      if (currentUser) {
        const currentUserEntry = data.find(entry => entry.user.uid === currentUser.uid);
        setUserRank(currentUserEntry || null);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for ranking display
  // const getRankIcon = (rank: number) => {
  //   switch (rank) {
  //     case 1:
  //       return <Crown className="h-6 w-6 text-yellow-500" />;
  //     case 2:
  //       return <Medal className="h-6 w-6 text-gray-400" />;
  //     case 3:
  //       return <Medal className="h-6 w-6 text-amber-600" />;
  //     default:
  //       return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  //   }
  // };

  // const getRankBadgeColor = (rank: number) => {
  //   switch (rank) {
  //     case 1:
  //       return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  //     case 2:
  //       return 'bg-gradient-to-r from-gray-300 to-gray-500';
  //     case 3:
  //       return 'bg-gradient-to-r from-amber-400 to-amber-600';
  //     default:
  //       return 'bg-gradient-to-r from-gray-200 to-gray-300';
  //   }
  // };

  // const getLevel = (points: number) => {
  //   return Math.floor(points / 100) + 1;
  // };

  const getLevelProgress = (points: number) => {
    return (points % 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-gray-600">See how you rank among eco-warriors worldwide!</p>
        </motion.div>

        {/* Time Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
            {['all', 'month', 'week'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter === 'all' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Current User Rank Card */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    {userRank.user.photoURL ? (
                      <img
                        src={userRank.user.photoURL}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold">
                        {userRank.user.displayName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your Rank: #{userRank.rank}</h3>
                    <p className="text-white text-opacity-90">{userRank.user.displayName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{userRank.stats.totalPoints} points</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4" />
                        <span>{userRank.stats.challengesCompleted} challenges</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4" />
                        <span>{userRank.stats.streakDays} day streak</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">Level {userRank.stats.level}</div>
                  <div className="w-32 bg-white bg-opacity-20 rounded-full h-2 mt-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{ width: `${getLevelProgress(userRank.stats.totalPoints)}%` }}
                    />
                  </div>
                  <div className="text-xs mt-1 text-white text-opacity-75">
                    {getLevelProgress(userRank.stats.totalPoints)}/100 to next level
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="card bg-gradient-to-b from-gray-100 to-gray-200 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                  </div>
                  <div className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                      {leaderboard[1].user.photoURL ? (
                        <img
                          src={leaderboard[1].user.photoURL}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-600">
                          {leaderboard[1].user.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{leaderboard[1].user.displayName}</h3>
                    <p className="text-gray-600 text-sm">{leaderboard[1].stats.totalPoints} points</p>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="card bg-gradient-to-b from-yellow-100 to-yellow-200 relative transform scale-110">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Crown className="h-10 w-10 text-yellow-500" />
                  </div>
                  <div className="pt-8">
                    <div className="w-20 h-20 mx-auto mb-3 bg-yellow-300 rounded-full flex items-center justify-center">
                      {leaderboard[0].user.photoURL ? (
                        <img
                          src={leaderboard[0].user.photoURL}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-yellow-800">
                          {leaderboard[0].user.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{leaderboard[0].user.displayName}</h3>
                    <p className="text-gray-600">{leaderboard[0].stats.totalPoints} points</p>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="card bg-gradient-to-b from-amber-100 to-amber-200 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                  </div>
                  <div className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-3 bg-amber-300 rounded-full flex items-center justify-center">
                      {leaderboard[2].user.photoURL ? (
                        <img
                          src={leaderboard[2].user.photoURL}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-amber-800">
                          {leaderboard[2].user.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{leaderboard[2].user.displayName}</h3>
                    <p className="text-gray-600 text-sm">{leaderboard[2].stats.totalPoints} points</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Full Rankings</h2>
          <div className="space-y-3">
            {leaderboard.slice(3).map((entry, index) => (
              <motion.div
                key={entry.user.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  entry.user.uid === currentUser?.uid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 text-center">
                    <span className="text-lg font-bold text-gray-600">#{entry.rank}</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    {entry.user.photoURL ? (
                      <img
                        src={entry.user.photoURL}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-600">
                        {entry.user.displayName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{entry.user.displayName}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>Level {entry.stats.level}</span>
                      <span>•</span>
                      <span>{entry.stats.challengesCompleted} challenges</span>
                      <span>•</span>
                      <span>{entry.stats.streakDays} day streak</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{entry.stats.totalPoints}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rankings yet</h3>
            <p className="text-gray-600">Complete some challenges to appear on the leaderboard!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
