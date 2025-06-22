import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  Target,
  Trophy,
  Calendar,
  Star,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Challenge } from '../services/localChallengeService';

interface ChallengeInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinChallenge: () => void;
  challenge: Challenge | null;
  loading?: boolean;
}

const ChallengeInstructionsModal: React.FC<ChallengeInstructionsModalProps> = ({
  isOpen,
  onClose,
  onJoinChallenge,
  challenge,
  loading = false
}) => {
  if (!challenge) return null;

  const getDaysLeft = (endDate: Date | string) => {
    try {
      const now = new Date();
      const end = endDate instanceof Date ? endDate : new Date(endDate);
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch (error) {
      return 0;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'carbon': return '🌱';
      case 'water': return '💧';
      case 'meals': return '🥗';
      case 'streak': return '🔥';
      default: return '🎯';
    }
  };

  // Default instructions based on category if none provided
  const getDefaultInstructions = (category: string) => {
    switch (category) {
      case 'carbon':
        return [
          'Track your daily carbon footprint using the app',
          'Choose eco-friendly transportation options',
          'Reduce energy consumption at home',
          'Log your progress daily in the challenge tracker'
        ];
      case 'water':
        return [
          'Monitor your daily water usage',
          'Take shorter showers (aim for 5 minutes or less)',
          'Fix any leaky faucets or pipes',
          'Use water-efficient appliances when possible',
          'Record your water savings in the app'
        ];
      case 'meals':
        return [
          'Plan your meals in advance',
          'Choose plant-based options when possible',
          'Log each meal in the FoodPrint app',
          'Take photos of your sustainable meals',
          'Share your favorite recipes with the community'
        ];
      case 'streak':
        return [
          'Log into the app daily',
          'Complete your daily sustainability action',
          'Track your progress consistently',
          'Maintain your streak by not missing any days'
        ];
      default:
        return [
          'Read the challenge description carefully',
          'Track your progress daily',
          'Stay consistent with your efforts',
          'Use the app to log your activities'
        ];
    }
  };

  const getDefaultTips = (category: string) => {
    switch (category) {
      case 'carbon':
        return [
          'Start with small changes like using public transport',
          'Set reminders to track your daily activities',
          'Join community discussions for motivation'
        ];
      case 'water':
        return [
          'Install a shower timer to track your time',
          'Keep a water usage journal',
          'Celebrate small wins to stay motivated'
        ];
      case 'meals':
        return [
          'Try "Meatless Monday" to start your week strong',
          'Explore new plant-based recipes online',
          'Connect with other participants for recipe ideas'
        ];
      case 'streak':
        return [
          'Set a daily reminder on your phone',
          'Make logging part of your daily routine',
          'Don\'t give up if you miss a day - restart your streak!'
        ];
      default:
        return [
          'Stay consistent and don\'t give up',
          'Connect with other participants for support',
          'Celebrate your progress along the way'
        ];
    }
  };

  const instructions = challenge.instructions || getDefaultInstructions(challenge.category);
  const tips = challenge.tips || getDefaultTips(challenge.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{getCategoryIcon(challenge.category)}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 mb-3">{challenge.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {getDaysLeft(challenge.endDate)} days left
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Trophy className="h-4 w-4 mr-1" />
                        {challenge.points} points
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Challenge Goal */}
              <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-900">Challenge Goal</h4>
                </div>
                <p className="text-orange-800">
                  Achieve <strong>{challenge.targetValue} {challenge.targetUnit}</strong> to complete this challenge
                </p>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">How to Complete</h4>
                </div>
                <div className="space-y-2">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-gray-700">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900">Tips for Success</h4>
                </div>
                <div className="space-y-2">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              {challenge.rules && challenge.rules.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Challenge Rules</h4>
                  <div className="space-y-1">
                    {challenge.rules.map((rule, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <p className="text-gray-600 text-sm">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rewards */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Rewards</h4>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-purple-800">🏆 {challenge.points} Points</span>
                  {challenge.rewards.badge && (
                    <span className="text-purple-800">🏅 {challenge.rewards.badge}</span>
                  )}
                  {challenge.rewards.title && (
                    <span className="text-purple-800">👑 {challenge.rewards.title}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onJoinChallenge}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Joining...</span>
                    </div>
                  ) : (
                    <>
                      <span>Join Challenge</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChallengeInstructionsModal;
