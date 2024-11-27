import { useState, useEffect } from 'react';
import { History, MapPin } from 'lucide-react';
import type { LocationHistory } from '../types/user';

interface LocationHistoryProps {
  userId: string;
}

export default function LocationHistory({ userId }: LocationHistoryProps) {
  const [history, setHistory] = useState<LocationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/locations`);
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch location history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold">Location History</h3>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No location history available</p>
        ) : (
          history.map((entry, index) => (
            <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">
                  Lat: {entry.location.lat.toFixed(4)}, Lng: {entry.location.lng.toFixed(4)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}