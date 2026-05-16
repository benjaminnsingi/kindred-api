import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  IJwtService,
  JWT_SERVICE,
} from '../../application/ports/jwt-service';

/**
 * Guard for WebSocket connections requiring JWT authentication.
 *
 * Token can be provided either:
 * - In the handshake auth payload: socket.handshake.auth.token
 * - As a query parameter: socket.handshake.query.token
 *
 * On success, attaches user info to socket.data:
 *   socket.data.userId
 *   socket.data.email
 */
@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtAuthGuard.name);

  constructor(
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);

    if (!token) {
      throw new WsException('Missing authentication token');
    }

    try {
      const payload = await this.jwtService.verify(token);
      client.data.userId = payload.sub;
      client.data.email = payload.email;
      return true;
    } catch {
      throw new WsException('Invalid or expired token');
    }
  }

  private extractToken(client: Socket): string | undefined {
    const authToken = client.handshake?.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const queryToken = client.handshake?.query?.token;
    if (typeof queryToken === 'string' && queryToken.length > 0) {
      return queryToken;
    }

    return undefined;
  }
}
