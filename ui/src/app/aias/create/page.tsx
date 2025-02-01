import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Create AIA",
  description: "Create a new AI Agent",
}

const abilities = [
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
]

const permissions = [
  {
    id: "create_proposal",
    title: "Create Proposals",
    description: "Can create new proposals in the DAO"
  },
  {
    id: "review_proposal",
    title: "Review Proposals",
    description: "Can review and comment on proposals"
  },
  {
    id: "vote_proposal",
    title: "Vote on Proposals",
    description: "Can cast votes on proposals"
  },
  {
    id: "execute_proposal",
    title: "Execute Proposals",
    description: "Can execute approved proposals"
  },
  {
    id: "create_meeting",
    title: "Create Meetings",
    description: "Can schedule and create new meetings"
  },
  {
    id: "moderate_discussion",
    title: "Moderate Discussions",
    description: "Can moderate DAO discussions and forums"
  }
]

export default function CreateAIAPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create AI Agent</h1>
          <p className="text-muted-foreground mt-2">Configure a new AI Agent for your DAO</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="e.g., Technical Advisor" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the role and responsibilities of this AI Agent"
                />
              </div>
            </div>
          </div>

          {/* Prompt Configuration */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Prompt Configuration</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea 
                  id="system-prompt" 
                  placeholder="Define the core behavior and principles of the AI Agent"
                  className="min-h-[150px]"
                />
              </div>
              <div>
                <Label htmlFor="example-conversations">Example Conversations</Label>
                <Textarea 
                  id="example-conversations" 
                  placeholder="Provide example conversations to guide the AI Agent's responses"
                  className="min-h-[150px]"
                />
              </div>
            </div>
          </div>

          {/* Abilities */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Abilities</h2>
            <div className="space-y-2">
              {abilities.map((ability) => (
                <div key={ability.id} className="flex items-start space-x-2">
                  <Checkbox id={ability.id} />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={ability.id}>{ability.title}</Label>
                    <p className="text-sm text-muted-foreground">
                      {ability.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Permissions</h2>
            <div className="space-y-2">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-2">
                  <Checkbox id={permission.id} />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={permission.id}>{permission.title}</Label>
                    <p className="text-sm text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">Create AI Agent</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
