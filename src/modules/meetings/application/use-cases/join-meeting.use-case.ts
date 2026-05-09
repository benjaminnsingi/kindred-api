import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AlreadyParticipantError } from '../../domain/errors/already-participant.error';
import { MeetingNotJoinableError } from '../../domain/errors/meeting-not-joinable.error';
import { IMeeting } from '../../domain/meeting';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../domain/meeting.repository';
import { IParticipant } from '../../domain/participant';
import { Participant } from '../../domain/participant.entity';
import {
  IParticipantRepository,
  PARTICIPANT_REPOSITORY,
} from '../../domain/participant.repository';

/**
 * Input data for joining a meeting.
 */
export interface JoinMeetingInput {
  meetingCode: string;
  userId: string;
}

/**
 * Output data after a successful join.
 */
export interface JoinMeetingOutput {
  meeting: IMeeting;
  participant: IParticipant;
}

/**
 * Use case for joining a meeting via its meetingCode.
 *
 * Business rules:
 * - The meeting must exist (NotFoundException otherwise)
 * - The meeting must be joinable (status: scheduled or in_progress)
 * - The user must not already be an active participant
 *
 * Re-joining: if the user has previously left the meeting (leftAt is not null),
 * they can join again - we create a new Participant record (kept for history).
 */
@Injectable()
export class JoinMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepo: IMeetingRepository,
    @Inject(PARTICIPANT_REPOSITORY)
    private readonly participantRepo: IParticipantRepository,
  ) {}

  async execute(input: JoinMeetingInput): Promise<JoinMeetingOutput> {
    const meeting = await this.meetingRepo.findByCode(input.meetingCode);
    if (!meeting) {
      throw new NotFoundException(
        `No meeting found with code "${input.meetingCode}"`,
      );
    }

    if (meeting.status !== 'scheduled' && meeting.status !== 'in_progress') {
      throw new MeetingNotJoinableError(meeting.status);
    }

    const existingActive = await this.participantRepo.findActiveByUserAndMeeting(
      input.userId,
      meeting.id,
    );
    if (existingActive) {
      throw new AlreadyParticipantError();
    }

    const participant = Participant.create({
      meetingId: meeting.id,
      userId: input.userId,
      role: 'participant',
    });

    await this.participantRepo.save(participant);

    return { meeting, participant };
  }
}
