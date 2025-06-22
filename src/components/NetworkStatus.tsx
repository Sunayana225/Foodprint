import { useState, useEffect } from 'react';
import { isFirestoreAvailable } from '../config/firebase';

interface NetworkStatusType {
  isOnline: boolean;
  isFirebaseOnline: boolean;
  lastOnlineCheck: number;
  connectionQuality: 'good' | 'poor';
}

export default function NetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatusType>({
    isOnline: navigator.onLine,
    isFirebaseOnline: isFirestoreAvailable(),
    lastOnlineCheck: Date.now(),
    connectionQuality: 'good'
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simple network status monitoring
    const updateNetworkStatus = () => {
      setNetworkStatus({
        isOnline: navigator.onLine,
        isFirebaseOnline: isFirestoreAvailable(),
        lastOnlineCheck: Date.now(),
        connectionQuality: navigator.onLine ? 'good' : 'poor'
      });
    };

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Update status every 30 seconds
    const interval = setInterval(updateNetworkStatus, 30000);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = () => {
    if (!networkStatus.isOnline) return 'bg-red-500';
    if (!networkStatus.isFirebaseOnline) return 'bg-yellow-500';
    if (networkStatus.connectionQuality === 'poor') return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!networkStatus.isOnline) return 'Offline';
    if (!networkStatus.isFirebaseOnline) return 'Firebase Offline';
    if (networkStatus.connectionQuality === 'poor') return 'Poor Connection';
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!networkStatus.isOnline) return '🔴';
    if (!networkStatus.isFirebaseOnline) return '🟡';
    if (networkStatus.connectionQuality === 'poor') return '🟠';
    return '🟢';
  };

  const handleRefreshStatus = () => {
    console.log('🔄 Refreshing network status...');
    setNetworkStatus({
      isOnline: navigator.onLine,
      isFirebaseOnline: isFirestoreAvailable(),
      lastOnlineCheck: Date.now(),
      connectionQuality: navigator.onLine ? 'good' : 'poor'
    });
  };

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
        {/* Status indicator */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {getStatusIcon()} {getStatusText()}
          </span>
          <button className="text-gray-400 hover:text-gray-600 ml-auto">
            {showDetails ? '▼' : '▶'}
          </button>
        </div>

        {/* Detailed status */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <div className="text-xs text-gray-600">
              <div>Network: {networkStatus.isOnline ? '✅ Online' : '❌ Offline'}</div>
              <div>Firebase: {networkStatus.isFirebaseOnline ? '✅ Connected' : '❌ Disconnected'}</div>
              <div>Quality: {networkStatus.connectionQuality}</div>
              <div>Last Check: {new Date(networkStatus.lastOnlineCheck).toLocaleTimeString()}</div>
            </div>
            
            {/* Control buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRefreshStatus}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Refresh Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
