import { create } from 'zustand';
import type { User } from '../types/user';

interface MapState {
  selectedUsers: string[];
  geofences: Map<string, GeoFence[]>;
  addSelectedUser: (userId: string) => void;
  removeSelectedUser: (userId: string) => void;
  clearSelectedUsers: () => void;
  addGeofence: (userId: string, geofence: GeoFence) => void;
  removeGeofence: (userId: string, geofenceId: string) => void;
  clearGeofences: (userId: string) => void;
  bulkAddGeofence: (userIds: string[], geofence: GeoFence) => void;
  bulkRemoveGeofence: (userIds: string[]) => void;
}

interface GeoFence {
  id: string;
  type: 'circle' | 'polygon';
  coordinates: number[][] | [number, number];
  radius?: number;
  name: string;
  createdAt: Date;
}

const useMapStore = create<MapState>((set) => ({
  selectedUsers: [],
  geofences: new Map(),
  
  addSelectedUser: (userId) => 
    set((state) => ({
      selectedUsers: [...state.selectedUsers, userId]
    })),
    
  removeSelectedUser: (userId) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.filter(id => id !== userId)
    })),
    
  clearSelectedUsers: () =>
    set({ selectedUsers: [] }),
    
  addGeofence: (userId, geofence) =>
    set((state) => {
      const userGeofences = state.geofences.get(userId) || [];
      const updatedGeofences = new Map(state.geofences);
      updatedGeofences.set(userId, [...userGeofences, geofence]);
      return { geofences: updatedGeofences };
    }),
    
  removeGeofence: (userId, geofenceId) =>
    set((state) => {
      const userGeofences = state.geofences.get(userId) || [];
      const updatedGeofences = new Map(state.geofences);
      updatedGeofences.set(
        userId,
        userGeofences.filter(g => g.id !== geofenceId)
      );
      return { geofences: updatedGeofences };
    }),
    
  clearGeofences: (userId) =>
    set((state) => {
      const updatedGeofences = new Map(state.geofences);
      updatedGeofences.delete(userId);
      return { geofences: updatedGeofences };
    }),
    
  bulkAddGeofence: (userIds, geofence) =>
    set((state) => {
      const updatedGeofences = new Map(state.geofences);
      userIds.forEach(userId => {
        const userGeofences = state.geofences.get(userId) || [];
        updatedGeofences.set(userId, [...userGeofences, geofence]);
      });
      return { geofences: updatedGeofences };
    }),
    
  bulkRemoveGeofence: (userIds) =>
    set((state) => {
      const updatedGeofences = new Map(state.geofences);
      userIds.forEach(userId => {
        updatedGeofences.delete(userId);
      });
      return { geofences: updatedGeofences };
    }),
}));

export default useMapStore;