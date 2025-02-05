"use client"

import { useEffect, useState } from 'react'
import mermaid from 'mermaid'

interface StatusFlowDiagramProps {
  className?: string
  currentStatus: string
}

export function StatusFlowDiagram({ className, currentStatus }: StatusFlowDiagramProps) {
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? 'dark' : 'default',
      flowchart: {
        curve: 'basis',
        nodeSpacing: 50,
        rankSpacing: 50,
        htmlLabels: true,
      },
      securityLevel: 'loose',
    })

    const diagram = `
      graph TD
        classDef current fill:#3b82f6,stroke:#2563eb,color:white
        classDef default fill:#f6ebf1,stroke:#e5e7eb,color:black
        
        Proposed -- **Meeting**:Reject --> Discarded
        Proposed -- **Proposer**:Abandon --> Discarded
        Proposed -- **Meeting**:Accept --> Accepted
        Accepted -- **System**:Executing\n_delay_ --> Executing
        Executing -- **Proposer**:Report --> Executed
        Executed -- **Meeting**:Accept --> Finalizing
        Finalizing -- **System**:Finalize --> Finalized
        Executed -- **Meeting**:Reject --> Failed

        class Proposed,Accepted,Executing,Executed,Discarded,Finalized,Failed default
        class ${currentStatus} current
    `

    mermaid.render('status-diagram', diagram).then((result) => {
      setSvg(result.svg)
    })
  }, [currentStatus])

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
