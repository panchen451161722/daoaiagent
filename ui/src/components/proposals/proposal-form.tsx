"use client"

import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SHA256 } from 'crypto-js'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useDAOStore } from "@/lib/store/dao"
import { daoFactoryABI, daoFactoryAddress } from "@/contracts/dao-factory"

interface ProposalFormProps {
  daoId: string
}

// Default proposal data for development
const defaultFormData = {
  title: "New Community Initiative",
  type: "governance",
  summary: "This proposal aims to improve community engagement through...",
  details: "We propose to implement the following initiatives:\n1. Weekly community calls\n2. Monthly governance workshops\n3. Educational content series",
  beneficiary: "0x1234567890123456789012345678901234567890",
  fundingAmount: "50000",
  releasePercentage: "25",
  fundingPlan: "Total budget: 50,000 USDC\n- Community management: 20,000 USDC\n- Content creation: 15,000 USDC\n- Technical infrastructure: 10,000 USDC\n- Contingency: 5,000 USDC",
  expectedOutcome: "Expected outcomes include:\n- 50% increase in active participation\n- Creation of 12 educational modules\n- Establishment of regular governance processes"
}

export default function ProposalForm({ daoId }: ProposalFormProps) {
  const router = useRouter()
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash, })
  const addProposal = useDAOStore(state => state.addProposal)
  const proposals = useDAOStore(state => state.proposals)
  const [formData, setFormData] = useState(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const contentHash = SHA256(JSON.stringify(formData)).toString()
      await writeContract({
        abi: daoFactoryABI,
        address: daoFactoryAddress,
        // functionName: 'createProposal',
        // args: [daoId, "0x"+contentHash]
        functionName: 'createDAO',
        args: ["0x1234567890123456789012345678901234567890", false,"0x"+contentHash]
      })
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create proposal")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!isConfirming && hash) {
      addProposal({
        id: proposals.length + 1,
        daoId: parseInt(daoId),
        title: formData.title,
        type: formData.type as 'treasury' | 'research' | 'governance' | 'technical',
        status: 'Proposed',
        created: new Date().toISOString(),
        creator: { name: 'Current User' },
        beneficiary: { name: formData.beneficiary },
        funding: {
          amount: parseInt(formData.fundingAmount),
          currency: 'USDC',
          releasePercentage: parseInt(formData.releasePercentage)
        },
        summary: formData.summary,
        details: formData.details,
        fundingPlan: formData.fundingPlan,
        expectedOutcome: formData.expectedOutcome
      })
      // router.push(`/daos/${daoId}/proposals`)
    }
  }, [isConfirming, hash, daoId, formData, proposals, addProposal, router])

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter proposal title"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Proposal Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="treasury">Treasury</option>
              <option value="research">Research</option>
              <option value="governance">Governance</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          <div>
            <Label htmlFor="summary">Brief Summary</Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="One-line summary of your proposal"
              required
            />
          </div>
          <div>
            <Label htmlFor="beneficiary">Beneficiary Address</Label>
            <Input
              id="beneficiary"
              value={formData.beneficiary}
              onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
              placeholder="0x..."
              required
            />
          </div>
        </div>
      </div>

      {/* Detailed Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Detailed Content</h2>
        <div>
          <Label htmlFor="details">Proposal Details</Label>
          <Textarea
            id="details"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Provide detailed information about your proposal"
            className="min-h-[200px]"
            required
          />
        </div>
      </div>

      {/* Funding Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Funding Details</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="fundingAmount">Funding Amount (USDC)</Label>
            <div className="relative">
              <Input
                id="fundingAmount"
                value={formData.fundingAmount}
                onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
                placeholder="e.g. 500,000"
                type="text"
                required
              />
              <span className="absolute right-3 top-2 text-sm text-muted-foreground">USDC</span>
            </div>
          </div>
          <div>
            <Label htmlFor="releasePercentage">Initial Release Percentage</Label>
            <div className="relative">
              <Input
                id="releasePercentage"
                value={formData.releasePercentage}
                onChange={(e) => setFormData({ ...formData, releasePercentage: e.target.value })}
                placeholder="e.g. 40"
                type="number"
                min="0"
                max="100"
                required
              />
              <span className="absolute right-3 top-2 text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <div>
            <Label htmlFor="fundingPlan">Funding Plan</Label>
            <Textarea
              id="fundingPlan"
              value={formData.fundingPlan}
              onChange={(e) => setFormData({ ...formData, fundingPlan: e.target.value })}
              placeholder="Describe how the funds will be used and the release schedule"
              className="min-h-[150px]"
              required
            />
          </div>
        </div>
      </div>

      {/* Expected Outcome */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Expected Outcome</h2>
        <div>
          <Label htmlFor="expectedOutcome">Expected Results</Label>
          <Textarea
            id="expectedOutcome"
            value={formData.expectedOutcome}
            onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
            placeholder="Describe the expected outcomes, deliverables, and success metrics"
            className="min-h-[150px]"
            required
          />
        </div>
      </div>

      {/* Submit Button and Status Messages */}
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
          </Button>
        </div>
      </div>

      {(isError || errorMessage) && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="text-sm font-medium">Failed to create DAO</p>
          {error && (
            <p className="text-sm mt-1 font-mono break-all">
              {error.message || error.toString()}
            </p>
          )}
          {errorMessage && (
            <p className="text-sm mt-1 font-mono break-all">
              {errorMessage}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {hash && <div className="bg-primary/10 p-4 rounded-lg">Transaction Hash: {hash}</div>}
        {isConfirming && <div className="bg-info/10 p-4 rounded-lg">Waiting for confirmation...</div>}
        {isConfirmed && <div className="bg-success/10 p-4 rounded-lg">Transaction confirmed.</div>}
      </div>
    </form>
  )
}
