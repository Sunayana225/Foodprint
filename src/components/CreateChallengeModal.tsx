import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trophy,
  TreePine,
  Droplets,
  Utensils,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { challengeService } from '../services/challengeService';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeCreated: () => void;
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onChallengeCreated
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'carbon',
    difficulty: 'Easy',
    targetValue: '',
    targetUnit: 'kg',
    duration: '7',
    rewards: {
      points: 100,
      badge: 'Eco Warrior'
    }
  });

  const categories = [
    { id: 'carbon', label: 'Carbon Reduction', icon: TreePine, unit: 'kg CO₂' },
    { id: 'water', label: 'Water Conservation', icon: Droplets, unit: 'liters' },
    { id: 'meals', label: 'Sustainable Meals', icon: Utensils, unit: 'meals' },
    { id: 'streak', label: 'Daily Streak', icon: TrendingUp, unit: 'days' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(formData.duration));

      const challengeData = {
        title: formData.title,
        description: formData.description,
        type: 'custom' as const,
        category: formData.category as 'carbon' | 'water' | 'meals' | 'streak' | 'general',
        difficulty: formData.difficulty as 'Easy' | 'Medium' | 'Hard',
        targetValue: parseFloat(formData.targetValue),
        targetUnit: formData.targetUnit,
        points: formData.rewards.points,
        startDate: new Date(),
        endDate,
        createdBy: currentUser.uid,
        rules: [`Achieve ${formData.targetValue} ${formData.targetUnit} within ${formData.duration} days`],
        rewards: formData.rewards,
        isActive: true
      };

      await challengeService.createChallenge(challengeData);
      onChallengeCreated();
      onClose();

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'carbon',
        difficulty: 'Easy',
        targetValue: '',
        targetUnit: 'kg',
        duration: '7',
        rewards: {
          points: 100,
          badge: 'Eco Warrior'
        }
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Trophy className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Create New Challenge</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenge Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 30-Day Plant-Based Challenge"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field h-24 resize-none"
                    placeholder="Describe your challenge and what participants need to do..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            category: category.id,
                            targetUnit: category.unit
                          })}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            formData.category === category.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <Icon className={`h-6 w-6 mx-auto mb-2 ${
                            formData.category === category.id ? 'text-primary-600' : 'text-gray-400'
                          }`} />
                          <div className="text-sm font-medium text-gray-900">{category.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Value
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.targetValue}
                      onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                      className="input-field"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={selectedCategory?.unit || formData.targetUnit}
                      readOnly
                      className="input-field bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days)
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="input-field"
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="flex space-x-3">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => setFormData({ ...formData, difficulty })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          formData.difficulty === difficulty
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-primary-100'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary"
                  >
                    {loading ? 'Creating...' : 'Create Challenge'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateChallengeModal;
