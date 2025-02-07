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

export interface Proposal {
  id: number
  daoId: number
  title: string
  type: 'treasury' | 'research' | 'governance' | 'technical'
  status: 'Proposed' | 'Active' | 'Executing' | 'Completed' | 'Failed'
  created: string
  creator: {
    name: string
    address: string
  }
  fundingAmount: string
  releasePercentage: string
  description?: string
  votes?: {
    for: number
    against: number
    abstain: number
  }
  quorum?: number
  endTime?: string
}

interface DAOStore {
  daos: DAO[]
  proposals: Proposal[]
  selectedDAO: number | null
  setSelectedDAO: (id: number | null) => void
  addDAO: (dao: DAO) => void
  addProposal: (proposal: Proposal) => void
  getDAOById: (id: number) => DAO | undefined
  getProposalsByDAOId: (daoId: number) => Proposal[]
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
      address: "0x1234...5678"
    },
    fundingAmount: "500,000 USDC",
    releasePercentage: "40%",
    description: "Development of a mobile wallet application with integrated DAO governance features",
    votes: {
      for: 15000,
      against: 5000,
      abstain: 2000
    },
    quorum: 20000,
    endTime: "2025-02-16",
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
  },
]

export const useDAOStore = create<DAOStore>()(
  persist(
    (set, get) => ({
      daos: initialDAOs,
      proposals: initialProposals,
      selectedDAO: null,
      setSelectedDAO: (id) => set({ selectedDAO: id }),
      addDAO: (dao) => set((state) => ({ daos: [...state.daos, dao] })),
      addProposal: (proposal) => set((state) => ({ proposals: [...state.proposals, proposal] })),
      getDAOById: (id) => get().daos.find(dao => dao.id === id),
      getProposalsByDAOId: (daoId) => get().proposals.filter(proposal => proposal.daoId === daoId),
    }),
    {
      name: 'dao-storage',
    }
  )
)
