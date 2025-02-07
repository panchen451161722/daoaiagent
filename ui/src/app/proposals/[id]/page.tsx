"use client"

import { use } from "react"
import { ProposalDetail } from "@/components/proposals/proposal-detail"
import { useDAOStore } from "@/lib/store/dao"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProposalPage({ params }: PageProps) {
  const { id } = use(params)
  const { getProposalById } = useDAOStore()
  const proposal = getProposalById(Number(id))

  if (!proposal) {
    return <div>Proposal not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <ProposalDetail proposal={proposal} />
      </div>
    </div>
  )
}
