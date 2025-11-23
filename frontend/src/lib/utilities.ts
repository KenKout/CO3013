// Utilities API Service
import { api } from './api';
import type {
  UtilityResponse,
  CreateUtilityRequest,
  UpdateUtilityRequest,
} from '@/schemas/api';

// ============================================================================
// Utilities API
// ============================================================================

export const utilitiesApi = {
  /**
   * List all utilities
   */
  list: async (): Promise<UtilityResponse[]> => {
    return api.get<UtilityResponse[]>('/utilities', undefined, false);
  },

  /**
   * Create a new utility (admin only)
   * Requires authentication
   */
  create: async (data: CreateUtilityRequest): Promise<UtilityResponse> => {
    return api.post<UtilityResponse>('/utilities', data, true);
  },

  /**
   * Update a utility (admin only)
   * Requires authentication
   */
  update: async (utilityId: number, data: UpdateUtilityRequest): Promise<UtilityResponse> => {
    return api.patch<UtilityResponse>(`/utilities/${utilityId}`, data, true);
  },

  /**
   * Delete a utility (admin only)
   * Requires authentication
   */
  delete: async (utilityId: number): Promise<void> => {
    return api.delete<void>(`/utilities/${utilityId}`, true);
  },
};
