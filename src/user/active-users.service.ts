import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ActiveUsersService {
  private readonly activeUsers: Map<number, Socket> = new Map();

  addUser(user_id: number, socket: Socket) {
    this.activeUsers.set(user_id, socket);
  }

  removeUser(user_id: number) {
    this.activeUsers.delete(user_id);
  }

  getActiveUsers(): number[] {
    return Array.from(this.activeUsers.keys());
  }

  getSocketByUserId(user_id: number): Socket | undefined {
    return this.activeUsers.get(user_id);
  }
}
