import { DomainError } from '../../../../shared/domain/errors/domain-error';

/**
 * Thrown when a user tries to perform an action on a meeting they don't own.
 *
 * Example: a user trying to cancel another user's meeting.
 */
export class UnauthorizedMeetingActionError extends DomainError {
  constructor(action: string) {
    super(
      `You are not authorized to ${action} this meeting`,
      'UNAUTHORIZED_MEETING_ACTION',
    );
  }
}
