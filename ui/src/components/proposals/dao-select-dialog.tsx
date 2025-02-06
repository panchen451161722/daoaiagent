"use client"

import { useState, Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for demonstration
const mockDAOs = [
  { id: 1, name: "DeveloperDAO", description: "A DAO focused on developer tooling and infrastructure" },
  { id: 2, name: "ResearchDAO", description: "Advancing blockchain research and innovation" },
  { id: 3, name: "CommunityDAO", description: "Building and nurturing the Web3 community" },
]

interface DAOSelectDialogProps {
  selectedDAO: number | null
  setSelectedDAO: Dispatch<SetStateAction<number | null>>
  daoOptions: { id: number; name: string }[]
}

export function DAOSelectDialog({ selectedDAO, setSelectedDAO, daoOptions }: DAOSelectDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDAOSelect = (daoId: number) => {
    setOpen(false)
    router.push(`/daos/${daoId}/proposals/create`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Proposal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a DAO</DialogTitle>
          <DialogDescription>
            Choose which DAO you want to submit a proposal to
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {daoOptions.map((dao) => (
            <Button
              key={dao.id}
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => handleDAOSelect(dao.id)}
            >
              <div className="text-left">
                <div className="font-medium">{dao.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
