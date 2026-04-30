import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserOrmEntity } from '../user.orm-entity';

/**
 * Translates between the User domain entity and the UserOrmEntity (TypeORM).
 *
 * This mapper isolates the persistence layer from the domain layer.
 * The domain knows nothing about TypeORM, and TypeORM entities can have
 * their own structure (snake_case columns, decorators, etc.) without
 * polluting the domain.
 */
@Injectable()
export class UserMapper {
  toDomain(orm: UserOrmEntity): User {
    return User.reconstitute({
      id: orm.id,
      email: orm.email,
      name: orm.name,
      passwordHash: orm.passwordHash,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  toOrmEntity(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.email = user.email;
    orm.name = user.name;
    orm.passwordHash = user.passwordHash;
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;
    return orm;
  }
}
