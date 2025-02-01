"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// Mock data for demonstration
const mockDAOs = [
  { id: 1, name: "DeveloperDAO" },
  { id: 2, name: "ResearchDAO" },
  { id: 3, name: "CommunityDAO" },
]

const mockProposals = [
  {
    id: 1,
    daoId: 1,
    title: "Implement New Governance Model",
    type: "Governance",
    status: "Active",
    created: "2024-01-30",
    votes: { for: 120, against: 30 },
  },
  {
    id: 2,
    daoId: 1,
    title: "Community Fund Allocation",
    type: "Treasury",
    status: "Pending",
    created: "2024-01-29",
    votes: { for: 80, against: 40 },
  },
  {
    id: 3,
    daoId: 2,
    title: "Research Project Funding",
    type: "Treasury",
    status: "Active",
    created: "2024-01-28",
    votes: { for: 90, against: 20 },
  },
]

export default function ProposalList() {
  const [selectedDAO, setSelectedDAO] = useState<number | null>(null)

  const filteredProposals = selectedDAO
    ? mockProposals.filter(p => p.daoId === selectedDAO)
    : mockProposals

  return (
    <div className="space-y-6">
      {/* DAO Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDAO === null ? "default" : "outline"}
          onClick={() => setSelectedDAO(null)}
        >
          All DAOs
        </Button>
        {mockDAOs.map((dao) => (
          <Button
            key={dao.id}
            variant={selectedDAO === dao.id ? "default" : "outline"}
            onClick={() => setSelectedDAO(dao.id)}
          >
            {dao.name}
          </Button>
        ))}
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="border rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <Link
                  href={`/proposals/${proposal.id}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {proposal.title}
                </Link>
                <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                  <span>{mockDAOs.find(d => d.id === proposal.daoId)?.name}</span>
                  <span>•</span>
                  <span>{proposal.type}</span>
                  <span>•</span>
                  <span>Created {proposal.created}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    proposal.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {proposal.status}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="text-sm">
                  <span className="text-green-600">{proposal.votes.for} For</span>
                  <span className="mx-2">|</span>
                  <span className="text-red-600">{proposal.votes.against} Against</span>
                </div>
              </div>
              <Link href={`/proposals/${proposal.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
