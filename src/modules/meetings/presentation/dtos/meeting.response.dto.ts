import { IMeeting, MeetingStatus } from '../../domain/meeting';

/**
 * DTO for meeting data returned to the client.
 *
 * Exposes all public meeting information.
 * Used by GET /meetings/:id and as a building block for list responses.
 */
export class MeetingResponseDto {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  scheduledAt: Date;
  status: MeetingStatus;
  meetingCode: string;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(meeting: IMeeting): MeetingResponseDto {
    const dto = new MeetingResponseDto();
    dto.id = meeting.id;
    dto.hostId = meeting.hostId;
    dto.title = meeting.title;
    dto.description = meeting.description;
    dto.scheduledAt = meeting.scheduledAt;
    dto.status = meeting.status;
    dto.meetingCode = meeting.meetingCode;
    dto.createdAt = meeting.createdAt;
    dto.updatedAt = meeting.updatedAt;
    return dto;
  }
}
