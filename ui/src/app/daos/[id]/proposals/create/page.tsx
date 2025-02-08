"use client"

import { use } from "react"
import ProposalForm from "@/components/proposals/proposal-form"
import { useDAOStore } from "@/lib/store/dao"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function CreateProposalPage({ params }: PageProps) {
  const { id } = use(params)
  const { getDAOById } = useDAOStore()
  const dao = getDAOById(Number(id))

  if (!dao) {
    return <div>DAO not found</div>
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* DAO Information */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{dao.name}</h1>
              <p className="text-muted-foreground mt-2">{dao.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold">{dao.members}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Treasury</p>
              <p className="text-2xl font-bold">{dao.treasury}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Active Proposals</p>
              <p className="text-2xl font-bold">{dao.activeProposals}</p>
            </div>
          </div>
        </div>

        {/* Proposal Form */}
        <ProposalForm daoId={id} />
      </div>
    </div>
  )
}
