import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';
import type { User } from '../types/user';
import UserMarker from './UserMarker';
import 'leaflet/dist/leaflet.css';

const { BaseLayer } = LayersControl;

interface RestrictedMapProps {
  users: User[];
}

export default function RestrictedMap({ users }: RestrictedMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        className={`w-full h-full ${isFullscreen ? 'fullscreen-map' : ''}`}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
            />
          </BaseLayer>
        </LayersControl>

        {users.map(user => (
          <UserMarker 
            key={user.id} 
            user={user}
            isSelected={false}
          />
        ))}
      </MapContainer>

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-[1000] p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-opacity duration-300"
        title="Toggle fullscreen"
      >
        <Maximize2 className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}