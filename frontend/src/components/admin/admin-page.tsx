"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "../landing/header"
import { Footer } from "../landing/footer"
import { SearchBar } from "./search-bar"
import { Pagination } from "./pagination"
import { AdminSpaceList } from "./admin-space-list"
import { AdminUserList } from "./admin-user-list"
import { AdminReservationList } from "./admin-reservation-list"
import { AdminPenaltiesList } from "./admin-penalties-list"
import { AdminRatingsList } from "./admin-ratings-list"
import { AdminUtilitiesList } from "./admin-utilities-list"
import { SpaceFormModal } from "./space-form-modal"
import { UserDetailsModal } from "./user-details-modal"
import { AddPenaltyModal, AddRatingModal } from "./penalty-rating-modals"
import { UtilityFormModal } from "./utility-form-modal"
import { toast } from "sonner"
import { useRequireAdmin } from "@/hooks/useRequireAdmin"
import { adminApi } from "@/lib/admin"
import { spacesApi } from "@/lib/spaces"
import { bookingsApi } from "@/lib/bookings"
import { penaltiesApi } from "@/lib/penalties"
import { ratingsApi } from "@/lib/ratings"
import { utilitiesApi } from "@/lib/utilities"
import {
  type UserSummaryResponse,
  type SpaceResponse,
  type BookingResponse,
  type PenaltyResponse,
  type RatingResponse,
  type UtilityResponse,
  type UserStatus,
  type SpaceStatus,
  BookingStatus,
  PenaltyStatus,
  type CreateSpaceRequest,
  type UpdateSpaceRequest,
  type CreateUtilityRequest,
  type UpdateUtilityRequest,
  type AdminUserSummaryResponse,
} from "@/schemas/api"

type TabType = "spaces" | "users" | "reservations" | "penalties" | "ratings" | "utilities"

export function AdminPage() {
  const admin = useRequireAdmin()
  const [activeTab, setActiveTab] = useState<TabType>("spaces")

  // Data states
  const [spaces, setSpaces] = useState<SpaceResponse[]>([])
  const [users, setUsers] = useState<UserSummaryResponse[]>([])
  const [reservations, setReservations] = useState<BookingResponse[]>([])
  const [penalties, setPenalties] = useState<PenaltyResponse[]>([])
  const [ratings, setRatings] = useState<RatingResponse[]>([])
  const [utilities, setUtilities] = useState<UtilityResponse[]>([]) // For space form
  const [utilitiesList, setUtilitiesList] = useState<UtilityResponse[]>([]) // For utilities tab

  // Pagination states
  const [spacesPage, setSpacesPage] = useState(0)
  const [usersPage, setUsersPage] = useState(0)
  const [reservationsPage, setReservationsPage] = useState(0)
  const [penaltiesPage, setPenaltiesPage] = useState(0)
  const [ratingsPage, setRatingsPage] = useState(0)
  const [utilitiesPage, setUtilitiesPage] = useState(0)

  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Total counts for pagination
  const [spacesTotal, setSpacesTotal] = useState(0)
  const [usersTotal, setUsersTotal] = useState(0)
  const [reservationsTotal, setReservationsTotal] = useState(0)
  const [penaltiesTotal, setPenaltiesTotal] = useState(0)
  const [ratingsTotal, setRatingsTotal] = useState(0)
  const [utilitiesTotal, setUtilitiesTotal] = useState(0)

  // Search states
  const [spacesSearch, setSpacesSearch] = useState("")
  const [usersSearch, setUsersSearch] = useState("")
  const [reservationsSearch, setReservationsSearch] = useState("")
  const [penaltiesSearch, setPenaltiesSearch] = useState("")
  const [ratingsSearch, setRatingsSearch] = useState("")
  const [utilitiesSearch, setUtilitiesSearch] = useState("")

  // Filter states
  const [spacesStatusFilter, setSpacesStatusFilter] = useState<SpaceStatus | "all">("all")

  // Loading states
  const [loading, setLoading] = useState(false)

  // Modals
  const [selectedUser, setSelectedUser] = useState<AdminUserSummaryResponse | null>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false)
  const [editingSpace, setEditingSpace] = useState<SpaceResponse | null>(null)
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [targetUserId, setTargetUserId] = useState<number>(0)
  const [isUtilityModalOpen, setIsUtilityModalOpen] = useState(false)
  const [editingUtility, setEditingUtility] = useState<UtilityResponse | null>(null)

  // Fetch utilities for space form (on mount)
  useEffect(() => {
    const fetchUtilitiesForSpaces = async () => {
      try {
        const data = await utilitiesApi.list()
        setUtilities(data)
      } catch (error) {
        console.error("Failed to fetch utilities:", error)
      }
    }
    fetchUtilitiesForSpaces()
  }, [])

  // Fetch utilities for utilities tab
  const fetchUtilitiesData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await utilitiesApi.list()
      // Filter by search
      const filtered = data.filter(u =>
        !utilitiesSearch ||
        u.label.toLowerCase().includes(utilitiesSearch.toLowerCase()) ||
        u.key.toLowerCase().includes(utilitiesSearch.toLowerCase()) ||
        u.description?.toLowerCase().includes(utilitiesSearch.toLowerCase())
      )

      // Paginate
      const start = utilitiesPage * itemsPerPage
      const end = start + itemsPerPage
      setUtilitiesList(filtered.slice(start, end))
      setUtilitiesTotal(filtered.length)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch utilities")
    } finally {
      setLoading(false)
    }
  }, [utilitiesPage, itemsPerPage, utilitiesSearch])

  // Fetch spaces
  const fetchSpaces = useCallback(async () => {
    setLoading(true)
    try {
      const data = await spacesApi.list({
        limit: itemsPerPage,
        offset: spacesPage * itemsPerPage,
        q: spacesSearch || undefined,
        status: spacesStatusFilter === "all" ? undefined : spacesStatusFilter,
      })
      setSpaces(data.data)
      setSpacesTotal(data.meta.total)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch spaces")
    } finally {
      setLoading(false)
    }
  }, [spacesPage, itemsPerPage, spacesSearch, spacesStatusFilter])

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminApi.listUsers({
        limit: itemsPerPage,
        offset: usersPage * itemsPerPage,
        q: usersSearch || undefined,
      })
      setUsers(data.data)
      setUsersTotal(data.meta.total)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }, [usersPage, itemsPerPage, usersSearch])

  // Fetch reservations (bookings)
  const fetchReservations = useCallback(async () => {
    setLoading(true)
    try {
      const data = await bookingsApi.list({
        limit: itemsPerPage,
        offset: reservationsPage * itemsPerPage,
        my: false, // Admin should see all bookings
      })
      setReservations(data.data)
      setReservationsTotal(data.meta.total)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch reservations")
    } finally {
      setLoading(false)
    }
  }, [reservationsPage, itemsPerPage])

  // Fetch penalties
  const fetchPenalties = useCallback(async () => {
    setLoading(true)
    try {
      const data = await penaltiesApi.list({
        limit: itemsPerPage,
        offset: penaltiesPage * itemsPerPage,
        q: penaltiesSearch || undefined,
      })
      setPenalties(data.data)
      setPenaltiesTotal(data.meta.total)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch penalties")
    } finally {
      setLoading(false)
    }
  }, [penaltiesPage, itemsPerPage, penaltiesSearch])

  // Fetch ratings
  const fetchRatings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await ratingsApi.list({
        limit: itemsPerPage,
        offset: ratingsPage * itemsPerPage,
        q: ratingsSearch || undefined,
      })
      setRatings(data.data)
      setRatingsTotal(data.meta.total)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch ratings")
    } finally {
      setLoading(false)
    }
  }, [ratingsPage, itemsPerPage, ratingsSearch])

  // Fetch data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case "spaces":
        fetchSpaces()
        break
      case "users":
        fetchUsers()
        break
      case "reservations":
        fetchReservations()
        break
      case "penalties":
        fetchPenalties()
        break
      case "ratings":
        fetchRatings()
        break
      case "utilities":
        fetchUtilitiesData()
        break
    }
  }, [activeTab, fetchSpaces, fetchUsers, fetchReservations, fetchPenalties, fetchRatings, fetchUtilitiesData])

  // Space handlers
  const handleAddSpace = () => {
    setEditingSpace(null)
    setIsSpaceModalOpen(true)
  }

  const handleEditSpace = (space: SpaceResponse) => {
    setEditingSpace(space)
    setIsSpaceModalOpen(true)
  }

  const handleSaveSpace = async (spaceData: CreateSpaceRequest | UpdateSpaceRequest) => {
    try {
      if (editingSpace) {
        await spacesApi.update(editingSpace.id, spaceData as UpdateSpaceRequest)
        toast.success("Space updated successfully")
      } else {
        await spacesApi.create(spaceData as CreateSpaceRequest)
        toast.success("Space created successfully")
      }
      setIsSpaceModalOpen(false)
      fetchSpaces()
    } catch (error: any) {
      toast.error(error.message || "Failed to save space")
    }
  }

  const handleDeleteSpace = async (id: number) => {
    if (!confirm("Are you sure you want to delete this space?")) return

    try {
      await spacesApi.delete(id)
      toast.success("Space deleted successfully")
      fetchSpaces()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete space")
    }
  }

  const handleToggleSpaceStatus = async (id: number, currentStatus: SpaceStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      await spacesApi.update(id, { status: newStatus as SpaceStatus })
      toast.success("Space status updated")
      fetchSpaces()
    } catch (error: any) {
      toast.error(error.message || "Failed to update space status")
    }
  }

  // User handlers
  const handleViewUserDetails = async (user: UserSummaryResponse) => {
    try {
      const summary = await adminApi.getUserSummary(user.id)
      setSelectedUser(summary)
      setIsUserDetailsOpen(true)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch user details")
    }
  }

  const handleToggleUserStatus = async (id: number, currentStatus: UserStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active"
      await adminApi.updateUser(id, { status: newStatus as UserStatus })
      toast.success("User status updated")
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status")
    }
  }

  // Reservation handlers
  const handleApproveReservation = async (id: number) => {
    try {
      await bookingsApi.updateStatus(id, { status: BookingStatus.APPROVED })
      toast.success("Reservation approved")
      fetchReservations()
    } catch (error: any) {
      toast.error(error.message || "Failed to approve reservation")
    }
  }

  const handleRejectReservation = async (id: number) => {
    try {
      await bookingsApi.updateStatus(id, { status: BookingStatus.REJECTED })
      toast.success("Reservation rejected")
      fetchReservations()
    } catch (error: any) {
      toast.error(error.message || "Failed to reject reservation")
    }
  }

  const handleCompleteReservation = async (id: number) => {
    try {
      await bookingsApi.updateStatus(id, { status: BookingStatus.COMPLETED })
      toast.success("Reservation marked as completed")
      fetchReservations()
    } catch (error: any) {
      toast.error(error.message || "Failed to complete reservation")
    }
  }

  const handleAddRatingForReservation = (userId: number, reservationId: number) => {
    setTargetUserId(userId)
    setIsRatingModalOpen(true)
  }

  const handleAddPenaltyForReservation = (userId: number, reservationId: number) => {
    setTargetUserId(userId)
    setIsPenaltyModalOpen(true)
  }

  // Penalty handlers
  const handleOpenAddPenalty = (userId: number) => {
    setTargetUserId(userId)
    setIsPenaltyModalOpen(true)
    setIsUserDetailsOpen(false)
  }

  const handleAddPenalty = async (penaltyData: { reason: string; points: number; bookingId?: number }) => {
    try {
      await penaltiesApi.create({
        user_id: targetUserId,
        booking_id: penaltyData.bookingId || null,
        reason: penaltyData.reason,
        points: penaltyData.points,
      })
      toast.success("Penalty added successfully")
      setIsPenaltyModalOpen(false)
      if (activeTab === "penalties") {
        fetchPenalties()
      }
      if (selectedUser) {
        const updated = await adminApi.getUserSummary(targetUserId)
        setSelectedUser(updated)
        setIsUserDetailsOpen(true)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add penalty")
    }
  }

  const handleResolvePenalty = async (id: number) => {
    try {
      await penaltiesApi.update(id, { status: PenaltyStatus.RESOLVED })
      toast.success("Penalty resolved")
      fetchPenalties()
    } catch (error: any) {
      toast.error(error.message || "Failed to resolve penalty")
    }
  }

  // Rating handlers
  const handleOpenAddRating = (userId: number) => {
    setTargetUserId(userId)
    setIsRatingModalOpen(true)
    setIsUserDetailsOpen(false)
  }

  const handleAddRating = async (ratingData: { rating: number; comment: string; bookingId?: number }) => {
    try {
      await ratingsApi.create({
        rated_user_id: targetUserId,
        booking_id: ratingData.bookingId || null,
        rating: ratingData.rating,
        comment: ratingData.comment || null,
      })
      toast.success("Rating added successfully")
      setIsRatingModalOpen(false)
      if (activeTab === "ratings") {
        fetchRatings()
      }
      if (selectedUser) {
        const updated = await adminApi.getUserSummary(targetUserId)
        setSelectedUser(updated)
        setIsUserDetailsOpen(true)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add rating")
    }
  }

  // Utility handlers
  const handleAddUtility = () => {
    setEditingUtility(null)
    setIsUtilityModalOpen(true)
  }

  const handleEditUtility = (utility: UtilityResponse) => {
    setEditingUtility(utility)
    setIsUtilityModalOpen(true)
  }

  const handleSaveUtility = async (utilityData: CreateUtilityRequest | UpdateUtilityRequest) => {
    try {
      if (editingUtility) {
        await utilitiesApi.update(editingUtility.id, utilityData as UpdateUtilityRequest)
        toast.success("Utility updated successfully")
      } else {
        await utilitiesApi.create(utilityData as CreateUtilityRequest)
        toast.success("Utility created successfully")
      }
      setIsUtilityModalOpen(false)
      fetchUtilitiesData()
      // Also refresh utilities list for space form
      const data = await utilitiesApi.list()
      setUtilities(data)
    } catch (error: any) {
      toast.error(error.message || "Failed to save utility")
    }
  }

  const handleDeleteUtility = async (id: number) => {
    if (!confirm("Are you sure you want to delete this utility? Spaces using this utility will still reference it.")) return

    try {
      await utilitiesApi.delete(id)
      toast.success("Utility deleted successfully")
      fetchUtilitiesData()
      // Also refresh utilities list for space form
      const data = await utilitiesApi.list()
      setUtilities(data)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete utility")
    }
  }

  const tabs = [
    { id: "spaces" as TabType, label: "Spaces", icon: "🏢" },
    { id: "users" as TabType, label: "Users", icon: "👥" },
    { id: "reservations" as TabType, label: "Reservations", icon: "📅" },
    { id: "penalties" as TabType, label: "Penalties", icon: "⚠️" },
    { id: "ratings" as TabType, label: "Ratings", icon: "⭐" },
    { id: "utilities" as TabType, label: "Utilities", icon: "🔧" }
  ]

  // Protect the page - show loading while checking auth
  if (!admin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section with Header */}
      <div className="relative min-h-[400px] flex flex-col bg-background">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')`,
          }}
        />

        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="flex flex-col justify-center items-center text-center px-5 py-20">
            <div className="container max-w-[1400px] mx-auto">
              <h1
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
                style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
              >
                Admin Dashboard
              </h1>
              <p className="text-lg md:text-xl font-light text-white/90 max-w-[600px] mx-auto">
                Manage spaces, users, reservations, penalties, ratings, and utilities
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
                <h2 className="text-2xl font-bold">Manage Spaces</h2>
                <button
                  onClick={handleAddSpace}
                  className="px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
                >
                  + Add Space
                </button>
              </div>
              <div className="mb-6">
                <SearchBar
                  onSearch={(query) => {
                    setSpacesSearch(query)
                    setSpacesPage(0)
                  }}
                  placeholder="Search spaces by name or building..."
                />
              </div>
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground">Filter by Status:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSpacesStatusFilter("all")
                        setSpacesPage(0)
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                        spacesStatusFilter === "all"
                          ? "bg-foreground text-background border-2 border-foreground"
                          : "bg-transparent text-foreground border-2 border-border hover:bg-muted"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setSpacesStatusFilter("active" as SpaceStatus)
                        setSpacesPage(0)
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                        spacesStatusFilter === "active"
                          ? "bg-green-600 text-white border-2 border-green-600"
                          : "bg-transparent text-green-600 border-2 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        setSpacesStatusFilter("inactive" as SpaceStatus)
                        setSpacesPage(0)
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                        spacesStatusFilter === "inactive"
                          ? "bg-red-600 text-white border-2 border-red-600"
                          : "bg-transparent text-red-600 border-2 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      }`}
                    >
                      Inactive
                    </button>
                    <button
                      onClick={() => {
                        setSpacesStatusFilter("maintenance" as SpaceStatus)
                        setSpacesPage(0)
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                        spacesStatusFilter === "maintenance"
                          ? "bg-yellow-600 text-white border-2 border-yellow-600"
                          : "bg-transparent text-yellow-600 border-2 border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                      }`}
                    >
                      Maintenance
                    </button>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <>
                  <AdminSpaceList
                    spaces={spaces}
                    onEdit={handleEditSpace}
                    onDelete={handleDeleteSpace}
                    onToggleStatus={handleToggleSpaceStatus}
                  />
                  <Pagination
                    currentPage={spacesPage + 1}
                    totalPages={Math.ceil(spacesTotal / itemsPerPage)}
                    onPageChange={(page) => setSpacesPage(page - 1)}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </>
              )}
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={(query) => {
                    setUsersSearch(query)
                    setUsersPage(0)
                  }}
                  placeholder="Search users by name, email, or student ID..."
                />
              </div>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <>
                  <AdminUserList
                    users={users}
                    onViewDetails={handleViewUserDetails}
                    onToggleStatus={handleToggleUserStatus}
                  />
                  <Pagination
                    currentPage={usersPage + 1}
                    totalPages={Math.ceil(usersTotal / itemsPerPage)}
                    onPageChange={(page) => setUsersPage(page - 1)}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </>
              )}
            </>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Manage Reservations</h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={(query) => {
                    setReservationsSearch(query)
                    setReservationsPage(0)
                  }}
                  placeholder="Search reservations..."
                />
              </div>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <>
                  <AdminReservationList
                    reservations={reservations}
                    onApprove={handleApproveReservation}
                    onReject={handleRejectReservation}
                    onComplete={handleCompleteReservation}
                    onAddRating={handleAddRatingForReservation}
                    onAddPenalty={handleAddPenaltyForReservation}
                  />
                  <Pagination
                    currentPage={reservationsPage + 1}
                    totalPages={Math.ceil(reservationsTotal / itemsPerPage)}
                    onPageChange={(page) => setReservationsPage(page - 1)}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </>
              )}
            </>
          )}

          {/* Penalties Tab */}
          {activeTab === "penalties" && (
            <>
              <h2 className="text-2xl font-bold mb-6">System Penalties</h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={(query) => {
                    setPenaltiesSearch(query)
                    setPenaltiesPage(0)
                  }}
                  placeholder="Search penalties by reason..."
                />
              </div>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <>
                  <AdminPenaltiesList
                    penalties={penalties}
                    onResolve={handleResolvePenalty}
                  />
                  <Pagination
                    currentPage={penaltiesPage + 1}
                    totalPages={Math.ceil(penaltiesTotal / itemsPerPage)}
                    onPageChange={(page) => setPenaltiesPage(page - 1)}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </>
              )}
            </>
          )}

          {/* Ratings Tab */}
          {activeTab === "ratings" && (
            <>
              <h2 className="text-2xl font-bold mb-6">System Ratings</h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={(query) => {
                    setRatingsSearch(query)
                    setRatingsPage(0)
                  }}
                  placeholder="Search ratings by comment..."
                />
              </div>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <>
                  <AdminRatingsList ratings={ratings} />
                  <Pagination
                    currentPage={ratingsPage + 1}
                    totalPages={Math.ceil(ratingsTotal / itemsPerPage)}
                    onPageChange={(page) => setRatingsPage(page - 1)}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </>
              )}
            </>
          )}

          {/* Utilities Tab */}
          {activeTab === "utilities" && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Manage Utilities</h2>
                <button
                  onClick={handleAddUtility}
                  className="px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
                >
                  + Add Utility
                </button>
              </div>
              <div className="mb-6">
                <SearchBar
                  onSearch={(query) => {
                    setUtilitiesSearch(query)
                    setUtilitiesPage(0)
                  }}
                  placeholder="Search utilities by key, label, or description..."
                />
              </div>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <>
                  <AdminUtilitiesList
                    utilities={utilitiesList}
                    onEdit={handleEditUtility}
                    onDelete={handleDeleteUtility}
                  />
                  <Pagination
                    currentPage={utilitiesPage + 1}
                    totalPages={Math.ceil(utilitiesTotal / itemsPerPage)}
                    onPageChange={(page) => setUtilitiesPage(page - 1)}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {isSpaceModalOpen && (
        <SpaceFormModal
          isOpen={isSpaceModalOpen}
          onClose={() => setIsSpaceModalOpen(false)}
          onSave={handleSaveSpace}
          space={editingSpace}
          utilities={utilities}
        />
      )}

      {isUserDetailsOpen && selectedUser && (
        <UserDetailsModal
          isOpen={isUserDetailsOpen}
          onClose={() => setIsUserDetailsOpen(false)}
          user={selectedUser}
          onAddPenalty={handleOpenAddPenalty}
          onAddRating={handleOpenAddRating}
        />
      )}

      {isPenaltyModalOpen && (
        <AddPenaltyModal
          isOpen={isPenaltyModalOpen}
          onClose={() => setIsPenaltyModalOpen(false)}
          onSave={handleAddPenalty}
        />
      )}

      {isRatingModalOpen && (
        <AddRatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSave={handleAddRating}
        />
      )}

      {isUtilityModalOpen && (
        <UtilityFormModal
          isOpen={isUtilityModalOpen}
          onClose={() => setIsUtilityModalOpen(false)}
          onSave={handleSaveUtility}
          utility={editingUtility}
        />
      )}
    </div>
  )
}
