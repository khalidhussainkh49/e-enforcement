import { useState, useEffect } from 'react';
import { generateMockUsers, updateUserLocations } from '../utils/mockData';
import Map from './Map';
import RestrictedMap from './RestrictedMap';
import Sidebar from './Sidebar';
import Chat from './Chat';
import VideoCall from './VideoCall';
import { useAuth } from '../contexts/AuthContext';
import useMapStore from '../stores/mapStore';
import type { User } from '../types/user';

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>(() => generateMockUsers(20));
  const { user } = useAuth();
  const { selectedUsers, clearSelectedUsers } = useMapStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers => updateUserLocations(prevUsers));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  // For restricted users, show only the map view
  if (user.role === 'restricted') {
    return <RestrictedMap users={users} />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        users={users} 
        selectedUsers={selectedUsers}
        onClearSelection={clearSelectedUsers}
      />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <Map 
            users={users} 
            selectedUsers={selectedUsers}
          />
        </div>
        <div className="h-1/3 p-4 bg-gray-50 border-t flex gap-4">
          <div className="flex-1">
            <Chat 
              currentUserId={user.id} 
              selectedUserId={selectedUsers[0]} 
            />
          </div>
          <div className="flex-1">
            <VideoCall selectedUserId={selectedUsers[0]} />
          </div>
        </div>
      </main>
    </div>
  );
}