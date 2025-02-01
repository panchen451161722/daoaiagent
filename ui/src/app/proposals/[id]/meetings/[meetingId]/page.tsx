import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AIA Meeting Details",
  description: "View AIA meeting details and discussions",
}

// Mock data for demonstration
const mockMeeting = {
  id: "M001",
  date: "2024-01-30",
  status: "Completed",
  title: "Proposal Review Meeting",
  summary: "Initial review completed, proceeding to voting phase",
  participants: [
    {
      role: "Coordinator",
      address: "0x1234...5678",
      vote: "Approve",
      comments: "The proposal aligns with our governance objectives"
    },
    {
      role: "Auditor",
      address: "0x2345...6789",
      vote: "Approve",
      comments: "Risk assessment shows acceptable levels"
    },
    {
      role: "Researcher",
      address: "0x3456...7890",
      vote: "Approve",
      comments: "Technical implementation appears feasible"
    }
  ],
  discussion: [
    {
      time: "10:00 AM",
      speaker: "Coordinator",
      content: "Meeting called to order. Today we will review proposal #123 regarding the new governance model."
    },
    {
      time: "10:05 AM",
      speaker: "Researcher",
      content: "Based on my analysis, the proposed changes are technically sound and can be implemented within the suggested timeframe."
    },
    {
      time: "10:15 AM",
      speaker: "Auditor",
      content: "I've reviewed the potential risks. The main concerns are..."
    },
    {
      time: "10:30 AM",
      speaker: "Coordinator",
      content: "Let's proceed with the voting phase. Please submit your votes with comments."
    }
  ],
  decisions: [
    "Proposal approved for community voting",
    "Implementation timeline accepted",
    "Risk mitigation measures to be documented"
  ],
  nextSteps: [
    "Prepare community announcement",
    "Set up voting infrastructure",
    "Schedule follow-up review in 2 weeks"
  ]
}

interface PageProps {
  params: {
    id: string
    meetingId: string
  }
}

export default async function MeetingPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-10">
      {/* Back Link */}
      <div className="mb-8">
        <Link href={`/proposals/${await Promise.resolve(params.id)}`}>
          <Button variant="ghost" className="pl-0">
            ← Back to Proposal
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{mockMeeting.title}</h1>
          <div className="flex gap-2 text-sm text-muted-foreground mt-2">
            <span>Meeting ID: {mockMeeting.id}</span>
            <span>•</span>
            <span>{mockMeeting.date}</span>
            <span>•</span>
            <span>{mockMeeting.status}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-secondary/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Meeting Summary</h2>
          <p className="text-muted-foreground">{mockMeeting.summary}</p>
        </div>

        {/* Participants and Votes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Participants & Votes</h2>
          <div className="grid gap-4">
            {mockMeeting.participants.map((participant, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{participant.role}</h3>
                    <p className="text-sm text-muted-foreground">{participant.address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    participant.vote === "Approve" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {participant.vote}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{participant.comments}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Discussion */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Meeting Discussion</h2>
          <div className="space-y-4">
            {mockMeeting.discussion.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-24 flex-shrink-0">
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
                <div>
                  <p className="font-semibold">{item.speaker}</p>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Decisions Made</h2>
          <ul className="list-disc list-inside space-y-2">
            {mockMeeting.decisions.map((decision, index) => (
              <li key={index} className="text-muted-foreground">{decision}</li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <ul className="list-disc list-inside space-y-2">
            {mockMeeting.nextSteps.map((step, index) => (
              <li key={index} className="text-muted-foreground">{step}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
