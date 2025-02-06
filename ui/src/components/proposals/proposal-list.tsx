"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DAOSelectDialog } from "./dao-select-dialog"
import { useState } from "react"

// Mock data for demonstration
const mockDAOs = [
  { id: 1, name: "DeveloperDAO" },
  { id: 2, name: "ResearchDAO" },
  { id: 3, name: "CommunityDAO" },
]

const mockProposals = [
  {
    id: 1390,
    daoId: 1,
    title: "Talisman - Mobile Wallet Proposal",
    type: "Treasury",
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
    type: "Treasury",
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
    type: "Research",
    status: "Finalized",
    created: "2025-01-14",
    creator: {
      name: "Research Working Group",
      address: "0xabcd...efgh"
    },
    fundingAmount: "250,000 USDC",
    releasePercentage: "100%",
  },
]

export default function ProposalList() {
  const [selectedDAO, setSelectedDAO] = useState<number | null>(null)

  const filteredProposals = selectedDAO
    ? mockProposals.filter(p => p.daoId === selectedDAO)
    : mockProposals

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold"></h1>
        <DAOSelectDialog
          selectedDAO={selectedDAO}
          setSelectedDAO={setSelectedDAO}
          daoOptions={mockDAOs}
        />
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/proposals/${proposal.id}`}
                    className="text-xl font-semibold hover:underline"
                  >
                    Proposal #{proposal.id}: {proposal.title}
                  </Link>
                  <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                    <span>{mockDAOs.find(d => d.id === proposal.daoId)?.name}</span>
                    <span>•</span>
                    <span>{proposal.type}</span>
                    <span>•</span>
                    <span>Created {proposal.created}</span>
                    <span>•</span>
                    <span>by {proposal.creator.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    <div>{proposal.fundingAmount}</div>
                    <div>Release: {proposal.releasePercentage}</div>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {proposal.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No proposals yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first proposal</p>
          </div>
        )}
      </div>
    </div>
  )
}
