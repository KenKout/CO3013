"use client"

import type { UtilityResponse } from "@/schemas/api"

interface AdminUtilitiesListProps {
  utilities: UtilityResponse[]
  onEdit: (utility: UtilityResponse) => void
  onDelete: (id: number) => void
}

export function AdminUtilitiesList({ utilities, onEdit, onDelete }: AdminUtilitiesListProps) {
  if (utilities.length === 0) {
    return (
      <div className="text-center py-10 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No utilities found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {utilities.map((utility) => (
        <div
          key={utility.id}
          className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between p-5">
            {/* Content */}
            <div className="flex-grow mb-4 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-foreground">
                  {utility.label}
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {utility.key}
                </span>
              </div>

              {utility.description && (
                <p className="text-sm text-muted-foreground">
                  {utility.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(utility)}
                className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(utility.id)}
                className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-transparent text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
