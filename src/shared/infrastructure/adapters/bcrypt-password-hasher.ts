import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../application/ports/password-hasher';

/**
 * Bcrypt implementation of IPasswordHasher.
 *
 * Uses bcrypt with cost factor 12, a good balance between security
 * and performance in 2025 (~250ms per hash on modern hardware).
 *
 * Cost factor recommendations:
 * - 10: too fast, vulnerable to brute force
 * - 12: current sweet spot (default)
 * - 14+: very secure but very slow (annoying UX on signup)
 */
@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 12;

  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.saltRounds);
  }

  async compare(plaintext: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hashed);
  }
}
