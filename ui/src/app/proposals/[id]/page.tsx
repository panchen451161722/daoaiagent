import { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Proposal Details",
  description: "View proposal details and vote",
}

// Mock data for demonstration
const mockProposal = {
  id: 1,
  title: "Implement New Governance Model",
  type: "Governance",
  status: "Active",
  created: "2024-01-30",
  creator: "0x1234...5678",
  summary: "A proposal to improve our governance structure",
  details: `This proposal aims to implement a new governance model that will enhance our decision-making process and increase community participation. The key points are:

1. Introduction of a two-phase voting system
2. Implementation of delegation capabilities
3. Creation of specialized committees
4. Enhanced transparency measures`,
  tokenRequest: 1000,
  fundingPlan: `The requested tokens will be allocated as follows:
- 40% for technical implementation
- 30% for community education and outreach
- 20% for ongoing maintenance
- 10% for contingency`,
  expectedOutcome: "Increased participation rate by 50% and faster decision-making process",
  votes: {
    for: 120,
    against: 30,
    quorum: 200,
  },
}

export default function ProposalPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{mockProposal.title}</h1>
              <div className="flex gap-2 text-sm text-muted-foreground mt-2">
                <span>{mockProposal.type}</span>
                <span>•</span>
                <span>Created {mockProposal.created}</span>
                <span>•</span>
                <span>By {mockProposal.creator}</span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                mockProposal.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {mockProposal.status}
            </span>
          </div>
        </div>

        {/* Voting Status */}
        <div className="bg-secondary/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Voting Status</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {mockProposal.votes.for}
              </div>
              <div className="text-sm text-muted-foreground">For</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {mockProposal.votes.against}
              </div>
              <div className="text-sm text-muted-foreground">Against</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {mockProposal.votes.quorum}
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
            <p className="text-muted-foreground">{mockProposal.summary}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <div className="prose max-w-none">
              {mockProposal.details.split("\n").map((paragraph, index) => (
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
                Token Amount: {mockProposal.tokenRequest} tokens
              </p>
              <div className="prose max-w-none">
                {mockProposal.fundingPlan.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Expected Outcome</h2>
            <p className="text-muted-foreground">{mockProposal.expectedOutcome}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
