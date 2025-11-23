// Penalties API Service
import { api } from './api';
import type {
  PenaltyResponse,
  CreatePenaltyRequest,
  UpdatePenaltyRequest,
  PenaltyListParams,
  PaginatedResponse,
} from '@/schemas/api';

// ============================================================================
// Penalties API
// ============================================================================

export const penaltiesApi = {
  /**
   * List penalties (admin only)
   * Requires authentication
   */
  list: async (params?: PenaltyListParams): Promise<PaginatedResponse<PenaltyResponse>> => {
    return api.get<PaginatedResponse<PenaltyResponse>>('/penalties', params, true);
  },

  /**
   * Create a new penalty (admin only)
   * Requires authentication
   */
  create: async (data: CreatePenaltyRequest): Promise<PenaltyResponse> => {
    return api.post<PenaltyResponse>('/penalties', data, true);
  },

  /**
   * Update penalty status (admin only)
   * Requires authentication
   */
  update: async (penaltyId: number, data: UpdatePenaltyRequest): Promise<PenaltyResponse> => {
    return api.patch<PenaltyResponse>(`/penalties/${penaltyId}`, data, true);
  },
};
