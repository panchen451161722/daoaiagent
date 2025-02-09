"use client"

import { use } from "react"
import ProposalForm from "@/components/proposals/proposal-form"
import { useDAOStore } from "@/lib/store/dao"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
        <h1 className="text-3xl font-bold">Create Proposal</h1>

        {/* DAO Information */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            {dao.logo && (
              <Avatar className="h-16 w-16">
                <AvatarImage src={dao.logo} alt={dao.name} />
                <AvatarFallback>{dao.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{dao.name}</h2>
              <p className="text-muted-foreground mt-1">{dao.description}</p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="font-medium">{dao.members}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Treasury</p>
                  <p className="font-medium">{dao.treasury}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Proposals</p>
                  <p className="font-medium">{dao.activeProposals}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Proposal Form */}
        <ProposalForm daoId={id} />
      </div>
    </div>
  )
}
