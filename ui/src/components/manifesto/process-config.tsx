"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProcessConfig {
  enabled: boolean
  params: {
    proposalPeriod?: number
    votingPeriod?: number
    executionDelay?: number
    emergencyDelay?: number
  }
}

export interface ProcessConfigs {
  [key: string]: ProcessConfig
}

const defaultProcesses: ProcessConfigs = {
  proposal: {
    enabled: true,
    params: {
      proposalPeriod: 7,
      votingPeriod: 3,
      executionDelay: 1
    }
  },
  internal: {
    enabled: true,
    params: {
      proposalPeriod: 3,
      votingPeriod: 2,
      executionDelay: 1
    }
  },
  emergency: {
    enabled: true,
    params: {
      emergencyDelay: 1
    }
  },
  upgrade: {
    enabled: true,
    params: {
      votingPeriod: 5,
      executionDelay: 2
    }
  }
}

export default function ProcessConfig({ 
  onChange 
}: { 
  onChange: (processes: ProcessConfigs) => void 
}) {
  const [processes, setProcesses] = useState<ProcessConfigs>(defaultProcesses)

  // Send initial processes
  useEffect(() => {
    onChange(processes)
  }, [])

  const handleProcessToggle = (processKey: string, enabled: boolean) => {
    const newProcesses = {
      ...processes,
      [processKey]: {
        ...processes[processKey],
        enabled
      }
    }
    setProcesses(newProcesses)
    onChange(newProcesses)
  }

  const handleParamChange = (processKey: string, paramKey: string, value: number) => {
    const newProcesses = {
      ...processes,
      [processKey]: {
        ...processes[processKey],
        params: {
          ...processes[processKey].params,
          [paramKey]: value
        }
      }
    }
    setProcesses(newProcesses)
    onChange(newProcesses)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Process Configuration</h3>

      {/* Standard Proposal Process */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="proposal-process"
            checked={processes.proposal.enabled}
            onCheckedChange={(checked) => handleProcessToggle("proposal", checked as boolean)}
          />
          <Label htmlFor="proposal-process" className="font-medium">
            Standard Proposal Process
          </Label>
        </div>
        {processes.proposal.enabled && (
          <div className="grid grid-cols-3 gap-4 ml-6">
            <div>
              <Label htmlFor="proposal-period">Proposal Period (days)</Label>
              <Input
                id="proposal-period"
                type="number"
                value={processes.proposal.params.proposalPeriod}
                onChange={(e) => handleParamChange("proposal", "proposalPeriod", Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="voting-period">Voting Period (days)</Label>
              <Input
                id="voting-period"
                type="number"
                value={processes.proposal.params.votingPeriod}
                onChange={(e) => handleParamChange("proposal", "votingPeriod", Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="execution-delay">Execution Delay (days)</Label>
              <Input
                id="execution-delay"
                type="number"
                value={processes.proposal.params.executionDelay}
                onChange={(e) => handleParamChange("proposal", "executionDelay", Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
        )}
      </div>

      {/* Internal Proposal Process */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="internal-process"
            checked={processes.internal.enabled}
            onCheckedChange={(checked) => handleProcessToggle("internal", checked as boolean)}
          />
          <Label htmlFor="internal-process" className="font-medium">
            Internal Proposal Process
          </Label>
        </div>
        {processes.internal.enabled && (
          <div className="grid grid-cols-3 gap-4 ml-6">
            <div>
              <Label htmlFor="internal-proposal-period">Proposal Period (days)</Label>
              <Input
                id="internal-proposal-period"
                type="number"
                value={processes.internal.params.proposalPeriod}
                onChange={(e) => handleParamChange("internal", "proposalPeriod", Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="internal-voting-period">Voting Period (days)</Label>
              <Input
                id="internal-voting-period"
                type="number"
                value={processes.internal.params.votingPeriod}
                onChange={(e) => handleParamChange("internal", "votingPeriod", Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="internal-execution-delay">Execution Delay (days)</Label>
              <Input
                id="internal-execution-delay"
                type="number"
                value={processes.internal.params.executionDelay}
                onChange={(e) => handleParamChange("internal", "executionDelay", Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
        )}
      </div>

      {/* Emergency Process */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="emergency-process"
            checked={processes.emergency.enabled}
            onCheckedChange={(checked) => handleProcessToggle("emergency", checked as boolean)}
          />
          <Label htmlFor="emergency-process" className="font-medium">
            Emergency Process
          </Label>
        </div>
        {processes.emergency.enabled && (
          <div className="ml-6">
            <div className="w-1/3">
              <Label htmlFor="emergency-delay">Emergency Delay (hours)</Label>
              <Input
                id="emergency-delay"
                type="number"
                value={processes.emergency.params.emergencyDelay}
                onChange={(e) => handleParamChange("emergency", "emergencyDelay", Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Process */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="upgrade-process"
            checked={processes.upgrade.enabled}
            onCheckedChange={(checked) => handleProcessToggle("upgrade", checked as boolean)}
          />
          <Label htmlFor="upgrade-process" className="font-medium">
            Upgrade Process
          </Label>
        </div>
        {processes.upgrade.enabled && (
          <div className="grid grid-cols-2 gap-4 ml-6">
            <div>
              <Label htmlFor="upgrade-voting-period">Voting Period (days)</Label>
              <Input
                id="upgrade-voting-period"
                type="number"
                value={processes.upgrade.params.votingPeriod}
                onChange={(e) => handleParamChange("upgrade", "votingPeriod", Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="upgrade-execution-delay">Execution Delay (days)</Label>
              <Input
                id="upgrade-execution-delay"
                type="number"
                value={processes.upgrade.params.executionDelay}
                onChange={(e) => handleParamChange("upgrade", "executionDelay", Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
