"use client"

import type { SpaceResponse, SpaceStatus } from "@/schemas/api"
import Image from "next/image"

interface AdminSpaceListProps {
  spaces: SpaceResponse[]
  onEdit: (space: SpaceResponse) => void
  onDelete: (id: number) => void
  onToggleStatus: (id: number, currentStatus: SpaceStatus) => void
}

export function AdminSpaceList({ spaces, onEdit, onDelete, onToggleStatus }: AdminSpaceListProps) {
  if (spaces.length === 0) {
    return (
      <div className="text-center py-10 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No spaces found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {spaces.map((space) => (
        <div
          key={space.id}
          className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center p-4">
            {/* Image */}
            <div className="relative w-full md:w-[200px] h-[150px] flex-shrink-0 bg-muted overflow-hidden rounded-lg">
              {space.image_url ? (
                <Image
                  src={space.image_url}
                  alt={space.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-grow md:pl-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {space.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        space.status === "active"
                          ? "bg-green-600 text-white"
                          : space.status === "inactive"
                          ? "bg-red-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {space.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <span>🏢 {space.building}, Floor {space.floor}</span>
                    </div>
                    {space.location && (
                      <div className="flex items-center gap-2">
                        <span>📍 {space.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>👥 Capacity: {space.capacity} people</span>
                    </div>
                    {space.utilities.length > 0 && (
                      <div className="flex items-center gap-2 md:col-span-2">
                        <span>🔧 {space.utilities.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => onEdit(space)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onToggleStatus(space.id, space.status)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                      space.status === "active"
                        ? "bg-red-600 text-white border-2 border-red-600 hover:bg-red-700"
                        : "bg-green-600 text-white border-2 border-green-600 hover:bg-green-700"
                    }`}
                  >
                    {space.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => onDelete(space.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 bg-transparent text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
