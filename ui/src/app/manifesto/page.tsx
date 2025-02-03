import { Metadata } from "next"
import ManifestoForm from "@/components/manifesto/manifesto-form"

export const metadata: Metadata = {
  title: "DAO Manifesto",
  description: "Create your DAO manifesto",
}

export default function ManifestoPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Create DAO Manifesto</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create your DAO manifesto.
        </p>
        <ManifestoForm />
      </div>
    </div>
  )
}
