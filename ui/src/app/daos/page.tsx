import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "DAOs",
  description: "View and manage DAOs",
}

// Mock data for demonstration
const mockDAOs = [
  {
    id: "1",
    name: "DeFi DAO",
    description: "Decentralized Finance Governance",
    members: 1200,
    proposals: 45,
    treasury: "1.5M USDC"
  },
  {
    id: "2",
    name: "NFT Creators",
    description: "Digital Art and NFT Governance",
    members: 800,
    proposals: 32,
    treasury: "2.3M USDC"
  },
  {
    id: "3",
    name: "Gaming Guild",
    description: "Gaming and Metaverse Governance",
    members: 1500,
    proposals: 28,
    treasury: "900K USDC"
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
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">{dao.members}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proposals</p>
                <p className="text-2xl font-bold">{dao.proposals}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Treasury</p>
                <p className="text-2xl font-bold">{dao.treasury}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
