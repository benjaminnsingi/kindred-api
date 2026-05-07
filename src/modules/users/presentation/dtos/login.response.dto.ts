import { IUser } from '../../domain/user';
import { UserResponseDto } from './user.response.dto';

/**
 * DTO returned after a successful login.
 *
 * Contains:
 * - The user's public information (no passwordHash)
 * - The JWT access token to use for authenticated requests
 */
export class LoginResponseDto {
  user: UserResponseDto;
  accessToken: string;

  static from(user: IUser, accessToken: string): LoginResponseDto {
    const dto = new LoginResponseDto();
    dto.user = UserResponseDto.fromDomain(user);
    dto.accessToken = accessToken;
    return dto;
  }
}
