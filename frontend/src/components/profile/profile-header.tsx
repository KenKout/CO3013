"use client"

import Image from "next/image"

interface User {
  name: string
  email: string
  studentId: string
  department: string
  profileImage: string
  joinedDate: string
}

interface ProfileHeaderProps {
  user: User
  isEditing: boolean
  isSubmitting?: boolean
  onEditToggle: () => void
  onCancelEdit: () => void
}

export function ProfileHeader({ user, isEditing, isSubmitting = false, onEditToggle, onCancelEdit }: ProfileHeaderProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
      {/* Profile Image */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-border">
        <Image
          src={user.profileImage}
          alt={user.name}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>

      {/* User Info */}
      <div className="flex-grow text-center md:text-left">
        <h2
          className="text-3xl font-bold text-foreground mb-2"
          style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
        >
          {user.name}
        </h2>
        <p className="text-muted-foreground mb-1">{user.email}</p>
        <p className="text-sm text-muted-foreground">
          {user.studentId} • {user.department}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Member Since: {user.joinedDate}
        </p>
      </div>

      {/* Edit Button */}
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-muted text-foreground border-2 border-border hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onEditToggle}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <button
            onClick={onEditToggle}
            className="px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}