"use client"

import { useState } from "react"
import { Header } from "../landing/header"
import { SearchBar } from "./search-bar"
import { FilterSidebar } from "./filter-sidebar"
import { RoomCard, type Room } from "./room-card"
import { BookingModal, type BookingData } from "./booking-modal"
import { Footer } from "../landing/footer"
import { toast } from "sonner"

// Mock room data
const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    name: "Room A001",
    building: "Building A",
    floor: "1st Floor",
    capacity: 30,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: false, outlet: false },
  },
  {
    id: "2",
    name: "Room B001",
    building: "Building B",
    floor: "1st Floor",
    capacity: 20,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: false, whiteboard: true, outlet: false },
  },
  {
    id: "3",
    name: "Room B002",
    building: "Building B",
    floor: "1st Floor",
    capacity: 20,
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: true, outlet: false },
  },
  {
    id: "4",
    name: "Room C001",
    building: "Building C",
    floor: "1st Floor",
    capacity: 50,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: false, outlet: false },
  },
  {
    id: "5",
    name: "Room C201",
    building: "Building C",
    floor: "2nd Floor",
    capacity: 50,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: false, whiteboard: true, outlet: false },
  },
  {
    id: "6",
    name: "Room A202",
    building: "Building A",
    floor: "2nd Floor",
    capacity: 50,
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: false, outlet: true },
  },
  {
    id: "7",
    name: "Room B003",
    building: "Building B",
    floor: "1st Floor",
    capacity: 25,
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: false, outlet: false },
  },
  {
    id: "8",
    name: "Room C002",
    building: "Building C",
    floor: "1st Floor",
    capacity: 50,
    image: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: true, outlet: false },
  },
  {
    id: "9",
    name: "Room C202",
    building: "Building C",
    floor: "2nd Floor",
    capacity: 50,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: false, outlet: true },
  },
  {
    id: "10",
    name: "Room A101",
    building: "Building A",
    floor: "1st Floor",
    capacity: 30,
    image: "https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: false, outlet: false },
  },
  {
    id: "11",
    name: "Room A201",
    building: "Building A",
    floor: "2nd Floor",
    capacity: 50,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: false, whiteboard: true, outlet: false },
  },
  {
    id: "12",
    name: "Room C003",
    building: "Building C",
    floor: "1st Floor",
    capacity: 30,
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop",
    utilities: { wifi: true, ac: true, whiteboard: false, outlet: true },
  },
]

export function SpacesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [building, setBuilding] = useState("all")
  const [capacity, setCapacity] = useState("none")
  const [utility, setUtility] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Filter rooms based on search and filters
  const filteredRooms = MOCK_ROOMS.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.building.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesBuilding = building === "all" || 
                           room.building.toLowerCase().includes(building.toLowerCase())
    
    let matchesCapacity = true
    if (capacity === "1-10") matchesCapacity = room.capacity >= 1 && room.capacity <= 10
    else if (capacity === "11-30") matchesCapacity = room.capacity >= 11 && room.capacity <= 30
    else if (capacity === "31+") matchesCapacity = room.capacity >= 31

    const matchesUtility = !utility || 
                          Object.entries(room.utilities)
                            .some(([key, value]) => value && key.toLowerCase().includes(utility.toLowerCase()))

    return matchesSearch && matchesBuilding && matchesCapacity && matchesUtility
  })

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage)

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleConfirmBooking = (bookingData: BookingData) => {
    toast.success(
      `Successfully booked ${bookingData.room.name}!`,
      {
        description: `${bookingData.date} at ${bookingData.timeSlot} for ${bookingData.attendees} attendees`,
        duration: 5000,
      }
    )
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRooms.map((room) => (
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

            {/* No Results */}
            {filteredRooms.length === 0 && (
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