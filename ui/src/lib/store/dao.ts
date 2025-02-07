import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DAO {
  id: number
  name: string
  description: string
  logo?: string
  treasury: string
  members: number
  activeProposals: number
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
}

interface DAOStore {
  daos: DAO[]
  proposals: Proposal[]
  selectedDAO: number | null
  setSelectedDAO: (id: number | null) => void
  addDAO: (dao: DAO) => void
  addProposal: (proposal: Proposal) => void
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
  },
  {
    id: 2,
    name: "ResearchDAO",
    description: "Funding blockchain research and development",
    treasury: "2.8M USDC",
    members: 800,
    activeProposals: 5,
  },
  {
    id: 3,
    name: "CommunityDAO",
    description: "Building and nurturing the Web3 community",
    treasury: "950K USDC",
    members: 1500,
    activeProposals: 12,
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
  },
]

export const useDAOStore = create<DAOStore>()(
  persist(
    (set) => ({
      daos: initialDAOs,
      proposals: initialProposals,
      selectedDAO: null,
      setSelectedDAO: (id) => set({ selectedDAO: id }),
      addDAO: (dao) => set((state) => ({ daos: [...state.daos, dao] })),
      addProposal: (proposal) => set((state) => ({ proposals: [...state.proposals, proposal] })),
    }),
    {
      name: 'dao-storage',
    }
  )
)
