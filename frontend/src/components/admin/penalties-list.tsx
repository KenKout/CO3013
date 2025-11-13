"use client"

import { Penalty } from "./types"

interface PenaltiesListProps {
  penalties: Penalty[]
  onResolve: (id: string) => void
}

export function PenaltiesList({ penalties, onResolve }: PenaltiesListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {penalties.map((penalty) => (
        <div
          key={penalty.id}
          className="bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-lg border-l-4 border-l-red-600"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Left Section */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-foreground">
                  {penalty.userName}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    penalty.status === "active"
                      ? "bg-red-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {penalty.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">
                  {penalty.points} points
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="text-foreground">
                  <span className="font-bold">Reason: </span>
                  {penalty.reason}
                </div>
                <div className="text-muted-foreground">
                  <span className="font-bold">Space: </span>
                  {penalty.spaceName}
                </div>
                <div className="text-muted-foreground">
                  <span className="font-bold">Date: </span>
                  {penalty.date}
                </div>
                <div className="text-muted-foreground">
                  <span className="font-bold">Reservation ID: </span>
                  {penalty.reservationId}
                </div>
              </div>
            </div>

            {/* Action Button */}
            {penalty.status === "active" && (
              <div className="flex md:flex-col gap-2">
                <button
                  onClick={() => onResolve(penalty.id)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-green-600 text-white border-2 border-green-600 hover:bg-green-700"
                >
                  Mark as Resolved
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}