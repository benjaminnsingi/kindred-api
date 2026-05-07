import { Inject, Injectable } from '@nestjs/common';
import {
  IJwtService,
  JWT_SERVICE,
} from '../../../../shared/application/ports/jwt-service';
import {
  IPasswordHasher,
  PASSWORD_HASHER,
} from '../../../../shared/application/ports/password-hasher';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { IUser } from '../../domain/user';
import {IUserRepository, USER_REPOSITORY } from '../../domain/user.repository';

/**
 * Input data required to log a user in.
 */
export interface LoginUserInput {
  email: string;
  password: string;
}

/**
 * Output data returned after a successful login.
 */
export interface LoginUserOutput {
  user: IUser;
  accessToken: string;
}

/**
 * Use case for logging a user in.
 *
 * Orchestrates:
 *   1. Find the user by email (normalize the email first)
 *   2. If not found OR password doesn't match: throw InvalidCredentialsError
 *      (same error in both cases to prevent user enumeration attacks)
 *   3. Generate a JWT access token
 *   4. Return the user + token
 */
@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const normalizedEmail = input.email.toLowerCase().trim();

    const user = await this.userRepo.findByEmail(normalizedEmail);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.hasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { user, accessToken };
  }
}
