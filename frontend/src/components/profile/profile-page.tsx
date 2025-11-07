"use client"

import { useState } from "react"
import { Header } from "../landing/header"
import { Footer } from "../landing/footer"
import { ProfileHeader } from "./profile-header"
import { ProfileInfoCard } from "./profile-info-card"
import { BookingHistoryCard } from "./booking-history-card"
import { toast } from "sonner"

// Mock user data
const MOCK_USER = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  studentId: "2021-12345",
  department: "Computer Science",
  year: "3rd Year",
  phone: "+1 234-567-8900",
  joinedDate: "January 2022",
  totalBookings: 47,
  activeBookings: 3,
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
}

// Mock booking history
const MOCK_BOOKING_HISTORY = [
  {
    id: "1",
    roomName: "Room A003",
    date: "Sat, Oct 11, 2025",
    time: "10:00 - 12:00",
    status: "completed" as const,
  },
  {
    id: "2",
    roomName: "Library Hub",
    date: "Wed, Oct 22, 2025",
    time: "13:00 - 16:00",
    status: "upcoming" as const,
  },
  {
    id: "3",
    roomName: "Room B101",
    date: "Mon, Oct 13, 2025",
    time: "14:00 - 15:00",
    status: "cancelled" as const,
  },
  {
    id: "4",
    roomName: "Room A102",
    date: "Thu, Oct 23, 2025",
    time: "09:00 - 11:00",
    status: "upcoming" as const,
  },
  {
    id: "5",
    roomName: "Room C205",
    date: "Fri, Oct 10, 2025",
    time: "09:00 - 11:00",
    status: "completed" as const,
  },
]

export function ProfilePage() {
  const [user, setUser] = useState(MOCK_USER)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(MOCK_USER)

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUser(editedUser)
      toast.success("Profile updated successfully")
    }
    setIsEditing(!isEditing)
  }

  const handleCancelEdit = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof typeof MOCK_USER, value: string) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section with Header */}
      <div className="relative min-h-[400px] flex flex-col bg-background">
        {/* Background Image with Dark Overlay - Always dark for readability */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col">
          <Header />
          
          <div className="flex flex-col justify-center items-center text-center px-5 py-20">
            <div className="container max-w-[900px] mx-auto">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                My Profile
              </h1>
              <p className="text-lg md:text-xl font-light text-white/90 max-w-[600px] mx-auto">
                Manage your account information and view your booking history.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-[900px] mx-auto px-5 py-10 flex-grow">
        {/* Profile Header with Avatar */}
        <ProfileHeader
          user={isEditing ? editedUser : user}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onCancelEdit={handleCancelEdit}
        />

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <ProfileInfoCard
              user={isEditing ? editedUser : user}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </div>

          {/* Statistics Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3
                className="text-xl font-bold text-foreground mb-6"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Total Bookings</span>
                  <span className="text-2xl font-bold text-foreground">
                    {user.totalBookings}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Active Bookings</span>
                  <span className="text-2xl font-bold text-green-600">
                    {user.activeBookings}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-sm font-bold text-foreground">
                    {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking History */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
          >
            Booking History
          </h3>
          <div className="space-y-4">
            {MOCK_BOOKING_HISTORY.map((booking) => (
              <BookingHistoryCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}