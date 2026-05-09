import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IParticipantRepository,
  PARTICIPANT_REPOSITORY,
} from '../../domain/participant.repository';

/**
 * Input data for leaving a meeting.
 */
export interface LeaveMeetingInput {
  meetingId: string;
  userId: string;
}

/**
 * Use case for leaving a meeting.
 *
 * Marks the user's active Participant record as left (sets leftAt = now).
 *
 * Notes:
 * - The host CAN leave (the meeting continues without them).
 *   To "end" a meeting, use cancel-meeting instead.
 * - If the user is not currently an active participant, throws NotFoundException.
 */
@Injectable()
export class LeaveMeetingUseCase {
  constructor(
    @Inject(PARTICIPANT_REPOSITORY)
    private readonly participantRepo: IParticipantRepository,
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
  }
}
