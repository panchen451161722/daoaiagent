"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ProposalDetailProps {
  proposal: any // TODO: Add proper type
}

export function ProposalDetail({ proposal }: ProposalDetailProps) {
  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Link href="/proposals">
          <Button variant="ghost" className="pl-0">
            ← Back to Proposals
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{proposal.title}</h1>
            <div className="flex gap-2 text-sm text-muted-foreground mt-2">
              <span>{proposal.type}</span>
              <span>•</span>
              <span>Created {proposal.created}</span>
              <span>•</span>
              <span>By {proposal.creator}</span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              proposal.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {proposal.status}
          </span>
        </div>
      </div>

      {/* Voting Status */}
      <div className="bg-secondary/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Voting Status</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {proposal.votes.for}
            </div>
            <div className="text-sm text-muted-foreground">For</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {proposal.votes.against}
            </div>
            <div className="text-sm text-muted-foreground">Against</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {proposal.votes.quorum}
            </div>
            <div className="text-sm text-muted-foreground">Quorum</div>
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <Button variant="default" className="w-32">Vote For</Button>
          <Button variant="outline" className="w-32">Vote Against</Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="text-muted-foreground">{proposal.summary}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <div className="prose max-w-none">
            {proposal.details.split("\n").map((paragraph: string, index: number) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Funding Request</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Token Amount: {proposal.tokenRequest} tokens
            </p>
            <div className="prose max-w-none">
              {proposal.fundingPlan.split("\n").map((paragraph: string, index: number) => (
                <p key={index} className="text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Expected Outcome</h2>
          <p className="text-muted-foreground">{proposal.expectedOutcome}</p>
        </section>

        {/* Proposal History */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Proposal History</h2>
          <div className="space-y-4">
            {proposal.history.map((event: any) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{event.status}</h3>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => {
                      // TODO: Implement modal or navigation to show AIA meeting details
                      console.log("View AIA meeting:", event.aiaMeeting)
                    }}
                  >
                    View AIA Meeting
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{event.summary}</p>
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Participants: </span>
                  {event.aiaMeeting.participants.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
