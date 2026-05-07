import { DomainError } from '../../../../shared/domain/errors/domain-error';

/**
 * Thrown when a login attempt fails due to invalid email or password.
 *
 * The error message is intentionally vague ("Invalid credentials") to avoid
 * leaking information about whether the email exists in the database
 * (defense against user enumeration attacks).
 */
export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}
