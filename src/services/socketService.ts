import { io } from 'socket.io-client';
import { API_URL } from '../config/constants';

class SocketService {
  private static instance: SocketService;
  private socket: any;

  private constructor() {
    this.socket = io(API_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public getSocket() {
    return this.socket;
  }

  public sendPrivateMessage(to: string, message: string) {
    this.socket.emit('private-message', { to, message });
  }

  public sendBroadcastMessage(message: string) {
    this.socket.emit('broadcast-message', { message });
  }

  public onPrivateMessage(callback: (data: any) => void) {
    this.socket.on('private-message', callback);
  }

  public onBroadcastMessage(callback: (data: any) => void) {
    this.socket.on('broadcast-message', callback);
  }

  public onDangerAlert(callback: (data: any) => void) {
    this.socket.on('danger-alert', callback);
  }
}

export default SocketService;