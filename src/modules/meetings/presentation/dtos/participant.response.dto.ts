import { IParticipant, ParticipantRole } from '../../domain/participant';

/**
 * DTO for participant data returned to the client.
 */
export class ParticipantResponseDto {
  id: string;
  meetingId: string;
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  leftAt: Date | null;
  isActive: boolean;

  static fromDomain(participant: IParticipant): ParticipantResponseDto {
    const dto = new ParticipantResponseDto();
    dto.id = participant.id;
    dto.meetingId = participant.meetingId;
    dto.userId = participant.userId;
    dto.role = participant.role;
    dto.joinedAt = participant.joinedAt;
    dto.leftAt = participant.leftAt;
    dto.isActive = participant.isActive();
    return dto;
  }
}
