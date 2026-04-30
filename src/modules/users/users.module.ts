import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PASSWORD_HASHER } from '../../shared/application/ports/password-hasher';
import { BcryptPasswordHasher } from '../../shared/infrastructure/adapters/bcrypt-password-hasher';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { USER_REPOSITORY } from './domain/user.repository';
import { UserMapper } from './infrastructure/mappers/user.mapper';
import { TypeOrmUserRepository } from './infrastructure/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { UsersController } from './presentation/users.controller';

/**
 * Users module.
 *
 * Wires together all the components of the users feature:
 * - Domain: entities, value objects, repository interface
 * - Application: use cases
 * - Infrastructure: TypeORM repository, mapper
 * - Presentation: controller, DTOs
 *
 * Uses the Dependency Inversion Principle: the use cases depend on
 * IUserRepository (interface), and this module binds the interface
 * to its concrete implementation (TypeOrmUserRepository).
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    UserMapper,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class UsersModule {}
