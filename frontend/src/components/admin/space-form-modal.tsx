"use client"

import { useState, useEffect } from "react"
import { Space } from "./types"

interface SpaceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (space: Partial<Space>) => void
  space?: Space | null
}

export function SpaceFormModal({ isOpen, onClose, onSave, space }: SpaceFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    pricePerHour: "",
    utilities: "",
    image: "",
    status: "active" as "active" | "inactive"
  })

  useEffect(() => {
    if (space) {
      setFormData({
        name: space.name,
        location: space.location,
        capacity: space.capacity.toString(),
        pricePerHour: space.pricePerHour.toString(),
        utilities: space.utilities.join(", "),
        image: space.image,
        status: space.status
      })
    } else {
      setFormData({
        name: "",
        location: "",
        capacity: "",
        pricePerHour: "",
        utilities: "",
        image: "",
        status: "active"
      })
    }
  }, [space])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: space?.id,
      name: formData.name,
      location: formData.location,
      capacity: parseInt(formData.capacity),
      pricePerHour: parseInt(formData.pricePerHour),
      utilities: formData.utilities.split(",").map(u => u.trim()),
      image: formData.image,
      status: formData.status
    })
    onClose()
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
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-2">
                  Price per Hour ($)
                </label>
                <input
                  type="number"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Utilities (comma-separated)
              </label>
              <input
                type="text"
                value={formData.utilities}
                onChange={(e) => setFormData({ ...formData, utilities: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="WiFi, Whiteboard, Projector"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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