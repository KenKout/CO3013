"use client"

import { useState } from "react"

interface AddPenaltyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (penalty: { reason: string; points: number }) => void
  userName: string
}

export function AddPenaltyModal({ isOpen, onClose, onSave, userName }: AddPenaltyModalProps) {
  const [formData, setFormData] = useState({
    reason: "",
    points: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      reason: formData.reason,
      points: parseInt(formData.points)
    })
    setFormData({ reason: "", points: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl border border-border max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
            >
              Add Penalty
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

          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">User: </span>
            <span className="text-foreground font-bold">{userName}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Reason
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 min-h-[100px]"
                required
                placeholder="Describe the reason for the penalty..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Penalty Points
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
                min="1"
                max="50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 5 pts (minor), 10 pts (moderate), 15+ pts (severe)
              </p>
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
                className="flex-1 px-5 py-2.5 rounded-lg font-bold transition-all duration-300 bg-red-600 text-white border-2 border-red-600 hover:bg-red-700"
              >
                Add Penalty
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

interface AddRatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rating: { rating: number; comment: string }) => void
  userName: string
}

export function AddRatingModal({ isOpen, onClose, onSave, userName }: AddRatingModalProps) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      rating: formData.rating,
      comment: formData.comment
    })
    setFormData({ rating: 5, comment: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl border border-border max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
            >
              Rate User
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

          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">User: </span>
            <span className="text-foreground font-bold">{userName}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-none text-muted-foreground"
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-foreground font-bold">{formData.rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">
                Comment
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 min-h-[100px]"
                required
                placeholder="Share your feedback about this user..."
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
                Submit Rating
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}