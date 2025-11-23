"use client"

import type { RatingResponse } from "@/schemas/api"

interface AdminRatingsListProps {
  ratings: RatingResponse[]
}

export function AdminRatingsList({ ratings }: AdminRatingsListProps) {
  if (ratings.length === 0) {
    return (
      <div className="text-center py-10 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No ratings found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {ratings.map((rating) => (
        <div
          key={rating.id}
          className="bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-foreground">
                  Rating #{rating.id}
                </h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < rating.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-2">
                  <span>👤 User ID: {rating.rated_user_id}</span>
                </div>
                {rating.booking_id && (
                  <div className="flex items-center gap-2">
                    <span>📅 Booking ID: {rating.booking_id}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>📅 {new Date(rating.created_at).toLocaleDateString()}</span>
                </div>
                {rating.created_by && (
                  <div className="flex items-center gap-2">
                    <span>Created by Admin ID: {rating.created_by}</span>
                  </div>
                )}
              </div>

              {rating.comment && (
                <div className="text-sm">
                  <span className="font-bold">Comment:</span>
                  <span className="ml-2">{rating.comment}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
