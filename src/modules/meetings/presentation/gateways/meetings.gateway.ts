import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IEventEmitter } from '../../../../shared/application/ports/event-emitter';
import { WsJwtAuthGuard } from '../../../../shared/infrastructure/guards/ws-jwt-auth.guard';

/**
 * Authenticated socket type with JWT user payload attached.
 */
interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    email: string;
  };
}

/**
 * WebSocket gateway for real-time meeting events.
 *
 * Implements IEventEmitter so use cases can emit events without depending
 * on the gateway directly (Port/Adapter pattern).
 */
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/meetings',
})
export class MeetingsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, IEventEmitter
{
  private readonly logger = new Logger(MeetingsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('meeting:subscribe')
  handleSubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { meetingId: string },
  ): { success: boolean } {
    if (!data?.meetingId) {
      throw new WsException('meetingId is required');
    }

    const roomName = `meeting:${data.meetingId}`;
    client.join(roomName);

    this.logger.log(
      `User ${client.data.userId} subscribed to ${roomName}`,
    );

    return { success: true };
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('meeting:unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { meetingId: string },
  ): { success: boolean } {
    if (!data?.meetingId) {
      throw new WsException('meetingId is required');
    }

    const roomName = `meeting:${data.meetingId}`;
    client.leave(roomName);

    this.logger.log(
      `User ${client.data.userId} unsubscribed from ${roomName}`,
    );

    return { success: true };
  }

  /**
   * IEventEmitter implementation.
   * Broadcasts an event to all clients in the meeting's room.
   */
  emitToMeeting(meetingId: string, event: string, payload: unknown): void {
    const roomName = `meeting:${meetingId}`;
    this.server.to(roomName).emit(event, payload);
    this.logger.log(`Emitted "${event}" to ${roomName}`);
  }
}
