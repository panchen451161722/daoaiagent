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

interface AIAPrompt {
  type: 'system' | 'human'
  content: string
  description?: string
}

interface AIA {
  id: string
  role: string
  type: 'Internal' | 'Public'
  emoji: string
  description: string
  prompts: AIAPrompt[]
  abilities?: string[]
  recentActivities?: AIAActivity[]
  stats?: AIAStats
  activeDAOs: number
  totalMeetings: number
  recentActivity?: string
}

interface AIAStore {
  aias: AIA[]
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
      description: "Responsible for proposal routing, prioritization, and ensuring proper format and completeness.",
      prompts: [
        {
          type: "system",
          content: "You are a Proposal Coordinator responsible for routing and prioritizing proposals.",
          description: "Core role definition"
        },
        {
          type: "human",
          content: "Review the proposal:\n{proposal}\n\nProvide routing recommendations based on the content and priority.",
          description: "Routing instruction template"
        }
      ],
      activeDAOs: 3,
      totalMeetings: 45,
      recentActivity: "Coordinated DeFi DAO governance model review",
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
        }
      ]
    },
    {
      id: "2",
      role: "Chief Auditor",
      type: "Internal",
      emoji: "🔍",
      description: "Final veto authority, responsible for overall compliance and risk assessment.",
      prompts: [
        {
          type: "system",
          content: "You are the Chief Auditor with veto power. You can only REJECT a proposal if you find serious compliance or risk issues.",
          description: "Core role and authority"
        },
        {
          type: "human",
          content: "Review discussions and votes:\n{discussion_history}\n\nVotes: {votes}\nApprove: {approve_count}\nReject: {reject_count}\n\nProposal: {proposal}",
          description: "Decision template with vote summary"
        }
      ],
      activeDAOs: 5,
      totalMeetings: 78,
      recentActivity: "Completed risk assessment for NFT verification system"
    },
    {
      id: "3",
      role: "Technical Advisor",
      type: "Public",
      emoji: "💻",
      description: "Responsible for technical risk assessment and implementation feasibility.",
      prompts: [
        {
          type: "system",
          content: "You are a Technical Advisor responsible for assessing technical risks and feasibility.",
          description: "Core role definition"
        },
        {
          type: "human",
          content: "Review the technical implementation:\n{implementation}\n\nProvide feedback on technical risks and feasibility.",
          description: "Technical assessment template"
        }
      ],
      activeDAOs: 8,
      totalMeetings: 92,
      recentActivity: "Evaluated gaming integration requirements"
    },
    {
      id: "4",
      role: "Financial Controller",
      type: "Public",
      emoji: "💰",
      description: "Responsible for budget enforcement and financial risk assessment.",
      prompts: [
        {
          type: "system",
          content: "You are a Financial Controller responsible for enforcing budget and assessing financial risks.",
          description: "Core role definition"
        },
        {
          type: "human",
          content: "Review the financial proposal:\n{proposal}\n\nProvide feedback on budget and financial risks.",
          description: "Financial assessment template"
        }
      ],
      activeDAOs: 6,
      totalMeetings: 63,
      recentActivity: "Reviewed Q1 treasury allocation proposals"
    },
    {
      id: "5",
      role: "Proposal Checker",
      type: "Internal",
      emoji: "✅",
      description: "Responsible for initial proposal validation and quick risk assessment.",
      prompts: [
        {
          type: "system",
          content: "You are a Proposal Checker responsible for validating proposals and assessing quick risks.",
          description: "Core role definition"
        },
        {
          type: "human",
          content: "Review the proposal:\n{proposal}\n\nProvide feedback on validation and quick risks.",
          description: "Validation template"
        }
      ],
      activeDAOs: 4,
      totalMeetings: 55,
      recentActivity: "Completed initial validation of 3 new proposals"
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
