"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AIAConfigPanel from "./aia-config-panel"
import ProcessConfig from "./process-config"

export default function ManifestoForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null as File | null,
    tokenSymbol: "",
    initialSupply: "",
    objective: "",
    values: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Information</h2>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            DAO Name
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.files?.[0] || null }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tokenSymbol" className="block text-sm font-medium mb-1">
              Token Symbol
            </label>
            <Input
              id="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={(e) => setFormData(prev => ({ ...prev, tokenSymbol: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, initialSupply: e.target.value }))}
              min="0"
              required
            />
          </div>
        </div>
      </div>

      {/* Manifesto Content */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Manifesto Content</h2>
        
        <div>
          <label htmlFor="objective" className="block text-sm font-medium mb-1">
            Organization Objective
          </label>
          <Textarea
            id="objective"
            value={formData.objective}
            onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
            rows={4}
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
            onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))}
            rows={4}
            required
          />
        </div>
      </div>

      {/* AIA Configuration */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AIA Configuration</h2>
        <AIAConfigPanel />
      </div>

      {/* Process Configuration */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Process Configuration</h2>
        <ProcessConfig />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Save Draft
        </Button>
        <Button type="submit">
          Submit Manifesto
        </Button>
      </div>
    </form>
  )
}
