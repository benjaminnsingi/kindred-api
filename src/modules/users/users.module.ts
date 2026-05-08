import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_SERVICE } from '../../shared/application/ports/jwt-service';
import { PASSWORD_HASHER } from '../../shared/application/ports/password-hasher';
import { BcryptPasswordHasher } from '../../shared/infrastructure/adapters/bcrypt-password-hasher';
import { NestJwtService } from '../../shared/infrastructure/adapters/nest-jwt-service';
import { JwtAuthGuard } from '../../shared/infrastructure/guards/jwt-auth.guard';
import { GetMyProfileUseCase } from './application/use-cases/get-my-profile.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { USER_REPOSITORY } from './domain/user.repository';
import { UserMapper } from './infrastructure/mappers/user.mapper';
import { TypeOrmUserRepository } from './infrastructure/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { UsersController } from './presentation/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    GetMyProfileUseCase,
    UserMapper,
    JwtAuthGuard,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: JWT_SERVICE,
      useClass: NestJwtService,
    },
  ],
})
export class UsersModule {}
