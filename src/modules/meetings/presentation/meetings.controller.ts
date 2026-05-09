import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { CancelMeetingUseCase } from '../application/use-cases/cancel-meeting.use-case';
import { CreateMeetingUseCase } from '../application/use-cases/create-meeting.use-case';
import { GetMeetingUseCase } from '../application/use-cases/get-meeting.use-case';
import { JoinMeetingUseCase } from '../application/use-cases/join-meeting.use-case';
import { LeaveMeetingUseCase } from '../application/use-cases/leave-meeting.use-case';
import { ListMyMeetingsUseCase } from '../application/use-cases/list-my-meetings.use-case';
import { ListParticipantsUseCase } from '../application/use-cases/list-participants.use-case';
import { AlreadyParticipantError } from '../domain/errors/already-participant.error';
import { MeetingNotFoundError } from '../domain/errors/meeting-not-found.error';
import { MeetingNotJoinableError } from '../domain/errors/meeting-not-joinable.error';
import { UnauthorizedMeetingActionError } from '../domain/errors/unauthorized-meeting-action.error';
import { CreateMeetingRequestDto } from './dtos/create-meeting.request.dto';
import { JoinMeetingRequestDto } from './dtos/join-meeting.request.dto';
import { ListMeetingsResponseDto } from './dtos/list-meetings.response.dto';
import { MeetingResponseDto } from './dtos/meeting.response.dto';
import { ParticipantResponseDto } from './dtos/participant.response.dto';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(
    private readonly createMeeting: CreateMeetingUseCase,
    private readonly getMeeting: GetMeetingUseCase,
    private readonly listMyMeetings: ListMyMeetingsUseCase,
    private readonly cancelMeeting: CancelMeetingUseCase,
    private readonly joinMeeting: JoinMeetingUseCase,
    private readonly leaveMeeting: LeaveMeetingUseCase,
    private readonly listParticipants: ListParticipantsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateMeetingRequestDto,
  ): Promise<MeetingResponseDto> {
    const meeting = await this.createMeeting.execute({
      hostId: req.user.sub,
      title: body.title,
      description: body.description ?? null,
      scheduledAt: new Date(body.scheduledAt),
    });
    return MeetingResponseDto.fromDomain(meeting);
  }

  @Get()
  async list(
    @Req() req: AuthenticatedRequest,
  ): Promise<ListMeetingsResponseDto> {
    const meetings = await this.listMyMeetings.execute(req.user.sub);
    return ListMeetingsResponseDto.fromDomain(meetings);
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  async join(
    @Req() req: AuthenticatedRequest,
    @Body() body: JoinMeetingRequestDto,
  ): Promise<{ meeting: MeetingResponseDto; participant: ParticipantResponseDto }> {
    try {
      const { meeting, participant } = await this.joinMeeting.execute({
        meetingCode: body.meetingCode,
        userId: req.user.sub,
      });
      return {
        meeting: MeetingResponseDto.fromDomain(meeting),
        participant: ParticipantResponseDto.fromDomain(participant),
      };
    } catch (error) {
      if (error instanceof MeetingNotJoinableError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof AlreadyParticipantError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MeetingResponseDto> {
    try {
      const meeting = await this.getMeeting.execute(id);
      return MeetingResponseDto.fromDomain(meeting);
    } catch (error) {
      if (error instanceof MeetingNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get(':id/participants')
  async getParticipants(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ParticipantResponseDto[]> {
    try {
      const participants = await this.listParticipants.execute(id);
      return participants.map((p) => ParticipantResponseDto.fromDomain(p));
    } catch (error) {
      if (error instanceof MeetingNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    try {
      await this.cancelMeeting.execute({
        meetingId: id,
        userId: req.user.sub,
      });
    } catch (error) {
      if (error instanceof MeetingNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof UnauthorizedMeetingActionError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id/participants/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.leaveMeeting.execute({
      meetingId: id,
      userId: req.user.sub,
    });
  }
}
