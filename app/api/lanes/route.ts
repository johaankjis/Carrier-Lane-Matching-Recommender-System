import { NextResponse } from "next/server"

export async function GET() {
  // Mock lanes data
  const lanes = [
    {
      lane_id: "lane_001",
      origin_city: "Los Angeles",
      origin_state: "CA",
      destination_city: "Chicago",
      destination_state: "IL",
      distance_miles: 2015,
      shipment_count: 342,
    },
    {
      lane_id: "lane_002",
      origin_city: "New York",
      origin_state: "NY",
      destination_city: "Miami",
      destination_state: "FL",
      distance_miles: 1280,
      shipment_count: 256,
    },
    {
      lane_id: "lane_003",
      origin_city: "Seattle",
      origin_state: "WA",
      destination_city: "Denver",
      destination_state: "CO",
      distance_miles: 1318,
      shipment_count: 189,
    },
    {
      lane_id: "lane_004",
      origin_city: "Houston",
      origin_state: "TX",
      destination_city: "Atlanta",
      destination_state: "GA",
      distance_miles: 789,
      shipment_count: 412,
    },
    {
      lane_id: "lane_005",
      origin_city: "Phoenix",
      origin_state: "AZ",
      destination_city: "Dallas",
      destination_state: "TX",
      distance_miles: 1071,
      shipment_count: 298,
    },
    {
      lane_id: "lane_006",
      origin_city: "San Francisco",
      origin_state: "CA",
      destination_city: "Portland",
      destination_state: "OR",
      distance_miles: 635,
      shipment_count: 167,
    },
    {
      lane_id: "lane_007",
      origin_city: "Boston",
      origin_state: "MA",
      destination_city: "Washington",
      destination_state: "DC",
      distance_miles: 440,
      shipment_count: 223,
    },
    {
      lane_id: "lane_008",
      origin_city: "Detroit",
      origin_state: "MI",
      destination_city: "Indianapolis",
      destination_state: "IN",
      distance_miles: 290,
      shipment_count: 145,
    },
  ]

  return NextResponse.json({
    success: true,
    data: lanes,
  })
}
