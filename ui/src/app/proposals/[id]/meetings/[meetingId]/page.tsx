"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useDAOStore } from "@/lib/store/dao"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface PageProps {
  params: Promise<{
    id: string
    meetingId: string
  }>
}

export default function MeetingPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const { id, meetingId } = resolvedParams
  const { getMeetingById } = useDAOStore()
  const meeting = getMeetingById(meetingId)

  if (!meeting) {
    return <div>Meeting not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href={`/daos/${meeting.daoId}`} className="hover:underline">
              {meeting.daoName}
            </Link>
            <span>•</span>
            <span>{meeting.date}</span>
            <span>•</span>
            <span
              className={cn("px-2 py-0.5 rounded-full text-xs", {
                "bg-green-100 text-green-700": meeting.status === "Completed",
                "bg-yellow-100 text-yellow-700": meeting.status === "In Progress",
                "bg-blue-100 text-blue-700": meeting.status === "Scheduled",
              })}
            >
              {meeting.status}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{meeting.proposalTitle}</h1>
          <Link 
            href={`/proposals/${id}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View Related Proposal →
          </Link>
          <p className="text-muted-foreground mt-4">{meeting.summary}</p>
        </div>

        {/* Final Decision - Moved to top for significance */}
        {meeting.finalDecision && (
          <Card className={cn(
            "border-2",
            meeting.finalDecision.decision === "APPROVE" ? "border-green-500" : "border-red-500"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Final Decision
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  meeting.finalDecision.decision === "APPROVE" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                )}>
                  {meeting.finalDecision.decision}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{meeting.finalDecision.justification}</p>
            </CardContent>
          </Card>
        )}

        {/* Participants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <div className="grid gap-4">
            {meeting.participants && meeting.participants.map((participant, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">{participant.role}</p>
                    </div>
                  </div>
                  {participant.vote && (
                    <span
                      className={cn("px-3 py-1 rounded-full text-sm", {
                        "bg-green-100 text-green-700": participant.vote === "Approve",
                        "bg-red-100 text-red-700": participant.vote === "Reject",
                        "bg-yellow-100 text-yellow-700": participant.vote === "Abstain",
                      })}
                    >
                      {participant.vote}
                    </span>
                  )}
                </div>
                {participant.comments && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {participant.comments}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Discussion */}
        {meeting.discussion && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Discussion</h2>
            <div className="space-y-4">
              {meeting.discussion.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={item.speaker.avatar} />
                    <AvatarFallback>{item.speaker.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{item.speaker.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.speaker.role}
                      </span>
                    </div>
                    <p className="mt-1">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discussion History */}
        {meeting.discussionHistory && meeting.discussionHistory.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Discussion History</h2>
            <div className="space-y-6">
              {meeting.discussionHistory.map((discussion, index) => {
                const [prefix, message] = discussion.split(": ")
                const [round, role] = prefix.split(" - ")
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {round}
                      </span>
                      <span className="font-medium">{role}</span>
                    </div>
                    <p className="text-muted-foreground">{message}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Votes */}
        {meeting.votes && Object.keys(meeting.votes).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Committee Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {Object.entries(meeting.votes).map(([role, vote]) => (
                  <div key={role} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{role}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm",
                      vote === "APPROVE" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    )}>
                      {vote}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Decisions */}
        {meeting.decisions && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Decisions</h2>
            <ul className="list-disc list-inside space-y-2">
              {meeting.decisions.map((decision, index) => (
                <li key={index} className="text-muted-foreground">
                  {decision}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {meeting.nextSteps && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <ul className="list-disc list-inside space-y-2">
              {meeting.nextSteps.map((step, index) => (
                <li key={index} className="text-muted-foreground">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
