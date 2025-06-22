import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

const AuthOnlyNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Authentication-Only Mode
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              FoodPrint is running with local storage for meal tracking. Your data is saved in your browser
              and some advanced features like challenges and leaderboards are temporarily unavailable.
            </p>
          </div>
          <div className="mt-3">
            <p className="text-xs text-blue-600">
              ✅ Available: Authentication, Meal Tracking, Recipe Generator, Food Search<br/>
              🚧 Unavailable: Challenges, User Profiles, Leaderboards (require database)
            </p>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => setIsVisible(false)}
            className="bg-blue-50 rounded-md inline-flex text-blue-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthOnlyNotice;
