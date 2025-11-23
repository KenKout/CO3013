"use client"

import type { AdminUserSummaryResponse } from "@/schemas/api"
import Image from "next/image"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: AdminUserSummaryResponse | null
  onAddPenalty: (userId: number) => void
  onAddRating: (userId: number) => void
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onAddPenalty,
  onAddRating
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null

  const { user: userInfo, booking_history, penalties, ratings } = user

  const statusStyles: Record<string, string> = {
    completed: "bg-green-600 text-white",
    cancelled: "bg-red-600 text-white",
    no_show: "bg-orange-600 text-white"
  }

  // Calculate total bookings from user data
  const totalBookings = booking_history.length
  
  // Calculate average rating from ratings
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-card rounded-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
            >
              User Details
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-border bg-muted">
              {userInfo.profile_image_url ? (
                <Image
                  src={userInfo.profile_image_url}
                  alt={userInfo.full_name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-3xl">
                  {userInfo.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-foreground">{userInfo.full_name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    userInfo.status === "active" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {userInfo.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>{userInfo.email}</div>
                {userInfo.student_id && <div>{userInfo.student_id}</div>}
                {userInfo.department && <div>{userInfo.department}</div>}
                {userInfo.phone && <div>{userInfo.phone}</div>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{totalBookings}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                {averageRating.toFixed(1)}
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {penalties.filter(p => p.status === "active").reduce((sum, p) => sum + p.points, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Penalty Points</div>
            </div>
          </div>

          {/* Booking History */}
          <div className="mb-6">
            <h3
              className="text-lg font-bold text-foreground mb-4"
              style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
            >
              Booking History
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {booking_history.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No booking history</div>
              ) : (
                booking_history.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div>
                      <div className="font-bold text-foreground">{booking.space_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.date} • {booking.time}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[booking.status] || "bg-gray-600 text-white"}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Penalties */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                Penalties
              </h3>
              <button
                onClick={() => onAddPenalty(userInfo.id)}
                className="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-red-600 text-white border-2 border-red-600 hover:bg-red-700"
              >
                Add Penalty
              </button>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {penalties.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No penalties</div>
              ) : (
                penalties.map((penalty) => (
                  <div
                    key={penalty.id}
                    className="p-3 rounded-lg bg-muted/30 border-l-4 border-red-600"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-bold text-foreground">{penalty.reason}</div>
                      <span className="text-red-600 font-bold">{penalty.points} pts</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <span>{new Date(penalty.created_at).toLocaleDateString()}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          penalty.status === "active" ? "bg-red-600 text-white" : "bg-green-600 text-white"
                        }`}
                      >
                        {penalty.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ratings */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                Rating History
              </h3>
              <button
                onClick={() => onAddRating(userInfo.id)}
                className="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
              >
                Add Rating
              </button>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {ratings.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No ratings yet</div>
              ) : (
                ratings.map((rating) => (
                  <div key={rating.id} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {rating.created_by && `Created by Admin ID: ${rating.created_by}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating.rating ? "fill-current" : "fill-none stroke-current"}`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground">{rating.comment}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">{new Date(rating.created_at).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-bold transition-all duration-300 bg-muted text-foreground border-2 border-border hover:bg-muted/80"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}