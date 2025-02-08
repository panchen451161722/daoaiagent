"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import AIAConfigPanel from "./aia-config-panel"
import ProcessConfig from "./process-config"

interface AIAConfig {
  id: string
  role: string
  emoji: string
  permissions: string[]
  weight: number
  type: "Internal" | "Public"
  prompts: string[]
  nexts: string[]
}

export default function ManifestoForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "🌟", // Default emoji
    tokenContractAddress: "",
    objective: "",
    values: "",
    allowIndependentAIA: false
  })

  const [agents, setAgents] = useState<AIAConfig[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const manifestoData = {
      ...formData,
      agents
    }
    console.log("Form submitted:", manifestoData)
  }

  const emojis = ["🌟", "🚀", "🌈", "🎯", "🔮", "⚡️", "🎨", "🌍", "💫", "🎭", "🦋", "🎪"]

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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="logo" className="block text-sm font-medium mb-1">
            Logo (Emoji)
          </label>
          <div className="grid grid-cols-6 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData({ ...formData, logo: emoji })}
                className={`p-2 text-2xl rounded hover:bg-accent ${
                  formData.logo === emoji ? "bg-accent" : ""
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full min-h-[100px]"
          />
        </div>

        <div>
          <label htmlFor="tokenContractAddress" className="block text-sm font-medium mb-1">
            Token Contract Address
          </label>
          <Input
            id="tokenContractAddress"
            value={formData.tokenContractAddress}
            onChange={(e) => setFormData({ ...formData, tokenContractAddress: e.target.value })}
            className="w-full"
            placeholder="0x..."
          />
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
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, values: e.target.value })}
            rows={4}
            required
          />
        </div>
      </div>

      {/* AIA Settings */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AIA Settings</h2>
        <div className="flex items-center space-x-4">
          <Switch
            id="allowIndependentAIA"
            checked={formData.allowIndependentAIA}
            onCheckedChange={(checked) => setFormData({ ...formData, allowIndependentAIA: checked })}
          />
          <div className="space-y-1">
            <Label htmlFor="allowIndependentAIA">Allow Independent AIA</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, meeting phase 2 will be enabled and all independent AIAs will be able to participate in voting.
            </p>
          </div>
        </div>
      </div>

      {/* AIA Configuration */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AIA Configuration</h2>
        <AIAConfigPanel onDiagramChange={({ agents }) => setAgents(agents)} />
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
