"use client"

import Image from "next/image"

export interface Room {
  id: string
  name: string
  building: string
  floor: string
  capacity: number
  image: string
  utilities: {
    wifi: boolean
    ac: boolean
    whiteboard: boolean
    outlet: boolean
  }
}

interface RoomCardProps {
  room: Room
  onBook: (room: Room) => void
}

export function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border transition-all duration-200 ease-in-out hover:-translate-y-1.5 hover:shadow-2xl flex flex-col">
      {/* Room Image */}
      <div className="relative w-full h-[180px]">
        <Image
          src={room.image}
          alt={room.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Room Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-xl font-bold text-foreground mb-1">
          {room.name}
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          {room.building} - {room.floor}
        </p>

        {/* Capacity and Utilities */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
          <span className="flex items-center gap-2 text-foreground">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {room.capacity} seats
          </span>
          <div className="flex items-center gap-2">
            {room.utilities.wifi && (
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="WiFi">
                <title>WiFi</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            )}
            {room.utilities.ac && (
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Air Conditioner">
                <title>Air Conditioner</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            )}
            {room.utilities.whiteboard && (
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Whiteboard">
                <title>Whiteboard</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {room.utilities.outlet && (
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Power Outlet">
                <title>Power Outlet</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={() => onBook(room)}
          className="w-full py-3 mt-4 rounded-lg bg-foreground text-background font-bold transition-opacity hover:opacity-90"
        >
          Book this room
        </button>
      </div>
    </div>
  )
}