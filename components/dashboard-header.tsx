import { Truck } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Carrier Lane Recommender</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Carrier Matching System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Model v1.0</div>
          </div>
        </div>
      </div>
    </header>
  )
}
