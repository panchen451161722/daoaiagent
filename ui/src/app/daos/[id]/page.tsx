"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDAOStore } from "@/lib/store/dao"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function DAODetailsPage({ params }: PageProps) {
  const { id } = use(params)
  const { getDAOById } = useDAOStore()
  const dao = getDAOById(Number(id))

  if (!dao) {
    return <div>DAO not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{dao.name}</h1>
              <p className="text-muted-foreground mt-2">{dao.description}</p>
            </div>
            {dao.logo && (
              <Avatar className="h-20 w-20">
                <AvatarImage src={dao.logo} alt={dao.name} />
                <AvatarFallback>{dao.name[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold">{dao.members}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Active Proposals</p>
              <p className="text-2xl font-bold">{dao.activeProposals}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Treasury</p>
              <p className="text-2xl font-bold">{dao.treasury}</p>
            </div>
          </div>
        </div>

        {/* Token Info */}
        {(dao.tokenSymbol || dao.initialSupply) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Token Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {dao.tokenSymbol && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Token Symbol</p>
                  <p className="text-lg font-medium">{dao.tokenSymbol}</p>
                </div>
              )}
              {dao.initialSupply && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Initial Supply</p>
                  <p className="text-lg font-medium">{dao.initialSupply}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mission */}
        {(dao.objective || dao.values) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Mission</h2>
            <div className="space-y-4">
              {dao.objective && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Objective</p>
                  <p>{dao.objective}</p>
                </div>
              )}
              {dao.values && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Values</p>
                  <p>{dao.values}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Agents */}
        {dao.aias && dao.aias.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">AI Agents</h2>
              <Link href={`/aias/create?dao=${id}`}>
                <Button variant="outline">Add AIA</Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {dao.aias.map((aia) => (
                <div key={aia.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={aia.avatar} />
                        <AvatarFallback>{aia.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{aia.name}</p>
                        <p className="text-sm text-muted-foreground">{aia.type}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        aia.status === "Active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {aia.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process Configuration */}
        {dao.processes && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Process Configuration</h2>
            <div className="grid gap-4">
              {Object.entries(dao.processes).map(([key, process]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium capitalize">{key}</h3>
                      <p className="text-sm text-muted-foreground">
                        {process.enabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    {Object.entries(process.params).map(([paramKey, value]) => (
                      <div key={paramKey} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">
                          {paramKey.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
