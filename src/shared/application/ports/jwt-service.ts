/**
 * Payload encoded in the JWT.
 * Keep it minimal - tokens should be small and contain only what's needed.
 */
export interface JwtPayload {
  sub: string;
  email: string;
}

/**
 * Port for JWT operations.
 *
 * Defined as an interface to invert the dependency: the application layer
 * declares what it needs (sign + verify), and the infrastructure provides
 * a concrete implementation (NestJwtService using @nestjs/jwt).
 */
export interface IJwtService {
  /**
   * Signs a payload and returns a JWT string.
   * The expiration is configured at the implementation level.
   */
  sign(payload: JwtPayload): Promise<string>;

  /**
   * Verifies a JWT string and returns its payload.
   * Throws if the token is invalid or expired.
   */
  verify(token: string): Promise<JwtPayload>;
}

/**
 * Injection token for the IJwtService.
 * Use it with @Inject(JWT_SERVICE) in services and use cases.
 */
export const JWT_SERVICE = Symbol('IJwtService');
