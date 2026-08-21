import { BaseApiClient } from './BaseApiClient';
import {
  User,
  UsersListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserResponse,
  UserQueryParams,
} from '../models/user.model';
import { ApiResponse } from '../models/common.model';

export class UsersClient extends BaseApiClient {
  /**
   * Retrieve list of users with optional pagination/filtering params
   */
  async getUsers(params?: UserQueryParams): Promise<ApiResponse<UsersListResponse>> {
    const cleanParams: Record<string, string | number | boolean> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          cleanParams[key] = value;
        }
      });
    }
    return this.get<UsersListResponse>('/users', cleanParams);
  }

  /**
   * Retrieve single user by ID
   */
  async getUser(id: number | string): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${id}`);
  }

  /**
   * Create a new user resource
   */
  async createUser(payload: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.post<User>('/users/add', payload);
  }

  /**
   * Update an existing user resource
   */
  async updateUser(id: number | string, payload: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.put<User>(`/users/${id}`, payload);
  }

  /**
   * Delete a user resource by ID
   */
  async deleteUser(id: number | string): Promise<ApiResponse<DeleteUserResponse>> {
    return this.delete<DeleteUserResponse>(`/users/${id}`);
  }
}
