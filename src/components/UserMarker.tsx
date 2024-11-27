import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { User } from '../types/user';

interface UserMarkerProps {
  user: User;
  isSelected?: boolean;
}

const getStatusColor = (status: User['status']) => {
  switch (status) {
    case 'online':
      return '#10B981';
    case 'away':
      return '#F59E0B';
    case 'offline':
      return '#EF4444';
  }
};

const createIcon = (user: User, isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative">
        <div class="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center ${isSelected ? 'ring-4 ring-indigo-500' : ''}">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img src="${user.avatar}" alt="user" class="w-full h-full object-cover" />
          </div>
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white" style="background-color: ${getStatusColor(user.status)}"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });
};

export default function UserMarker({ user, isSelected = false }: UserMarkerProps) {
  return (
    <Marker
      position={[user.location.lat, user.location.lng]}
      icon={createIcon(user, isSelected)}
    >
      <Popup>
        <div className="p-2">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">
                Last active: {new Date(user.lastActive).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}