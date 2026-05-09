import { Inject, Injectable } from '@nestjs/common';
import { Meeting } from '../../domain/meeting.entity';
import { IMeeting } from '../../domain/meeting';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../domain/meeting.repository';
import { Participant } from '../../domain/participant.entity';
import {
  IParticipantRepository,
  PARTICIPANT_REPOSITORY,
} from '../../domain/participant.repository';

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
 * Creates the meeting AND automatically registers the host as a participant
 * with role 'host'. This ensures consistency: the host is always the first
 * participant of their meeting.
 */
@Injectable()
export class CreateMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepo: IMeetingRepository,
    @Inject(PARTICIPANT_REPOSITORY)
    private readonly participantRepo: IParticipantRepository,
  ) {}

  async execute(input: CreateMeetingInput): Promise<IMeeting> {
    const meeting = Meeting.create({
      hostId: input.hostId,
      title: input.title,
      description: input.description,
      scheduledAt: input.scheduledAt,
    });

    await this.meetingRepo.save(meeting);

    const hostParticipant = Participant.create({
      meetingId: meeting.id,
      userId: input.hostId,
      role: 'host',
    });

    await this.participantRepo.save(hostParticipant);

    return meeting;
  }
}
