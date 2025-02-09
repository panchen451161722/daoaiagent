"use client"

import Link from "next/link"
import { useDAOStore } from "@/lib/store/dao"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function MeetingsPage() {
  const { meetings } = useDAOStore()

  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="container max-w-3xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Recent Meetings</h1>
            <p className="text-muted-foreground mt-2">View all AI agent meetings and their outcomes</p>
          </div>
        </div>

        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <Link key={meeting.id} href={`/proposals/${meeting.proposalId}/meetings/${meeting.id}`}>
              <Card className="p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{meeting.proposalTitle}</h2>
                    <p className="text-sm text-muted-foreground">
                      {meeting.daoName} · {new Date(meeting.date).toLocaleDateString()}
                    </p>
                  </div>
                  {meeting.finalDecision && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant={meeting.finalDecision.decision === "REJECT" ? "destructive" : "default"}>
                            {meeting.finalDecision.decision}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{meeting.finalDecision.justification}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
