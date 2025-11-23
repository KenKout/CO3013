"use client"

import type { BookingResponse } from "@/schemas/api"

interface AdminReservationListProps {
  reservations: BookingResponse[]
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onComplete: (id: number) => void
  onAddRating: (userId: number, reservationId: number) => void
  onAddPenalty: (userId: number, reservationId: number) => void
}

export function AdminReservationList({
  reservations,
  onApprove,
  onReject,
  onComplete,
  onAddRating,
  onAddPenalty
}: AdminReservationListProps) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-10 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No reservations found</p>
      </div>
    )
  }

  const statusStyles = {
    pending: "bg-blue-600 text-white",
    approved: "bg-green-600 text-white",
    rejected: "bg-red-600 text-white",
    cancelled: "bg-gray-600 text-white",
    completed: "bg-purple-600 text-white",
    no_show: "bg-orange-600 text-white"
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-foreground">
                  {reservation.space?.name || `Space #${reservation.space_id}`}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[reservation.status]}`}>
                  {reservation.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>👤 {reservation.user?.full_name || `User #${reservation.user_id}`}</span>
                </div>
                {reservation.user?.average_rating && (
                  <div className="flex items-center gap-2">
                    <span>⭐ {reservation.user.average_rating.toFixed(1)} rating</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>📅 {reservation.booking_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐 {reservation.start_time} - {reservation.end_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥 {reservation.attendees} people</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Requested: {new Date(reservation.requested_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-start gap-2 md:col-span-2">
                  <span className="font-bold">Purpose:</span>
                  <span>{reservation.purpose}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex md:flex-col gap-2">
              {reservation.status === "pending" && (
                <>
                  <button
                    onClick={() => onApprove(reservation.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-green-600 text-white border-2 border-green-600 hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(reservation.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-red-600 text-white border-2 border-red-600 hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
              {reservation.status === "approved" && (
                <button
                  onClick={() => onComplete(reservation.id)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-purple-600 text-white border-2 border-purple-600 hover:bg-purple-700"
                >
                  Mark Complete
                </button>
              )}
              {reservation.status === "completed" && (
                <>
                  <button
                    onClick={() => onAddRating(reservation.user_id, reservation.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-700"
                  >
                    Add Rating
                  </button>
                  <button
                    onClick={() => onAddPenalty(reservation.user_id, reservation.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-orange-600 text-white border-2 border-orange-600 hover:bg-orange-700"
                  >
                    Add Penalty
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
