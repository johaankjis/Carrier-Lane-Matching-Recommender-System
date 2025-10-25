"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Truck, Package, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricsData {
  statistics: {
    total_lanes: number
    total_carriers: number
    avg_carrier_rating: number
  }
  avg_match_score: number
}

export function MetricsOverview() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)

  useEffect(() => {
    async function getMetrics() {
      try {
        const response = await fetch("/api/metrics", {
          cache: "no-store",
        })
        const data = await response.json()
        if (data.success) {
          setMetrics(data.data)
        }
      } catch (error) {
        console.error("[v0] Error fetching metrics:", error)
      }
    }
    getMetrics()
  }, [])

  if (!metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card border-border animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-2" />
              <div className="h-3 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Lanes",
      value: metrics.statistics.total_lanes,
      icon: Package,
      description: "Active shipping lanes",
    },
    {
      title: "Total Carriers",
      value: metrics.statistics.total_carriers,
      icon: Truck,
      description: "Registered carriers",
    },
    {
      title: "Avg Match Score",
      value: `${metrics.avg_match_score}%`,
      icon: Target,
      description: "Recommendation quality",
    },
    {
      title: "Avg Carrier Rating",
      value: metrics.statistics.avg_carrier_rating.toFixed(1),
      icon: TrendingUp,
      description: "Out of 5.0",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
