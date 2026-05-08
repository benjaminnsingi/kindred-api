import { IMeeting } from './meeting';

/**
 * Repository contract for Meeting persistence.
 *
 * Defines what the domain needs from persistence, without coupling
 * to TypeORM or any specific database technology.
 */
export interface IMeetingRepository {
  /**
   * Find a meeting by its UUID.
   * Returns null if not found.
   */
  findById(id: string): Promise<IMeeting | null>;

  /**
   * Find a meeting by its short meeting code.
   * Used by participants to join a meeting.
   */
  findByCode(meetingCode: string): Promise<IMeeting | null>;

  /**
   * Find all meetings hosted by a specific user.
   * Ordered by scheduledAt descending (most recent first).
   */
  findByHostId(hostId: string): Promise<IMeeting[]>;

  /**
   * Save a meeting (insert or update).
   */
  save(meeting: IMeeting): Promise<void>;
}

/**
 * Injection token for IMeetingRepository.
 */
export const MEETING_REPOSITORY = Symbol('IMeetingRepository');
