"use client"

import { useState, useCallback } from "react"
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  addEdge,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AIA {
  id: string
  role: string
  emoji: string
  permissions: string[]
  weight: number
  type: "internal" | "public"
}

const availablePermissions = [
  "propose",
  "vote",
  "execute",
  "manage_members",
  "manage_treasury",
  "manage_settings"
]

const availableAIAs: AIA[] = [
  { id: "gpt4", role: "GPT-4", emoji: "🤖", permissions: ["propose", "vote"], weight: 1, type: "internal" },
  { id: "claude", role: "Claude", emoji: "🧠", permissions: ["propose", "vote"], weight: 1, type: "internal" },
  { id: "llama", role: "Llama", emoji: "🦙", permissions: ["propose"], weight: 1, type: "public" },
  { id: "palm", role: "PaLM", emoji: "🌴", permissions: ["propose"], weight: 1, type: "public" },
  { id: "gemini", role: "Gemini", emoji: "👾", permissions: ["propose", "vote"], weight: 1, type: "internal" },
  { id: "mistral", role: "Mistral", emoji: "🌪️", permissions: ["propose"], weight: 1, type: "public" }
]

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'default',
    position: { x: 200, y: 50 },
    data: { 
      label: (
        <div className="flex items-center gap-2 p-2">
          <span className="text-xl">🎯</span>
          <span>START</span>
        </div>
      )
    },
    style: {
      background: '#f3e5f5',
      border: '1px solid #ce93d8',
      borderRadius: '8px',
      padding: '4px',
    },
  },
]
const initialEdges: Edge[] = []

export default function AIAConfigPanel() {
  const [selectedAIAs, setSelectedAIAs] = useState<AIA[]>([])
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedAIA, setSelectedAIA] = useState<AIA | null>(null)
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 })

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      markerEnd: { type: MarkerType.Arrow },
      style: { strokeWidth: 2 },
    }, eds)),
    []
  )

  const handleAddAIA = (aia: AIA) => {
    const newAIA = { ...aia }
    
    const newNode: Node = {
      id: aia.id,
      type: 'default',
      position: selectedPosition,
      data: { 
        label: (
          <div className="flex items-center gap-2 p-2">
            <span className="text-xl">{aia.emoji}</span>
            <span>{aia.role}</span>
          </div>
        ),
        aia: newAIA
      },
      style: {
        background: aia.type === "internal" ? "#e3f2fd" : "#f1f8e9",
        border: "1px solid",
        borderColor: aia.type === "internal" ? "#90caf9" : "#a5d6a7",
        borderRadius: "8px",
        padding: "4px",
      },
    }
    setNodes((nds) => [...nds, newNode])
    setAddDialogOpen(false)
  }

  const handleRemoveAIA = (id: string) => {
    setNodes((nds) => nds.filter(node => node.id !== id))
    setEdges((eds) => eds.filter(edge => edge.source !== id && edge.target !== id))
    setEditDialogOpen(false)
  }

  const handlePermissionToggle = (aiaId: string, permission: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === aiaId && node.data.aia) {
        const newPermissions = node.data.aia.permissions.includes(permission)
          ? node.data.aia.permissions.filter(p => p !== permission)
          : [...node.data.aia.permissions, permission]
        return {
          ...node,
          data: {
            ...node.data,
            aia: { ...node.data.aia, permissions: newPermissions }
          }
        }
      }
      return node
    }))
  }

  const handleWeightChange = (id: string, weight: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id && node.data.aia ? {
        ...node,
        data: {
          ...node.data,
          aia: { ...node.data.aia, weight }
        }
      } : node
    ))
  }

  const toggleAIAType = (id: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === id && node.data.aia) {
        const newType = node.data.aia.type === "internal" ? "public" : "internal"
        return {
          ...node,
          data: {
            ...node.data,
            aia: { ...node.data.aia, type: newType }
          },
          style: {
            ...node.style,
            background: newType === "internal" ? "#e3f2fd" : "#f1f8e9",
            borderColor: newType === "internal" ? "#90caf9" : "#a5d6a7",
          },
        }
      }
      return node
    }))
  }

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    const reactFlowBounds = (event.target as HTMLElement).closest('.react-flow')?.getBoundingClientRect()
    const reactFlowInstance = document.querySelector('.react-flow')
    if (reactFlowBounds && reactFlowInstance) {
      const scale = reactFlowInstance.style.transform 
        ? parseFloat(reactFlowInstance.style.transform.match(/scale\((.*?)\)/)?.[1] || "1")
        : 1
      const position = {
        x: (event.clientX - reactFlowBounds.left) / scale,
        y: (event.clientY - reactFlowBounds.top) / scale,
      }
      setSelectedPosition(position)
      setAddDialogOpen(true)
    }
  }, [])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.id === 'start') {
      return
    }
    if (node.data.aia) {
      setSelectedAIA(node.data.aia)
      setEditDialogOpen(true)
    }
  }, [])

  return (
    <div className="space-y-6">
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select an Agent</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {availableAIAs.map((aia) => {
              const isSelected = nodes.some(node => node.id === aia.id)
              return (
                <Button
                  key={aia.id}
                  variant="outline"
                  className={cn(
                    "h-auto py-4 px-4 flex flex-col items-center gap-2 relative",
                    isSelected && "opacity-50"
                  )}
                  onClick={() => !isSelected && handleAddAIA(aia)}
                  disabled={isSelected}
                >
                  <span className="text-2xl">{aia.emoji}</span>
                  <span>{aia.role}</span>
                  <span className={cn(
                    "absolute top-2 right-2 text-xs px-2 py-1 rounded-full text-white",
                    aia.type === "internal" ? "bg-blue-500" : "bg-green-500"
                  )}>
                    {aia.type}
                  </span>
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent Properties</DialogTitle>
          </DialogHeader>
          {selectedAIA && (
            <div className="space-y-6 pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedAIA.emoji}</span>
                  <div>
                    <h4 className="font-semibold">{selectedAIA.role}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAIAType(selectedAIA.id)}
                      className={cn(
                        "mt-1 text-xs h-6 px-2",
                        selectedAIA.type === "internal" ? "text-blue-500" : "text-green-500"
                      )}
                    >
                      {selectedAIA.type}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Weight:</span>
                    <Input
                      type="number"
                      value={selectedAIA.weight}
                      onChange={(e) => handleWeightChange(selectedAIA.id, Number(e.target.value))}
                      className="w-20"
                      min={0}
                      max={10}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAIA(selectedAIA.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${selectedAIA.id}-${permission}`}
                      checked={selectedAIA.permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionToggle(selectedAIA.id, permission)}
                    />
                    <label
                      htmlFor={`${selectedAIA.id}-${permission}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Agent Flow Diagram</h3>
          <Button variant="outline" size="sm" onClick={onPaneClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>
        <div className="border rounded-lg" style={{ height: '400px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionMode={ConnectionMode.Loose}
            onPaneClick={onPaneClick}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <p className="text-sm text-muted-foreground">
          Click anywhere on the canvas or use the Add Agent button to add new agents. Click on an agent to edit its properties. Connect agents by dragging from one node to another.
        </p>
      </div>
    </div>
  )
}
