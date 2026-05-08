import { DomainError } from '../../../../shared/domain/errors/domain-error';

/**
 * Thrown when attempting to access a meeting that does not exist.
 */
export class MeetingNotFoundError extends DomainError {
  constructor(meetingId: string) {
    super(`Meeting with ID "${meetingId}" was not found`, 'MEETING_NOT_FOUND');
  }
}
