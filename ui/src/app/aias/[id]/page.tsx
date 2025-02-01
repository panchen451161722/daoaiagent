import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "AIA Details",
  description: "View AIA details and activities",
}

const allPermissions = [
  {
    id: "create_proposal",
    name: "Create Proposals",
    description: "Can create new proposals in the DAO"
  },
  {
    id: "review_proposal",
    name: "Review Proposals",
    description: "Can review and comment on proposals"
  },
  {
    id: "vote_proposal",
    name: "Vote on Proposals",
    description: "Can cast votes on proposals"
  },
  {
    id: "execute_proposal",
    name: "Execute Proposals",
    description: "Can execute approved proposals"
  },
  {
    id: "manage_members",
    name: "Manage Members",
    description: "Can add or remove DAO members"
  },
  {
    id: "manage_funds",
    name: "Manage Funds",
    description: "Can manage DAO treasury and funds"
  },
  {
    id: "create_meeting",
    name: "Create Meetings",
    description: "Can schedule and create new meetings"
  },
  {
    id: "moderate_discussion",
    name: "Moderate Discussions",
    description: "Can moderate DAO discussions and forums"
  }
]

const mockAIADetails = {
  id: "1",
  role: "Proposal Coordinator",
  type: "Internal",
  description: "Coordinates proposal reviews and voting processes",
  permissions: [
    "create_proposal",
    "review_proposal",
    "create_meeting",
    "moderate_discussion"
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
            {allPermissions.map((permission) => (
              <div key={permission.id} className="bg-secondary/30 rounded-lg p-3 flex items-center gap-2">
                {mockAIADetails.permissions.includes(permission.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2a1 1 0 00.293.707l2 2a1 1 0 001.414 0l2-2a1 1 0 00.293-.707V7a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 00.293.707l-2 2a1 1 0 00-1.414 0l-2-2a1 1 0 00-.293-.707V7z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{permission.name}</span>
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
