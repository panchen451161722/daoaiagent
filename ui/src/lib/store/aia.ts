import { create } from "zustand"

interface AIAPermission {
  id: string
  name: string
  description: string
}

interface AIAAbility {
  id: string
  title: string
  description: string
}

interface AIAActivity {
  id: string
  date: string
  daoName: string
  action: string
  status: 'Completed' | 'In Progress' | 'Failed'
}

interface AIAStats {
  activeDAOs: number
  totalMeetings: number
  proposalsCoordinated: number
  successRate: string
}

interface AIA {
  id: string
  role: string
  type: 'Internal' | 'Public'
  emoji: string
  description: string
  permissions: string[]
  abilities?: string[]
  recentActivities?: AIAActivity[]
  stats?: AIAStats
  activeDAOs: number
  totalMeetings: number
  recentActivity?: string
}

interface AIAStore {
  aias: AIA[]
  permissions: AIAPermission[]
  abilities: AIAAbility[]
  getAIAById: (id: string) => AIA | undefined
}

export const useAIAStore = create<AIAStore>((set, get) => ({
  aias: [
    {
      id: "1",
      role: "Proposal Coordinator",
      type: "Internal",
      emoji: "📋",
      description: "Coordinates proposal reviews and voting processes",
      activeDAOs: 3,
      totalMeetings: 45,
      recentActivity: "Coordinated DeFi DAO governance model review",
      permissions: [
        "create_proposal",
        "review_proposal",
        "create_meeting",
        "moderate_discussion"
      ],
      recentActivities: [
        {
          id: "act1",
          date: "2024-01-30",
          daoName: "DeFi DAO",
          action: "Coordinated governance model review",
          status: "Completed"
        },
        {
          id: "act2",
          date: "2024-01-29",
          daoName: "NFT Creators",
          action: "Initiated proposal review process",
          status: "In Progress"
        },
        {
          id: "act3",
          date: "2024-01-28",
          daoName: "Gaming Guild",
          action: "Updated proposal status",
          status: "Completed"
        }
      ],
      stats: {
        activeDAOs: 3,
        totalMeetings: 45,
        proposalsCoordinated: 28,
        successRate: "92%"
      }
    },
    {
      id: "2",
      role: "Auditor",
      type: "Internal",
      emoji: "",
      description: "Reviews and validates proposal compliance",
      activeDAOs: 5,
      totalMeetings: 78,
      recentActivity: "Completed risk assessment for NFT verification system",
      permissions: ["review_proposal", "vote_proposal"]
    },
    {
      id: "3",
      role: "Technical Advisor",
      type: "Public",
      emoji: "",
      description: "Provides technical expertise and feasibility assessment",
      activeDAOs: 8,
      totalMeetings: 92,
      recentActivity: "Evaluated gaming integration requirements",
      permissions: ["review_proposal", "vote_proposal"]
    },
    {
      id: "4",
      role: "Financial Controller",
      type: "Public",
      emoji: "",
      description: "Oversees financial aspects and treasury management",
      activeDAOs: 6,
      totalMeetings: 63,
      recentActivity: "Reviewed Q1 treasury allocation proposals",
      permissions: ["manage_funds", "review_proposal"]
    }
  ],
  permissions: [
    {
      id: "create_proposal",
      name: "Create Proposals",
      description: "Can create new proposals in the DAO"
    },
    {
      id: "review_proposal",
      name: "Review Proposals",
      description: "Can review and comment on proposals"
    },
    {
      id: "vote_proposal",
      name: "Vote on Proposals",
      description: "Can cast votes on proposals"
    },
    {
      id: "execute_proposal",
      name: "Execute Proposals",
      description: "Can execute approved proposals"
    },
    {
      id: "manage_members",
      name: "Manage Members",
      description: "Can add or remove DAO members"
    },
    {
      id: "manage_funds",
      name: "Manage Funds",
      description: "Can manage DAO treasury and funds"
    },
    {
      id: "create_meeting",
      name: "Create Meetings",
      description: "Can schedule and create new meetings"
    },
    {
      id: "moderate_discussion",
      name: "Moderate Discussions",
      description: "Can moderate DAO discussions and forums"
    }
  ],
  abilities: [
    {
      id: "proposal_analysis",
      title: "Proposal Analysis",
      description: "Analyze proposals for technical feasibility, risks, and alignment with DAO objectives"
    },
    {
      id: "code_review",
      title: "Code Review",
      description: "Review smart contract code and technical implementations for security and best practices"
    },
    {
      id: "financial_analysis",
      title: "Financial Analysis",
      description: "Analyze financial implications, budget requirements, and economic impact"
    },
    {
      id: "governance_optimization",
      title: "Governance Optimization",
      description: "Suggest improvements to governance processes and voting mechanisms"
    },
    {
      id: "risk_assessment",
      title: "Risk Assessment",
      description: "Identify and evaluate potential risks in proposals and operations"
    },
    {
      id: "community_engagement",
      title: "Community Engagement",
      description: "Analyze community sentiment and facilitate discussions"
    }
  ],
  getAIAById: (id) => get().aias.find((aia) => aia.id === id)
}))
