import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProposalList from "@/components/proposals/proposal-list"

export const metadata: Metadata = {
  title: "Proposals",
  description: "View and manage DAO proposals",
}

export default function ProposalsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">View and manage DAO proposals</p>
        </div>
        <Link href="/proposals/create">
          <Button>Create Proposal</Button>
        </Link>
      </div>
      <ProposalList />
    </div>
  )
}
