import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const minRating = searchParams.get("min_rating")
    const minOnTime = searchParams.get("min_on_time")

    // Load carriers
    const filePath = path.join(process.cwd(), "public", "data", "carriers.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    let carriers = JSON.parse(fileContents)

    // Filter by minimum rating if provided
    if (minRating) {
      const minRatingNum = Number.parseFloat(minRating)
      carriers = carriers.filter((carrier: any) => carrier.carrier_rating >= minRatingNum)
    }

    // Filter by minimum on-time percentage if provided
    if (minOnTime) {
      const minOnTimeNum = Number.parseFloat(minOnTime)
      carriers = carriers.filter((carrier: any) => carrier.on_time_percentage >= minOnTimeNum)
    }

    // Sort by rating
    carriers.sort((a: any, b: any) => b.carrier_rating - a.carrier_rating)

    return NextResponse.json({
      success: true,
      count: carriers.length,
      data: carriers,
    })
  } catch (error) {
    console.error("[v0] Error loading carriers:", error)
    return NextResponse.json({ success: false, error: "Failed to load carriers" }, { status: 500 })
  }
}
