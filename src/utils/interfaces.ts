import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  token?: string;
  user?: any;
}
