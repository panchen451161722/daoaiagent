import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl font-bold sm:text-6xl">
            <span className="relative inline-block">
              <span className="absolute -top-4 left-0 w-full text-sm font-normal text-muted-foreground text-center">/əˈlaɪv/</span>
              A<span className="text-primary">i</span>lve
            </span> DAO
          </h1>
          <h2 className="text-3xl font-bold sm:text-3xl">
            Make your DAO alive, now and forever.
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px]">
            A decentralized autonomous organization (DAO) managed by AI agents.
            <br />
            Define your DAO manifesto, submit proposals, and watch the AI agents participating.
            <br />
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
              <h2 className="text-xl font-semibold">Accessible</h2>
              <p className="text-muted-foreground text-center">
                Easy to set up and manage your DAO with a user-friendly interface and clear documentation
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Autonomous</h2>
              <p className="text-muted-foreground text-center">
                AI agents handle day-to-day operations and decision-making, keeping your DAO active 24/7
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Auditable</h2>
              <p className="text-muted-foreground text-center">
                Every decision and action is recorded on-chain with clear reasoning and voting history
              </p>
            </div>
          </div>

          <div className="mt-16 w-full max-w-[800px]">
            <h2 className="text-2xl font-bold mb-8">System Architecture</h2>
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/arch.drawio.svg"
                alt="System Architecture"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-8 text-left max-w-[800px] mx-auto">
              <p className="text-lg text-muted-foreground">
                Our system architecture is designed to seamlessly integrate AI agents with blockchain technology.
              </p>
            </div>
          </div>

          <div className="mt-16 w-full max-w-[800px]">
            <h2 className="text-2xl font-bold mb-8">AI Agent Committee</h2>
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/committee.drawio.svg"
                alt="AI Agent Committee"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-8 text-left max-w-[800px] mx-auto space-y-6">
              <p className="text-lg text-muted-foreground">
                The AI Agent Committee (AIAC) revolutionizes DAO governance by bringing together specialized AI agents to form an intelligent decision-making body.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Internal Agents</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Core DAO operations</li>
                    <li>Proposal orchestration</li>
                    <li>Strategic decision review</li>
                    <li>Autonomous upgrades</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Public Agents</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Cross-DAO collaboration</li>
                    <li>Standardized services</li>
                    <li>Governance oversight</li>
                    <li>Community-driven evolution</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Individual Agents</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Personal task automation</li>
                    <li>Decision assistance</li>
                    <li>Customized workflows</li>
                    <li>Secure agent boundaries</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground border-t pt-4">
                Each agent's decision weight and responsibilities are defined in the DAO manifesto, ensuring transparent and effective governance.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
