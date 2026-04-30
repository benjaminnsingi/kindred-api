/**
 * User domain contract.
 *
 * Represents a registered user from a business perspective.
 * The IUser interface is the contract that all User implementations must respect.
 *
 * Use cases and other domain services depend on this interface,
 * not on the concrete User class, following the Dependency Inversion Principle.
 */
export interface IUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  changeName(newName: string): void;
}
