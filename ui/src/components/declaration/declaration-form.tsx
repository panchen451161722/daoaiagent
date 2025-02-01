"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function DeclarationForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null,
    tokenSymbol: "",
    initialSupply: "",
    objectives: "",
    values: "",
    governanceStructure: "direct_democracy", // default value
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <div className="grid gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              DAO Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter DAO name"
              maxLength={60}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your DAO"
              maxLength={60}
              required
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium mb-1">
              Logo
            </label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
            />
          </div>
        </div>
      </div>

      {/* Token Configuration */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Token Configuration</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tokenSymbol" className="block text-sm font-medium mb-1">
              Token Symbol
            </label>
            <Input
              id="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
              placeholder="e.g., DAO"
              required
            />
          </div>
          <div>
            <label htmlFor="initialSupply" className="block text-sm font-medium mb-1">
              Initial Supply
            </label>
            <Input
              id="initialSupply"
              type="number"
              value={formData.initialSupply}
              onChange={(e) => setFormData({ ...formData, initialSupply: e.target.value })}
              placeholder="Enter initial token supply"
              required
            />
          </div>
        </div>
      </div>

      {/* Declaration Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Declaration Content</h2>
        <div className="grid gap-4">
          <div>
            <label htmlFor="objectives" className="block text-sm font-medium mb-1">
              Organization Objectives
            </label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              placeholder="Describe your DAO's objectives"
              required
            />
          </div>
          <div>
            <label htmlFor="values" className="block text-sm font-medium mb-1">
              Values Statement
            </label>
            <Textarea
              id="values"
              value={formData.values}
              onChange={(e) => setFormData({ ...formData, values: e.target.value })}
              placeholder="Describe your DAO's core values"
              required
            />
          </div>
          <div>
            <label htmlFor="governanceStructure" className="block text-sm font-medium mb-1">
              Governance Structure
            </label>
            <select
              id="governanceStructure"
              value={formData.governanceStructure}
              onChange={(e) => setFormData({ ...formData, governanceStructure: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="direct_democracy">Direct Democracy</option>
              <option value="representative">Representative</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full sm:w-auto">
        Create Declaration
      </Button>
    </form>
  )
}
