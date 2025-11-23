// Spaces API Service
import { api } from './api';
import type {
  SpaceResponse,
  SpaceListParams,
  CreateSpaceRequest,
  UpdateSpaceRequest,
  PaginatedResponse,
} from '@/schemas/api';

// ============================================================================
// Spaces API
// ============================================================================

export const spacesApi = {
  /**
   * List spaces with optional filters and pagination
   */
  list: async (params?: SpaceListParams): Promise<PaginatedResponse<SpaceResponse>> => {
    return api.get<PaginatedResponse<SpaceResponse>>('/spaces', params, false);
  },

  /**
   * Get a single space by ID
   */
  getById: async (spaceId: number): Promise<SpaceResponse> => {
    return api.get<SpaceResponse>(`/spaces/${spaceId}`, undefined, false);
  },

  /**
   * Create a new space (admin only)
   * Requires authentication
   */
  create: async (data: CreateSpaceRequest): Promise<SpaceResponse> => {
    return api.post<SpaceResponse>('/spaces', data, true);
  },

  /**
   * Update a space (admin only)
   * Requires authentication
   */
  update: async (spaceId: number, data: UpdateSpaceRequest): Promise<SpaceResponse> => {
    return api.patch<SpaceResponse>(`/spaces/${spaceId}`, data, true);
  },

  /**
   * Delete a space (admin only)
   * Requires authentication
   */
  delete: async (spaceId: number): Promise<void> => {
    return api.delete<void>(`/spaces/${spaceId}`, true);
  },
};
