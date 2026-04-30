import { randomUUID } from 'node:crypto';
import { IUser } from './user';

/**
 * User domain entity (concrete implementation of IUser).
 *
 * Encapsulates business rules and behaviors related to a user.
 * Should be created via the static factory methods:
 *   - User.create() for new users
 *   - User.reconstitute() for users loaded from persistence
 */
export class User implements IUser {
  private constructor(
    public readonly id: string,
    private _email: string,
    private _name: string,
    private readonly _passwordHash: string,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: {
    email: string;
    name: string;
    passwordHash: string;
  }): User {
    const now = new Date();
    return new User(
      randomUUID(),
      props.email.toLowerCase().trim(),
      props.name.trim(),
      props.passwordHash,
      now,
      now,
    );
  }

  static reconstitute(props: {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props.id,
      props.email,
      props.name,
      props.passwordHash,
      props.createdAt,
      props.updatedAt,
    );
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  changeName(newName: string): void {
    const trimmed = newName.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      throw new Error('Name must be between 2 and 50 characters');
    }
    this._name = trimmed;
    this._updatedAt = new Date();
  }
}
