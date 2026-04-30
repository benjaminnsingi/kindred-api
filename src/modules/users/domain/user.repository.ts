import { IUser } from './user';

/**
 * Repository contract for User persistence.
 *
 * Defined in the domain layer to invert the dependency: the domain
 * defines what it needs from persistence, and the infrastructure
 * provides a concrete implementation (TypeOrmUserRepository).
 *
 * Use cases depend on this interface, never on a concrete implementation.
 * This allows for easy testing (mock implementation) and swapping
 * the underlying persistence technology without touching the domain.
 */
export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  save(user: IUser): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}

/**
 * Injection token for the IUserRepository.
 *
 * NestJS uses this Symbol to wire the interface to its implementation
 * at runtime. Use it with @Inject(USER_REPOSITORY) in services and use cases.
 *
 * Why a Symbol and not a string?
 * - Guaranteed uniqueness across the codebase
 * - Refactor-safe (renaming via IDE updates all usages)
 * - Self-documenting (clearly an injection token)
 */
export const USER_REPOSITORY = Symbol('IUserRepository');
