import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

interface ProgressData {
  date: string;
  value: number;
  target?: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  title: string;
  unit: string;
  color?: 'green' | 'blue' | 'orange' | 'purple';
  showTrend?: boolean;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  title, 
  unit, 
  color = 'green',
  showTrend = true 
}) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-100',
      text: 'text-green-600',
      gradient: 'from-green-400 to-green-600'
    },
    blue: {
      bg: 'bg-blue-500',
      light: 'bg-blue-100',
      text: 'text-blue-600',
      gradient: 'from-blue-400 to-blue-600'
    },
    orange: {
      bg: 'bg-orange-500',
      light: 'bg-orange-100',
      text: 'text-orange-600',
      gradient: 'from-orange-400 to-orange-600'
    },
    purple: {
      bg: 'bg-purple-500',
      light: 'bg-purple-100',
      text: 'text-purple-600',
      gradient: 'from-purple-400 to-purple-600'
    }
  };

  const colors = colorClasses[color];
  
  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.target || 0)));
  const minValue = Math.min(...data.map(d => d.value));
  
  // Calculate trend
  const trend = data.length >= 2 ? 
    ((data[data.length - 1].value - data[0].value) / data[0].value) * 100 : 0;

  // Get latest value
  const latestValue = data[data.length - 1]?.value || 0;
  const latestTarget = data[data.length - 1]?.target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-2xl font-bold text-gray-900">
              {latestValue.toFixed(1)} {unit}
            </span>
            {latestTarget && (
              <span className="text-sm text-gray-500">
                / {latestTarget} {unit} target
              </span>
            )}
          </div>
        </div>
        
        {showTrend && data.length >= 2 && (
          <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-8">
          <span>{maxValue.toFixed(0)}</span>
          <span>{(maxValue / 2).toFixed(0)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 relative h-32">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2].map(i => (
              <div key={i} className="border-t border-gray-100"></div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between px-1">
            {data.map((point, index) => {
              const height = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
              const targetHeight = point.target && maxValue > 0 ? (point.target / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center space-y-1 flex-1 max-w-8">
                  {/* Target line */}
                  {point.target && (
                    <div 
                      className="w-full border-t-2 border-dashed border-gray-400 absolute"
                      style={{ bottom: `${targetHeight}%` }}
                    />
                  )}
                  
                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`w-full bg-gradient-to-t ${colors.gradient} rounded-t-sm min-h-[2px] relative group`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {point.value.toFixed(1)} {unit}
                    </div>
                  </motion.div>
                  
                  {/* Date label */}
                  <span className="text-xs text-gray-500 transform -rotate-45 origin-center mt-2">
                    {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      {data.some(d => d.target) && (
        <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 bg-gradient-to-r ${colors.gradient} rounded-sm`}></div>
            <span>Actual</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-gray-400"></div>
            <span>Target</span>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500">Average</p>
          <p className="font-semibold text-gray-900">
            {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Best</p>
          <p className="font-semibold text-gray-900">{Math.max(...data.map(d => d.value)).toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-semibold text-gray-900">{data.reduce((sum, d) => sum + d.value, 0).toFixed(1)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressChart;
