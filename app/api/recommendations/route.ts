import { NextResponse } from "next/server"

// Mock carrier data
const carriers = [
  { id: "carrier_001", name: "Swift Transport", rating: 4.8, on_time: 96 },
  { id: "carrier_002", name: "Reliable Freight", rating: 4.5, on_time: 92 },
  { id: "carrier_003", name: "Express Logistics", rating: 4.6, on_time: 94 },
  { id: "carrier_004", name: "Prime Carriers", rating: 4.3, on_time: 89 },
  { id: "carrier_005", name: "National Freight", rating: 4.7, on_time: 95 },
]

// Mock lanes data (matching the lanes API)
const lanes = [
  {
    lane_id: "lane_001",
    origin_city: "Los Angeles",
    destination_city: "Chicago",
    distance_miles: 2015,
  },
  {
    lane_id: "lane_002",
    origin_city: "New York",
    destination_city: "Miami",
    distance_miles: 1280,
  },
  {
    lane_id: "lane_003",
    origin_city: "Seattle",
    destination_city: "Denver",
    distance_miles: 1318,
  },
  {
    lane_id: "lane_004",
    origin_city: "Houston",
    destination_city: "Atlanta",
    distance_miles: 789,
  },
  {
    lane_id: "lane_005",
    origin_city: "Phoenix",
    destination_city: "Dallas",
    distance_miles: 1071,
  },
]

function generateRecommendation(lane: (typeof lanes)[0], carrier: (typeof carriers)[0], hasHistory: boolean) {
  const baseRate = 2.5 + Math.random() * 1.5
  const matchScore = Math.floor(75 + Math.random() * 20)

  const historicalPerformance = hasHistory ? Math.floor(85 + Math.random() * 15) : Math.floor(60 + Math.random() * 20)
  const reliability = Math.floor(80 + Math.random() * 20)
  const costCompetitiveness = Math.floor(70 + Math.random() * 25)
  const experience = Math.floor(75 + Math.random() * 20)

  return {
    lane_id: lane.lane_id,
    origin_city: lane.origin_city,
    destination_city: lane.destination_city,
    carrier_id: carrier.id,
    carrier_name: carrier.name,
    match_score: matchScore,
    estimated_rate: Number.parseFloat(baseRate.toFixed(2)),
    estimated_cost: Math.floor(lane.distance_miles * baseRate),
    estimated_delivery_hours: Math.floor(lane.distance_miles / 50),
    carrier_rating: carrier.rating,
    on_time_percentage: carrier.on_time,
    has_lane_history: hasHistory,
    score_factors: {
      historical_performance: historicalPerformance,
      reliability,
      cost_competitiveness: costCompetitiveness,
      experience,
    },
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const laneId = searchParams.get("lane_id")
  const limit = Number.parseInt(searchParams.get("limit") || "5")

  if (laneId) {
    // Get recommendations for specific lane
    const lane = lanes.find((l) => l.lane_id === laneId)
    if (!lane) {
      return NextResponse.json(
        {
          success: false,
          error: "Lane not found",
        },
        { status: 404 },
      )
    }

    // Generate recommendations for this lane
    const recommendations = carriers
      .map(
        (carrier, index) => generateRecommendation(lane, carrier, index < 2), // First 2 carriers have history
      )
      .sort((a, b) => b.match_score - a.match_score)

    return NextResponse.json({
      success: true,
      data: recommendations,
    })
  }

  // Get top recommendations across all lanes
  const topRecommendations = lanes
    .slice(0, limit)
    .flatMap((lane, laneIndex) =>
      carriers
        .slice(0, 2)
        .map((carrier, carrierIndex) => generateRecommendation(lane, carrier, laneIndex === 0 && carrierIndex === 0)),
    )
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, limit)

  return NextResponse.json({
    success: true,
    data: topRecommendations,
  })
}
