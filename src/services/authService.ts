import axios from 'axios';
import { API_URL } from '../config/constants';
import type { AuthUser } from '../types/user';

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  public async login(email: string, password: string): Promise<AuthUser> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      this.setToken(token);
      return user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  }

  public async register(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        name
      });
      
      const { token, user } = response.data;
      this.setToken(token);
      return user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  }

  public async getCurrentUser(): Promise<AuthUser | null> {
    if (!this.token) return null;

    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      return response.data;
    } catch (error) {
      this.clearToken();
      return null;
    }
  }

  public async logout(): Promise<void> {
    try {
      if (this.token) {
        await axios.post(`${API_URL}/api/auth/logout`);
      }
    } finally {
      this.clearToken();
    }
  }

  public async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const response = await axios.put(`${API_URL}/api/auth/profile`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      throw new Error(message);
    }
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }
}

export default AuthService;