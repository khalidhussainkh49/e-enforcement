import { faker } from '@faker-js/faker';
import type { User } from '../types/user';

const generateRandomLocation = () => ({
  lat: faker.location.latitude({ min: 25, max: 49 }),
  lng: faker.location.longitude({ min: -125, max: -65 })
});

export const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    location: generateRandomLocation(),
    status: faker.helpers.arrayElement(['online', 'offline', 'away']),
    lastActive: faker.date.recent()
  }));
};

export const updateUserLocations = (users: User[]): User[] => {
  return users.map(user => ({
    ...user,
    location: {
      lat: user.location.lat + (Math.random() - 0.5) * 0.01,
      lng: user.location.lng + (Math.random() - 0.5) * 0.01
    }
  }));
};