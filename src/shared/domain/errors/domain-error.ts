/**
 * Base class for all domain errors in the application.
 *
 * Domain errors represent expected business rule violations (invalid email,
 * user already exists, etc.) as opposed to technical errors (DB down, network
 * failure) which use plain Error.
 *
 * @example
 * class InvalidEmailError extends DomainError {
 *   constructor(email: string) {
 *     super(`Invalid email format: ${email}`, 'INVALID_EMAIL');
 *   }
 * }
 */
export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;

  protected constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
