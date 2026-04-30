import { Inject, Injectable } from '@nestjs/common';
import {
  IPasswordHasher,
  PASSWORD_HASHER,
} from '../../../../shared/application/ports/password-hasher';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error';
import { IUser } from '../../domain/user';
import { User } from '../../domain/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../domain/user.repository';

/**
 * Input data required to register a new user.
 */
export interface RegisterUserInput {
  email: string;
  name: string;
  password: string;
}

/**
 * Use case for registering a new user.
 *
 * Orchestrates:
 *   1. Verify the email is not already taken
 *   2. Hash the password using the configured hasher
 *   3. Create the User domain entity
 *   4. Persist the user via the repository
 *   5. Return the created user
 *
 * Throws UserAlreadyExistsError if the email is already in use.
 */
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<IUser> {
    const normalizedEmail = input.email.toLowerCase().trim();

    const exists = await this.userRepo.existsByEmail(normalizedEmail);
    if (exists) {
      throw new UserAlreadyExistsError(normalizedEmail);
    }

    const passwordHash = await this.hasher.hash(input.password);

    const user = User.create({
      email: normalizedEmail,
      name: input.name,
      passwordHash,
    });

    await this.userRepo.save(user);

    return user;
  }
}
