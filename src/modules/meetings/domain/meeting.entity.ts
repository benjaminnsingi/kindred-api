import { randomUUID } from 'node:crypto';
import { IMeeting, MeetingStatus } from './meeting';

/**
 * Meeting domain entity (concrete implementation of IMeeting).
 *
 * Encapsulates business rules:
 * - Creation generates a unique ID and meeting code
 * - Cancellation is only allowed if not already ended/cancelled
 *
 * Should be created via:
 *   - Meeting.create() for new meetings
 *   - Meeting.reconstitute() for meetings loaded from persistence
 */
export class Meeting implements IMeeting {
  private constructor(
    public readonly id: string,
    public readonly hostId: string,
    private _title: string,
    private _description: string | null,
    private _scheduledAt: Date,
    private _status: MeetingStatus,
    public readonly meetingCode: string,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: {
    hostId: string;
    title: string;
    description?: string | null;
    scheduledAt: Date;
  }): Meeting {
    const now = new Date();
    return new Meeting(
      randomUUID(),
      props.hostId,
      props.title.trim(),
      props.description?.trim() ?? null,
      props.scheduledAt,
      'scheduled',
      Meeting.generateMeetingCode(),
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    hostId: string;
    title: string;
    description: string | null;
    scheduledAt: Date;
    status: MeetingStatus;
    meetingCode: string;
    createdAt: Date;
    updatedAt: Date;
  }): Meeting {
    return new Meeting(
      props.id,
      props.hostId,
      props.title,
      props.description,
      props.scheduledAt,
      props.status,
      props.meetingCode,
      props.createdAt,
      props.updatedAt,
    );
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get scheduledAt(): Date {
    return this._scheduledAt;
  }

  get status(): MeetingStatus {
    return this._status;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  cancel(): void {
    if (this._status === 'ended') {
      throw new Error('Cannot cancel an ended meeting');
    }
    if (this._status === 'cancelled') {
      throw new Error('Meeting is already cancelled');
    }
    this._status = 'cancelled';
    this._updatedAt = new Date();
  }

  /**
   * Generates a 9-character meeting code in format 'xxx-xxx-xxx'.
   * Uses lowercase letters and digits, avoiding ambiguous chars (0, O, 1, l, I).
   */
  private static generateMeetingCode(): string {
    const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
    const segments: string[] = [];
    for (let i = 0; i < 3; i++) {
      let segment = '';
      for (let j = 0; j < 3; j++) {
        segment += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      segments.push(segment);
    }
    return segments.join('-');
  }
}
