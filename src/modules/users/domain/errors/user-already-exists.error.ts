import { DomainError } from '../../../../shared/domain/errors/domain-error';

/**
 * Thrown when attempting to register a user with an email that already exists.
 *
 * This is a predictable business rule violation, not a technical error,
 * hence it extends DomainError (not Error directly).
 */
export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`A user with email "${email}" already exists`, 'USER_ALREADY_EXISTS');
  }
}
