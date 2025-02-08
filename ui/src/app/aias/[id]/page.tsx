"use client"

import { JSX, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAIAStore } from "@/lib/store/aia"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

interface HighlightedPromptProps {
  text: string
  replacements: Array<{
    key: string
    color: string
  }>
}

const HighlightedPrompt: React.FC<HighlightedPromptProps> = ({ text, replacements }) => {
  if (!text) return null;
  let lastIndex = 0
  const parts: JSX.Element[] = []

  // Sort replacements by their position in text to handle overlapping matches
  const matches = replacements.reduce<Array<{ key: string; color: string; index: number }>>((acc, replacement) => {
    const index = text.indexOf(replacement.key)
    if (index !== -1) {
      acc.push({ ...replacement, index })
    }
    return acc
  }, []).sort((a, b) => a.index - b.index)

  matches.forEach((match, i) => {
    if (match.index > lastIndex) {
      // Add text before the match
      parts.push(
        <span key={`text-${i}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      )
    }
    // Add the highlighted replacement
    parts.push(
      <span
        key={`highlight-${i}`}
        style={{ 
          backgroundColor: `${match.color}20`,
          color: match.color,
          padding: '0.1rem 0.3rem',
          borderRadius: '0.2rem',
          margin: '0 0.2rem',
          fontWeight: 500
        }}
      >
        {match.key}
      </span>
    )
    lastIndex = match.index + match.key.length
  })

  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key="text-end">
        {text.substring(lastIndex)}
      </span>
    )
  }

  return <div className="font-mono text-sm whitespace-pre-wrap bg-muted p-5 rounded-lg overflow-auto">{parts}</div>
}

export default function AIADetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { getAIAById, abilities, supportedReplacements } = useAIAStore()
  const aia = getAIAById(id)
  const { toast } = useToast()

  if (!aia) {
    return <div>AIA not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{aia.emoji || "🤖"}</span>
            <div>
              <h1 className="text-2xl font-bold">{aia.role}</h1>
              <p className="text-muted-foreground">{aia.type} AIA</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => {
        toast({
          title: "Not Available",
          description: "Sorry, this feature is not available yet.",
        })
      }}>
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{aia.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Prompts</h2>
            <div className="space-y-4">
              {aia.prompts.map((prompt, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge>{prompt.type}</Badge>
                    {prompt.description && (
                      <span className="text-sm text-muted-foreground">
                        {prompt.description}
                      </span>
                    )}
                  </div>
                  <HighlightedPrompt
                    text={prompt.content}
                    replacements={supportedReplacements}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Abilities</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {abilities.map(ability => (
                <div key={ability.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{ability.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ability.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {aia.recentActivities && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
              <div className="space-y-4">
                {aia.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.daoName} • {activity.date}
                      </p>
                    </div>
                    <Badge variant={activity.status === "Completed" ? "default" : "secondary"}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active DAOs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aia.activeDAOs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aia.totalMeetings}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
