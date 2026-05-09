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
import { JoinMeetingUseCase } from './application/use-cases/join-meeting.use-case';
import { LeaveMeetingUseCase } from './application/use-cases/leave-meeting.use-case';
import { ListMyMeetingsUseCase } from './application/use-cases/list-my-meetings.use-case';
import { ListParticipantsUseCase } from './application/use-cases/list-participants.use-case';
import { MEETING_REPOSITORY } from './domain/meeting.repository';
import { PARTICIPANT_REPOSITORY } from './domain/participant.repository';
import { MeetingMapper } from './infrastructure/mappers/meeting.mapper';
import { ParticipantMapper } from './infrastructure/mappers/participant.mapper';
import { MeetingOrmEntity } from './infrastructure/meeting.orm-entity';
import { ParticipantOrmEntity } from './infrastructure/participant.orm-entity';
import { TypeOrmMeetingRepository } from './infrastructure/typeorm-meeting.repository';
import { TypeOrmParticipantRepository } from './infrastructure/typeorm-participant.repository';
import { MeetingsController } from './presentation/meetings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingOrmEntity, ParticipantOrmEntity]),
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
    JoinMeetingUseCase,
    LeaveMeetingUseCase,
    ListParticipantsUseCase,

    // Infrastructure - mappers
    MeetingMapper,
    ParticipantMapper,
    JwtAuthGuard,

    // Bindings
    {
      provide: MEETING_REPOSITORY,
      useClass: TypeOrmMeetingRepository,
    },
    {
      provide: PARTICIPANT_REPOSITORY,
      useClass: TypeOrmParticipantRepository,
    },
    {
      provide: JWT_SERVICE,
      useClass: NestJwtService,
    },
  ],
})
export class MeetingsModule {}
