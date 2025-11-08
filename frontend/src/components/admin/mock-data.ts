import { Space, User, Reservation, Penalty, Rating, BookingHistory, UserPenalty, UserRating } from "./types"

// Mock Spaces
export const MOCK_SPACES: Space[] = [
  {
    id: "1",
    name: "Room A003",
    location: "Building A, Floor 3",
    capacity: 4,
    utilities: ["WiFi", "Whiteboard", "Projector"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop",
    status: "active",
    pricePerHour: 20
  },
  {
    id: "2",
    name: "Library Hub",
    location: "Main Library, Floor 2",
    capacity: 8,
    utilities: ["WiFi", "Air Conditioning", "Power Outlets"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&auto=format&fit=crop",
    status: "active",
    pricePerHour: 15
  },
  {
    id: "3",
    name: "Study Room B101",
    location: "Building B, Floor 1",
    capacity: 6,
    utilities: ["WiFi", "Whiteboard", "Air Conditioning"],
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&auto=format&fit=crop",
    status: "inactive",
    pricePerHour: 25
  }
]

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    studentId: "2021-12345",
    department: "Computer Science",
    phone: "+1 234-567-8900",
    joinedDate: "January 2022",
    totalBookings: 47,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
    status: "active",
    averageRating: 4.5
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.williams@university.edu",
    studentId: "2020-67890",
    department: "Engineering",
    phone: "+1 234-567-8901",
    joinedDate: "September 2021",
    totalBookings: 32,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
    status: "active",
    averageRating: 4.8
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@university.edu",
    studentId: "2022-11223",
    department: "Business",
    phone: "+1 234-567-8902",
    joinedDate: "March 2023",
    totalBookings: 15,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    status: "suspended",
    averageRating: 3.2
  }
]

// Mock Reservations
export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: "1",
    userId: "1",
    userName: "Alex Johnson",
    spaceId: "1",
    spaceName: "Room A003",
    date: "2025-11-10",
    time: "10:00 - 12:00",
    attendees: 4,
    purpose: "Team meeting for CS project discussion",
    status: "pending",
    requestDate: "2025-11-05",
    userRating: 4.5
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Williams",
    spaceId: "2",
    spaceName: "Library Hub",
    date: "2025-11-11",
    time: "14:00 - 16:00",
    attendees: 6,
    purpose: "Study group session for Engineering exam",
    status: "pending",
    requestDate: "2025-11-06",
    userRating: 4.8
  },
  {
    id: "3",
    userId: "3",
    userName: "Michael Chen",
    spaceId: "1",
    spaceName: "Room A003",
    date: "2025-11-12",
    time: "09:00 - 11:00",
    attendees: 3,
    purpose: "Business presentation preparation",
    status: "approved",
    requestDate: "2025-11-04",
    userRating: 3.2
  },
  {
    id: "4",
    userId: "1",
    userName: "Alex Johnson",
    spaceId: "2",
    spaceName: "Library Hub",
    date: "2025-10-15",
    time: "10:00 - 12:00",
    attendees: 4,
    purpose: "Research paper collaboration",
    status: "completed",
    requestDate: "2025-10-10",
    userRating: 4.5
  },
  {
    id: "5",
    userId: "2",
    userName: "Sarah Williams",
    spaceId: "1",
    spaceName: "Room A003",
    date: "2025-10-20",
    time: "14:00 - 16:00",
    attendees: 2,
    purpose: "Individual study session",
    status: "completed",
    requestDate: "2025-10-15",
    userRating: 4.8
  }
]

// Mock Penalties
export const MOCK_PENALTIES: Penalty[] = [
  {
    id: "1",
    userId: "3",
    userName: "Michael Chen",
    reservationId: "101",
    spaceName: "Room A003",
    reason: "No-show without cancellation",
    points: 10,
    date: "2025-10-15",
    status: "active"
  },
  {
    id: "2",
    userId: "1",
    userName: "Alex Johnson",
    reservationId: "102",
    spaceName: "Library Hub",
    reason: "Late cancellation (less than 2 hours)",
    points: 5,
    date: "2025-10-20",
    status: "resolved"
  },
  {
    id: "3",
    userId: "3",
    userName: "Michael Chen",
    reservationId: "103",
    spaceName: "Study Room B101",
    reason: "Left room in poor condition",
    points: 15,
    date: "2025-10-25",
    status: "active"
  }
]

// Mock Ratings
export const MOCK_RATINGS: Rating[] = [
  {
    id: "1",
    userId: "1",
    userName: "Alex Johnson",
    reservationId: "201",
    spaceName: "Room A003",
    rating: 5,
    comment: "Very professional and punctual. Left the room clean.",
    date: "2025-10-15",
    ratedBy: "Admin Staff"
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Williams",
    reservationId: "202",
    spaceName: "Library Hub",
    rating: 5,
    comment: "Excellent user, follows all rules.",
    date: "2025-10-20",
    ratedBy: "Admin Staff"
  },
  {
    id: "3",
    userId: "3",
    userName: "Michael Chen",
    reservationId: "203",
    spaceName: "Study Room B101",
    rating: 2,
    comment: "Did not follow room rules, left trash behind.",
    date: "2025-10-25",
    ratedBy: "Admin Staff"
  }
]

// Mock User Booking History (for user details view)
export const MOCK_USER_BOOKING_HISTORY: Record<string, BookingHistory[]> = {
  "1": [
    {
      id: "1",
      spaceName: "Room A003",
      date: "2025-10-15",
      time: "10:00 - 12:00",
      status: "completed"
    },
    {
      id: "2",
      spaceName: "Library Hub",
      date: "2025-10-20",
      time: "14:00 - 16:00",
      status: "completed"
    },
    {
      id: "3",
      spaceName: "Room A003",
      date: "2025-10-25",
      time: "09:00 - 11:00",
      status: "completed"
    }
  ],
  "2": [
    {
      id: "4",
      spaceName: "Library Hub",
      date: "2025-10-18",
      time: "13:00 - 15:00",
      status: "completed"
    },
    {
      id: "5",
      spaceName: "Room A003",
      date: "2025-10-22",
      time: "10:00 - 12:00",
      status: "completed"
    }
  ],
  "3": [
    {
      id: "6",
      spaceName: "Study Room B101",
      date: "2025-10-10",
      time: "14:00 - 16:00",
      status: "no-show"
    },
    {
      id: "7",
      spaceName: "Room A003",
      date: "2025-10-25",
      time: "09:00 - 11:00",
      status: "completed"
    }
  ]
}

// Mock User Penalties (for user details view)
export const MOCK_USER_PENALTIES: Record<string, UserPenalty[]> = {
  "1": [
    {
      id: "1",
      reason: "Late cancellation (less than 2 hours)",
      points: 5,
      date: "2025-10-20",
      status: "resolved"
    }
  ],
  "3": [
    {
      id: "2",
      reason: "No-show without cancellation",
      points: 10,
      date: "2025-10-15",
      status: "active"
    },
    {
      id: "3",
      reason: "Left room in poor condition",
      points: 15,
      date: "2025-10-25",
      status: "active"
    }
  ]
}

// Mock User Ratings (for user details view)
export const MOCK_USER_RATINGS: Record<string, UserRating[]> = {
  "1": [
    {
      id: "1",
      spaceName: "Room A003",
      rating: 5,
      comment: "Very professional and punctual. Left the room clean.",
      date: "2025-10-15",
      ratedBy: "Admin Staff"
    },
    {
      id: "2",
      spaceName: "Library Hub",
      rating: 4,
      comment: "Good user, minor delay in checkout.",
      date: "2025-10-20",
      ratedBy: "Admin Staff"
    }
  ],
  "2": [
    {
      id: "3",
      spaceName: "Library Hub",
      rating: 5,
      comment: "Excellent user, follows all rules.",
      date: "2025-10-18",
      ratedBy: "Admin Staff"
    },
    {
      id: "4",
      spaceName: "Room A003",
      rating: 5,
      comment: "Perfect behavior, highly recommended.",
      date: "2025-10-22",
      ratedBy: "Admin Staff"
    }
  ],
  "3": [
    {
      id: "5",
      spaceName: "Study Room B101",
      rating: 2,
      comment: "Did not follow room rules, left trash behind.",
      date: "2025-10-25",
      ratedBy: "Admin Staff"
    }
  ]
}