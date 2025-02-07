"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProposalList from "@/components/proposals/proposal-list"

export default function ProposalsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">View and manage DAO proposals</p>
        </div>
      </div>
      <ProposalList />
    </div>
  )
}
