/**
 * Port for password hashing operations.
 *
 * Defined as an interface to invert the dependency: the application layer
 * declares what it needs (hash + compare), and the infrastructure provides
 * a concrete implementation (BcryptPasswordHasher).
 *
 * This allows easy testing (mock implementation) and swapping the hashing
 * algorithm (bcrypt → argon2) without touching use cases.
 */
export interface IPasswordHasher {
  /**
   * Hashes a plaintext password using a secure algorithm.
   * The result is safe to store in the database.
   */
  hash(plaintext: string): Promise<string>;

  /**
   * Compares a plaintext password with a previously-hashed one.
   * Returns true if they match, false otherwise.
   */
  compare(plaintext: string, hashed: string): Promise<boolean>;
}

/**
 * Injection token for the IPasswordHasher.
 * Use it with @Inject(PASSWORD_HASHER) in services and use cases.
 */
export const PASSWORD_HASHER = Symbol('IPasswordHasher');
