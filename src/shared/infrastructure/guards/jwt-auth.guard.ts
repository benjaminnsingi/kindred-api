import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  IJwtService,
  JWT_SERVICE,
  JwtPayload,
} from '../../application/ports/jwt-service';

/**
 * Extends Express Request to include the authenticated user payload.
 */
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

/**
 * Guards routes by requiring a valid JWT in the Authorization header.
 *
 * Expected header format: "Authorization: Bearer <token>"
 *
 * On success: attaches the decoded payload to request.user
 * On failure: throws UnauthorizedException (401)
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = await this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
