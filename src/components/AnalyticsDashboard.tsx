import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Lightbulb,
  BarChart3,
  Activity,
  Zap,
  Calendar
} from 'lucide-react';
import { analyticsService, type AnalyticsData } from '../services/analyticsService';
import ProgressChart from './ProgressChart';

interface AnalyticsDashboardProps {
  userId: string;
  timeframe?: number; // days
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  userId, 
  timeframe = 30 
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'goals' | 'insights'>('overview');

  useEffect(() => {
    const loadAnalytics = () => {
      try {
        const data = analyticsService.getUserAnalytics(userId, timeframe);
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [userId, timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-1">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'insights', label: 'Insights', icon: Lightbulb }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Meals"
              value={analytics.monthlyProgress.totalMeals}
              icon={Calendar}
              color="blue"
            />
            <MetricCard
              title="CO₂ Saved"
              value={`${analytics.monthlyProgress.totalCO2Saved}kg`}
              icon={TrendingDown}
              color="green"
            />
            <MetricCard
              title="Water Saved"
              value={`${analytics.monthlyProgress.totalWaterSaved}L`}
              icon={Activity}
              color="blue"
            />
            <MetricCard
              title="Eco Score"
              value={analytics.monthlyProgress.averageEcoScore}
              icon={Zap}
              color="orange"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressChart
              data={analytics.dailyStats.map(stat => ({
                date: stat.date,
                value: stat.co2Saved,
                target: 2.0
              }))}
              title="Daily CO₂ Impact"
              unit="kg"
              color="green"
            />
            
            <ProgressChart
              data={analytics.dailyStats.map(stat => ({
                date: stat.date,
                value: stat.mealsLogged
              }))}
              title="Daily Meals Logged"
              unit="meals"
              color="blue"
            />
          </div>
        </motion.div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TrendCard
              title="CO₂ Savings"
              trend={analytics.weeklyTrends.co2Trend}
              description="vs last week"
            />
            <TrendCard
              title="Water Savings"
              trend={analytics.weeklyTrends.waterTrend}
              description="vs last week"
            />
            <TrendCard
              title="Meal Tracking"
              trend={analytics.weeklyTrends.mealsTrend}
              description="vs last week"
            />
          </div>

          {/* Detailed Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressChart
              data={analytics.dailyStats.map(stat => ({
                date: stat.date,
                value: stat.waterSaved
              }))}
              title="Water Usage Trend"
              unit="L"
              color="blue"
              showTrend={true}
            />
            
            <ProgressChart
              data={analytics.dailyStats.map(stat => ({
                date: stat.date,
                value: stat.ecoScore
              }))}
              title="Eco Score Trend"
              unit="score"
              color="green"
              showTrend={true}
            />
          </div>
        </motion.div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GoalCard
              title="Monthly Meals"
              current={analytics.monthlyProgress.goalProgress.achievedMeals}
              target={analytics.monthlyProgress.goalProgress.mealsGoal}
              unit="meals"
              color="blue"
            />
            <GoalCard
              title="CO₂ Savings"
              current={analytics.monthlyProgress.goalProgress.achievedCO2}
              target={analytics.monthlyProgress.goalProgress.co2Goal}
              unit="kg"
              color="green"
            />
            <GoalCard
              title="Water Savings"
              current={analytics.monthlyProgress.goalProgress.achievedWater}
              target={analytics.monthlyProgress.goalProgress.waterGoal}
              unit="L"
              color="blue"
            />
          </div>
        </motion.div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {analytics.insights.length > 0 ? (
            <div className="space-y-4">
              {analytics.insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No insights available yet. Keep tracking your meals to get personalized insights!</p>
            </div>
          )}

          {/* Recent Achievements */}
          {analytics.achievements.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {analytics.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Helper Components
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const TrendCard: React.FC<{
  title: string;
  trend: number;
  description: string;
}> = ({ title, trend, description }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <div className="flex items-center space-x-2">
      {trend >= 0 ? (
        <TrendingUp className="h-5 w-5 text-green-600" />
      ) : (
        <TrendingDown className="h-5 w-5 text-red-600" />
      )}
      <span className={`text-xl font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {Math.abs(trend).toFixed(1)}%
      </span>
    </div>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
);

const GoalCard: React.FC<{
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}> = ({ title, current, target, unit, color }) => {
  const progress = Math.min((current / target) * 100, 100);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{current} {unit}</span>
          <span>{target} {unit}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              color === 'green' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-sm text-gray-600">{progress.toFixed(0)}% complete</p>
    </div>
  );
};

const InsightCard: React.FC<{
  insight: any;
}> = ({ insight }) => {
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-red-200 bg-red-50';
      case 'tip': return 'border-blue-200 bg-blue-50';
      case 'goal': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🎉';
      case 'warning': return '⚠️';
      case 'tip': return '💡';
      case 'goal': return '🎯';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
      <div className="flex items-start space-x-3">
        <span className="text-xl">{getInsightIcon(insight.type)}</span>
        <div>
          <h4 className="font-medium text-gray-900">{insight.title}</h4>
          <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
