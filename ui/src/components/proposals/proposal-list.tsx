"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DAOSelectDialog } from "./dao-select-dialog"
import { useDAOStore } from "@/lib/store/dao"

export default function ProposalList() {
  const { proposals, daos } = useDAOStore()
  const [selectedDAO, setSelectedDAO] = useState<number | null>(null)
  const filteredProposals = selectedDAO 
    ? proposals.filter(p => p.daoId === selectedDAO)
    : proposals

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold"></h1>
        <DAOSelectDialog
          selectedDAO={selectedDAO}
          setSelectedDAO={setSelectedDAO}
          daoOptions={daos}
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
                    <span>{daos.find(d => d.id === proposal.daoId)?.name}</span>
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
                    <div>{proposal.funding?.amount}</div>
                    <div>Release: {proposal.funding?.releasePercentage}</div>
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
            <DAOSelectDialog
              selectedDAO={selectedDAO}
              setSelectedDAO={setSelectedDAO}
              daoOptions={daos}
            />
          </div>
        )}
      </div>
    </div>
  )
}
