import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '../domain/errors/user-already-exists.error';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { RegisterUserRequestDto } from './dtos/register-user.request.dto';
import { UserResponseDto } from './dtos/user.response.dto';

/**
 * HTTP entry point for the Users module.
 *
 * Maps HTTP requests to use cases. Does NOT contain business logic;
 * it only orchestrates DTO validation, use case invocation, and response shaping.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: RegisterUserRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.registerUser.execute(body);
      return UserResponseDto.fromDomain(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
