"use client"

import { useState, useMemo } from "react"
import { AdminHeader } from "./admin-header"
import { Footer } from "../landing/footer"
import { SpaceList } from "./space-list"
import { SpaceFormModal } from "./space-form-modal"
import { UserList } from "./user-list"
import { UserDetailsModal } from "./user-details-modal"
import { ReservationList } from "./reservation-list"
import { PenaltiesList } from "./penalties-list"
import { RatingsList } from "./ratings-list"
import { AddPenaltyModal, AddRatingModal } from "./penalty-rating-modals"
import { Pagination } from "./pagination"
import { SearchBar } from "./search-bar"
import { toast } from "sonner"
import {
  MOCK_SPACES,
  MOCK_USERS,
  MOCK_RESERVATIONS,
  MOCK_PENALTIES,
  MOCK_RATINGS,
  MOCK_USER_BOOKING_HISTORY,
  MOCK_USER_PENALTIES,
  MOCK_USER_RATINGS
} from "./mock-data"
import { Space, User } from "./types"

type TabType = "spaces" | "users" | "reservations" | "penalties" | "ratings"

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("spaces")
  const [spaces, setSpaces] = useState(MOCK_SPACES)
  const [users, setUsers] = useState(MOCK_USERS)
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS)
  const [penalties, setPenalties] = useState(MOCK_PENALTIES)
  const [ratings, setRatings] = useState(MOCK_RATINGS)

  // Pagination and search states
  const [spacesPage, setSpacesPage] = useState(1)
  const [usersPage, setUsersPage] = useState(1)
  const [reservationsPage, setReservationsPage] = useState(1)
  const [penaltiesPage, setPenaltiesPage] = useState(1)
  const [ratingsPage, setRatingsPage] = useState(1)
  
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [spacesSearch, setSpacesSearch] = useState("")
  const [usersSearch, setUsersSearch] = useState("")
  const [reservationsSearch, setReservationsSearch] = useState("")
  const [penaltiesSearch, setPenaltiesSearch] = useState("")
  const [ratingsSearch, setRatingsSearch] = useState("")

  // Space modals
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)

  // User modals
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Penalty/Rating modals
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [targetUserId, setTargetUserId] = useState<string>("")

  // Space handlers
  const handleAddSpace = () => {
    setEditingSpace(null)
    setIsSpaceModalOpen(true)
  }

  const handleEditSpace = (space: Space) => {
    setEditingSpace(space)
    setIsSpaceModalOpen(true)
  }

  const handleSaveSpace = (spaceData: Partial<Space>) => {
    if (editingSpace) {
      setSpaces(spaces.map(s => s.id === editingSpace.id ? { ...s, ...spaceData } : s))
      toast.success("Space updated successfully")
    } else {
      const newSpace = {
        ...spaceData,
        id: Date.now().toString()
      } as Space
      setSpaces([...spaces, newSpace])
      toast.success("Space created successfully")
    }
  }

  const handleDeleteSpace = (id: string) => {
    setSpaces(spaces.filter(s => s.id !== id))
    toast.success("Space deleted successfully")
  }

  const handleToggleSpaceStatus = (id: string) => {
    setSpaces(spaces.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    ))
    toast.success("Space status updated")
  }

  // User handlers
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsUserDetailsOpen(true)
  }

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
    ))
    toast.success("User status updated")
  }

  // Reservation handlers
  const handleApproveReservation = (id: string) => {
    setReservations(reservations.map(r => 
      r.id === id ? { ...r, status: "approved" } : r
    ))
    toast.success("Reservation approved")
  }

  const handleRejectReservation = (id: string) => {
    setReservations(reservations.map(r =>
      r.id === id ? { ...r, status: "rejected" } : r
    ))
    toast.success("Reservation rejected")
  }

  const handleCompleteReservation = (id: string) => {
    setReservations(reservations.map(r =>
      r.id === id ? { ...r, status: "completed" } : r
    ))
    toast.success("Reservation marked as completed")
  }

  const handleAddRatingForReservation = (userId: string, reservationId: string) => {
    setTargetUserId(userId)
    setIsRatingModalOpen(true)
    
    // Update the rating modal to include reservation info
    const reservation = reservations.find(r => r.id === reservationId)
    if (reservation) {
      // We'll pass this info to the modal when we create the rating
      console.log("Adding rating for reservation:", reservationId, "User:", userId)
    }
  }

  const handleAddPenaltyForReservation = (userId: string, reservationId: string) => {
    setTargetUserId(userId)
    setIsPenaltyModalOpen(true)
    
    // Update the penalty modal to include reservation info
    const reservation = reservations.find(r => r.id === reservationId)
    if (reservation) {
      // We'll pass this info to the modal when we create the penalty
      console.log("Adding penalty for reservation:", reservationId, "User:", userId)
    }
  }

  // Penalty handlers
  const handleOpenAddPenalty = (userId: string) => {
    setTargetUserId(userId)
    setIsPenaltyModalOpen(true)
    setIsUserDetailsOpen(false)
  }

  const handleAddPenalty = (penaltyData: { reason: string; points: number }) => {
    const user = users.find(u => u.id === targetUserId)
    if (!user) return

    // Find the most recent reservation for this user to associate with the penalty
    const userReservations = reservations.filter(r => r.userId === targetUserId && r.status === "completed")
    const latestReservation = userReservations[userReservations.length - 1]

    const newPenalty = {
      id: Date.now().toString(),
      userId: targetUserId,
      userName: user.name,
      reservationId: latestReservation?.id || "N/A",
      spaceName: latestReservation?.spaceName || "N/A",
      reason: penaltyData.reason,
      points: penaltyData.points,
      date: new Date().toISOString().split('T')[0],
      status: "active" as const
    }
    setPenalties([...penalties, newPenalty])
    toast.success("Penalty added successfully")
  }

  const handleResolvePenalty = (id: string) => {
    setPenalties(penalties.map(p => 
      p.id === id ? { ...p, status: "resolved" } : p
    ))
    toast.success("Penalty resolved")
  }

  // Rating handlers
  const handleOpenAddRating = (userId: string) => {
    setTargetUserId(userId)
    setIsRatingModalOpen(true)
    setIsUserDetailsOpen(false)
  }

  const handleAddRating = (ratingData: { rating: number; comment: string }) => {
    const user = users.find(u => u.id === targetUserId)
    if (!user) return

    // Find the most recent reservation for this user to associate with the rating
    const userReservations = reservations.filter(r => r.userId === targetUserId && r.status === "completed")
    const latestReservation = userReservations[userReservations.length - 1]

    const newRating = {
      id: Date.now().toString(),
      userId: targetUserId,
      userName: user.name,
      reservationId: latestReservation?.id || "N/A",
      spaceName: latestReservation?.spaceName || "N/A",
      rating: ratingData.rating,
      comment: ratingData.comment,
      date: new Date().toISOString().split('T')[0],
      ratedBy: "Admin Staff"
    }
    setRatings([...ratings, newRating])
    toast.success("Rating added successfully")
  }

  // Enhanced reservations with user ratings
  const enhancedReservations = useMemo(() => {
    return reservations.map(reservation => {
      const user = users.find(u => u.id === reservation.userId)
      return {
        ...reservation,
        userRating: user?.averageRating
      }
    })
  }, [reservations, users])

  // Filtered and paginated data
  const filteredSpaces = useMemo(() => {
    return spaces.filter(space =>
      space.name.toLowerCase().includes(spacesSearch.toLowerCase()) ||
      space.location.toLowerCase().includes(spacesSearch.toLowerCase()) ||
      space.utilities.some(util => util.toLowerCase().includes(spacesSearch.toLowerCase()))
    )
  }, [spaces, spacesSearch])

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(usersSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(usersSearch.toLowerCase()) ||
      user.studentId.toLowerCase().includes(usersSearch.toLowerCase()) ||
      user.department.toLowerCase().includes(usersSearch.toLowerCase())
    )
  }, [users, usersSearch])

  const filteredReservations = useMemo(() => {
    return enhancedReservations.filter(reservation =>
      reservation.userName.toLowerCase().includes(reservationsSearch.toLowerCase()) ||
      reservation.spaceName.toLowerCase().includes(reservationsSearch.toLowerCase()) ||
      reservation.purpose.toLowerCase().includes(reservationsSearch.toLowerCase()) ||
      reservation.status.toLowerCase().includes(reservationsSearch.toLowerCase())
    )
  }, [enhancedReservations, reservationsSearch])

  const filteredPenalties = useMemo(() => {
    return penalties.filter(penalty =>
      penalty.userName.toLowerCase().includes(penaltiesSearch.toLowerCase()) ||
      penalty.reason.toLowerCase().includes(penaltiesSearch.toLowerCase()) ||
      penalty.spaceName.toLowerCase().includes(penaltiesSearch.toLowerCase()) ||
      penalty.status.toLowerCase().includes(penaltiesSearch.toLowerCase())
    )
  }, [penalties, penaltiesSearch])

  const filteredRatings = useMemo(() => {
    return ratings.filter(rating =>
      rating.userName.toLowerCase().includes(ratingsSearch.toLowerCase()) ||
      rating.comment.toLowerCase().includes(ratingsSearch.toLowerCase()) ||
      rating.spaceName.toLowerCase().includes(ratingsSearch.toLowerCase()) ||
      rating.ratedBy.toLowerCase().includes(ratingsSearch.toLowerCase())
    )
  }, [ratings, ratingsSearch])

  // Paginated data
  const paginatedSpaces = useMemo(() => {
    const startIndex = (spacesPage - 1) * itemsPerPage
    return filteredSpaces.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredSpaces, spacesPage, itemsPerPage])

  const paginatedUsers = useMemo(() => {
    const startIndex = (usersPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, usersPage, itemsPerPage])

  const paginatedReservations = useMemo(() => {
    const startIndex = (reservationsPage - 1) * itemsPerPage
    return filteredReservations.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredReservations, reservationsPage, itemsPerPage])

  const paginatedPenalties = useMemo(() => {
    const startIndex = (penaltiesPage - 1) * itemsPerPage
    return filteredPenalties.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPenalties, penaltiesPage, itemsPerPage])

  const paginatedRatings = useMemo(() => {
    const startIndex = (ratingsPage - 1) * itemsPerPage
    return filteredRatings.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredRatings, ratingsPage, itemsPerPage])

  // Reset page when search changes
  const handleSpacesSearch = (query: string) => {
    setSpacesSearch(query)
    setSpacesPage(1)
  }

  const handleUsersSearch = (query: string) => {
    setUsersSearch(query)
    setUsersPage(1)
  }

  const handleReservationsSearch = (query: string) => {
    setReservationsSearch(query)
    setReservationsPage(1)
  }

  const handlePenaltiesSearch = (query: string) => {
    setPenaltiesSearch(query)
    setPenaltiesPage(1)
  }

  const handleRatingsSearch = (query: string) => {
    setRatingsSearch(query)
    setRatingsPage(1)
  }

  const tabs = [
    { id: "spaces" as TabType, label: "Spaces", icon: "🏢" },
    { id: "users" as TabType, label: "Users", icon: "👥" },
    { id: "reservations" as TabType, label: "Reservations", icon: "📅" },
    { id: "penalties" as TabType, label: "Penalties", icon: "⚠️" },
    { id: "ratings" as TabType, label: "Ratings", icon: "⭐" }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section with Header */}
      <div className="relative min-h-[300px] flex flex-col bg-background">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2071&auto=format&fit=crop')`,
          }}
        />
        
        <div className="relative z-10 flex flex-col">
          <AdminHeader />
          
          <div className="flex flex-col justify-center items-center text-center px-5 py-12">
            <div className="container max-w-[1400px] mx-auto">
              <h1
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                Admin Dashboard
              </h1>
              <p className="text-lg md:text-xl font-light text-white/90 max-w-[600px] mx-auto">
                Manage spaces, users, reservations, penalties, and ratings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-[1400px] mx-auto px-5 py-10 flex-grow">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-card rounded-xl p-2 border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-transparent text-foreground hover:bg-muted"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mb-6">
          {/* Spaces Tab */}
          {activeTab === "spaces" && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
                >
                  Manage Spaces
                </h2>
                <button
                  onClick={handleAddSpace}
                  className="px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
                >
                  + Add Space
                </button>
              </div>
              <div className="mb-6">
                <SearchBar
                  onSearch={handleSpacesSearch}
                  placeholder="Search spaces by name, location, or utilities..."
                />
              </div>
              <SpaceList
                spaces={paginatedSpaces}
                onEdit={handleEditSpace}
                onDelete={handleDeleteSpace}
                onToggleStatus={handleToggleSpaceStatus}
              />
              <Pagination
                currentPage={spacesPage}
                totalPages={Math.ceil(filteredSpaces.length / itemsPerPage)}
                onPageChange={setSpacesPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              <h2
                className="text-2xl font-bold text-foreground mb-6"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                Manage Users
              </h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={handleUsersSearch}
                  placeholder="Search users by name, email, student ID, or department..."
                />
              </div>
              <UserList
                users={paginatedUsers}
                onViewDetails={handleViewUserDetails}
                onToggleStatus={handleToggleUserStatus}
              />
              <Pagination
                currentPage={usersPage}
                totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                onPageChange={setUsersPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <>
              <h2
                className="text-2xl font-bold text-foreground mb-6"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                Manage Reservations
              </h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={handleReservationsSearch}
                  placeholder="Search reservations by user, space, purpose, or status..."
                />
              </div>
              <ReservationList
                reservations={paginatedReservations}
                onApprove={handleApproveReservation}
                onReject={handleRejectReservation}
                onComplete={handleCompleteReservation}
                onAddRating={handleAddRatingForReservation}
                onAddPenalty={handleAddPenaltyForReservation}
              />
              <Pagination
                currentPage={reservationsPage}
                totalPages={Math.ceil(filteredReservations.length / itemsPerPage)}
                onPageChange={setReservationsPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          )}

          {/* Penalties Tab */}
          {activeTab === "penalties" && (
            <>
              <h2
                className="text-2xl font-bold text-foreground mb-6"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                System Penalties
              </h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={handlePenaltiesSearch}
                  placeholder="Search penalties by user, reason, space, or status..."
                />
              </div>
              <PenaltiesList
                penalties={paginatedPenalties}
                onResolve={handleResolvePenalty}
              />
              <Pagination
                currentPage={penaltiesPage}
                totalPages={Math.ceil(filteredPenalties.length / itemsPerPage)}
                onPageChange={setPenaltiesPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          )}

          {/* Ratings Tab */}
          {activeTab === "ratings" && (
            <>
              <h2
                className="text-2xl font-bold text-foreground mb-6"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                System Ratings
              </h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={handleRatingsSearch}
                  placeholder="Search ratings by user, comment, space, or rated by..."
                />
              </div>
              <RatingsList ratings={paginatedRatings} />
              <Pagination
                currentPage={ratingsPage}
                totalPages={Math.ceil(filteredRatings.length / itemsPerPage)}
                onPageChange={setRatingsPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SpaceFormModal
        isOpen={isSpaceModalOpen}
        onClose={() => setIsSpaceModalOpen(false)}
        onSave={handleSaveSpace}
        space={editingSpace}
      />

      <UserDetailsModal
        isOpen={isUserDetailsOpen}
        onClose={() => setIsUserDetailsOpen(false)}
        user={selectedUser}
        bookingHistory={selectedUser ? MOCK_USER_BOOKING_HISTORY[selectedUser.id] || [] : []}
        penalties={selectedUser ? MOCK_USER_PENALTIES[selectedUser.id] || [] : []}
        ratings={selectedUser ? MOCK_USER_RATINGS[selectedUser.id] || [] : []}
        onAddPenalty={handleOpenAddPenalty}
        onAddRating={handleOpenAddRating}
      />

      <AddPenaltyModal
        isOpen={isPenaltyModalOpen}
        onClose={() => {
          setIsPenaltyModalOpen(false)
          if (selectedUser) setIsUserDetailsOpen(true)
        }}
        onSave={handleAddPenalty}
        userName={users.find(u => u.id === targetUserId)?.name || ""}
      />

      <AddRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false)
          if (selectedUser) setIsUserDetailsOpen(true)
        }}
        onSave={handleAddRating}
        userName={users.find(u => u.id === targetUserId)?.name || ""}
      />
    </div>
  )
}