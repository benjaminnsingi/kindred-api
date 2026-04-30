import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from '../domain/user';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
    private readonly mapper: UserMapper,
  ) {}

  async findById(id: string): Promise<IUser | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const orm = await this.repo.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async save(user: IUser): Promise<void> {
    const orm = this.mapper.toOrmEntity(user as User);
    await this.repo.save(orm);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repo.count({
      where: { email: email.toLowerCase().trim() },
    });
    return count > 0;
  }
}
