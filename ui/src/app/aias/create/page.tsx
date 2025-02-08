"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  HelpCircle, 
  ChevronDown, 
  X 
} from "lucide-react"
import { useAIAStore, predefinedPrompts, supportedReplacements } from "@/lib/store/aia"

export default function CreateAIAPage() {
  const { abilities } = useAIAStore()
  const [prompts, setPrompts] = useState([predefinedPrompts["Core Role"]])
  const [type, setType] = useState("Internal")

  const addPrompt = (promptKey: keyof typeof predefinedPrompts) => {
    setPrompts([...prompts, predefinedPrompts[promptKey]])
  }

  const removePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index))
  }

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
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="e.g., Technical Advisor" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Responsible for technical risk assessment and implementation feasibility."
                  className="h-20"
                />
              </div>
              <div>
                <Label>Type</Label>
                <ToggleGroup type="single" value={type} onValueChange={(value) => value && setType(value)} className="justify-start mt-2">
                  <ToggleGroupItem value="Internal">🔒 Internal</ToggleGroupItem>
                  <ToggleGroupItem value="Public">🌎 Public</ToggleGroupItem>
                  <ToggleGroupItem value="Individual">👤 Individual</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          {/* Prompts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Prompts</h2>
                <Popover>
                  <PopoverTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h3 className="font-medium">Available Variables</h3>
                      <div className="space-y-1">
                        {supportedReplacements.map(({ key, description }) => (
                          <div key={key} className="text-sm">
                            <code className="text-muted-foreground">{key}</code>
                            <span className="text-muted-foreground"> - {description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Add Prompt <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.keys(predefinedPrompts).map((key) => (
                    <DropdownMenuItem key={key} onSelect={() => addPrompt(key as keyof typeof predefinedPrompts)}>
                      {key}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-6">
              {prompts.map((prompt, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => removePrompt(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div>
                    <Label>Type</Label>
                    <ToggleGroup 
                      type="single" 
                      value={prompt.type}
                      onValueChange={(value) => {
                        if (value) {
                          const newPrompts = [...prompts]
                          newPrompts[index].type = value as "system" | "human"
                          setPrompts(newPrompts)
                        }
                      }}
                      className="justify-start mt-2"
                    >
                      <ToggleGroupItem value="system">System</ToggleGroupItem>
                      <ToggleGroupItem value="human">Human</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input 
                      value={prompt.description}
                      onChange={(e) => {
                        const newPrompts = [...prompts]
                        newPrompts[index].description = e.target.value
                        setPrompts(newPrompts)
                      }}
                      placeholder="e.g., Core role definition" 
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea 
                      value={prompt.content}
                      onChange={(e) => {
                        const newPrompts = [...prompts]
                        newPrompts[index].content = e.target.value
                        setPrompts(newPrompts)
                      }}
                      className="font-mono text-sm min-h-[100px]"
                    />
                  </div>
                </div>
              ))}
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

          {/* Submit */}
          <div className="pt-4">
            <Button className="w-full">Create AI Agent</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
