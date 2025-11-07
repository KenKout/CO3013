"use client"

import { useState } from "react"
import { Header } from "../landing/header"
import { Footer } from "../landing/footer"
import { BookingCard, type Booking, type BookingStatus } from "./booking-card"
import { QRDoorModal } from "./qr-door-modal"
import { toast } from "sonner"

// Mock booking data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    roomName: "Room A003",
    roomImage: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&auto=format&fit=crop",
    status: "approved",
    date: "Sat, Oct 11, 2025",
    time: "10:00 - 12:00",
    location: "Building A - 1st Floor",
    attendees: 8,
    utilities: ["Wifi", "Outlet"],
  },
  {
    id: "2",
    roomName: "Room B101",
    roomImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop",
    status: "waitlist",
    date: "Mon, Oct 13, 2025",
    time: "14:00 - 15:00",
    location: "Building B - 1st Floor",
    attendees: 4,
    utilities: ["Wifi"],
  },
  {
    id: "3",
    roomName: "Room C205",
    roomImage: "https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1974&auto=format&fit=crop",
    status: "dismissed",
    date: "Fri, Oct 10, 2025",
    time: "09:00 - 11:00",
    location: "Building C - 2nd Floor",
    attendees: 12,
    utilities: ["Wifi", "Whiteboard"],
  },
  {
    id: "4",
    roomName: "Library Hub",
    roomImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
    status: "approved",
    date: "Wed, Oct 22, 2025",
    time: "13:00 - 16:00",
    location: "Library - 3rd Floor",
    attendees: 6,
    utilities: ["Wifi", "Outlet", "Projector"],
  },
  {
    id: "5",
    roomName: "Room A102",
    roomImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
    status: "approved",
    date: "Thu, Oct 23, 2025",
    time: "09:00 - 11:00",
    location: "Building A - 1st Floor",
    attendees: 15,
    utilities: ["Wifi", "AC", "Whiteboard"],
  },
  {
    id: "6",
    roomName: "Room C101",
    roomImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
    status: "waitlist",
    date: "Fri, Oct 24, 2025",
    time: "14:00 - 16:00",
    location: "Building C - 1st Floor",
    attendees: 20,
    utilities: ["Wifi", "AC"],
  },
]

export function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<BookingStatus>("approved")
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => booking.status === activeFilter)

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id))
    toast.success("Booking deleted successfully")
  }

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
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
                My space!
              </h1>
              <p className="text-lg md:text-xl font-light text-white/90 max-w-[600px] mx-auto">
                Keep track of all the classrooms you&apos;ve booked in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-[900px] mx-auto px-5 py-10 flex-grow">
        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-muted p-2 rounded-xl flex gap-2 max-w-[400px] w-full">
            {(["approved", "waitlist", "dismissed"] as BookingStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`flex-1 py-3 px-5 text-base font-bold rounded-lg transition-all ${
                  activeFilter === status
                    ? "bg-foreground text-background shadow-md"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="grid gap-5">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onDelete={handleDeleteBooking}
                onClick={handleBookingClick}
              />
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No {activeFilter} bookings found.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* QR & Door Control Modal */}
      <QRDoorModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}