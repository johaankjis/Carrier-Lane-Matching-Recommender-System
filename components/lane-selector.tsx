"use client"

import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"

interface Lane {
  lane_id: string
  origin_city: string
  destination_city: string
  origin_state: string
  destination_state: string
  distance_miles: number
  shipment_count: number
}

export function LaneSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [lanes, setLanes] = useState<Lane[]>([])
  const [search, setSearch] = useState("")
  const [selectedLane, setSelectedLane] = useState<string | null>(searchParams.get("lane_id"))

  useEffect(() => {
    async function loadLanes() {
      try {
        const response = await fetch("/api/lanes")
        const data = await response.json()
        if (data.success) {
          setLanes(data.data)
        }
      } catch (error) {
        console.error("[v0] Error loading lanes:", error)
      }
    }
    loadLanes()
  }, [])

  const filteredLanes = lanes.filter(
    (lane) =>
      lane.origin_city.toLowerCase().includes(search.toLowerCase()) ||
      lane.destination_city.toLowerCase().includes(search.toLowerCase()) ||
      lane.origin_state.toLowerCase().includes(search.toLowerCase()) ||
      lane.destination_state.toLowerCase().includes(search.toLowerCase()),
  )

  const handleLaneSelect = (laneId: string) => {
    setSelectedLane(laneId)
    router.push(`/?lane_id=${laneId}`)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Select Lane</CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose a shipping lane to view recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lanes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border text-foreground"
          />
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {filteredLanes.map((lane) => (
              <button
                key={lane.lane_id}
                onClick={() => handleLaneSelect(lane.lane_id)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedLane === lane.lane_id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:bg-secondary/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="font-medium text-foreground">
                      {lane.origin_city}, {lane.origin_state}
                    </div>
                    <div className="text-sm text-muted-foreground">to</div>
                    <div className="font-medium text-foreground">
                      {lane.destination_city}, {lane.destination_state}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {lane.distance_miles} mi
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lane.shipment_count} shipments
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
