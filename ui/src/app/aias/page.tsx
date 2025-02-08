"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAIAStore } from "@/lib/store/aia"

export default function AIAsPage() {
  const { aias } = useAIAStore()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AIA List</h1>
          <p className="text-muted-foreground">View all available AIAs</p>
        </div>
        <Link href="/aias/create">
          <Button>Create AIA</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {aias.map((aia) => (
          <div key={aia.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{aia.emoji || "🤖"}</span>
                  <h2 className="text-xl font-semibold">
                    <Link href={`/aias/${aia.id}`} className="hover:underline">
                      {aia.role}
                    </Link>
                  </h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    aia.type === "Internal"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  )}>
                    {aia.type}
                  </span>
                </div>
                <p className="text-muted-foreground">{aia.description}</p>
              </div>
              <Link href={`/aias/${aia.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
