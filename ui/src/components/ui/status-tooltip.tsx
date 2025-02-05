"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { StatusFlowDiagram } from "@/components/status-flow-diagram"

interface StatusTooltipProps {
  children: React.ReactNode
  currentStatus: string
}

export function StatusTooltip({ children, currentStatus }: StatusTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          align="start" 
          className="w-[800px] p-6 bg-background border rounded-lg"
          sideOffset={5}
        >
          <div className="w-full overflow-x-auto">
            <StatusFlowDiagram currentStatus={currentStatus} className="min-w-[700px]" />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
