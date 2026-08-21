import { z } from 'zod';

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Validates data against a Zod schema safely and returns a result object
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): SchemaValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors = result.error.errors.map(
    (err) => `${err.path.join('.') || 'root'}: ${err.message}`
  );

  return {
    success: false,
    errors,
  };
}

/**
 * Asserts that the data matches the Zod schema.
 * Throws a descriptive Error listing all contract mismatches if validation fails.
 */
export function assertSchemaMatch<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  schemaName: string = 'Response'
): T {
  const result = validateSchema(schema, data);
  if (!result.success) {
    const errorMessage = `[Schema Validation Error] ${schemaName} contract validation failed:\n` +
      (result.errors ? result.errors.map((e) => `  - ${e}`).join('\n') : '  - Unknown error');
    throw new Error(errorMessage);
  }
  return result.data!;
}
