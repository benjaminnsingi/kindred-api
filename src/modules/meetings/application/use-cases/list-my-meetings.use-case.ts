import { Inject, Injectable } from '@nestjs/common';
import { IMeeting } from '../../domain/meeting';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../domain/meeting.repository';

/**
 * Use case for listing all meetings hosted by a user.
 *
 * Returns meetings ordered by scheduledAt descending (most recent first).
 */
@Injectable()
export class ListMyMeetingsUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepo: IMeetingRepository,
  ) {}

  async execute(hostId: string): Promise<IMeeting[]> {
    return this.meetingRepo.findByHostId(hostId);
  }
}
