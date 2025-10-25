import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: Promise<{ carrierId: string }> }) {
  try {
    const { carrierId } = await params

    // Load carriers
    const carriersPath = path.join(process.cwd(), "public", "data", "carriers.json")
    const carriersContents = await fs.readFile(carriersPath, "utf8")
    const carriers = JSON.parse(carriersContents)

    // Find specific carrier
    const carrier = carriers.find((c: any) => c.carrier_id === carrierId)

    if (!carrier) {
      return NextResponse.json({ success: false, error: "Carrier not found" }, { status: 404 })
    }

    // Load carrier's lane history
    const historyPath = path.join(process.cwd(), "public", "data", "carrier_lane_history.json")
    const historyContents = await fs.readFile(historyPath, "utf8")
    const allHistory = JSON.parse(historyContents)

    const laneHistory = allHistory.filter((h: any) => h.carrier_id === carrierId)

    return NextResponse.json({
      success: true,
      data: {
        carrier,
        lane_history: laneHistory,
      },
    })
  } catch (error) {
    console.error("[v0] Error loading carrier details:", error)
    return NextResponse.json({ success: false, error: "Failed to load carrier details" }, { status: 500 })
  }
}
