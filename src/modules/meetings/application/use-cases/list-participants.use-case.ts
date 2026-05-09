import { Inject, Injectable } from '@nestjs/common';
import { MeetingNotFoundError } from '../../domain/errors/meeting-not-found.error';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../domain/meeting.repository';
import { IParticipant } from '../../domain/participant';
import {
  IParticipantRepository,
  PARTICIPANT_REPOSITORY,
} from '../../domain/participant.repository';

/**
 * Use case for listing participants of a meeting.
 *
 * Returns ALL participants (active and past).
 * The presentation layer can filter by isActive() if needed.
 *
 * Note: anyone authenticated can list participants of any meeting.
 * In a more strict system, we might check that the requester is part
 * of the meeting first, but for Kindred MVP, we keep it open.
 */
@Injectable()
export class ListParticipantsUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepo: IMeetingRepository,
    @Inject(PARTICIPANT_REPOSITORY)
    private readonly participantRepo: IParticipantRepository,
  ) {}

  async execute(meetingId: string): Promise<IParticipant[]> {
    const meeting = await this.meetingRepo.findById(meetingId);
    if (!meeting) {
      throw new MeetingNotFoundError(meetingId);
    }

    return this.participantRepo.findByMeetingId(meetingId);
  }
}
