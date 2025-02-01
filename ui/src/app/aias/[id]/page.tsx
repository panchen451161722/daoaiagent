import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "AIA Details",
  description: "View AIA details and activities",
}

const mockAIADetails = {
  id: "1",
  role: "Proposal Coordinator",
  type: "Internal",
  description: "Coordinates proposal reviews and voting processes",
  permissions: [
    "Create proposals",
    "Review proposals",
    "Coordinate meetings",
    "Update proposal status"
  ],
  recentActivities: [
    {
      id: "act1",
      date: "2024-01-30",
      daoName: "DeFi DAO",
      action: "Coordinated governance model review",
      status: "Completed"
    },
    {
      id: "act2",
      date: "2024-01-29",
      daoName: "NFT Creators",
      action: "Initiated proposal review process",
      status: "In Progress"
    },
    {
      id: "act3",
      date: "2024-01-28",
      daoName: "Gaming Guild",
      action: "Updated proposal status",
      status: "Completed"
    }
  ],
  stats: {
    activeDAOs: 3,
    totalMeetings: 45,
    proposalsCoordinated: 28,
    successRate: "92%"
  }
}

interface PageProps {
  params: {
    id: string
  }
}

export default function AIADetailsPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{mockAIADetails.role}</h1>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              mockAIADetails.type === "Internal"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            )}>
              {mockAIADetails.type}
            </span>
          </div>
          <p className="text-muted-foreground">{mockAIADetails.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(mockAIADetails.stats).map(([key, value]) => (
            <div key={key} className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Permissions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Permissions</h2>
          <div className="grid grid-cols-2 gap-2">
            {mockAIADetails.permissions.map((permission, index) => (
              <div key={index} className="bg-secondary/30 rounded-lg p-3">
                {permission}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {mockAIADetails.recentActivities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {activity.date}
                    </span>
                    <span>•</span>
                    <Link 
                      href={`/daos/${activity.daoName.toLowerCase().replace(" ", "-")}`}
                      className="text-sm hover:underline"
                    >
                      {activity.daoName}
                    </Link>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    {
                      "bg-green-100 text-green-700": activity.status === "Completed",
                      "bg-yellow-100 text-yellow-700": activity.status === "In Progress"
                    }
                  )}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm">{activity.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
