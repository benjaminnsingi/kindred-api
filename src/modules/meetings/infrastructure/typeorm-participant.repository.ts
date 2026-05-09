import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { IParticipant } from '../domain/participant';
import { IParticipantRepository } from '../domain/participant.repository';
import { ParticipantMapper } from './mappers/participant.mapper';
import { ParticipantOrmEntity } from './participant.orm-entity';

/**
 * TypeORM implementation of IParticipantRepository.
 */
@Injectable()
export class TypeOrmParticipantRepository implements IParticipantRepository {
  constructor(
    @InjectRepository(ParticipantOrmEntity)
    private readonly repo: Repository<ParticipantOrmEntity>,
    private readonly mapper: ParticipantMapper,
  ) {}

  async findById(id: string): Promise<IParticipant | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async findActiveByUserAndMeeting(
    userId: string,
    meetingId: string,
  ): Promise<IParticipant | null> {
    const orm = await this.repo.findOne({
      where: {
        userId,
        meetingId,
        leftAt: IsNull(),
      },
    });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async findByMeetingId(meetingId: string): Promise<IParticipant[]> {
    const orms = await this.repo.find({
      where: { meetingId },
      order: { joinedAt: 'ASC' },
    });
    return orms.map((orm) => this.mapper.toDomain(orm));
  }

  async save(participant: IParticipant): Promise<void> {
    const orm = this.mapper.toOrm(participant);
    await this.repo.save(orm);
  }
}
