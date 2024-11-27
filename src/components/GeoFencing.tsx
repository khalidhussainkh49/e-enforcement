import { useState, useEffect } from 'react';
import { Circle, useMap, Marker } from 'react-leaflet';
import { AlertTriangle } from 'lucide-react';
import type { LatLng } from 'leaflet';
import L from 'leaflet';

interface GeoFence {
  center: LatLng;
  radius: number;
}

interface GeoFencingProps {
  userId: string;
  onViolation: () => void;
  isPlottingLocation: boolean;
}

export default function GeoFencing({ userId, onViolation, isPlottingLocation }: GeoFencingProps) {
  const [geofences, setGeofences] = useState<GeoFence[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [plottedLocation, setPlottedLocation] = useState<LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    // Load existing geofences for the user
    const loadGeofences = async () => {
      try {
        const response = await fetch(`/api/geofences/${userId}`);
        const data = await response.json();
        setGeofences(data);
      } catch (error) {
        console.error('Failed to load geofences:', error);
      }
    };

    loadGeofences();
  }, [userId]);

  useEffect(() => {
    if (!isDrawing && !isPlottingLocation) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (isDrawing) {
        const newGeofence = {
          center: e.latlng,
          radius: 1000 // Default radius in meters
        };
        setGeofences(prev => [...prev, newGeofence]);
        setIsDrawing(false);
      } else if (isPlottingLocation) {
        setPlottedLocation(e.latlng);
        // Check if the plotted location violates any geofence
        geofences.forEach(fence => {
          const distance = map.distance(e.latlng, fence.center);
          if (distance > fence.radius) {
            onViolation();
          }
        });
      }
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isDrawing, isPlottingLocation, map, geofences, onViolation]);

  return (
    <>
      {geofences.map((fence, index) => (
        <Circle
          key={index}
          center={fence.center}
          radius={fence.radius}
          pathOptions={{
            color: '#4F46E5',
            fillColor: '#4F46E5',
            fillOpacity: 0.2
          }}
        />
      ))}

      {plottedLocation && (
        <Marker
          position={plottedLocation}
          icon={L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}
        />
      )}

      {!isPlottingLocation && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold">Geofencing Controls</h3>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsDrawing(true)}
              className={`w-full px-4 py-2 rounded-lg ${
                isDrawing
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isDrawing ? 'Click on map to place fence' : 'Add Geofence'}
            </button>

            {geofences.length > 0 && (
              <button
                onClick={() => setGeofences([])}
                className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Clear All Fences
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}