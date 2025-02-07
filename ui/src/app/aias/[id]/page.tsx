"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAIAStore } from "@/lib/store/aia"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function AIADetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { getAIAById, permissions } = useAIAStore()
  const aia = getAIAById(id)

  if (!aia) {
    return <div>AIA not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{aia.role}</h1>
            <span className={cn(
              "px-2 py-1 rounded-full text-sm",
              aia.type === "Internal"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            )}>
              {aia.type}
            </span>
          </div>
          <p className="text-muted-foreground">{aia.description}</p>
        </div>
        <Button variant="outline">Edit AIA</Button>
      </div>

      {/* Stats */}
      {aia.stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active DAOs</p>
            <p className="text-2xl font-bold">{aia.stats.activeDAOs}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Meetings</p>
            <p className="text-2xl font-bold">{aia.stats.totalMeetings}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Proposals Coordinated</p>
            <p className="text-2xl font-bold">{aia.stats.proposalsCoordinated}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">{aia.stats.successRate}</p>
          </div>
        </div>
      )}

      {/* Permissions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Permissions</h2>
        <div className="grid grid-cols-2 gap-4">
          {permissions
            .filter(permission => aia.permissions.includes(permission.id))
            .map(permission => (
              <div key={permission.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{permission.name}</h3>
                <p className="text-sm text-muted-foreground">{permission.description}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activities */}
      {aia.recentActivities && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {aia.recentActivities.map(activity => (
              <div key={activity.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{activity.daoName}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{activity.date}</span>
                    </div>
                    <p>{activity.action}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    activity.status === "Completed" ? "bg-green-100 text-green-700" :
                    activity.status === "In Progress" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
