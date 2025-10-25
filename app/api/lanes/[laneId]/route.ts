import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: Promise<{ laneId: string }> }) {
  try {
    const { laneId } = await params

    // Load lanes
    const lanesPath = path.join(process.cwd(), "public", "data", "lanes.json")
    const lanesContents = await fs.readFile(lanesPath, "utf8")
    const lanes = JSON.parse(lanesContents)

    // Find specific lane
    const lane = lanes.find((l: any) => l.lane_id === laneId)

    if (!lane) {
      return NextResponse.json({ success: false, error: "Lane not found" }, { status: 404 })
    }

    // Load recommendations for this lane
    const recsPath = path.join(process.cwd(), "public", "data", "recommendations.json")
    const recsContents = await fs.readFile(recsPath, "utf8")
    const allRecommendations = JSON.parse(recsContents)

    const recommendations = allRecommendations
      .filter((rec: any) => rec.lane_id === laneId)
      .sort((a: any, b: any) => b.match_score - a.match_score)

    return NextResponse.json({
      success: true,
      data: {
        lane,
        recommendations,
      },
    })
  } catch (error) {
    console.error("[v0] Error loading lane details:", error)
    return NextResponse.json({ success: false, error: "Failed to load lane details" }, { status: 500 })
  }
}
