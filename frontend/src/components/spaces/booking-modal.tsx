
"use client"

import { useState } from "react"
import Image from "next/image"
import type { Room } from "./room-card"

interface BookingModalProps {
  room: Room | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (bookingData: BookingData) => void
}

export interface BookingData {
  room: Room
  date: string
  timeSlot: string
  attendees: number
  purpose: string
}

export function BookingModal({ room, isOpen, onClose, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<number>(16)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [attendees, setAttendees] = useState<string>("")
  const [purpose, setPurpose] = useState<string>("")

  if (!isOpen || !room) return null

  const timeSlots = [
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
  ]

  const handleConfirm = () => {
    if (!selectedTimeSlot || !attendees || !purpose) {
      return
    }

    onConfirm({
      room,
      date: `2024-10-${selectedDate}`,
      timeSlot: selectedTimeSlot,
      attendees: parseInt(attendees),
      purpose,
    })

    // Reset form
    setSelectedTimeSlot("")
    setAttendees("")
    setPurpose("")
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-muted rounded-2xl overflow-hidden w-full max-w-[800px] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-white text-4xl leading-none opacity-70 hover:opacity-100 transition-opacity z-10"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Header with Background Image */}
        <header className="relative text-white p-8">
          <div className="absolute inset-0 z-0">
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40" />
          </div>

          <div className="relative z-10">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
            >
              {room.name}
            </h1>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {room.building} - {room.floor}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Capacity: {room.capacity}
              </span>
            </div>

            <div className="border-t border-white/30 pt-4">
              <h4 className="text-xs uppercase tracking-wider mb-3 text-white/80 font-bold">
                Available Utilities
              </h4>
              <div className="flex flex-wrap gap-4">
                {room.utilities.wifi && (
                  <span className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                    WiFi
                  </span>
                )}
                {room.utilities.ac && (
                  <span className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    Air Conditioner
                  </span>
                )}
                {room.utilities.whiteboard && (
                  <span className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Whiteboard
                  </span>
                )}
                {room.utilities.outlet && (
                  <span className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Power Outlet
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-background overflow-y-auto">
          {/* Calendar Section */}
          <div>
            <h3 className="text-xl mb-4 text-foreground font-bold">
              Select day <span className="text-red-500">*</span>
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <svg className="w-5 h-5 cursor-pointer text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-bold text-foreground">October</span>
                <svg className="w-5 h-5 cursor-pointer text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                  <div key={day} className="text-muted-foreground font-bold">
                    {day}
                  </div>
                ))}
                {[29, 30].map((day) => (
                  <div key={`prev-${day}`} className="text-muted-foreground/50 p-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 rounded-full transition-colors font-bold ${
                      day === selectedDate
                        ? "bg-foreground text-background"
                        : day === 16
                        ? "bg-muted-foreground/20 text-foreground"
                        : "text-foreground hover:bg-muted-foreground/10"
                    }`}
                  >
                    {day}
                  </button>
                ))}
                {[1, 2].map((day) => (
                  <div key={`next-${day}`} className="text-muted-foreground/50 p-2">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <h3 className="text-xl mb-4 text-foreground font-bold">
              Select time slot <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`px-3 py-2.5 text-sm rounded-lg border transition-all font-bold ${
                    selectedTimeSlot === slot
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {slot}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="attendees" className="block mb-2 font-bold text-foreground">
                  Number of Attendees <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="attendees"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="Enter number of people..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>

              <div>
                <label htmlFor="purpose" className="block mb-2 font-bold text-foreground">
                  Purpose/Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  placeholder="e.g., Team meeting, Workshop, Class session..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="p-8 border-t border-border bg-background flex justify-center">
          <div className="flex flex-col items-center w-[250px]">
            <button
              onClick={handleConfirm}
              disabled={!selectedTimeSlot || !attendees || !purpose}
              className="w-full py-4 rounded-2xl bg-foreground text-background font-bold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Booking
            </button>
            <button
              onClick={onClose}
              className="mt-5 bg-none border-none p-0 text-muted-foreground font-bold transition-colors hover:text-foreground hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}