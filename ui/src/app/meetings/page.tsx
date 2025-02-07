"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDAOStore } from "@/lib/store/dao"

export default function MeetingsPage() {
  const { meetings } = useDAOStore()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AIA Meetings</h1>
          <p className="text-muted-foreground">View all AIA meetings across DAOs</p>
        </div>
      </div>

      <div className="space-y-6">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Link href={`/daos/${meeting.daoId}`} className="hover:underline">
                    {meeting.daoName}
                  </Link>
                  <span>•</span>
                  <span>{meeting.date}</span>
                  <span>•</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    {
                      "bg-green-100 text-green-700": meeting.status === "Completed",
                      "bg-yellow-100 text-yellow-700": meeting.status === "In Progress",
                      "bg-blue-100 text-blue-700": meeting.status === "Scheduled"
                    }
                  )}>
                    {meeting.status}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">
                  <Link 
                    href={`/proposals/${meeting.proposalId}/meetings/${meeting.id}`}
                    className="hover:underline"
                  >
                    {meeting.proposalTitle}
                  </Link>
                </h2>
              </div>
              <Link href={`/proposals/${meeting.proposalId}/meetings/${meeting.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
            <p className="text-muted-foreground mb-4">{meeting.summary}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Participants:</span>
              <div className="flex gap-2">
                {meeting.participants.map((participant, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary rounded-full text-xs"
                  >
                    {participant.role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
