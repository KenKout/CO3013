// Bookings API Service
import { api } from './api';
import type {
  BookingResponse,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  BookingListParams,
  PaginatedResponse,
} from '@/schemas/api';

// ============================================================================
// Bookings API
// ============================================================================

export const bookingsApi = {
  /**
   * List bookings with optional filters and pagination
   * Requires authentication
   */
  list: async (params?: BookingListParams): Promise<PaginatedResponse<BookingResponse>> => {
    return api.get<PaginatedResponse<BookingResponse>>('/bookings', params, true);
  },

  /**
   * Get a single booking by ID
   * Requires authentication
   */
  getById: async (bookingId: number): Promise<BookingResponse> => {
    return api.get<BookingResponse>(`/bookings/${bookingId}`, undefined, true);
  },

  /**
   * Create a new booking request
   * Requires authentication
   */
  create: async (data: CreateBookingRequest): Promise<BookingResponse> => {
    return api.post<BookingResponse>('/bookings', data, true);
  },

  /**
   * Update booking status (approve/reject/cancel)
   * Requires authentication
   */
  updateStatus: async (
    bookingId: number,
    data: UpdateBookingStatusRequest
  ): Promise<BookingResponse> => {
    return api.patch<BookingResponse>(`/bookings/${bookingId}`, data, true);
  },

  /**
   * Delete a booking (admin only)
   * Requires authentication
   */
  delete: async (bookingId: number): Promise<void> => {
    return api.delete<void>(`/bookings/${bookingId}`, true);
  },

  /**
   * Check in to a booking
   * Requires authentication
   */
  checkIn: async (bookingId: number): Promise<BookingResponse> => {
    return api.post<BookingResponse>(`/bookings/${bookingId}/check-in`, undefined, true);
  },

  /**
   * Check out from a booking
   * Requires authentication
   */
  checkOut: async (bookingId: number): Promise<BookingResponse> => {
    return api.post<BookingResponse>(`/bookings/${bookingId}/check-out`, undefined, true);
  },

  // openDoor: async (bookingId: number): Promise<void> => {
  //   return api.post<void>(`/bookings/${bookingId}/open-door`, undefined, true);
  // }
};
