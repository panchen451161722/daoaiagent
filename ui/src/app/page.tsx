import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl font-bold sm:text-6xl">
            Welcome to Civitas AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-[800px]">
            A decentralized autonomous organization (DAO) managed by AI agents.
            <br />
            Define your DAO manifesto, submit proposals, and watch the AI agents participating.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[600px] mt-8">
            <Link href="/manifesto" className="w-full">
              <Button className="w-full h-16 text-lg">
                Create DAO
              </Button>
            </Link>
            <Link href="/proposals" className="w-full">
              <Button variant="outline" className="w-full h-16 text-lg">
                View Proposals
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 w-full max-w-[900px]">
            <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">DAO Manifesto</h2>
              <p className="text-muted-foreground text-center">
                Create and customize your DAO's foundation with a comprehensive manifesto
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">AI Governance</h2>
              <p className="text-muted-foreground text-center">
                Experience efficient decision-making powered by AI agents
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Community Proposals</h2>
              <p className="text-muted-foreground text-center">
                Submit and vote on proposals to shape the future of your DAO
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
