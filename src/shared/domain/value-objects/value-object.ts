/**
 * Base class for all Value Objects in the domain.
 *
 * A Value Object is identified by its value, not by an ID. Two Value Objects
 * with the same properties are considered equal. They are immutable: instead
 * of modifying them, you create a new instance with the new value.
 *
 * @example
 * class Email extends ValueObject<{ value: string }> {
 *   private constructor(props: { value: string }) {
 *     super(props);
 *   }
 *
 *   static create(value: string): Result<Email, InvalidEmailError> {
 *     if (!value.includes('@')) return Result.fail(new InvalidEmailError(value));
 *     return Result.ok(new Email({ value }));
 *   }
 *
 *   get value(): string {
 *     return this.props.value;
 *   }
 * }
 */
export abstract class ValueObject<T extends object> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * Compares two Value Objects by their properties (value equality).
   * Returns true if both are the same type and have the same props.
   */
  public equals(other?: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other.constructor !== this.constructor) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
