"use client"

import { User } from "./types"
import Image from "next/image"

interface UserListProps {
  users: User[]
  onViewDetails: (user: User) => void
  onToggleStatus: (id: string) => void
}

export function UserList({ users, onViewDetails, onToggleStatus }: UserListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Avatar */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-border">
              <Image
                src={user.profileImage}
                alt={user.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            {/* Content */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {user.name}
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
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span>{user.studentId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{user.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{user.totalBookings} bookings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>{user.averageRating.toFixed(1)} rating</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => onViewDetails(user)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onToggleStatus(user.id)}
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