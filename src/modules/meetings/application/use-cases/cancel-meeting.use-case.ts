import { Inject, Injectable } from '@nestjs/common';
import { MeetingNotFoundError } from '../../domain/errors/meeting-not-found.error';
import { UnauthorizedMeetingActionError } from '../../domain/errors/unauthorized-meeting-action.error';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../domain/meeting.repository';

/**
 * Input data for cancelling a meeting.
 */
export interface CancelMeetingInput {
  meetingId: string;
  userId: string;
}

/**
 * Use case for cancelling a meeting.
 *
 * Authorization: only the host can cancel their meeting.
 * Throws:
 * - MeetingNotFoundError if the meeting does not exist
 * - UnauthorizedMeetingActionError if the user is not the host
 * - Error if the meeting is already cancelled or ended (from entity logic)
 */
@Injectable()
export class CancelMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepo: IMeetingRepository,
  ) {}

  async execute(input: CancelMeetingInput): Promise<void> {
    const meeting = await this.meetingRepo.findById(input.meetingId);
    if (!meeting) {
      throw new MeetingNotFoundError(input.meetingId);
    }

    if (meeting.hostId !== input.userId) {
      throw new UnauthorizedMeetingActionError('cancel');
    }

    meeting.cancel();

    await this.meetingRepo.save(meeting);
  }
}
