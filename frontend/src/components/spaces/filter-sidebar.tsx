"use client"

import type { UtilityResponse } from "@/schemas/api"

interface FilterSidebarProps {
  building: string
  capacity: string
  utility: string
  buildings: string[]
  utilities: UtilityResponse[]
  onBuildingChange: (value: string) => void
  onCapacityChange: (value: string) => void
  onUtilityChange: (value: string) => void
  onSort: () => void
}

export function FilterSidebar({
  building,
  capacity,
  utility,
  buildings,
  utilities,
  onBuildingChange,
  onCapacityChange,
  onUtilityChange,
  onSort,
}: FilterSidebarProps) {
  return (
    <aside className="w-full lg:w-[250px] bg-card rounded-xl p-6 border border-border h-fit">
      <h3
        className="text-2xl font-bold mb-6 text-foreground border-b border-border pb-4"
        style={{ fontFamily: 'var(--font-heading, Orbitron, sans-serif)' }}
      >
        Filter
      </h3>

      <div className="space-y-5">
        {/* Building Filter */}
        <div>
          <label htmlFor="building" className="block mb-2 font-bold text-sm text-muted-foreground">
            Building
          </label>
          <select
            id="building"
            value={building}
            onChange={(e) => onBuildingChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border-none bg-muted text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Buildings</option>
            {buildings.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Capacity Filter */}
        <div>
          <label htmlFor="capacity" className="block mb-2 font-bold text-sm text-muted-foreground">
            Capacity
          </label>
          <select
            id="capacity"
            value={capacity}
            onChange={(e) => onCapacityChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border-none bg-muted text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="none">None</option>
            <option value="1-10">1-10 Seats</option>
            <option value="11-30">11-30 Seats</option>
            <option value="31+">31+ Seats</option>
          </select>
        </div>

        {/* Utility Filter */}
        <div>
          <label htmlFor="utility" className="block mb-2 font-bold text-sm text-muted-foreground">
            Utility
          </label>
          <select
            id="utility"
            value={utility}
            onChange={(e) => onUtilityChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border-none bg-muted text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Utilities</option>
            {utilities.map((u) => (
              <option key={u.id} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Button */}
        <button
          onClick={onSort}
          className="w-full py-3 rounded-lg bg-foreground text-background font-bold transition-opacity hover:opacity-90"
        >
          Sort
        </button>
      </div>
    </aside>
  )
}