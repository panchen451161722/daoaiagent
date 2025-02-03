"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AIA {
  id: string
  role: string
  type: "internal" | "public"
  permissions: string[]
  weight: number
}

const defaultInternalAIAs: AIA[] = [
  {
    id: "1",
    role: "Proposal Coordinator",
    type: "internal",
    permissions: ["create_proposal", "review_proposal"],
    weight: 1
  },
  {
    id: "2",
    role: "Auditor",
    type: "internal",
    permissions: ["veto_proposal", "review_risk"],
    weight: 2
  },
  {
    id: "3",
    role: "Proposal Researcher",
    type: "internal",
    permissions: ["analyze_proposal", "assess_impact"],
    weight: 1
  }
]

const defaultPublicAIAs: AIA[] = [
  {
    id: "4",
    role: "Technical Advisor",
    type: "public",
    permissions: ["technical_review", "feasibility_assessment"],
    weight: 1
  },
  {
    id: "5",
    role: "Financial Controller",
    type: "public",
    permissions: ["budget_review", "fund_monitoring"],
    weight: 1
  }
]

export default function AIAConfigPanel() {
  const [internalAIAs, setInternalAIAs] = useState<AIA[]>(defaultInternalAIAs)
  const [publicAIAs, setPublicAIAs] = useState<AIA[]>(defaultPublicAIAs)
  const [upgradeThreshold, setUpgradeThreshold] = useState(75)

  const handleWeightChange = (id: string, weight: number, type: "internal" | "public") => {
    if (type === "internal") {
      setInternalAIAs(prev => prev.map(aia => 
        aia.id === id ? { ...aia, weight } : aia
      ))
    } else {
      setPublicAIAs(prev => prev.map(aia => 
        aia.id === id ? { ...aia, weight } : aia
      ))
    }
  }

  return (
    <div className="space-y-6">
      {/* Internal AIAs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Internal AIA Configuration</h3>
        <div className="space-y-4">
          {internalAIAs.map((aia) => (
            <div key={aia.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{aia.role}</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    Permissions: {aia.permissions.join(", ")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Weight:</span>
                  <Input
                    type="number"
                    value={aia.weight}
                    onChange={(e) => handleWeightChange(aia.id, Number(e.target.value), "internal")}
                    className="w-20"
                    min={0}
                    max={10}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public AIAs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Public AIA Configuration</h3>
        <div className="space-y-4">
          {publicAIAs.map((aia) => (
            <div key={aia.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{aia.role}</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    Permissions: {aia.permissions.join(", ")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Weight:</span>
                  <Input
                    type="number"
                    value={aia.weight}
                    onChange={(e) => handleWeightChange(aia.id, Number(e.target.value), "public")}
                    className="w-20"
                    min={0}
                    max={10}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Configuration */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Upgrade Configuration</h3>
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-4">
            <span>Upgrade Approval Threshold:</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={upgradeThreshold}
                onChange={(e) => setUpgradeThreshold(Number(e.target.value))}
                className="w-20"
                min={0}
                max={100}
              />
              <span>%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Percentage of weighted votes required to approve an AIA upgrade
          </p>
        </div>
      </div>
    </div>
  )
}
