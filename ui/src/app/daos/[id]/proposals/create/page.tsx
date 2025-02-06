"use client"

import { use } from "react"
import ProposalForm from "@/components/proposals/proposal-form"

// Mock data for demonstration
const mockDAO = {
  id: "1",
  name: "DeFi DAO",
  description: "A decentralized organization focused on DeFi governance and innovation",
  logo: "/dao-logo.png",
  treasury: "1.5M USDC",
  members: 1200,
  activeProposals: 8,
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function CreateProposalPage({ params }: PageProps) {
  const { id } = use(params)
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* DAO Information */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{mockDAO.name}</h1>
              <p className="text-muted-foreground mt-2">{mockDAO.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold">{mockDAO.members}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Treasury</p>
              <p className="text-2xl font-bold">{mockDAO.treasury}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Active Proposals</p>
              <p className="text-2xl font-bold">{mockDAO.activeProposals}</p>
            </div>
          </div>
        </div>

        {/* Proposal Form */}
        <ProposalForm daoId={id} />
      </div>
    </div>
  )
}
