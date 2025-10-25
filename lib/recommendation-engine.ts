/**
 * Recommendation Engine - Client-side utilities
 * Provides functions to load and filter recommendations
 */

export interface Recommendation {
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

export interface Lane {
  lane_id: string
  origin_city: string
  destination_city: string
  origin_state: string
  destination_state: string
  distance_miles: number
  weight_lbs: number
  rate_per_mile: number
  total_cost: number
  delivery_time_hours: number
  shipment_count: number
  freight_type: string
}

export interface Carrier {
  carrier_id: string
  carrier_name: string
  rate_per_mile: number
  total_cost: number
  delivery_time_hours: number
  on_time_percentage: number
  carrier_rating: number
  total_shipments: number
  distance_miles: number
  weight_lbs: number
}

export interface ModelMetrics {
  model_version: string
  training_date: string
  total_recommendations: number
  unique_lanes: number
  unique_carriers: number
  avg_match_score: number
  recommendations_with_history: number
  history_coverage_percentage: number
  scoring_weights: {
    historical_performance: number
    reliability: number
    cost_competitiveness: number
    experience: number
  }
}

/**
 * Load recommendations from the data file
 */
export async function loadRecommendations(): Promise<Recommendation[]> {
  try {
    const response = await fetch("/data/recommendations.json")
    if (!response.ok) {
      throw new Error("Failed to load recommendations")
    }
    return await response.json()
  } catch (error) {
    console.error("[v0] Error loading recommendations:", error)
    return []
  }
}

/**
 * Load lanes from the data file
 */
export async function loadLanes(): Promise<Lane[]> {
  try {
    const response = await fetch("/data/lanes.json")
    if (!response.ok) {
      throw new Error("Failed to load lanes")
    }
    return await response.json()
  } catch (error) {
    console.error("[v0] Error loading lanes:", error)
    return []
  }
}

/**
 * Load carriers from the data file
 */
export async function loadCarriers(): Promise<Carrier[]> {
  try {
    const response = await fetch("/data/carriers.json")
    if (!response.ok) {
      throw new Error("Failed to load carriers")
    }
    return await response.json()
  } catch (error) {
    console.error("[v0] Error loading carriers:", error)
    return []
  }
}

/**
 * Load model metrics
 */
export async function loadModelMetrics(): Promise<ModelMetrics | null> {
  try {
    const response = await fetch("/data/model_metrics.json")
    if (!response.ok) {
      throw new Error("Failed to load model metrics")
    }
    return await response.json()
  } catch (error) {
    console.error("[v0] Error loading model metrics:", error)
    return null
  }
}

/**
 * Get recommendations for a specific lane
 */
export function getRecommendationsForLane(recommendations: Recommendation[], laneId: string): Recommendation[] {
  return recommendations.filter((rec) => rec.lane_id === laneId).sort((a, b) => b.match_score - a.match_score)
}

/**
 * Get top N recommendations across all lanes
 */
export function getTopRecommendations(recommendations: Recommendation[], limit = 10): Recommendation[] {
  return recommendations.sort((a, b) => b.match_score - a.match_score).slice(0, limit)
}

/**
 * Filter recommendations by minimum match score
 */
export function filterByMatchScore(recommendations: Recommendation[], minScore: number): Recommendation[] {
  return recommendations.filter((rec) => rec.match_score >= minScore)
}

/**
 * Search lanes by origin or destination
 */
export function searchLanes(lanes: Lane[], query: string): Lane[] {
  const lowerQuery = query.toLowerCase()
  return lanes.filter(
    (lane) =>
      lane.origin_city.toLowerCase().includes(lowerQuery) ||
      lane.destination_city.toLowerCase().includes(lowerQuery) ||
      lane.origin_state.toLowerCase().includes(lowerQuery) ||
      lane.destination_state.toLowerCase().includes(lowerQuery),
  )
}
