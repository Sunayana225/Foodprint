import React from 'react';
import { Database, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureDisabledProps {
  featureName: string;
  description?: string;
}

const FeatureDisabled: React.FC<FeatureDisabledProps> = ({ 
  featureName, 
  description = "This feature requires database connectivity and is currently unavailable." 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
          <Database className="h-8 w-8 text-gray-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {featureName} Unavailable
        </h2>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            <strong>Authentication-Only Mode:</strong> FoodPrint is currently running with basic authentication features only.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate('/recipe-generator')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Try Recipe Generator
          </button>
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          Available features: Recipe Generator, Food Search, Authentication
        </div>
      </div>
    </div>
  );
};

export default FeatureDisabled;
