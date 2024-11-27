export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  location?: {
    lat: number;
    lng: number;
  };
  status?: 'online' | 'offline' | 'away';
  lastActive?: Date;
  peerId?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'online' | 'offline' | 'away';
  lastActive: Date;
  peerId?: string;
}

export interface LocationHistory {
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
  };
}