import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { IGatewaySessionManager } from './gateway.session';
import { Services } from 'src/utils/constants';
import {
  CreateMessageResponse,
  NotificationResponse,
  UpdateMessageResponse,
} from 'src/utils/types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagingGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    readonly sessions: IGatewaySessionManager,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagingGateWay.name);

  afterInit() {
    this.logger.log(`${MessagingGateWay.name} initialized`);
  }

  async handleConnection(client: AuthenticatedSocket) {
    if (client.user) {
      const { sockets } = this.server.sockets;
      this.sessions.setUserSocket(client.user.id, client);
      this.logger.log(`user id: ${client.user.id} connected`);
      this.logger.debug(`Number of connected clients: ${sockets.size}`);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
    if (client.user) {
      this.sessions.removeUserSocket(client.user.id);
    }
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: CreateMessageResponse) {
    const { shop, user } = payload.message;
    const author = shop ? shop.id : user.id;
    const recipient =
      payload.conversation.shop.id === author
        ? payload.conversation.user.id
        : payload.conversation.shop.id;
    const recipientSocket = this.sessions.getUserSocket(recipient);
    const authorSocket = this.sessions.getUserSocket(author);
    if (authorSocket) authorSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
  }

  @OnEvent('message.update')
  handleMessageUpdateEvent(payload: UpdateMessageResponse) {
    const { shop, user } = payload.message;
    const author = shop ? shop.id : user.id;
    const recipient =
      payload.conversation.shop.id === author
        ? payload.conversation.user.id
        : payload.conversation.shop.id;
    const recipientSocket = this.sessions.getUserSocket(recipient);
    if (recipientSocket) recipientSocket.emit('onMessageUpdate', payload);
    const authorSocket = this.sessions.getUserSocket(author);
    if (authorSocket) authorSocket.emit('onMessageUpdate', payload);
  }

  @OnEvent('message.delete')
  handleMessageDeleteEvent(payload: UpdateMessageResponse) {
    const { shop, user } = payload.message;
    const author = shop ? shop.id : user.id;
    const recipient =
      payload.conversation.shop.id === author
        ? payload.conversation.user.id
        : payload.conversation.shop.id;
    const recipientSocket = this.sessions.getUserSocket(recipient);
    if (recipientSocket) recipientSocket.emit('onMessageDelete', payload);
    const authorSocket = this.sessions.getUserSocket(author);
    if (authorSocket) authorSocket.emit('onMessageDelete', payload);
  }

  @OnEvent('notification.create')
  handleNotification(payload: NotificationResponse) {
    const { notification, userId, shopId } = payload;
    const userSocket = this.sessions.getUserSocket(userId);
    if (userSocket) userSocket.emit('onNotification', notification);
    const shopSocket = this.sessions.getUserSocket(shopId);
    if (shopSocket) shopSocket.emit('onNotification', notification);
  }
}
