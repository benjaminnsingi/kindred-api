import { IsEmail, IsString, Length, Matches } from 'class-validator';

/**
 * DTO for the POST /users/register endpoint.
 *
 * Validates the request body using class-validator decorators.
 * Invalid requests are automatically rejected by ValidationPipe with a 400 error.
 */
export class RegisterUserRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name: string;

  @IsString()
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one digit' })
  password: string;
}
