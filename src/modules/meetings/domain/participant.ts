/**
 * Role of a user in a meeting.
 *
 * - 'host': the user who created the meeting
 * - 'participant': any other user who joined
 */
export type ParticipantRole = 'host' | 'participant';

/**
 * Participant domain contract.
 *
 * Represents the link between a User and a Meeting.
 * Tracks when the user joined and (if applicable) when they left.
 */
export interface IParticipant {
  readonly id: string;
  readonly meetingId: string;
  readonly userId: string;
  readonly role: ParticipantRole;
  readonly joinedAt: Date;
  readonly leftAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  leave(): void;
  isActive(): boolean;
}
