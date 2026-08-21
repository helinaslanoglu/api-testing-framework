import { BaseApiClient } from './BaseApiClient';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/common.model';

export class AuthClient extends BaseApiClient {
  /**
   * Authenticate user with username and password
   */
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/auth/login', payload);
  }

  /**
   * Get current authenticated user details using Bearer token
   */
  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get auth me endpoint without token (for negative testing)
   */
  async getCurrentUserWithoutAuth(): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me');
  }
}
