"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAIAStore } from "@/lib/store/aia"

export default function CreateAIAPage() {
  const { abilities, permissions } = useAIAStore()

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create AI Agent</h1>
          <p className="text-muted-foreground mt-2">Configure a new AI Agent for your DAO</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="emoji">Emoji</Label>
                <Input id="emoji" placeholder="e.g., 🤖" className="w-24" />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="e.g., Technical Advisor" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the role and responsibilities of this AI Agent"
                />
              </div>
            </div>
          </div>

          {/* Prompt Configuration */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Prompt Configuration</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea 
                  id="system-prompt" 
                  placeholder="Define the core behavior and principles of the AI Agent"
                  className="min-h-[150px]"
                />
              </div>
              <div>
                <Label htmlFor="example-conversations">Example Conversations</Label>
                <Textarea 
                  id="example-conversations" 
                  placeholder="Provide example conversations to guide the AI Agent's responses"
                  className="min-h-[150px]"
                />
              </div>
            </div>
          </div>

          {/* Abilities */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Abilities</h2>
            <div className="grid gap-4">
              {abilities.map((ability) => (
                <div key={ability.id} className="flex items-start space-x-3">
                  <Checkbox id={ability.id} />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={ability.id}>{ability.title}</Label>
                    <p className="text-sm text-muted-foreground">
                      {ability.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Permissions</h2>
            <div className="grid gap-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <Checkbox id={permission.id} />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={permission.id}>{permission.name}</Label>
                    <p className="text-sm text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button className="w-full">Create AI Agent</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
