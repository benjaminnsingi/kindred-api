import { DomainError } from '../../../../shared/domain/errors/domain-error';

/**
 * Thrown when a user tries to join a meeting they're already part of (and still active).
 */
export class AlreadyParticipantError extends DomainError {
  constructor() {
    super('You are already a participant in this meeting', 'ALREADY_PARTICIPANT');
  }
}
