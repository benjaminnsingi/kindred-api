import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for the POST /users/login endpoint.
 *
 * Validation rules are intentionally minimal here.
 * We don't replicate the full password complexity rules from registration
 * because validating against complex rules would leak information about
 * our password policy.
 */
export class LoginUserRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
