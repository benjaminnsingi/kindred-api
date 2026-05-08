import { Inject, Injectable } from '@nestjs/common';
import { Meeting } from '../../domain/meeting.entity';
import { IMeeting } from '../../domain/meeting';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../domain/meeting.repository';

/**
 * Input data for creating a new meeting.
 */
export interface CreateMeetingInput {
  hostId: string;
  title: string;
  description?: string | null;
  scheduledAt: Date;
}

/**
 * Use case for creating a new meeting.
 *
 * The hostId is provided by the caller (typically from JWT payload).
 * The use case generates the meeting code and sets initial status.
 */
@Injectable()
export class CreateMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepo: IMeetingRepository,
  ) {}

  async execute(input: CreateMeetingInput): Promise<IMeeting> {
    const meeting = Meeting.create({
      hostId: input.hostId,
      title: input.title,
      description: input.description,
      scheduledAt: input.scheduledAt,
    });

    await this.meetingRepo.save(meeting);
    return meeting;
  }
}
