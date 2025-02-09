import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AIA {
  id: string
  name: string
  avatar: string
  type: 'Internal' | 'Public'
  status: 'Active' | 'Inactive'
}

export interface ProcessConfig {
  enabled: boolean
  params: Record<string, string | number>
}

export interface DAO {
  id: number
  name: string
  description: string
  logo?: string
  treasury: string
  members: number
  activeProposals: number
  proposals?: number
  totalFunding?: string
  status?: string
  votingPower?: string
  website?: string
  github?: string
  discord?: string
  twitter?: string
  tokenSymbol?: string
  initialSupply?: string
  objective?: string
  values?: string
  aias?: AIA[]
  processes?: {
    proposal?: ProcessConfig
    treasury?: ProcessConfig
    membership?: ProcessConfig
  }
}

export interface ProposalHistory {
  id: number
  date: string
  type: 'status' | 'meeting'
  title: string
  description: string
  meetingId?: string
  participants?: string[]
}

interface Creator {
  name: string
  address?: string
  avatar?: string
}

interface Beneficiary {
  name: string
  avatar?: string
}

export interface Proposal {
  id: number
  daoId: number
  title: string
  type: 'treasury' | 'research' | 'governance' | 'technical'
  status: 'Proposed' | 'Active' | 'Executing' | 'Completed' | 'Failed'
  created: string
  creator: Creator
  beneficiary?: Beneficiary
  funding?: {
    amount: number
    currency: string
    releasePercentage: number
  }
  summary?: string
  details?: string
  fundingPlan?: string
  expectedOutcome?: string
  history?: ProposalHistory[]
}

export interface MeetingParticipant {
  role: string
  name: string
  avatar: string
  address?: string
  vote?: string
  comments?: string
}

export interface DiscussionItem {
  speaker: {
    role: string
    name: string
    avatar: string
  }
  content: string
}

export interface Meeting {
  id: string
  daoId: string
  daoName: string
  proposalId: string
  proposalTitle: string
  date: string
  status: 'Scheduled' | 'In Progress' | 'Completed'
  participants?: MeetingParticipant[]
  summary?: string
  discussion?: DiscussionItem[]
  decisions?: string[]
  nextSteps?: string[]
  discussionHistory?: string[]
  finalDecision?: {
    decision: string
    justification: string
  }
  votes?: Record<string, string>
}

interface DAOStore {
  daos: DAO[]
  proposals: Proposal[]
  meetings: Meeting[]
  addDAO: (dao: DAO) => void
  addProposal: (proposal: Proposal) => void
  addMeeting: (meeting: Meeting) => void
  getDAOById: (id: number) => DAO | undefined
  getProposalById: (id: number) => Proposal | undefined
  getMeetingById: (id: string) => Meeting | undefined
  getProposalsByDAOId: (daoId: number) => Proposal[]
  getMeetingsByProposalId: (proposalId: string) => Meeting[]
}

// Initial data
const initialDAOs: DAO[] = [
  {
    id: 1,
    name: "DeFi DAO",
    description: "Advancing decentralized finance initiatives",
    treasury: "1.5M USDC",
    members: 1200,
    activeProposals: 8,
    proposals: 24,
    totalFunding: "5.2M USDC",
    status: "Active",
    votingPower: "25K veDAO",
    website: "https://defidao.xyz",
    github: "https://github.com/defidao",
    discord: "https://discord.gg/defidao",
    twitter: "https://twitter.com/defidao",
    tokenSymbol: "DEFI",
    initialSupply: "1000000",
    objective: "To advance decentralized finance through community-driven governance",
    values: "Transparency, Innovation, Community-First",
    aias: [
      {
        id: "1",
        name: "Proposal Coordinator",
        avatar: "/aia/coordinator.png",
        type: "Internal",
        status: "Active"
      },
      {
        id: "2",
        name: "Technical Advisor",
        avatar: "/aia/advisor.png",
        type: "Public",
        status: "Active"
      },
      {
        id: "3",
        name: "Financial Controller",
        avatar: "/aia/controller.png",
        type: "Internal",
        status: "Inactive"
      }
    ],
    processes: {
      proposal: {
        enabled: true,
        params: {
          proposalPeriod: "7 days",
          votingPeriod: "3 days",
          executionDelay: "1 day"
        }
      },
      treasury: {
        enabled: true,
        params: {
          maxSpend: "100000 USDC",
          approvalThreshold: "66%"
        }
      },
      membership: {
        enabled: true,
        params: {
          joinThreshold: "1000 DEFI",
          kickThreshold: "75%"
        }
      }
    }
  },
  {
    id: 2,
    name: "ResearchDAO",
    description: "Funding blockchain research and development",
    treasury: "2.8M USDC",
    members: 800,
    activeProposals: 5,
    proposals: 18,
    totalFunding: "3.8M USDC",
    status: "Active",
    votingPower: "15K veDAO",
    tokenSymbol: "RSRCH",
    initialSupply: "500000",
    objective: "To advance blockchain technology through funded research",
    values: "Innovation, Collaboration, Open Source",
    aias: []
  },
  {
    id: 3,
    name: "CommunityDAO",
    description: "Building and nurturing the Web3 community",
    treasury: "950K USDC",
    members: 1500,
    activeProposals: 12,
    proposals: 32,
    totalFunding: "2.1M USDC",
    status: "Active",
    votingPower: "18K veDAO",
    tokenSymbol: "COMM",
    initialSupply: "2000000",
    objective: "To grow and support the Web3 community",
    values: "Community, Education, Inclusivity",
    aias: []
  },
]

const initialProposals: Proposal[] = [
  {
    id: 1390,
    daoId: 1,
    title: "Ledger - Hardware Wallet SDK Integration",
    type: "treasury",
    status: "Proposed",
    created: "2025-01-16",
    creator: {
      name: "Crypto Dragon | Ledger",
      avatar: "🐉"
    },
    beneficiary: {
      name: "16q8...gAQT",
      avatar: "🐉"
    },
    funding: {
      amount: 598100,
      currency: "USDT",
      releasePercentage: 40
    },
    summary: "This proposal seeks funding for integrating Ledger hardware wallet SDK for enhanced security.",
    details: "We aim to place the distinctive Ledger security features into the hands of our current and future users – to transform their web3 journey with a seamless hardware wallet integration. The Ledger SDK will be a new product that will work seamlessly with the existing Ledger hardware wallets and Ledger Live application. This is a proactive proposal that seeks US$598,100 in USDT for development of the SDK integration (from Mar 2025 to Sep 2025).",
    fundingPlan: "The requested funding will be allocated as follows:\n- Development Team (60%): $358,860\n  - SDK Integration Development\n  - UI/UX Design\n  - Testing and QA\n- Security Audits (20%): $119,620\n  - Kudelski Security Review\n  - NCC Group Penetration Testing\n- Marketing & User Acquisition (15%): $89,715\n  - Kraken Launch Campaign\n  - Gemini Community Engagement\n- Contingency (5%): $29,905",
    expectedOutcome: "Key deliverables and milestones:\n1. SDK integration with major hardware wallet models\n2. Seamless integration with existing Ledger Live\n3. Enhanced security features and user experience\n4. Increased user adoption and engagement\n5. Successful security audits and store approvals",
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
  },
  {
    id: 1389,
    daoId: 1,
    title: "Community Fund Allocation Q1 2025",
    type: "treasury",
    status: "Executing",
    created: "2025-01-15",
    creator: {
      name: "DAO Treasury Team",
      address: "0x9876...4321"
    },
    funding: {
      amount: 1000000,
      currency: "USDC",
      releasePercentage: 25
    },
    summary: "Quarterly allocation of funds for community development and growth initiatives",
  },
  {
    id: 1388,
    daoId: 2,
    title: "Research Project: Layer 2 Scalability",
    type: "research",
    status: "Proposed",
    created: "2025-01-14",
    creator: {
      name: "Research Working Group",
      address: "0xabcd...efgh"
    },
    funding: {
      amount: 250000,
      currency: "USDC",
      releasePercentage: 100
    },
    summary: "Research project focused on improving Layer 2 scalability solutions",
  }
]

const initialMeetings: Meeting[] = [
  {
    id: "M001",
    daoId: "1",
    daoName: "DeFi DAO",
    proposalId: "1390",
    proposalTitle: "Ledger - Hardware Wallet SDK Integration",
    date: "2024-01-30",
    status: "Completed",
    
        "discussionHistory": [
            "Round 1 - Financial Controller: The proposed budget of $52,000 should be re-evaluated in light of potential unforeseen expenses, especially considering the multi-phase implementation model which may increase costs if delays occur. Additionally, the reliance on fixed-price engagement might not sufficiently cover complications arising from technical risks during development, necessitating a contingency fund to mitigate these financial impacts.",
            "Round 1 - Technical Advisor: The proposal's technical risk mitigation heavily relies on established open-source libraries, which could introduce vulnerabilities if not actively maintained or regularly updated. Additionally, the timeline for security audits and testing does not account for potential identification of critical issues that could require significant rework, potentially impacting the entire project schedule.",
            "Round 1 - Chief Auditor: The proposal lacks clarity on the specific criteria for evaluating the 90% user satisfaction rate post-training, which is critical for measuring the effectiveness of the training program and ensuring compliance with user needs. Furthermore, the defined escalation procedures for incident response should be validated to ensure they align with organizational standards, as inadequate response measures could lead to compliance risks if incidents arise.",
            "Round 2 - Proposal Coordinator: The proposal should address the scalability of the dashboard, especially considering the expected growth in user engagement beyond the initial three teams mentioned—this could impact system performance and maintenance workload. Additionally, it would be prudent to outline how user feedback from the monthly surveys will be incorporated into ongoing improvements, ensuring that the project remains adaptive to user needs over time.",
            "Round 2 - Financial Controller: The proposal needs to explicitly outline the criteria for the success metrics related to cost efficiency, particularly how the projected 10% cost reduction in API usage will be achieved and monitored. Additionally, allocating a portion of the budget for unforeseen operational expenses or increased maintenance requirements given the complexity of the dashboard could enhance overall financial risk management.",
            "Round 2 - Technical Advisor: The proposal should include a formal risk assessment for the security audit phase, particularly regarding the potential delays in identifying security vulnerabilities that may require significant reengineering of the dashboard. Additionally, there should be a clearer plan for updating and maintaining the open-source libraries utilized, as neglecting this could lead to increased technical debt and vulnerabilities over time.",
            "Round 2 - Chief Auditor: The proposal lacks a comprehensive disaster recovery plan detailing how business continuity will be maintained in the event of a major system failure or data breach. Additionally, it should specify how compliance with emerging regulations on data privacy will be monitored post-implementation, to ensure the solution remains in line with evolving legal obligations.",
            "Round 3 - Proposal Coordinator: The proposal should explicitly define how training effectiveness will be measured and tied to user satisfaction, ensuring that this aligns with the criteria necessary for compliance and user adoption goals. Additionally, parameters for maintenance and support escalation during the initial three-month post-deployment phase should be detailed further to clarify how responsiveness to user issues and system performance will be managed effectively.",
            "Round 3 - Financial Controller: The proposal should consider outlining a detailed tracking mechanism for the financial metrics related to the 10% reduction in API costs to ensure transparency and accountability in monitoring these outcomes. Furthermore, given the potential for evolving technical needs, maintaining a flexible budget allocation for iterative development may be prudent in order to adapt to new requirements or challenges as they arise.",
            "Round 3 - Technical Advisor: The proposal should include a clear strategy for addressing potential compatibility issues with future updates of the underlying LLM APIs, which could impact the dashboard's functionality and require additional development efforts. Furthermore, the methodology for conducting the scheduled security audit needs to ensure that the assessment covers potential threats from external sources, not just compliance with internal standards.",
            "Round 3 - Chief Auditor: The proposal should include a clear framework for iterative updates based on user feedback and evolving compliance requirements, ensuring the dashboard adapts to both user needs and regulatory changes. Additionally, the approach to technical debt management over the project's lifecycle must be explicitly addressed to prevent vulnerabilities from accumulating due to outdated libraries or integrations.",
        ],
        "votes": {
            "Proposal Coordinator": "APPROVE",
            "Financial Controller": "APPROVE",
            "Technical Advisor": "APPROVE",
            "Chief Auditor": "REJECT",
        },
        "finalDecision": {
            "decision": "REJECT",
            "justification": "The proposal lacks clarity on evaluating success metrics, comprehensive disaster recovery, a detailed tracking mechanism for financial metrics, and strategies for technical debt management. These shortcomings present significant risks to the project, making it unfit for approval.",
        },
    nextSteps: [
      "Prepare community announcement",
      "Set up voting infrastructure",
      "Schedule follow-up review in 2 weeks"
    ]
  },
  {
    id: "M002",
    daoId: "2",
    daoName: "NFT Creators",
    proposalId: "P2",
    proposalTitle: "Artist Verification System",
    date: "2024-01-29",
    status: "Scheduled",
    participants: [
      {
        role: "Coordinator",
        name: "Proposal Coordinator",
        avatar: "/aia/coordinator.png"
      },
      {
        role: "Technical Advisor",
        name: "Technical Advisor",
        avatar: "/aia/advisor.png"
      }
    ],
    summary: "Technical review of verification system requirements"
  },
  {
    id: "M003",
    daoId: "3",
    daoName: "Gaming Guild",
    proposalId: "P3",
    proposalTitle: "New Game Integration",
    date: "2024-01-28",
    status: "In Progress",
    participants: [
      {
        role: "Coordinator",
        name: "Proposal Coordinator",
        avatar: "/aia/coordinator.png"
      },
      {
        role: "Researcher",
        name: "Technical Researcher",
        avatar: "/aia/researcher.png"
      },
      {
        role: "Financial Controller",
        name: "Financial Controller",
        avatar: "/aia/controller.png"
      }
    ],
    summary: "Evaluating integration costs and technical requirements"
  }
]

export const useDAOStore = create<DAOStore>()(
  persist(
    (set, get) => ({
      daos: initialDAOs,
      proposals: initialProposals,
      meetings: initialMeetings,
      addDAO: (dao) => set((state) => ({ daos: [...state.daos, dao] })),
      addProposal: (proposal) => set((state) => ({ proposals: [...state.proposals, proposal] })),
      addMeeting: (meeting) => set((state) => ({ meetings: [...state.meetings, meeting] })),
      getDAOById: (id) => get().daos.find(dao => dao.id === id),
      getProposalById: (id) => get().proposals.find(proposal => proposal.id === id),
      getMeetingById: (id) => get().meetings.find(meeting => meeting.id === id),
      getProposalsByDAOId: (daoId) => get().proposals.filter(proposal => proposal.daoId === daoId),
      getMeetingsByProposalId: (proposalId) => get().meetings.filter(meeting => meeting.proposalId === proposalId),
    }),
    {
      name: 'dao-storage',
    }
  )
)
