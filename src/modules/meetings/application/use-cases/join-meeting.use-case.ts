import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  EVENT_EMITTER,
  IEventEmitter,
} from '../../../../shared/application/ports/event-emitter';
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

export interface JoinMeetingInput {
  meetingCode: string;
  userId: string;
}

export interface JoinMeetingOutput {
  meeting: IMeeting;
  participant: IParticipant;
}

/**
 * Use case for joining a meeting via its meetingCode.
 *
 * After a successful join, broadcasts a 'participant:joined' event
 * to all clients subscribed to this meeting via WebSocket.
 */
@Injectable()
export class JoinMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepo: IMeetingRepository,
    @Inject(PARTICIPANT_REPOSITORY)
    private readonly participantRepo: IParticipantRepository,
    @Inject(EVENT_EMITTER)
    private readonly events: IEventEmitter,
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

    this.events.emitToMeeting(meeting.id, 'participant:joined', {
      id: participant.id,
      meetingId: participant.meetingId,
      userId: participant.userId,
      role: participant.role,
      joinedAt: participant.joinedAt,
    });

    return { meeting, participant };
  }
}
