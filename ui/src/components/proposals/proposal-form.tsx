"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ProposalFormProps {
  daoId: string
}

export default function ProposalForm({ daoId }: ProposalFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "treasury",
    summary: "",
    details: "",
    beneficiary: "",
    fundingAmount: "",
    releasePercentage: "",
    fundingPlan: "",
    expectedOutcome: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log(formData)
  }

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

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Submit Proposal
        </Button>
      </div>
    </form>
  )
}
