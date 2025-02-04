"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIA {
  id: string
  role: string
  emoji: string
  permissions: string[]
  weight: number
  type: "internal" | "public"
}

const availablePermissions = [
  "propose",
  "vote",
  "execute",
  "manage_members",
  "manage_treasury",
  "manage_settings"
]

const availableAIAs: AIA[] = [
  { id: "gpt4", role: "GPT-4", emoji: "🤖", permissions: ["propose", "vote"], weight: 1, type: "internal" },
  { id: "claude", role: "Claude", emoji: "🧠", permissions: ["propose", "vote"], weight: 1, type: "internal" },
  { id: "llama", role: "Llama", emoji: "🦙", permissions: ["propose"], weight: 1, type: "public" },
  { id: "palm", role: "PaLM", emoji: "🌴", permissions: ["propose"], weight: 1, type: "public" },
  { id: "gemini", role: "Gemini", emoji: "👾", permissions: ["propose", "vote"], weight: 1, type: "internal" },
  { id: "mistral", role: "Mistral", emoji: "🌪️", permissions: ["propose"], weight: 1, type: "public" }
]

export default function AIAConfigPanel() {
  const [selectedAIAs, setSelectedAIAs] = useState<AIA[]>([])

  const handleAddAIA = (aia: AIA) => {
    if (!selectedAIAs.find(a => a.id === aia.id)) {
      setSelectedAIAs([...selectedAIAs, { ...aia }])
    }
  }

  const handleRemoveAIA = (id: string) => {
    setSelectedAIAs(selectedAIAs.filter(aia => aia.id !== id))
  }

  const handlePermissionToggle = (aiaId: string, permission: string) => {
    setSelectedAIAs(prev => prev.map(aia => {
      if (aia.id === aiaId) {
        const newPermissions = aia.permissions.includes(permission)
          ? aia.permissions.filter(p => p !== permission)
          : [...aia.permissions, permission]
        return { ...aia, permissions: newPermissions }
      }
      return aia
    }))
  }

  const handleWeightChange = (id: string, weight: number) => {
    setSelectedAIAs(prev => prev.map(aia => 
      aia.id === id ? { ...aia, weight } : aia
    ))
  }

  const toggleAIAType = (id: string) => {
    setSelectedAIAs(prev => prev.map(aia => 
      aia.id === id ? { ...aia, type: aia.type === "internal" ? "public" : "internal" } : aia
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Add AIA</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableAIAs.map((aia) => {
            const isSelected = selectedAIAs.some(a => a.id === aia.id)
            return (
              <Button
                key={aia.id}
                variant="outline"
                className={cn(
                  "h-auto py-4 px-4 flex flex-col items-center gap-2 relative",
                  !isSelected && "opacity-50 hover:opacity-75",
                  isSelected && "border-primary"
                )}
                onClick={() => isSelected ? handleRemoveAIA(aia.id) : handleAddAIA(aia)}
              >
                <span className="text-2xl">{aia.emoji}</span>
                <span>{aia.role}</span>
                <span className={cn(
                  "absolute top-2 right-2 text-xs px-2 py-1 rounded-full",
                  "bg-opacity-80 text-white",
                  !isSelected && "bg-gray-400",
                  isSelected && (aia.type === "internal" ? "bg-blue-500" : "bg-green-500")
                )}>
                  {aia.type}
                </span>
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Selected AIAs</h3>
        <div className="space-y-4">
          {selectedAIAs.map((aia) => (
            <div key={aia.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{aia.emoji}</span>
                  <div>
                    <h4 className="font-semibold">{aia.role}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAIAType(aia.id)}
                      className={cn(
                        "mt-1 text-xs h-6 px-2",
                        aia.type === "internal" ? "text-blue-500" : "text-green-500"
                      )}
                    >
                      {aia.type}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Weight:</span>
                    <Input
                      type="number"
                      value={aia.weight}
                      onChange={(e) => handleWeightChange(aia.id, Number(e.target.value))}
                      className="w-20"
                      min={0}
                      max={10}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAIA(aia.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${aia.id}-${permission}`}
                      checked={aia.permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionToggle(aia.id, permission)}
                    />
                    <label
                      htmlFor={`${aia.id}-${permission}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
