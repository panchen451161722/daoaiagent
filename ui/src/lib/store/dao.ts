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
}

interface Creator {
  name: string
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
  participants: MeetingParticipant[]
  summary: string
  discussion?: DiscussionItem[]
  decisions?: string[]
  nextSteps?: string[]
}

interface DAOStore {
  daos: DAO[]
  proposals: Proposal[]
  meetings: Meeting[]
  selectedDAO: number | null
  setSelectedDAO: (id: number | null) => void
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
    title: "Talisman - Mobile Wallet Proposal",
    type: "treasury",
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
    details: "We aim to place the distinctive Talisman user experience into the hands of our current and future users – to transform their web3 journey with a seamless mobile app experience. The Talisman mobile wallet will be a new product that will work seamlessly with the existing Talisman browser extension wallet and Portal web application. This is a proactive proposal that seeks US$598,100 in USDT for development of the mobile app (from Mar 2025 to Sep 2025).",
    fundingPlan: "The requested funding will be allocated as follows:\n- Development Team (60%): $358,860\n  - Mobile App Development\n  - UI/UX Design\n  - Testing and QA\n- Security Audits (20%): $119,620\n  - External Security Review\n  - Penetration Testing\n- Marketing & User Acquisition (15%): $89,715\n  - Launch Campaign\n  - Community Engagement\n- Contingency (5%): $29,905",
    expectedOutcome: "Key deliverables and milestones:\n1. iOS and Android mobile wallet apps with core functionality\n2. Seamless integration with existing Talisman extension\n3. Enhanced security features and user experience\n4. Increased user adoption and engagement\n5. Successful security audits and app store approvals",
    votes: {
      for: 15000,
      against: 5000,
      abstain: 2000
    },
    quorum: 20000,
    endTime: "2025-02-16",
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
    fundingAmount: "1,000,000 USDC",
    releasePercentage: "25%",
    description: "Quarterly allocation of funds for community development and growth initiatives",
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
    fundingAmount: "250,000 USDC",
    releasePercentage: "100%",
    description: "Research project focused on improving Layer 2 scalability solutions",
  }
]

const initialMeetings: Meeting[] = [
  {
    id: "M001",
    daoId: "1",
    daoName: "DeFi DAO",
    proposalId: "1390",
    proposalTitle: "Talisman - Mobile Wallet Proposal",
    date: "2024-01-30",
    status: "Completed",
    participants: [
      {
        role: "Coordinator",
        name: "Proposal Coordinator",
        avatar: "/aia/coordinator.png",
        address: "0x1234...5678",
        vote: "Approve",
        comments: "The proposal aligns with our governance objectives"
      },
      {
        role: "Auditor",
        name: "Risk Auditor",
        avatar: "/aia/auditor.png",
        address: "0x2345...6789",
        vote: "Approve",
        comments: "Risk assessment shows acceptable levels"
      },
      {
        role: "Researcher",
        name: "Technical Researcher",
        avatar: "/aia/researcher.png",
        address: "0x3456...7890",
        vote: "Approve",
        comments: "Technical implementation appears feasible"
      }
    ],
    summary: "Initial review completed, proceeding to voting phase",
    discussion: [
      {
        speaker: {
          role: "Coordinator",
          name: "Proposal Coordinator",
          avatar: "/aia/coordinator.png"
        },
        content: "Meeting called to order. Today we will review proposal #123 regarding the new governance model."
      },
      {
        speaker: {
          role: "Researcher",
          name: "Technical Researcher",
          avatar: "/aia/researcher.png"
        },
        content: "Based on my analysis, the proposed changes are technically sound and can be implemented within the suggested timeframe."
      },
      {
        speaker: {
          role: "Auditor",
          name: "Risk Auditor",
          avatar: "/aia/auditor.png"
        },
        content: "I've reviewed the potential risks. The main concerns are..."
      },
      {
        speaker: {
          role: "Coordinator",
          name: "Proposal Coordinator",
          avatar: "/aia/coordinator.png"
        },
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
      selectedDAO: null,
      setSelectedDAO: (id) => set({ selectedDAO: id }),
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
