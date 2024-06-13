import { IoAdapter } from '@nestjs/platform-socket.io';
import { AuthenticatedSocket } from '../utils/interfaces';

export class WebsocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log('Inside Websocket Adapter');
      const user = socket.handshake.headers.user as string;
      if (user) {
        socket.user = JSON.parse(user);
      }
      next();
    });
    return server;
  }
}
