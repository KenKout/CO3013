"use client"

import type { PenaltyResponse } from "@/schemas/api"

interface AdminPenaltiesListProps {
  penalties: PenaltyResponse[]
  onResolve: (id: number) => void
}

export function AdminPenaltiesList({ penalties, onResolve }: AdminPenaltiesListProps) {
  if (penalties.length === 0) {
    return (
      <div className="text-center py-10 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No penalties found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {penalties.map((penalty) => (
        <div
          key={penalty.id}
          className="bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-foreground">
                  Penalty #{penalty.id}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    penalty.status === "active"
                      ? "bg-red-600 text-white"
                      : penalty.status === "resolved"
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {penalty.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">
                  {penalty.points} points
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-2">
                  <span>👤 User ID: {penalty.user_id}</span>
                </div>
                {penalty.booking_id && (
                  <div className="flex items-center gap-2">
                    <span>📅 Booking ID: {penalty.booking_id}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>📅 {new Date(penalty.created_at).toLocaleDateString()}</span>
                </div>
                {penalty.created_by && (
                  <div className="flex items-center gap-2">
                    <span>Created by Admin ID: {penalty.created_by}</span>
                  </div>
                )}
              </div>

              <div className="text-sm">
                <span className="font-bold">Reason:</span>
                <span className="ml-2">{penalty.reason}</span>
              </div>
            </div>

            {penalty.status === "active" && (
              <button
                onClick={() => onResolve(penalty.id)}
                className="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-green-600 text-white border-2 border-green-600 hover:bg-green-700"
              >
                Resolve
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
