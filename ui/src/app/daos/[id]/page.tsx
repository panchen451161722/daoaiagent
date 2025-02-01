import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "DAO Details",
  description: "View DAO details and configuration",
}

// Mock data for demonstration
const mockDAO = {
  id: "1",
  name: "DeFi DAO",
  description: "A decentralized organization focused on DeFi governance and innovation",
  logo: "/dao-logo.png",
  tokenSymbol: "DEFI",
  initialSupply: "1000000",
  objective: "To advance decentralized finance through community-driven governance",
  values: "Transparency, Innovation, Community-First",
  treasury: "1.5M USDC",
  members: 1200,
  activeProposals: 8,
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
        proposalPeriod: 7,
        votingPeriod: 3,
        executionDelay: 1
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
}

interface PageProps {
  params: {
    id: string
  }
}

export default function DAODetailsPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{mockDAO.name}</h1>
              <p className="text-muted-foreground mt-2">{mockDAO.description}</p>
            </div>
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockDAO.logo} alt={mockDAO.name} />
              <AvatarFallback>{mockDAO.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold">{mockDAO.members}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Active Proposals</p>
              <p className="text-2xl font-bold">{mockDAO.activeProposals}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Treasury</p>
              <p className="text-2xl font-bold">{mockDAO.treasury}</p>
            </div>
          </div>
        </div>

        {/* Token Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Token Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Token Symbol</p>
              <p className="text-lg font-medium">{mockDAO.tokenSymbol}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Initial Supply</p>
              <p className="text-lg font-medium">{mockDAO.initialSupply}</p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mission</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Objective</p>
              <p>{mockDAO.objective}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Values</p>
              <p>{mockDAO.values}</p>
            </div>
          </div>
        </div>

        {/* AI Agents */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">AI Agents</h2>
            <Link href={`/aias/create?dao=${params.id}`}>
              <Button variant="outline">Add AIA</Button>
            </Link>
          </div>
          <div className="grid gap-4">
            {mockDAO.aias.map((aia) => (
              <div key={aia.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={aia.avatar} alt={aia.name} />
                      <AvatarFallback>{aia.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        href={`/aias/${aia.id}`}
                        className="font-medium hover:underline"
                      >
                        {aia.name}
                      </Link>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          aia.type === "Internal"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        )}>
                          {aia.type}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          aia.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        )}>
                          {aia.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/aias/${aia.id}`}>
                    <Button variant="ghost">View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Configuration */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Process Configuration</h2>
          <div className="grid gap-4">
            {Object.entries(mockDAO.processes).map(([key, process]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium capitalize">{key} Process</h3>
                    <p className="text-sm text-muted-foreground">
                      {process.enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(process.params).map(([paramKey, value]) => (
                    <div key={paramKey}>
                      <p className="text-sm text-muted-foreground capitalize">
                        {paramKey.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
