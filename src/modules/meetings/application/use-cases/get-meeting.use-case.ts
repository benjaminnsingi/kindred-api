import { Inject, Injectable } from '@nestjs/common';
import { MeetingNotFoundError } from '../../domain/errors/meeting-not-found.error';
import { IMeeting } from '../../domain/meeting';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../domain/meeting.repository';

/**
 * Use case for retrieving a single meeting by ID.
 *
 * Returns the meeting if it exists, throws MeetingNotFoundError otherwise.
 *
 * Note: this use case does NOT check ownership.
 * Anyone authenticated can fetch any meeting (for the join-by-link flow).
 * Authorization for sensitive actions (cancel, edit) is handled in their
 * respective use cases.
 */
@Injectable()
export class GetMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepo: IMeetingRepository,
  ) {}

  async execute(meetingId: string): Promise<IMeeting> {
    const meeting = await this.meetingRepo.findById(meetingId);
    if (!meeting) {
      throw new MeetingNotFoundError(meetingId);
    }
    return meeting;
  }
}
