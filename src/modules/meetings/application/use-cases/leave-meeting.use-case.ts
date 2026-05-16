import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  EVENT_EMITTER,
  IEventEmitter,
} from '../../../../shared/application/ports/event-emitter';
import {
  IParticipantRepository,
  PARTICIPANT_REPOSITORY,
} from '../../domain/participant.repository';

export interface LeaveMeetingInput {
  meetingId: string;
  userId: string;
}

/**
 * Use case for leaving a meeting.
 *
 * After a successful leave, broadcasts a 'participant:left' event
 * to all clients subscribed to this meeting via WebSocket.
 */
@Injectable()
export class LeaveMeetingUseCase {
  constructor(
    @Inject(PARTICIPANT_REPOSITORY)
    private readonly participantRepo: IParticipantRepository,
    @Inject(EVENT_EMITTER)
    private readonly events: IEventEmitter,
  ) {}

  async execute(input: LeaveMeetingInput): Promise<void> {
    const participant = await this.participantRepo.findActiveByUserAndMeeting(
      input.userId,
      input.meetingId,
    );

    if (!participant) {
      throw new NotFoundException(
        'You are not currently an active participant in this meeting',
      );
    }

    participant.leave();
    await this.participantRepo.save(participant);

    this.events.emitToMeeting(input.meetingId, 'participant:left', {
      id: participant.id,
      userId: participant.userId,
    });
  }
}
