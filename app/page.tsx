import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsOverview } from "@/components/metrics-overview"
import { LaneSelector } from "@/components/lane-selector"
import { RecommendationsList } from "@/components/recommendations-list"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Suspense fallback={<MetricsSkeleton />}>
          <MetricsOverview />
        </Suspense>

        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          <aside className="space-y-6">
            <Suspense fallback={<Skeleton className="h-[400px]" />}>
              <LaneSelector />
            </Suspense>
          </aside>

          <section>
            <Suspense fallback={<RecommendationsSkeleton />}>
              <RecommendationsList />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[120px]" />
      ))}
    </div>
  )
}

function RecommendationsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-[180px]" />
      ))}
    </div>
  )
}
