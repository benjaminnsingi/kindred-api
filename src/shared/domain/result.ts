/**
 * Represents the outcome of an operation that can either succeed with a value of type T
 * or fail with an error of type E.
 *
 * Use Result instead of throwing exceptions when failure is a *predictable* outcome
 * (e.g. validation errors, business rule violations). Reserve exceptions for truly
 * unexpected technical errors (e.g. database down, network failures).
 *
 * @example
 * ```ts
 * const result = User.create({ email: 'invalid' });
 * if (result.isFailure) {
 *   return result; // propagate the error
 * }
 * const user = result.value;
 * ```
 */
export class Result<T, E = Error> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, value?: T, error?: E) {
    if (isSuccess && error) {
      throw new Error('A successful Result cannot contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('A failed Result must contain an error');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;

    Object.freeze(this);
  }

  public static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  public static fail<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  /**
   * Throws on failed Result. Always check `isSuccess` or `isFailure` first.
   */
  public get value(): T {
    if (this.isFailure) {
      throw new Error(
        'Cannot get value from a failed Result. Check isFailure first.',
      );
    }
    return this._value as T;
  }

  /**
   * Throws on successful Result. Always check `isFailure` first.
   */
  public get error(): E {
    if (this.isSuccess) {
      throw new Error(
        'Cannot get error from a successful Result. Check isSuccess first.',
      );
    }
    return this._error as E;
  }

  /**
   * Returns the first failure, or success if all results succeed.
   * Useful when validating multiple conditions before proceeding.
   */
  public static combine(
    results: Result<unknown, unknown>[],
  ): Result<void, unknown> {
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail(result.error);
      }
    }
    return Result.ok(undefined);
  }
}
