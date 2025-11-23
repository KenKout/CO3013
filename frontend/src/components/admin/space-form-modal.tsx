"use client"

import { useState, useEffect } from "react"
import { SpaceStatus } from "@/schemas/api"
import type { SpaceResponse, CreateSpaceRequest, UpdateSpaceRequest, UtilityResponse } from "@/schemas/api"

interface SpaceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (space: CreateSpaceRequest | UpdateSpaceRequest) => void
  space?: SpaceResponse | null
  utilities: UtilityResponse[]
}

export function SpaceFormModal({ isOpen, onClose, onSave, space, utilities }: SpaceFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    building: "",
    floor: "",
    location: "",
    capacity: "",
    image_url: "",
    status: SpaceStatus.ACTIVE as SpaceStatus,
    selectedUtilities: [] as string[]
  })

  useEffect(() => {
    if (space) {
      setFormData({
        name: space.name,
        building: space.building,
        floor: space.floor,
        location: space.location || "",
        capacity: space.capacity.toString(),
        image_url: space.image_url || "",
        status: space.status,
        selectedUtilities: space.utilities || []
      })
    } else {
      setFormData({
        name: "",
        building: "",
        floor: "",
        location: "",
        capacity: "",
        image_url: "",
        status: SpaceStatus.ACTIVE,
        selectedUtilities: []
      })
    }
  }, [space])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (space) {
      // Update existing space
      const updateData: UpdateSpaceRequest = {
        name: formData.name,
        building: formData.building,
        floor: formData.floor,
        location: formData.location || null,
        capacity: parseInt(formData.capacity),
        image_url: formData.image_url || null,
        status: formData.status,
        utilities: formData.selectedUtilities
      }
      onSave(updateData)
    } else {
      // Create new space
      const createData: CreateSpaceRequest = {
        name: formData.name,
        building: formData.building,
        floor: formData.floor,
        location: formData.location || null,
        capacity: parseInt(formData.capacity),
        image_url: formData.image_url || null,
        status: formData.status,
        utilities: formData.selectedUtilities
      }
      onSave(createData)
    }
    onClose()
  }

  const toggleUtility = (key: string) => {
    setFormData(prev => ({
      ...prev,
      selectedUtilities: prev.selectedUtilities.includes(key)
        ? prev.selectedUtilities.filter(k => k !== key)
        : [...prev.selectedUtilities, key]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
            >
              {space ? "Edit Space" : "Add New Space"}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Space Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Building
              </label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
                placeholder="e.g., Building A"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">
                  Floor
                </label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="e.g., Room A003"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Utilities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {utilities.map((utility) => (
                  <label key={utility.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedUtilities.includes(utility.key)}
                      onChange={() => toggleUtility(utility.key)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground">{utility.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SpaceStatus })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value={SpaceStatus.ACTIVE}>Active</option>
                <option value={SpaceStatus.INACTIVE}>Inactive</option>
                <option value={SpaceStatus.MAINTENANCE}>Maintenance</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-muted text-foreground border-2 border-border hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
              >
                {space ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}