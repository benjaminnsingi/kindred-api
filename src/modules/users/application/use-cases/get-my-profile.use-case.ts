import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from '../../domain/user';
import {IUserRepository,USER_REPOSITORY} from '../../domain/user.repository';

/**
 * Use case for retrieving the currently authenticated user's profile.
 *
 * Takes a user ID (extracted from the JWT) and returns the User domain entity.
 * Throws NotFoundException if the user has been deleted from the database
 * but still has a valid token (rare edge case).
 */
@Injectable()
export class GetMyProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string): Promise<IUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
