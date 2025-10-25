import { NextResponse } from "next/server"

export async function GET() {
  // Mock metrics data
  const metrics = {
    statistics: {
      total_lanes: 156,
      total_carriers: 42,
      avg_carrier_rating: 4.3,
    },
    avg_match_score: 87,
  }

  return NextResponse.json({
    success: true,
    data: metrics,
  })
}
