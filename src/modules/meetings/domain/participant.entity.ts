import { randomUUID } from 'node:crypto';
import { IParticipant, ParticipantRole } from './participant';

/**
 * Participant domain entity.
 *
 * Encapsulates the lifecycle of a user's participation in a meeting.
 *
 * Should be created via:
 *   - Participant.create() for new participants joining
 *   - Participant.reconstitute() when loading from persistence
 */
export class Participant implements IParticipant {
  private constructor(
    public readonly id: string,
    public readonly meetingId: string,
    public readonly userId: string,
    public readonly role: ParticipantRole,
    public readonly joinedAt: Date,
    private _leftAt: Date | null,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: {
    meetingId: string;
    userId: string;
    role: ParticipantRole;
  }): Participant {
    const now = new Date();
    return new Participant(
      randomUUID(),
      props.meetingId,
      props.userId,
      props.role,
      now,
      null,
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    meetingId: string;
    userId: string;
    role: ParticipantRole;
    joinedAt: Date;
    leftAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Participant {
    return new Participant(
      props.id,
      props.meetingId,
      props.userId,
      props.role,
      props.joinedAt,
      props.leftAt,
      props.createdAt,
      props.updatedAt,
    );
  }

  get leftAt(): Date | null {
    return this._leftAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  leave(): void {
    if (this._leftAt !== null) {
      throw new Error('Participant has already left the meeting');
    }
    this._leftAt = new Date();
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this._leftAt === null;
  }
}
