"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Booking } from "./booking-card"
import { api } from "@/lib/api"

interface QRDoorModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

export function QRDoorModal({ booking, isOpen, onClose }: QRDoorModalProps) {
  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Ref to store the timer ID so we can clear it if the modal closes
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timer when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!isOpen || !booking) return null

  let qrData
  if (!booking.iot_session_id) {
    qrData = `BookingID: ${booking.id}\nRoom: ${booking.roomName}\nDate: ${booking.date}\nTime: ${booking.time}`
  } else {
    qrData = `${booking.iot_session_id}`
  }

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`

  const handleUnlockDoor = async () => {
    // If already unlocked or loading, do nothing
    if (isDoorUnlocked || isLoading) return

    setIsLoading(true)

    await(async () => {
      await api.post(`/bookings/${booking.id}/open-door`, undefined, true)
    })()

    setIsLoading(false)
    setIsDoorUnlocked(true)
    console.log("Door UNLOCKED. Waiting for auto-lock...")

    // 2. Set Timer to Auto-Lock after 5 seconds
    if (timerRef.current) clearTimeout(timerRef.current)
    
    timerRef.current = setTimeout(() => {
      setIsDoorUnlocked(false)
      console.log("Door AUTO-LOCKED.")
    }, 3000) // 5 seconds duration
  }

  const handleClose = () => {
    // Reset state when closing modal
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsDoorUnlocked(false)
    setIsLoading(false)
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
          style={{ fontFamily: "var(--font-heading, Orbitron, sans-serif)" }}
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
          {/* Door Status Indicator */}
          <div
            className={`flex items-center justify-center gap-2.5 mb-5 text-lg font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 ${
              isDoorUnlocked
                ? "text-green-600 bg-green-50 border border-green-100"
                : "text-red-600 bg-red-50 border border-red-100"
            }`}
          >
            {isDoorUnlocked ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Unlocked</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Locked</span>
              </>
            )}
          </div>

          {/* Door Control Button */}
          <button
            onClick={handleUnlockDoor}
            disabled={isDoorUnlocked || isLoading}
            className={`w-full py-4 px-6 text-lg font-bold rounded-lg mb-6 transition-all duration-200 flex items-center justify-center gap-2 ${
              isDoorUnlocked
                ? "bg-green-600 text-white cursor-default opacity-90" // Unlocked State
                : isLoading 
                  ? "bg-gray-400 text-white cursor-wait" // Loading State
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]" // Locked State
            }`}
          >
            {isLoading ? (
               <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Processing...
               </>
            ) : isDoorUnlocked ? (
              "Door is Open"
            ) : (
              "Tap to Unlock"
            )}
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