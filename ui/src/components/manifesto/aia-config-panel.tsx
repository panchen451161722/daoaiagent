"use client"

import { useState, useCallback, useEffect } from "react"
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
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAIAStore } from "@/lib/store/aia"

interface AIA {
  id: string
  role: string
  emoji: string
  permissions: string[]
  weight: number
  type: "Internal" | "Public"
  prompts: string[]
  nexts: string[]
}

const availablePermissions = [
  "propose",
  "vote",
  "execute",
  "manage_members",
  "manage_treasury",
  "manage_settings"
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

export default function AIAConfigPanel({ 
  onDiagramChange 
}: { 
  onDiagramChange: (data: { agents: AIA[] }) => void 
}) {
  const { aias } = useAIAStore()
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>([])
  const [agents, setAgents] = useState<AIA[]>([])
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedAIA, setSelectedAIA] = useState<AIA | null>(null)
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 })

  // Update parent when agents change
  useEffect(() => {
    onDiagramChange({ agents })
  }, [agents, onDiagramChange])

  // Convert edges to nexts when they change
  useEffect(() => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      nexts: edges
        .filter(edge => edge.source === agent.id)
        .map(edge => edge.target)
    })))
  }, [edges])

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

  const handleAddAIA = (aia: Omit<AIA, 'nexts'>) => {
    const newAIA: AIA = { 
      ...aia,
      nexts: []
    }
    
    const newNode: Node = {
      id: aia.id,
      type: 'default',
      position: { x: 200, y: Math.max(...nodes.map(n => n.position.y)) + 100 },
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
        background: aia.type === "Internal" ? "#e3f2fd" : "#f1f8e9",
        border: "1px solid",
        borderColor: aia.type === "Internal" ? "#90caf9" : "#a5d6a7",
        borderRadius: "8px",
        padding: "4px",
      },
    }
    setNodes((nds) => [...nds, newNode])
    setAgents((prev) => [...prev, newAIA])
    setAddDialogOpen(false)
  }

  const handleRemoveAIA = (id: string) => {
    setNodes((nds) => nds.filter(node => node.id !== id))
    setEdges((eds) => eds.filter(edge => edge.source !== id && edge.target !== id))
    setAgents((prev) => prev.filter(agent => agent.id !== id))
    setEditDialogOpen(false)
  }

  const handlePermissionToggle = (aiaId: string, permission: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === aiaId) {
        const newPermissions = agent.permissions.includes(permission)
          ? agent.permissions.filter(p => p !== permission)
          : [...agent.permissions, permission]
        return {
          ...agent,
          permissions: newPermissions
        }
      }
      return agent
    }))
  }

  const handleWeightChange = (id: string, weight: number) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id ? {
        ...agent,
        weight
      } : agent
    ))
  }

  const toggleAIAType = (id: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        const newType = agent.type === "Internal" ? "Public" : "Internal"
        return {
          ...agent,
          type: newType
        }
      }
      return agent
    }))
  }

  const handlePromptChange = (id: string, prompts: string[]) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id ? {
        ...agent,
        prompts
      } : agent
    ))
  }

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
            {aias.map((aia) => {
              const isSelected = agents.some(agent => agent.id === aia.id)
              return (
                <button
                  key={aia.id}
                  type="button"
                  className={cn(
                    "h-auto py-4 px-4 flex flex-col items-center gap-2 relative border rounded-lg hover:bg-accent",
                    isSelected && "opacity-50"
                  )}
                  onClick={() => !isSelected && handleAddAIA({
                    id: aia.id,
                    role: aia.role,
                    emoji: aia.emoji || "🤖",
                    permissions: [],
                    weight: 1,
                    type: aia.type as "Internal" | "Public",
                    prompts: (aia.prompts || []).map(p => typeof p === 'string' ? p : p.content)
                  })}
                  disabled={isSelected}
                >
                  <span className="text-2xl">{aia.emoji || "🤖"}</span>
                  <span>{aia.role}</span>
                  <span className={cn(
                    "absolute top-2 right-2 text-xs px-2 py-1 rounded-full text-white",
                    aia.type === "Internal" ? "bg-blue-500" : "bg-green-500"
                  )}>
                    {aia.type}
                  </span>
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl">
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
                    <button
                      type="button"
                      onClick={() => toggleAIAType(selectedAIA.id)}
                      className={cn(
                        "mt-1 text-xs h-6 px-2 rounded border",
                        selectedAIA.type === "Internal" ? "text-blue-500" : "text-green-500"
                      )}
                    >
                      {selectedAIA.type}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Weight:</span>
                    <input
                      type="number"
                      value={selectedAIA.weight}
                      onChange={(e) => handleWeightChange(selectedAIA.id, Number(e.target.value))}
                      className="w-20 px-2 py-1 border rounded"
                      min={0}
                      max={10}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAIA(selectedAIA.id)}
                    className="text-muted-foreground hover:text-foreground p-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="text-sm font-medium">Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${selectedAIA.id}-${permission}`}
                        checked={selectedAIA.permissions.includes(permission)}
                        onChange={() => handlePermissionToggle(selectedAIA.id, permission)}
                        className="rounded border-gray-300"
                      />
                      <label
                        htmlFor={`${selectedAIA.id}-${permission}`}
                        className="text-sm font-medium"
                      >
                        {permission.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Agent Flow Diagram</h3>
          <button 
            type="button"
            className="px-4 py-2 border rounded hover:bg-accent text-sm"
            onClick={() => {
              const center = {
                x: 200,
                y: Math.max(...nodes.map(n => n.position.y)) + 100
              }
              setSelectedPosition(center)
              setAddDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </button>
        </div>
        <div className="border rounded-lg" style={{ height: '400px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionMode={ConnectionMode.Loose}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <p className="text-sm text-muted-foreground">
          Use the Add Agent button to add new agents. Click on an agent to edit its properties. Connect agents by dragging from one node to another.
        </p>
      </div>
    </div>
  )
}
