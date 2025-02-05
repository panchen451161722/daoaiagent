import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "DAOs",
  description: "View and manage DAOs",
}

interface Treasury {
  amount: string // Raw amount in smallest unit (e.g., "1500000000" for 1.5M)
  symbol: string
}

function formatNumber(value: string): string {
  const num = Number(value)
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M'
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Mock data for demonstration
const mockDAOs = [
  {
    id: "1",
    name: "DeFi DAO",
    description: "Decentralized Finance Governance",
    autonomousMeetings: 28,
    proposals: 45,
    treasury: {
      amount: "1500000", // 1.5M
      symbol: "USDC"
    } as Treasury
  },
  {
    id: "2",
    name: "NFT Creators",
    description: "Digital Art and NFT Governance",
    autonomousMeetings: 42,
    proposals: 32,
    treasury: {
      amount: "2300000", // 2.3M
      symbol: "USDC"
    } as Treasury
  },
  {
    id: "3",
    name: "Gaming Guild",
    description: "Gaming and Metaverse Governance",
    autonomousMeetings: 15,
    proposals: 28,
    treasury: {
      amount: "900000", // 900K
      symbol: "USDC"
    } as Treasury
  }
]

export default function DAOsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">DAOs</h1>
          <p className="text-muted-foreground">View and manage DAOs</p>
        </div>
        <Link href="/manifesto">
          <Button>Create DAO</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {mockDAOs.map((dao) => (
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
                <p className="text-sm text-muted-foreground">Autonomous Meetings</p>
                <p className="text-2xl font-bold">{dao.autonomousMeetings}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proposals</p>
                <p className="text-2xl font-bold">{dao.proposals}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Treasury</p>
                <p className="text-2xl font-bold">
                  <span>{formatNumber(dao.treasury.amount)}</span>
                  <span className="ml-1">{dao.treasury.symbol}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
