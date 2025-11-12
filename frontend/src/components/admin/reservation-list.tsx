"use client"

import { Reservation } from "./types"

interface ReservationListProps {
  reservations: Reservation[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onComplete: (id: string) => void
  onAddRating: (userId: string, reservationId: string) => void
  onAddPenalty: (userId: string, reservationId: string) => void
}

export function ReservationList({ reservations, onApprove, onReject, onComplete, onAddRating, onAddPenalty }: ReservationListProps) {
  const statusStyles = {
    pending: "bg-blue-600 text-white",
    approved: "bg-green-600 text-white",
    rejected: "bg-red-600 text-white",
    completed: "bg-purple-600 text-white"
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
                  {reservation.spaceName}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[reservation.status]}`}>
                  {reservation.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{reservation.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-bold text-foreground">{reservation.userRating?.toFixed(1) || "N/A"}</span>
                  <span className="text-xs">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{reservation.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{reservation.attendees} people</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">Requested: {reservation.requestDate}</span>
                </div>
                <div className="flex items-start gap-2 md:col-span-2">
                  <svg className="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <span className="font-bold">Purpose: </span>
                    <span>{reservation.purpose}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {reservation.status === "pending" && (
              <div className="flex md:flex-col gap-2">
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
              </div>
            )}
            {reservation.status === "approved" && (
              <div className="flex md:flex-col gap-2">
                <button
                  onClick={() => onComplete(reservation.id)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-purple-600 text-white border-2 border-purple-600 hover:bg-purple-700"
                >
                  Mark Complete
                </button>
              </div>
            )}
            {reservation.status === "completed" && (
              <div className="flex md:flex-col gap-2">
                <button
                  onClick={() => onAddRating(reservation.userId, reservation.id)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-yellow-600 text-white border-2 border-yellow-600 hover:bg-yellow-700"
                >
                  Rate User
                </button>
                <button
                  onClick={() => onAddPenalty(reservation.userId, reservation.id)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-red-600 text-white border-2 border-red-600 hover:bg-red-700"
                >
                  Add Penalty
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}