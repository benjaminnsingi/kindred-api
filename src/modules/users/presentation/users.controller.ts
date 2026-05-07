import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { InvalidCredentialsError } from '../domain/errors/invalid-credentials.error';
import { UserAlreadyExistsError } from '../domain/errors/user-already-exists.error';
import { LoginUserRequestDto } from './dtos/login-user.request.dto';
import { LoginResponseDto } from './dtos/login.response.dto';
import { RegisterUserRequestDto } from './dtos/register-user.request.dto';
import { UserResponseDto } from './dtos/user.response.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserRequestDto): Promise<LoginResponseDto> {
    try {
      const { user, accessToken } = await this.loginUser.execute(body);
      return LoginResponseDto.from(user, accessToken);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
