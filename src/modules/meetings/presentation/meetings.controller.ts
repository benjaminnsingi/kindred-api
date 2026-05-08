import {
  Body,
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
import { ListMyMeetingsUseCase } from '../application/use-cases/list-my-meetings.use-case';
import { MeetingNotFoundError } from '../domain/errors/meeting-not-found.error';
import { UnauthorizedMeetingActionError } from '../domain/errors/unauthorized-meeting-action.error';
import { CreateMeetingRequestDto } from './dtos/create-meeting.request.dto';
import { ListMeetingsResponseDto } from './dtos/list-meetings.response.dto';
import { MeetingResponseDto } from './dtos/meeting.response.dto';

/**
 * HTTP entry point for the Meetings module.
 *
 * All routes require JWT authentication (via JwtAuthGuard at the class level).
 * Translates domain errors to HTTP exceptions:
 * - MeetingNotFoundError -> 404 Not Found
 * - UnauthorizedMeetingActionError -> 403 Forbidden
 */
@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(
    private readonly createMeeting: CreateMeetingUseCase,
    private readonly getMeeting: GetMeetingUseCase,
    private readonly listMyMeetings: ListMyMeetingsUseCase,
    private readonly cancelMeeting: CancelMeetingUseCase,
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
}
