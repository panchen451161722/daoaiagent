"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ProposalForm() {
  const [formData, setFormData] = useState({
    title: "",
    type: "general",
    summary: "",
    details: "",
    tokenAmount: "",
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
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Proposal Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter proposal title"
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Proposal Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="general">General</option>
              <option value="governance">Governance</option>
              <option value="treasury">Treasury</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          <div>
            <label htmlFor="summary" className="block text-sm font-medium mb-1">
              Summary
            </label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief summary of your proposal"
              required
            />
          </div>
        </div>
      </div>

      {/* Detailed Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Detailed Content</h2>
        <div>
          <label htmlFor="details" className="block text-sm font-medium mb-1">
            Proposal Details
          </label>
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

      {/* Funding Request */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Funding Request</h2>
        <div className="grid gap-4">
          <div>
            <label htmlFor="tokenAmount" className="block text-sm font-medium mb-1">
              Token Amount
            </label>
            <Input
              id="tokenAmount"
              type="number"
              value={formData.tokenAmount}
              onChange={(e) => setFormData({ ...formData, tokenAmount: e.target.value })}
              placeholder="Enter requested token amount"
            />
          </div>
          <div>
            <label htmlFor="fundingPlan" className="block text-sm font-medium mb-1">
              Funding Plan
            </label>
            <Textarea
              id="fundingPlan"
              value={formData.fundingPlan}
              onChange={(e) => setFormData({ ...formData, fundingPlan: e.target.value })}
              placeholder="Describe how the funds will be used"
            />
          </div>
        </div>
      </div>

      {/* Expected Outcome */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Expected Outcome</h2>
        <div>
          <label htmlFor="expectedOutcome" className="block text-sm font-medium mb-1">
            Expected Results
          </label>
          <Textarea
            id="expectedOutcome"
            value={formData.expectedOutcome}
            onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
            placeholder="Describe the expected outcomes and success metrics"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full sm:w-auto">
        Submit Proposal
      </Button>
    </form>
  )
}
