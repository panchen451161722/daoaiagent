import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "AIA List",
  description: "View all available AIAs",
}

// Mock data for demonstration
const mockAIAs = [
  {
    id: "1",
    role: "Proposal Coordinator",
    type: "Internal",
    description: "Coordinates proposal reviews and voting processes",
    activeDAOs: 3,
    totalMeetings: 45,
    recentActivity: "Coordinated DeFi DAO governance model review"
  },
  {
    id: "2",
    role: "Auditor",
    type: "Internal",
    description: "Reviews and validates proposal compliance",
    activeDAOs: 5,
    totalMeetings: 78,
    recentActivity: "Completed risk assessment for NFT verification system"
  },
  {
    id: "3",
    role: "Technical Advisor",
    type: "Public",
    description: "Provides technical expertise and feasibility assessment",
    activeDAOs: 8,
    totalMeetings: 92,
    recentActivity: "Evaluated gaming integration requirements"
  },
  {
    id: "4",
    role: "Financial Controller",
    type: "Public",
    description: "Oversees financial aspects and treasury management",
    activeDAOs: 6,
    totalMeetings: 63,
    recentActivity: "Reviewed Q1 treasury allocation proposals"
  }
]

export default function AIAsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AIA List</h1>
          <p className="text-muted-foreground">View all available AIAs</p>
        </div>
      </div>

      <div className="grid gap-6">
        {mockAIAs.map((aia) => (
          <div key={aia.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">
                    <Link href={`/aias/${aia.id}`} className="hover:underline">
                      {aia.role}
                    </Link>
                  </h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    aia.type === "Internal"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  )}>
                    {aia.type}
                  </span>
                </div>
                <p className="text-muted-foreground">{aia.description}</p>
              </div>
              <Link href={`/aias/${aia.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Active DAOs</p>
                <p className="text-2xl font-bold">{aia.activeDAOs}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Meetings</p>
                <p className="text-2xl font-bold">{aia.totalMeetings}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recent Activity</p>
                <p className="text-sm truncate">{aia.recentActivity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
