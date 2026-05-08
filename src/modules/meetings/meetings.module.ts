import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_SERVICE } from '../../shared/application/ports/jwt-service';
import { NestJwtService } from '../../shared/infrastructure/adapters/nest-jwt-service';
import { JwtAuthGuard } from '../../shared/infrastructure/guards/jwt-auth.guard';
import { CancelMeetingUseCase } from './application/use-cases/cancel-meeting.use-case';
import { CreateMeetingUseCase } from './application/use-cases/create-meeting.use-case';
import { GetMeetingUseCase } from './application/use-cases/get-meeting.use-case';
import { ListMyMeetingsUseCase } from './application/use-cases/list-my-meetings.use-case';
import { MEETING_REPOSITORY } from './domain/meeting.repository';
import { MeetingMapper } from './infrastructure/mappers/meeting.mapper';
import { MeetingOrmEntity } from './infrastructure/meeting.orm-entity';
import { TypeOrmMeetingRepository } from './infrastructure/typeorm-meeting.repository';
import { MeetingsController } from './presentation/meetings.controller';

/**
 * Meetings module.
 *
 * Wires together all the components of the meetings feature.
 *
 * Reuses JwtModule from the shared infrastructure to support JWT authentication
 * via JwtAuthGuard on protected routes.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingOrmEntity]),
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
  controllers: [MeetingsController],
  providers: [
    // Application
    CreateMeetingUseCase,
    GetMeetingUseCase,
    ListMyMeetingsUseCase,
    CancelMeetingUseCase,

    // Infrastructure
    MeetingMapper,
    JwtAuthGuard,

    // Bindings
    {
      provide: MEETING_REPOSITORY,
      useClass: TypeOrmMeetingRepository,
    },
    {
      provide: JWT_SERVICE,
      useClass: NestJwtService,
    },
  ],
})
export class MeetingsModule {}
