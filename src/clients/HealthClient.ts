import { BaseApiClient } from './BaseApiClient';
import { ApiResponse } from '../models/common.model';
import { UsersListResponse } from '../models/user.model';

export class HealthClient extends BaseApiClient {
  /**
   * Perform health check by requesting a minimal payload from service
   */
  async checkHealth(): Promise<ApiResponse<UsersListResponse>> {
    return this.get<UsersListResponse>('/users', { limit: 1 });
  }
}
