// Admin panel types
export interface Space {
  id: string
  name: string
  location: string
  capacity: number
  utilities: string[]
  image: string
  status: "active" | "inactive"
  pricePerHour: number
}

export interface User {
  id: string
  name: string
  email: string
  studentId: string
  department: string
  phone: string
  joinedDate: string
  totalBookings: number
  profileImage: string
  status: "active" | "suspended"
  averageRating: number
}

export interface Reservation {
  id: string
  userId: string
  userName: string
  spaceId: string
  spaceName: string
  date: string
  time: string
  attendees: number
  purpose: string
  status: "pending" | "approved" | "rejected" | "completed"
  requestDate: string
  userRating?: number
}

export interface Penalty {
  id: string
  userId: string
  userName: string
  reservationId: string
  spaceName: string
  reason: string
  points: number
  date: string
  status: "active" | "resolved"
}

export interface Rating {
  id: string
  userId: string
  userName: string
  reservationId: string
  spaceName: string
  rating: number
  comment: string
  date: string
  ratedBy: string
}

export interface BookingHistory {
  id: string
  spaceName: string
  date: string
  time: string
  status: "completed" | "cancelled" | "no-show"
}

export interface UserPenalty {
  id: string
  reason: string
  points: number
  date: string
  status: "active" | "resolved"
}

export interface UserRating {
  id: string
  spaceName: string
  rating: number
  comment: string
  date: string
  ratedBy: string
}