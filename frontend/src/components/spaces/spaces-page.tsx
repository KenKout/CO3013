"use client"

import { useState, useEffect } from "react"
import { Header } from "../landing/header"
import { SearchBar } from "./search-bar"
import { FilterSidebar } from "./filter-sidebar"
import { RoomCard, type Room } from "./room-card"
import { BookingModal } from "./booking-modal"
import { Footer } from "../landing/footer"
import { toast } from "sonner"
import { spacesApi } from "@/lib/spaces"
import type { SpaceListParams } from "@/schemas/api"
import { useRequireAuth } from "@/hooks/useRequireAuth"

export function SpacesPage() {
  // Require authentication to access this page
  const user = useRequireAuth()

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }
  const [searchQuery, setSearchQuery] = useState("")
  const [building, setBuilding] = useState("all")
  const [capacity, setCapacity] = useState("none")
  const [utility, setUtility] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 12

  // Fetch spaces from API
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoading(true)
        setError(null)

        const params: SpaceListParams = {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
        }

        // Add search query
        if (searchQuery) {
          params.q = searchQuery
        }

        // Add building filter
        if (building !== "all") {
          params.building = building
        }

        // Add capacity filters
        if (capacity === "1-10") {
          params.capacityMin = 1
          params.capacityMax = 10
        } else if (capacity === "11-30") {
          params.capacityMin = 11
          params.capacityMax = 30
        } else if (capacity === "31+") {
          params.capacityMin = 31
        }

        // Add utility filter
        if (utility) {
          params.utilities = utility
        }

        const response = await spacesApi.list(params)
        setRooms(response.data)
        setTotalCount(response.meta.total)
      } catch (err) {
        console.error("Error fetching spaces:", err)
        setError("Failed to load spaces. Please try again later.")
        toast.error("Failed to load spaces")
      } finally {
        setLoading(false)
      }
    }

    fetchSpaces()
  }, [searchQuery, building, capacity, utility, currentPage])

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleConfirmBooking = () => {
    // Booking was successful, refresh the spaces list
    setIsModalOpen(false)
    setSelectedRoom(null)
  }

  const handleSort = () => {
    toast.info("Sort functionality will be implemented soon!")
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
                Find Your Space
              </h1>
              <p className="text-lg md:text-xl font-light text-white/90 max-w-[600px] mx-auto mb-8">
                Browse and book the perfect study space for your needs.
              </p>
              
              {/* Search Bar in Hero */}
              <div className="max-w-[600px] mx-auto">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-[1100px] mx-auto px-5 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            building={building}
            capacity={capacity}
            utility={utility}
            onBuildingChange={setBuilding}
            onCapacityChange={setCapacity}
            onUtilityChange={setUtility}
            onSort={handleSort}
          />

          {/* Room Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">Loading spaces...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-20">
                <p className="text-xl text-red-500">{error}</p>
              </div>
            )}

            {/* Rooms Grid */}
            {!loading && !error && rooms.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onBook={handleBookRoom} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-10 gap-2">
                    <span className="text-foreground font-bold">Page</span>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                          currentPage === page
                            ? "bg-muted text-foreground"
                            : "text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="ml-4 px-6 py-2 rounded-lg bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && !error && rooms.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  No rooms found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Booking Modal */}
      <BookingModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedRoom(null)
        }}
        onConfirm={handleConfirmBooking}
      />
    </div>
  )
}