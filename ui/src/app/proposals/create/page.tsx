import { Metadata } from "next"
import ProposalForm from "@/components/proposals/proposal-form"

export const metadata: Metadata = {
  title: "Create Proposal",
  description: "Submit a new proposal to the DAO",
}

export default function CreateProposalPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Create Proposal</h1>
        <p className="text-muted-foreground">
          Submit a new proposal to the DAO for consideration.
        </p>
        <ProposalForm />
      </div>
    </div>
  )
}
