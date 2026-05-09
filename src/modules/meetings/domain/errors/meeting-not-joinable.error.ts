import { DomainError } from '../../../../shared/domain/errors/domain-error';
import { MeetingStatus } from '../meeting';

/**
 * Thrown when trying to join a meeting that is not in a joinable state.
 *
 * A meeting is joinable only if its status is 'scheduled' or 'in_progress'.
 * Cancelled or ended meetings cannot be joined.
 */
export class MeetingNotJoinableError extends DomainError {
  constructor(status: MeetingStatus) {
    super(
      `Cannot join a meeting with status "${status}"`,
      'MEETING_NOT_JOINABLE',
    );
  }
}
