import { Metadata } from "next"
import { ProposalDetail } from "@/components/proposals/proposal-detail"

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
  history: [
    {
      id: 1,
      date: "2024-01-30",
      status: "Created",
      summary: "Proposal submitted for review",
      aiaMeeting: {
        id: "M001",
        participants: ["Coordinator", "Auditor", "Researcher"],
        summary: "Initial review completed, proceeding to voting phase"
      }
    },
    {
      id: 2,
      date: "2024-01-31",
      status: "Under Review",
      summary: "AIA Committee meeting conducted",
      aiaMeeting: {
        id: "M002",
        participants: ["Coordinator", "Auditor", "Researcher", "Financial Controller"],
        summary: "Detailed analysis of proposal impact and feasibility"
      }
    },
    {
      id: 3,
      date: "2024-02-01",
      status: "Active",
      summary: "Proposal approved for community voting",
      aiaMeeting: {
        id: "M003",
        participants: ["All Committee Members"],
        summary: "Final approval granted with conditions"
      }
    }
  ]
}

export default function ProposalPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <ProposalDetail proposal={mockProposal} />
    </div>
  )
}
