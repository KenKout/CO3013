// Admin API Service
import { api } from './api';
import type {
  UserResponse,
  UserSummaryResponse,
  AdminUserListParams,
  AdminUpdateUserRequest,
  AdminUserSummaryResponse,
  PaginatedResponse,
} from '@/schemas/api';

// ============================================================================
// Admin Users API
// ============================================================================

export const adminApi = {
  /**
   * List users (admin only)
   * Requires authentication
   */
  listUsers: async (params?: AdminUserListParams): Promise<PaginatedResponse<UserSummaryResponse>> => {
    return api.get<PaginatedResponse<UserSummaryResponse>>('/admin/users', params, true);
  },

  /**
   * Get user details (admin only)
   * Requires authentication
   */
  getUser: async (userId: number): Promise<UserResponse> => {
    return api.get<UserResponse>(`/admin/users/${userId}`, undefined, true);
  },

  /**
   * Update user role/status (admin only)
   * Requires authentication
   */
  updateUser: async (userId: number, data: AdminUpdateUserRequest): Promise<UserResponse> => {
    return api.patch<UserResponse>(`/admin/users/${userId}`, data, true);
  },

  /**
   * Get user summary with booking history, penalties, and ratings (admin only)
   * Requires authentication
   */
  getUserSummary: async (userId: number): Promise<AdminUserSummaryResponse> => {
    return api.get<AdminUserSummaryResponse>(`/admin/users/${userId}/summary`, undefined, true);
  },
};
