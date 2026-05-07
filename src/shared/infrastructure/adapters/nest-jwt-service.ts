import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtServiceLib } from '@nestjs/jwt';
import { IJwtService, JwtPayload } from '../../application/ports/jwt-service';

/**
 * NestJS JWT implementation of IJwtService.
 *
 * Wraps @nestjs/jwt's JwtService to expose a domain-friendly API
 * (returns Promises instead of synchronous results).
 *
 * Configuration (secret, expiration) is provided via the JwtModule
 * registration in UsersModule.
 */
@Injectable()
export class NestJwtService implements IJwtService {
  constructor(private readonly jwtService: NestJwtServiceLib) {}

  async sign(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
