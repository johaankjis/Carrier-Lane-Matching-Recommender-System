"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Clock, DollarSign, Award } from "lucide-react"

interface Recommendation {
  lane_id: string
  origin_city: string
  destination_city: string
  carrier_id: string
  carrier_name: string
  match_score: number
  estimated_rate: number
  estimated_cost: number
  estimated_delivery_hours: number
  carrier_rating: number
  on_time_percentage: number
  has_lane_history: boolean
  score_factors: {
    historical_performance: number
    reliability: number
    cost_competitiveness: number
    experience: number
  }
}

export function RecommendationsList() {
  const searchParams = useSearchParams()
  const laneId = searchParams.get("lane_id")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadRecommendations() {
      if (!laneId) {
        // Load top recommendations
        try {
          setLoading(true)
          const response = await fetch("/api/recommendations?limit=10")
          const data = await response.json()
          if (data.success) {
            setRecommendations(data.data)
          }
        } catch (error) {
          console.error("[v0] Error loading recommendations:", error)
        } finally {
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/recommendations?lane_id=${laneId}`)
        const data = await response.json()
        if (data.success) {
          setRecommendations(data.data)
        }
      } catch (error) {
        console.error("[v0] Error loading recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [laneId])

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Loading recommendations...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">No Recommendations</CardTitle>
          <CardDescription className="text-muted-foreground">
            Select a lane to view carrier recommendations
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recommended Carriers</h2>
          <p className="text-sm text-muted-foreground">
            {laneId
              ? `Showing ${recommendations.length} matches for selected lane`
              : "Top recommendations across all lanes"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <Card
            key={`${rec.carrier_id}-${rec.lane_id}`}
            className="bg-card border-border hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Award className="h-5 w-5 text-primary" />}
                    <CardTitle className="text-foreground">{rec.carrier_name}</CardTitle>
                    {rec.has_lane_history && (
                      <Badge variant="secondary" className="text-xs">
                        Lane History
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {rec.origin_city} → {rec.destination_city}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{rec.match_score}%</div>
                  <div className="text-xs text-muted-foreground">Match Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">${rec.estimated_cost.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">${rec.estimated_rate}/mile</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{rec.estimated_delivery_hours}h</div>
                    <div className="text-xs text-muted-foreground">Est. delivery</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{rec.carrier_rating}/5.0</div>
                    <div className="text-xs text-muted-foreground">{rec.on_time_percentage}% on-time</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Score Breakdown</div>
                <div className="space-y-2">
                  <ScoreFactor
                    label="Historical Performance"
                    value={rec.score_factors.historical_performance}
                    weight={40}
                  />
                  <ScoreFactor label="Reliability" value={rec.score_factors.reliability} weight={30} />
                  <ScoreFactor
                    label="Cost Competitiveness"
                    value={rec.score_factors.cost_competitiveness}
                    weight={20}
                  />
                  <ScoreFactor label="Experience" value={rec.score_factors.experience} weight={10} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ScoreFactor({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {label} ({weight}%)
        </span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  )
}
