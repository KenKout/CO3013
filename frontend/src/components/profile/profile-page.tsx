"use client"

import { useState } from "react"
import { Header } from "../landing/header"
import { Footer } from "../landing/footer"
import { ProfileHeader } from "./profile-header"
import { ProfileInfoCard } from "./profile-info-card"
import { toast } from "sonner"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useAuth } from "@/hooks/useAuth"
import type { UpdateProfileRequest } from "@/schemas/api"

// Convert user fields for editing
interface EditableUser {
  id: number
  name: string
  email: string
  studentId: string
  department: string
  year: string
  phone: string
  joinedDate: string
  profileImage: string
}

export function ProfilePage() {
  const apiUser = useRequireAuth()
  const { updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedFields, setEditedFields] = useState<Partial<EditableUser>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!apiUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Convert API user to display format
  const user: EditableUser = {
    id: apiUser.id,
    name: apiUser.full_name,
    email: apiUser.email,
    studentId: apiUser.student_id || "",
    department: apiUser.department || "",
    year: apiUser.year_of_study ? `${apiUser.year_of_study}${apiUser.year_of_study === 1 ? "st" : apiUser.year_of_study === 2 ? "nd" : apiUser.year_of_study === 3 ? "rd" : "th"} Year` : "",
    phone: apiUser.phone || "",
    joinedDate: new Date(apiUser.joined_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    profileImage: apiUser.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
  }

  const displayUser = isEditing ? { ...user, ...editedFields } : user

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      setIsSubmitting(true)
      try {
        const updateData: UpdateProfileRequest = {}

        if (editedFields.name) updateData.full_name = editedFields.name
        if (editedFields.department) updateData.department = editedFields.department
        if (editedFields.phone) updateData.phone = editedFields.phone
        if (editedFields.profileImage) updateData.profile_image_url = editedFields.profileImage
        if (editedFields.year) {
          const yearMatch = editedFields.year.match(/^(\d+)/)
          if (yearMatch) {
            updateData.year_of_study = parseInt(yearMatch[1])
          }
        }

        await updateProfile(updateData)
        setEditedFields({})
        toast.success("Profile updated successfully")
        setIsEditing(false)
      } catch (error) {
        console.error("Failed to update profile:", error)
        toast.error("Failed to update profile")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setEditedFields({})
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof EditableUser, value: string) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }))
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
                My Profile
              </h1>
              <p className="text-lg md:text-xl font-light text-white/90 max-w-[600px] mx-auto">
                Manage your account information and view your booking history.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-[900px] mx-auto px-5 py-10 flex-grow">
        {/* Profile Header with Avatar */}
        <ProfileHeader
          user={displayUser}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onEditToggle={handleEditToggle}
          onCancelEdit={handleCancelEdit}
        />

        {/* Profile Information */}
        <ProfileInfoCard
          user={displayUser}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}