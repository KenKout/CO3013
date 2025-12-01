"use client"

import { useState, useEffect } from "react"
import type { UtilityResponse, CreateUtilityRequest, UpdateUtilityRequest } from "@/schemas/api"

interface UtilityFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (utility: CreateUtilityRequest | UpdateUtilityRequest) => void
  utility?: UtilityResponse | null
}

export function UtilityFormModal({ isOpen, onClose, onSave, utility }: UtilityFormModalProps) {
  const [formData, setFormData] = useState({
    key: "",
    label: "",
    description: ""
  })

  useEffect(() => {
    if (utility) {
      setFormData({
        key: utility.key,
        label: utility.label,
        description: utility.description || ""
      })
    } else {
      setFormData({
        key: "",
        label: "",
        description: ""
      })
    }
  }, [utility])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (utility) {
      // Update existing utility (key cannot be changed)
      const updateData: UpdateUtilityRequest = {
        label: formData.label,
        description: formData.description || null
      }
      onSave(updateData)
    } else {
      // Create new utility
      const createData: CreateUtilityRequest = {
        key: formData.key,
        label: formData.label,
        description: formData.description || null
      }
      onSave(createData)
    }
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
              {utility ? "Edit Utility" : "Add New Utility"}
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
                Key {utility && <span className="text-xs">(cannot be changed)</span>}
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!!utility}
                placeholder="e.g., wifi, projector, whiteboard"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier for this utility (lowercase, no spaces)
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
                placeholder="e.g., WiFi, Projector, Whiteboard"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Display name for this utility
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 min-h-[100px]"
                placeholder="e.g., High-speed wireless internet connection"
              />
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
                {utility ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
