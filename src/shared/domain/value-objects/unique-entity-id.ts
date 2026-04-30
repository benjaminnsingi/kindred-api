import { randomUUID } from 'node:crypto';
import { ValueObject } from './value-object';

interface UniqueEntityIdProps {
  value: string;
}

/**
 * Represents a unique identifier for a domain entity.
 *
 * Uses UUID v4 by default. The ID is generated on creation if not provided,
 * which enables creating an entity before persisting it.
 */
export class UniqueEntityId extends ValueObject<UniqueEntityIdProps> {
  private constructor(props: UniqueEntityIdProps) {
    super(props);
  }

  /**
   * Creates a new ID. If no value is provided, generates a UUID v4.
   * @param value - Optional existing ID (e.g. when loading from DB)
   */
  public static create(value?: string): UniqueEntityId {
    return new UniqueEntityId({ value: value ?? randomUUID() });
  }

  public get value(): string {
    return this.props.value;
  }

  public toString(): string {
    return this.props.value;
  }
}
