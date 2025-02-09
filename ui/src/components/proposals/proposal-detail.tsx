"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusTooltip } from "@/components/ui/status-tooltip"
import { Proposal, ProposalHistory } from "@/lib/store/dao"

interface ProposalDetailProps {
  proposal: Proposal
}

export default function ProposalDetail({ proposal }: ProposalDetailProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <StatusTooltip currentStatus={proposal.status}>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium cursor-help">
                  {proposal.status}
                </span>
              </StatusTooltip>
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
            {proposal.creator.avatar && (
              <span className="text-xl">{proposal.creator.avatar}</span>
            )}
            <span className="font-medium">{proposal.creator.name}</span>
          </div>
        </div>
        {proposal.beneficiary && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Beneficiary</div>
            <div className="flex items-center gap-2">
              {proposal.beneficiary.avatar && (
                <span className="text-xl">{proposal.beneficiary.avatar}</span>
              )}
              <span className="font-medium">{proposal.beneficiary.name}</span>
            </div>
          </div>
        )}
        {proposal.funding && (
          <>
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
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-8">
          {proposal.summary && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p className="text-muted-foreground">{proposal.summary}</p>
            </section>
          )}

          {proposal.details && (
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
          )}

          {proposal.fundingPlan && (
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
          )}

          {proposal.expectedOutcome && (
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
          )}
        </TabsContent>

        <TabsContent value="history">
          {proposal.history && proposal.history.length > 0 ? (
            <div className="space-y-4">
              {proposal.history.map((item: ProposalHistory) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-1/4">
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                    {item.type === "meeting" && (
                      <Link
                        href={`/proposals/${proposal.id}/meetings/${item.meetingId}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Meeting Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No history available</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
