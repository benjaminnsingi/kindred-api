import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

/**
 * DTO for the POST /meetings endpoint.
 *
 * The hostId is NOT in this DTO: it's extracted from the JWT by the controller.
 * This prevents users from creating meetings on behalf of others.
 */
export class CreateMeetingRequestDto {
  @IsString()
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000, { message: 'Description must not exceed 5000 characters' })
  description?: string;

  @IsDateString({}, { message: 'scheduledAt must be a valid ISO 8601 date' })
  scheduledAt: string;
}
