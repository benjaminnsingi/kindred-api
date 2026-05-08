import { IMeeting } from '../../domain/meeting';
import { MeetingResponseDto } from './meeting.response.dto';

/**
 * DTO for the GET /meetings endpoint.
 *
 * Wraps a list of meetings with pagination metadata.
 * For Kindred MVP, pagination is simple: just the count.
 * We can add cursors/pages later if needed.
 */
export class ListMeetingsResponseDto {
  meetings: MeetingResponseDto[];
  count: number;

  static fromDomain(meetings: IMeeting[]): ListMeetingsResponseDto {
    const dto = new ListMeetingsResponseDto();
    dto.meetings = meetings.map((m) => MeetingResponseDto.fromDomain(m));
    dto.count = meetings.length;
    return dto;
  }
}
