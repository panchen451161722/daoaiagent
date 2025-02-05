"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProposalDetailProps {
  proposal: any // TODO: Add proper type
}

export function ProposalDetail({ proposal }: ProposalDetailProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                {proposal.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold mt-2">
              Proposal #{proposal.id}: {proposal.title}
            </h1>
            <div className="flex gap-2 text-sm text-muted-foreground mt-2">
              <span>{proposal.type}</span>
              <span>•</span>
              <span>Created {proposal.created}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Proposer</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{proposal.creator.avatar}</span>
            <span className="font-medium">{proposal.creator.name}</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Beneficiary</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{proposal.beneficiary.avatar}</span>
            <span className="font-medium">{proposal.beneficiary.name}</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Funding Amount</div>
          <div className="font-medium">
            {proposal.funding.amount.toLocaleString()} {proposal.funding.currency}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Release Percentage</div>
          <div className="font-medium">{proposal.funding.releasePercentage}%</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-8">
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
            <h2 className="text-xl font-semibold mb-2">Funding Plan</h2>
            <div className="prose max-w-none">
              {proposal.fundingPlan.split("\n").map((line: string, index: number) => (
                <p key={index} className="text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Expected Outcome</h2>
            <div className="prose max-w-none">
              {proposal.expectedOutcome.split("\n").map((line: string, index: number) => (
                <p key={index} className="text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {proposal.history.map((event: any) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                  {event.type === 'meeting' && (
                    <Link href={`/meetings/${event.meetingId}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                      >
                        View Meeting
                      </Button>
                    </Link>
                  )}
                </div>
                {event.type === 'meeting' && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Participants: </span>
                    {event.participants.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
