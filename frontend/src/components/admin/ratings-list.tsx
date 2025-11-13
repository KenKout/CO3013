"use client"

import { Rating } from "./types"

interface RatingsListProps {
  ratings: Rating[]
}

export function RatingsList({ ratings }: RatingsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {ratings.map((rating) => (
        <div
          key={rating.id}
          className="bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Left Section */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-foreground">
                  {rating.userName}
                </h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < rating.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-none text-muted-foreground"
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="ml-1 font-bold text-foreground">{rating.rating}/5</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="text-foreground">
                  <span className="font-bold">Comment: </span>
                  {rating.comment}
                </div>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div>
                    <span className="font-bold">Space: </span>
                    {rating.spaceName}
                  </div>
                  <div>
                    <span className="font-bold">Date: </span>
                    {rating.date}
                  </div>
                  <div>
                    <span className="font-bold">Rated by: </span>
                    {rating.ratedBy}
                  </div>
                </div>
                <div className="text-muted-foreground">
                  <span className="font-bold">Reservation ID: </span>
                  {rating.reservationId}
                </div>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="flex md:flex-col gap-2 items-start">
              <div
                className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  rating.rating >= 4
                    ? "bg-green-600 text-white"
                    : rating.rating >= 3
                    ? "bg-blue-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {rating.rating >= 4 ? "Excellent" : rating.rating >= 3 ? "Good" : "Poor"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}