"use client"

interface BookingHistory {
  id: string
  roomName: string
  date: string
  time: string
  status: "completed" | "upcoming" | "cancelled"
}

interface BookingHistoryCardProps {
  booking: BookingHistory
}

export function BookingHistoryCard({ booking }: BookingHistoryCardProps) {
  const statusStyles = {
    completed: "bg-green-600 text-white",
    upcoming: "bg-blue-600 text-white",
    cancelled: "bg-red-600 text-white",
  }

  const statusLabels = {
    completed: "Completed",
    upcoming: "Upcoming",
    cancelled: "Cancelled",
  }

  const statusIcons = {
    completed: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    upcoming: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    cancelled: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
      {/* Left Section - Room Info */}
      <div className="flex-grow mb-3 md:mb-0">
        <h4 className="text-lg font-bold text-foreground mb-1">
          {booking.roomName}
        </h4>
        <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{booking.time}</span>
          </div>
        </div>
      </div>

      {/* Right Section - Status Badge */}
      <div className="flex items-center justify-start md:justify-end">
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${statusStyles[booking.status]}`}
        >
          {statusIcons[booking.status]}
          {statusLabels[booking.status]}
        </span>
      </div>
    </div>
  )
}