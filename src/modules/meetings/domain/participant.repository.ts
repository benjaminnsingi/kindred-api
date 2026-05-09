import { IParticipant } from './participant';

/**
 * Repository contract for Participant persistence.
 */
export interface IParticipantRepository {
  /**
   * Find a participant by ID.
   */
  findById(id: string): Promise<IParticipant | null>;

  /**
   * Find an active participant for a given user in a meeting.
   * Returns the most recent active participation if any.
   * Used to check if a user is currently in a meeting.
   */
  findActiveByUserAndMeeting(
    userId: string,
    meetingId: string,
  ): Promise<IParticipant | null>;

  /**
   * Find all participants of a meeting (active and inactive).
   * Ordered by joinedAt ascending (chronological order).
   */
  findByMeetingId(meetingId: string): Promise<IParticipant[]>;

  /**
   * Save a participant (insert or update).
   */
  save(participant: IParticipant): Promise<void>;
}

/**
 * Injection token for IParticipantRepository.
 */
export const PARTICIPANT_REPOSITORY = Symbol('IParticipantRepository');
