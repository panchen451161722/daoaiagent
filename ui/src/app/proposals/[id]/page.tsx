import { Metadata } from "next"
import { ProposalDetail } from "@/components/proposals/proposal-detail"

export const metadata: Metadata = {
  title: "Proposal Details",
  description: "View proposal details and status",
}

// Mock data for demonstration
const mockProposal = {
  id: 1390,
  title: "Talisman - Mobile Wallet Proposal",
  type: "Treasury",
  status: "Proposed",
  created: "2025-01-16",
  creator: {
    name: "Warp Lizard | Talisman",
    avatar: "🦎"
  },
  beneficiary: {
    name: "16q8...gAQT",
    avatar: "🦎"
  },
  funding: {
    amount: 598100,
    currency: "USDT",
    releasePercentage: 40
  },
  summary: "This proposal seeks funding for a Talisman mobile wallet for both iOS and Android.",
  details: `We aim to place the distinctive Talisman user experience into the hands of our current and future users – to transform their web3 journey with a seamless mobile app experience. The Talisman mobile wallet will be a new product that will work seamlessly with the existing Talisman browser extension wallet and Portal web application. This is a proactive proposal that seeks US$598,100 in USDT for development of the mobile app (from Mar 2025 to Sep 2025).`,
  fundingPlan: `The requested funding will be allocated as follows:
- Development Team (60%): $358,860
  - Mobile App Development
  - UI/UX Design
  - Testing and QA
- Security Audits (20%): $119,620
  - External Security Review
  - Penetration Testing
- Marketing & User Acquisition (15%): $89,715
  - Launch Campaign
  - Community Engagement
- Contingency (5%): $29,905`,
  expectedOutcome: `Key deliverables and milestones:
1. iOS and Android mobile wallet apps with core functionality
2. Seamless integration with existing Talisman extension
3. Enhanced security features and user experience
4. Increased user adoption and engagement
5. Successful security audits and app store approvals`,
  history: [
    {
      id: 1,
      date: "2025-01-16",
      type: "status",
      title: "Proposal Created",
      description: "Proposal submitted for review"
    },
    {
      id: 2,
      date: "2025-01-16",
      type: "meeting",
      title: "Initial Review Meeting",
      description: "AIA Committee conducted initial review",
      meetingId: "M001",
      participants: ["Coordinator", "Auditor", "Researcher"]
    },
    {
      id: 3,
      date: "2025-01-17",
      type: "status",
      title: "Status Changed to Deciding",
      description: "Proposal moved to community voting phase"
    }
  ]
}

export default function ProposalPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <ProposalDetail proposal={mockProposal} />
      </div>
    </div>
  )
}
