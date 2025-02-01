import { Metadata } from "next"
import DeclarationForm from "@/components/declaration/declaration-form"

export const metadata: Metadata = {
  title: "DAO Declaration",
  description: "Create your DAO declaration",
}

export default function DeclarationPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Create DAO Declaration</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create your DAO declaration.
        </p>
        <DeclarationForm />
      </div>
    </div>
  )
}
