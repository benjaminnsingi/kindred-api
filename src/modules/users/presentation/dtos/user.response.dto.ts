import { IUser } from '../../domain/user';

/**
 * DTO for user data returned to the client.
 *
 * Excludes sensitive fields (passwordHash) and exposes only what the
 * client needs to know about a user.
 */
export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(user: IUser): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
