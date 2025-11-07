"use client"

import { useState } from "react"
import Image from "next/image"
import type { Booking } from "./booking-card"

interface QRDoorModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

export function QRDoorModal({ booking, isOpen, onClose }: QRDoorModalProps) {
  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false)

  if (!isOpen || !booking) return null

  // Generate QR code URL with booking data
  const qrData = `BookingID: ${booking.id}\nRoom: ${booking.roomName}\nDate: ${booking.date}\nTime: ${booking.time}`
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`

  const handleDoorToggle = () => {
    setIsDoorUnlocked(!isDoorUnlocked)
    console.log(`Simulating command: The door is now ${!isDoorUnlocked ? 'UNLOCKED' : 'LOCKED'}.`)
  }

  const handleClose = () => {
    setIsDoorUnlocked(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-white text-black rounded-2xl p-8 w-full max-w-[400px] text-center animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <h2
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
        >
          {booking.roomName}
        </h2>
        <p className="text-gray-600 mb-6 text-base">
          {booking.date} @ {booking.time}
        </p>

        {/* QR Code */}
        <div className="mb-6">
          <Image
            src={qrApiUrl}
            alt="QR Code for Check-in"
            width={250}
            height={250}
            className="w-full max-w-[250px] h-auto mx-auto rounded-lg bg-gray-100"
          />
        </div>

        {/* Door Control Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          {/* Door Status */}
          <div
            className={`flex items-center justify-center gap-2.5 mb-5 text-lg font-bold py-2.5 px-4 rounded-lg ${
              isDoorUnlocked
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50"
            }`}
          >
            {isDoorUnlocked ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Status: Unlocked</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Status: Locked</span>
              </>
            )}
          </div>

          {/* Door Control Button */}
          <button
            onClick={handleDoorToggle}
            className={`w-full py-4 px-6 text-lg font-bold rounded-lg mb-6 transition-colors ${
              isDoorUnlocked
                ? "bg-amber-500 text-black hover:bg-amber-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isDoorUnlocked ? "Lock Door" : "Unlock Door"}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="bg-transparent border-none p-0 text-gray-500 font-bold hover:text-black hover:underline cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  )
}