import { UsersListResponse } from '../models/user.model';
import { ApiResponse } from '../models/common.model';

export interface PaginationValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates consistency between pagination metadata (limit, skip, total) and returned records
 */
export function validatePaginationMetadata(
  response: ApiResponse<UsersListResponse>,
  expectedLimit?: number,
  expectedSkip?: number
): PaginationValidationResult {
  const errors: string[] = [];
  const data = response.data;

  if (!data || !Array.isArray(data.users)) {
    return {
      isValid: false,
      errors: ['Response data does not contain a valid users array'],
    };
  }

  if (typeof data.total !== 'number' || data.total < 0) {
    errors.push(`Invalid total count: ${data.total}`);
  }

  if (typeof data.skip !== 'number' || data.skip < 0) {
    errors.push(`Invalid skip value: ${data.skip}`);
  }

  if (typeof data.limit !== 'number' || data.limit < 0) {
    errors.push(`Invalid limit value: ${data.limit}`);
  }

  if (expectedLimit !== undefined && data.limit !== expectedLimit) {
    errors.push(`Expected limit ${expectedLimit}, but received ${data.limit}`);
  }

  if (expectedSkip !== undefined && data.skip !== expectedSkip) {
    errors.push(`Expected skip ${expectedSkip}, but received ${data.skip}`);
  }

  if (data.limit > 0 && data.users.length > data.limit) {
    errors.push(
      `Returned users count (${data.users.length}) exceeds expected limit (${data.limit})`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Verifies that items on consecutive paginated requests are distinct with zero overlapping IDs
 */
export function validatePageUniqueness(
  page1: UsersListResponse,
  page2: UsersListResponse
): boolean {
  const page1Ids = new Set(page1.users.map((u) => u.id));
  const hasOverlap = page2.users.some((u) => page1Ids.has(u.id));
  return !hasOverlap;
}
