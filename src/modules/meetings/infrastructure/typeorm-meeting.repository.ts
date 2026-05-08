import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMeeting } from '../domain/meeting';
import { IMeetingRepository } from '../domain/meeting.repository';
import { MeetingMapper } from './mappers/meeting.mapper';
import { MeetingOrmEntity } from './meeting.orm-entity';

/**
 * TypeORM implementation of IMeetingRepository.
 *
 * Bridges the domain interface to PostgreSQL via TypeORM.
 * The domain layer never sees TypeORM directly.
 */
@Injectable()
export class TypeOrmMeetingRepository implements IMeetingRepository {
  constructor(
    @InjectRepository(MeetingOrmEntity)
    private readonly repo: Repository<MeetingOrmEntity>,
    private readonly mapper: MeetingMapper,
  ) {}

  async findById(id: string): Promise<IMeeting | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async findByCode(meetingCode: string): Promise<IMeeting | null> {
    const orm = await this.repo.findOne({ where: { meetingCode } });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async findByHostId(hostId: string): Promise<IMeeting[]> {
    const orms = await this.repo.find({
      where: { hostId },
      order: { scheduledAt: 'DESC' },
    });
    return orms.map((orm) => this.mapper.toDomain(orm));
  }

  async save(meeting: IMeeting): Promise<void> {
    const orm = this.mapper.toOrm(meeting);
    await this.repo.save(orm);
  }
}
