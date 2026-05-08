/**
 * Meeting status state machine.
 *
 * Possible transitions:
 *   scheduled -> in_progress -> ended
 *   scheduled -> cancelled
 *   in_progress -> cancelled
 */
export type MeetingStatus =
  | 'scheduled'
  | 'in_progress'
  | 'ended'
  | 'cancelled';

/**
 * Meeting domain contract.
 *
 * Represents a video meeting (room) created by a host.
 * Participants will join later using the meetingCode.
 */
export interface IMeeting {
  readonly id: string;
  readonly hostId: string;
  readonly title: string;
  readonly description: string | null;
  readonly scheduledAt: Date;
  readonly status: MeetingStatus;
  readonly meetingCode: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  cancel(): void;
}
