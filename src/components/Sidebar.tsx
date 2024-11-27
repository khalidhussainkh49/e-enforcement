import { Users, MapPin, Activity, Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { User } from '../types/user';

interface SidebarProps {
  users: User[];
  selectedUsers: string[];
  onClearSelection: () => void;
}

export default function Sidebar({ users, selectedUsers, onClearSelection }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = users.filter(user => user.status === 'online').length;
  const awayCount = users.filter(user => user.status === 'away').length;

  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredUsers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (focusedIndex >= 0) {
          toggleUserSelection(filteredUsers[focusedIndex].id);
        }
        break;
      case 'Escape':
        setSearchQuery('');
        onClearSelection();
        break;
    }
  };

  const toggleUserSelection = (userId: string) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      onClearSelection();
    } else {
      // For now, we'll just select one user at a time
      onClearSelection();
      useMapStore.getState().addSelectedUser(userId);
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const element = listRef.current.children[focusedIndex] as HTMLElement;
      element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusedIndex]);

  return (
    <div className="w-80 bg-white h-full shadow-lg p-6 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-semibold">User Tracker</h1>
        </div>
        {selectedUsers.length > 0 && (
          <button
            onClick={onClearSelection}
            className="p-1 hover:bg-gray-100 rounded"
            title="Clear selection"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users... (↑↓ to navigate)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Activity className="w-5 h-5" />
            <span className="font-medium">Online</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{onlineCount}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Away</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">{awayCount}</p>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        <div className="space-y-4" ref={listRef}>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found matching "{searchQuery}"
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <div
                key={user.id}
                onClick={() => toggleUserSelection(user.id)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer
                  ${selectedUsers.includes(user.id) ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'hover:bg-gray-50'}
                  ${focusedIndex === index ? 'bg-gray-50' : ''}`}
              >
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div 
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white
                      ${user.status === 'online' ? 'bg-green-500' : 
                        user.status === 'away' ? 'bg-amber-500' : 'bg-red-500'}`}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(user.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}