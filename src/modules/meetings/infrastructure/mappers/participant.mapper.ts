import { Injectable } from '@nestjs/common';
import { IParticipant, ParticipantRole } from '../../domain/participant';
import { Participant } from '../../domain/participant.entity';
import { ParticipantOrmEntity } from '../participant.orm-entity';

/**
 * Translates between Participant (domain) and ParticipantOrmEntity (persistence).
 */
@Injectable()
export class ParticipantMapper {
  /**
   * Domain -> ORM (used before saving).
   */
  toOrm(participant: IParticipant): ParticipantOrmEntity {
    const orm = new ParticipantOrmEntity();
    orm.id = participant.id;
    orm.meetingId = participant.meetingId;
    orm.userId = participant.userId;
    orm.role = participant.role;
    orm.joinedAt = participant.joinedAt;
    orm.leftAt = participant.leftAt;
    orm.createdAt = participant.createdAt;
    orm.updatedAt = participant.updatedAt;
    return orm;
  }

  /**
   * ORM -> Domain (used after loading from DB).
   */
  toDomain(orm: ParticipantOrmEntity): Participant {
    return Participant.reconstitute({
      id: orm.id,
      meetingId: orm.meetingId,
      userId: orm.userId,
      role: orm.role as ParticipantRole,
      joinedAt: orm.joinedAt,
      leftAt: orm.leftAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
