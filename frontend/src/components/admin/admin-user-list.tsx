"use client"

import type { UserSummaryResponse, UserStatus } from "@/schemas/api"
import Image from "next/image"

interface AdminUserListProps {
  users: UserSummaryResponse[]
  onViewDetails: (user: UserSummaryResponse) => void
  onToggleStatus: (id: number, currentStatus: UserStatus) => void
}

export function AdminUserList({ users, onViewDetails, onToggleStatus }: AdminUserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-10 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Avatar */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-border bg-muted">
              {user.profile_image_url ? (
                <Image
                  src={user.profile_image_url}
                  alt={user.full_name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-2xl">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {user.full_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === "active"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <span>📧 {user.email}</span>
                    </div>
                    {user.student_id && (
                      <div className="flex items-center gap-2">
                        <span>🎓 {user.student_id}</span>
                      </div>
                    )}
                    {user.department && (
                      <div className="flex items-center gap-2">
                        <span>🏛️ {user.department}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>📅 {user.total_bookings} bookings</span>
                    </div>
                    {user.average_rating && (
                      <div className="flex items-center gap-2">
                        <span>⭐ {user.average_rating.toFixed(1)} rating</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => onViewDetails(user)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onToggleStatus(user.id, user.status)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                      user.status === "active"
                        ? "bg-red-600 text-white border-2 border-red-600 hover:bg-red-700"
                        : "bg-green-600 text-white border-2 border-green-600 hover:bg-green-700"
                    }`}
                  >
                    {user.status === "active" ? "Suspend" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
