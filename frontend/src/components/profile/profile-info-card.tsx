"use client"

interface User {
  name: string
  email: string
  studentId: string
  department: string
  year: string
  phone: string
}

interface ProfileInfoCardProps {
  user: User
  isEditing: boolean
  onInputChange: (field: keyof User, value: string) => void
}

export function ProfileInfoCard({ user, isEditing, onInputChange }: ProfileInfoCardProps) {
  const fields = [
    { key: "name" as keyof User, label: "Full Name", icon: UserIcon },
    { key: "email" as keyof User, label: "Email Address", icon: EmailIcon },
    { key: "studentId" as keyof User, label: "Student ID", icon: IdIcon },
    { key: "department" as keyof User, label: "Department", icon: DepartmentIcon },
    { key: "year" as keyof User, label: "Year", icon: CalendarIcon },
    { key: "phone" as keyof User, label: "Phone Number", icon: PhoneIcon },
  ]

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3
        className="text-xl font-bold text-foreground mb-6"
        style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
      >
        Personal Information
      </h3>
      <div className="space-y-4">
        {fields.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {label}
            </label>
            {isEditing && key !== "studentId" && key !== "email" ? (
              <input
                type="text"
                value={user[key]}
                onChange={(e) => onInputChange(key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            ) : (
              <p className="text-foreground px-4 py-2.5 bg-muted/30 rounded-lg">
                {user[key]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Icons
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function IdIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  )
}

function DepartmentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}