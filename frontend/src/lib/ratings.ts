// Ratings API Service
import { api } from './api';
import type {
  RatingResponse,
  CreateRatingRequest,
  RatingListParams,
  PaginatedResponse,
} from '@/schemas/api';

// ============================================================================
// Ratings API
// ============================================================================

export const ratingsApi = {
  /**
   * List ratings (admin only)
   * Requires authentication
   */
  list: async (params?: RatingListParams): Promise<PaginatedResponse<RatingResponse>> => {
    return api.get<PaginatedResponse<RatingResponse>>('/ratings', params, true);
  },

  /**
   * Create a new rating (admin only)
   * Requires authentication
   */
  create: async (data: CreateRatingRequest): Promise<RatingResponse> => {
    return api.post<RatingResponse>('/ratings', data, true);
  },

  /**
   * Delete a rating (admin only)
   * Requires authentication
   */
  delete: async (ratingId: number): Promise<void> => {
    return api.delete<void>(`/ratings/${ratingId}`, true);
  },
};
