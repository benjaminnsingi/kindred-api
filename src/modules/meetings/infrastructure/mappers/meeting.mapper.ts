import { Injectable } from '@nestjs/common';
import { IMeeting, MeetingStatus } from '../../domain/meeting';
import { Meeting } from '../../domain/meeting.entity';
import { MeetingOrmEntity } from '../meeting.orm-entity';

/**
 * Translates between Meeting (domain) and MeetingOrmEntity (persistence).
 *
 * Keeps domain free of TypeORM dependencies.
 */
@Injectable()
export class MeetingMapper {
  /**
   * Domain -> ORM (used before saving).
   */
  toOrm(meeting: IMeeting): MeetingOrmEntity {
    const orm = new MeetingOrmEntity();
    orm.id = meeting.id;
    orm.hostId = meeting.hostId;
    orm.title = meeting.title;
    orm.description = meeting.description;
    orm.scheduledAt = meeting.scheduledAt;
    orm.status = meeting.status;
    orm.meetingCode = meeting.meetingCode;
    orm.createdAt = meeting.createdAt;
    orm.updatedAt = meeting.updatedAt;
    return orm;
  }

  /**
   * ORM -> Domain (used after loading from DB).
   */
  toDomain(orm: MeetingOrmEntity): Meeting {
    return Meeting.reconstitute({
      id: orm.id,
      hostId: orm.hostId,
      title: orm.title,
      description: orm.description,
      scheduledAt: orm.scheduledAt,
      status: orm.status as MeetingStatus,
      meetingCode: orm.meetingCode,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
