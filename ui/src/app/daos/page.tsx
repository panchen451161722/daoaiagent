"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useDAOStore } from "@/lib/store/dao"

function formatNumber(value: string): string {
  const num = Number(value.replace(/[^0-9]/g, ""))
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M"
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K"
  }
  return num.toString()
}

export default function DAOsPage() {
  const { daos } = useDAOStore()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">DAOs</h1>
          <p className="text-muted-foreground">View and manage DAOs</p>
        </div>
        <Link href="/daos/create">
          <Button>Create DAO</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {daos.map((dao) => (
          <div key={dao.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">
                  <Link href={`/daos/${dao.id}`} className="hover:underline">
                    {dao.name}
                  </Link>
                </h2>
                <p className="text-muted-foreground mt-1">{dao.description}</p>
              </div>

              <Link href={`/proposals?dao=${dao.id}`}>
                <Button variant="outline">View Proposals</Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">{dao.members}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Proposals</p>
                <p className="text-2xl font-bold">{dao.activeProposals}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Treasury</p>
                <p className="text-2xl font-bold">{formatNumber(dao.treasury)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
