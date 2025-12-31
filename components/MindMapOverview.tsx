import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  MinusIcon, 
  DocumentTextIcon, 
  CpuChipIcon, 
  UserPlusIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon, 
  UserGroupIcon, 
  XMarkIcon, 
  SparklesIcon, 
  BoltIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  BuildingOfficeIcon, 
  MapPinIcon, 
  BanknotesIcon, 
  CalendarDaysIcon, 
  ScaleIcon, 
  BuildingStorefrontIcon, 
  MagnifyingGlassMinusIcon, 
  EnvelopeIcon, 
  PaperClipIcon, 
  ArrowDownTrayIcon, 
  ClockIcon
} from '@heroicons/react/24/outline';
import { getProjectData, getProjectDetailData, getNodeSidebarData, MapNode, EXPERT_POOL, ANDREW_BOWLER_IMG, SidebarData } from '../utils/mindMapUtils';

interface Props {
  onBack: () => void;
  projectId: string;
  projectName?: string;
  projectType?: 'Claim' | 'Arbitration';
  onExitProject: () => void;
  onToggleLogicLog?: () => void;
}

export const MindMapOverview: React.FC<Props> = ({ onBack, projectId, projectName, projectType = 'Claim', onExitProject, onToggleLogicLog }) => {
  const [viewMode, setViewMode] = useState<'strategy' | 'detail'>('strategy'); // New state for drill-down
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodesState, setNodesState] = useState<MapNode[]>([]);
  const [showBench, setShowBench] = useState(true);
  const [lastRemovedPosition, setLastRemovedPosition] = useState<{ x: number; y: number; allocatedTo?: string } | null>(null);
  
  // Collapsible Branches State
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([]);

  // Sidebar Position State
  const [sidebarSide, setSidebarSide] = useState<'left' | 'right'>('right');
  const [sidebarTab, setSidebarTab] = useState<'status' | 'files'>('status');

  // Transform State for Pan/Zoom
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.8 });
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const transformStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false); // To distinguish click vs drag

  // State for collapsible expert registry categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const canvasRef = useRef<HTMLDivElement>(null);

  // Fetch initial data whenever Project ID changes
  useEffect(() => {
    // Always fetch fresh data for the specific project ID, passing type for context
    const initialData = getProjectData(projectId, projectType);
    setNodesState(initialData.nodes);
    
    // Reset View State to defaults
    setViewMode('strategy');
    setTransform({ x: 0, y: 0, k: 0.8 });
    setSelectedNode(null);
    setFocusedNodeId(null);
    setShowBench(true);
    setExpandedNodeIds([]);
    setExpandedCategories({});
  }, [projectId, projectType]);

  // Sync Bench visibility with ViewMode
  useEffect(() => {
    if (viewMode === 'detail') {
        setShowBench(false);
        // Center initial view roughly
        if (canvasRef.current) {
             const cx = canvasRef.current.clientWidth / 2;
             const cy = canvasRef.current.clientHeight / 2;
             setTransform({ x: cx - 600 * 0.8, y: cy - 450 * 0.8, k: 0.8 });
        }
    } else {
        setShowBench(true);
        setTransform({ x: 0, y: 0, k: 0.8 }); 
    }
  }, [viewMode]);

  // --- VISIBILITY LOGIC ---
  
  // Recursively check if a node should be visible based on its parent's expansion state
  const isNodeVisible = (node: MapNode): boolean => {
      // If it has no parent ID, it's a top-level node (always visible in detail view if not expert)
      if (!node.parentId) return true;
      
      // If it has a parent, the parent must be expanded AND the parent itself must be visible
      const parentIsExpanded = expandedNodeIds.includes(node.parentId);
      const parentNode = nodesState.find(n => n.id === node.parentId);
      
      if (!parentNode) return true; // Fallback

      return parentIsExpanded && isNodeVisible(parentNode);
  };

  const hasChildren = (nodeId: string) => {
      return nodesState.some(n => n.parentId === nodeId);
  };

  const activeNodeData = nodesState.find(n => n.id === selectedNode);
  const activeSidebarData: SidebarData | null = activeNodeData ? getNodeSidebarData(activeNodeData, nodesState) : null;

  const toggleCategory = (role: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  // --- TRANSITION LOGIC: STRATEGY -> DETAIL ---
  const switchToDetailView = () => {
    // 1. Capture current experts from Strategy Board
    const activeExperts = nodesState.filter(n => n.type === 'expert');

    // 2. Get fresh Detail Structure
    const detailData = getProjectDetailData(projectId, projectType);
    let newDetailNodes = [...detailData.nodes];

    // 3. Map Strategy Experts to Anatomy Categories
    newDetailNodes = newDetailNodes.map(node => {
        let expertToAssign = null;
        
        // Dynamic Mapping based on project Type
        if (projectType === 'Arbitration') {
             if (node.id === 'd_plead') expertToAssign = activeExperts.find(e => e.role === 'Oversight' || e.role === 'Forensic');
             else if (node.id === 'd_expert') expertToAssign = activeExperts.find(e => e.role === 'Quantum');
             else if (node.id === 'd_evidence') expertToAssign = activeExperts.find(e => e.role === 'Delay');
             else if (node.id === 'd_disclosure') expertToAssign = activeExperts.find(e => e.role === 'Legal');
        } else {
             if (node.id === 'd_cost') expertToAssign = activeExperts.find(e => e.role === 'Quantum');
             else if (node.id === 'd_sched') expertToAssign = activeExperts.find(e => e.role === 'Delay');
             else if (node.id === 'd_risk') expertToAssign = activeExperts.find(e => e.role === 'Forensic');
        }

        if (expertToAssign) {
            return {
                ...node,
                assignedExpert: {
                    name: expertToAssign.label,
                    role: expertToAssign.role || 'Expert',
                    imageUrl: expertToAssign.imageUrl || ''
                }
            };
        }
        return node;
    });

    setNodesState(newDetailNodes);
    setExpandedNodeIds([]); // Reset expansion state
    setViewMode('detail');
    setSelectedNode(null);
  };

  // --- TRANSITION LOGIC: DETAIL -> STRATEGY ---
  const switchToStrategyView = () => {
    // 1. Capture currently assigned experts from Detail View
    const expertsToAdd: MapNode[] = [];
    
    // Helper to find assigned expert in detail nodes
    const findExpert = (nodeId: string, defaultRole: string, defaultX: number, defaultY: number, targetCat: string) => {
        const node = nodesState.find(n => n.id === nodeId);
        if (node?.assignedExpert) {
             expertsToAdd.push({
                id: `exp_${Date.now()}_${Math.random()}`,
                label: node.assignedExpert.name,
                type: 'expert',
                role: node.assignedExpert.role as any,
                x: defaultX, 
                y: defaultY,
                imageUrl: node.assignedExpert.imageUrl,
                allocatedTo: targetCat,
                description: `Senior ${node.assignedExpert.role}`
            });
        }
    };

    if (projectType === 'Arbitration') {
        findExpert('d_plead', 'Oversight', 600, 800, 'cat_pleadings');
        findExpert('d_expert', 'Quantum', 350, 600, 'cat_quantum');
        findExpert('d_evidence', 'Delay', 850, 600, 'cat_evidence');
    } else {
        findExpert('d_cost', 'Quantum', 350, 600, 'cat_finance');
        findExpert('d_sched', 'Delay', 850, 600, 'cat_events');
        findExpert('d_risk', 'Forensic', 450, 250, 'cat_contract');
    }

    // 2. Get fresh Strategy Structure
    const strategyData = getProjectData(projectId, projectType);
    
    // Filter out default experts from the fresh data to replace them with the "live" ones we just captured
    // (In a real app, we'd merge state more carefully, but here we just re-instantiate active experts)
    // Actually, for simplicity in this demo, let's just reload the base strategy data 
    // but typically we would preserve the *exact* experts if they were swapped. 
    // To keep it simple: we reload base data. If we want persistence, we'd use the `expertsToAdd` array.
    
    setNodesState(strategyData.nodes); // Reset to default strategy layout
    setViewMode('strategy');
    setSelectedNode(null);
    setTransform({ x: 0, y: 0, k: 0.8 });
  };


  const handleAddExpert = (poolItem: any) => {
     if (viewMode === 'detail') return;

     // --- SWAP / DESELECT LOGIC ---
     const existingExpertIndex = nodesState.findIndex(n => n.type === 'expert' && n.role === poolItem.role);
     
     let newNodes = [...nodesState];
     let position = lastRemovedPosition || { x: 600, y: 450, allocatedTo: undefined };

     if (!lastRemovedPosition) {
         if (projectType === 'Arbitration') {
             if (poolItem.role === 'Quantum') position = { x: 350, y: 600, allocatedTo: 'cat_quantum' };
             if (poolItem.role === 'Delay') position = { x: 850, y: 600, allocatedTo: 'cat_evidence' };
             if (poolItem.role === 'Oversight') position = { x: 600, y: 800, allocatedTo: 'cat_pleadings' };
             if (poolItem.role === 'Legal') position = { x: 400, y: 150, allocatedTo: 'cat_pleadings' };
         } else {
             if (poolItem.role === 'Quantum') position = { x: 350, y: 600, allocatedTo: 'cat_finance' };
             if (poolItem.role === 'Delay') position = { x: 850, y: 600, allocatedTo: 'cat_events' };
             if (poolItem.role === 'Forensic') position = { x: 450, y: 250, allocatedTo: 'cat_contract' };
         }
     }

     if (existingExpertIndex !== -1) {
         const existing = newNodes[existingExpertIndex];
         position = { x: existing.x, y: existing.y, allocatedTo: existing.allocatedTo };
         newNodes.splice(existingExpertIndex, 1);
     }

     const newNode: MapNode = {
        id: `exp_${Date.now()}`,
        label: poolItem.name,
        type: 'expert',
        role: poolItem.role as any,
        x: position.x,
        y: position.y,
        allocatedTo: position.allocatedTo,
        imageUrl: poolItem.img,
        description: `Senior ${poolItem.role} Expert. Added from global pool.`
     };

     newNodes.push(newNode);
     setNodesState(newNodes);
     setSelectedNode(newNode.id);
     setLastRemovedPosition(null);
  };

  const removeExpert = (id: string) => {
     const expertToRemove = nodesState.find(n => n.id === id);
     if (expertToRemove) {
        setLastRemovedPosition({
            x: expertToRemove.x,
            y: expertToRemove.y,
            allocatedTo: expertToRemove.allocatedTo
        });
     }
     setNodesState(prev => prev.filter(n => n.id !== id));
     setSelectedNode(null);
  };
  
  const groupedExperts = EXPERT_POOL.reduce((acc, expert) => {
    const roleKey = expert.role as keyof typeof acc;
    (acc[roleKey] = acc[roleKey] || []).push(expert);
    return acc;
  }, {} as Record<string, typeof EXPERT_POOL>);

  const roleTitles: Record<string, string> = {
    Quantum: "Quantum Experts",
    Delay: "Delay Analysts",
    Forensic: "Forensic Specialists",
    Legal: "Legal Counsel"
  };

  const focusOnNode = (node: MapNode) => {
    if (!canvasRef.current) return;
    const { clientWidth, clientHeight } = canvasRef.current;
    const targetScale = 1.4; 
    const newX = (clientWidth / 2) - (node.x * targetScale);
    const newY = (clientHeight / 2) - (node.y * targetScale);
    
    setTransform({ x: newX, y: newY, k: targetScale });
    setFocusedNodeId(node.id);
    setSelectedNode(node.id);
  };

  const resetFocus = () => {
      if (!canvasRef.current) return;
      setFocusedNodeId(null);
      const cx = canvasRef.current.clientWidth / 2;
      const cy = canvasRef.current.clientHeight / 2;
      setTransform({ x: cx - 600 * 0.8, y: cy - 450 * 0.8, k: 0.8 });
  };

  const handleNodeClick = (e: React.MouseEvent, node: MapNode) => {
    e.stopPropagation(); 
    const newSide = node.x >= 600 ? 'left' : 'right';
    setSidebarSide(newSide);

    if (node.type === 'root' && viewMode === 'strategy') {
        switchToDetailView();
        return;
    }

    if (viewMode === 'strategy' && node.type === 'expert' && node.role) {
        setShowBench(true);
        setExpandedCategories(prev => ({ ...prev, [node.role!]: true }));
    }

    if (viewMode === 'detail') {
        if (node.assignedExpert || node.type === 'category') {
             focusOnNode(node);
             return;
        }
    }

    setSidebarTab('status');
    setSelectedNode(node.id);
  };

  const handleExpandClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setExpandedNodeIds(prev => 
        prev.includes(nodeId) 
            ? prev.filter(id => id !== nodeId) // Collapse
            : [...prev, nodeId] // Expand
    );
  };

  const handleBackNavigation = () => {
    if (viewMode === 'detail') {
        if (focusedNodeId) {
            resetFocus();
        } else {
            switchToStrategyView();
        }
    } else {
        onExitProject();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    transformStartRef.current = { x: transform.x, y: transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMovedRef.current = true;
    setTransform(prev => ({ ...prev, x: transformStartRef.current.x + dx, y: transformStartRef.current.y + dy }));
  };

  const handleMouseUp = () => { setIsDragging(false); };

  const handleBackgroundClick = (e: React.MouseEvent) => {
      if (hasMovedRef.current) return;
      if (viewMode === 'detail' && focusedNodeId) resetFocus();
      setSelectedNode(null);
  };

  const isRightSidebar = sidebarSide === 'right';
  const currentConnections = viewMode === 'strategy' ? getProjectData(projectId, projectType).connections : getProjectDetailData(projectId, projectType).connections;


  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* 1. EXPERT BENCH */}
      <div className={`w-80 bg-slate-900 border-r border-white/10 flex flex-col transition-all duration-500 z-50 ${showBench && viewMode === 'strategy' ? 'translate-x-0' : '-translate-x-full absolute'}`}>
          <div className="p-6 border-b border-white/10 bg-slate-800/50 flex-1 overflow-y-auto">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-red-500">Expert Registry</h2>
                <button onClick={() => setShowBench(false)} className="text-slate-500 hover:text-white"><XMarkIcon className="w-5 h-5"/></button>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase mb-6">Allocate Team to Workstreams</p>
             
             <div className="space-y-4">
                {Object.entries(groupedExperts).map(([role, experts]) => {
                  const isExpanded = !!expandedCategories[role];
                  return (
                    <div key={role} className="border border-white/5 rounded-2xl overflow-hidden bg-slate-800/20">
                      <button onClick={() => toggleCategory(role)} className="w-full flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{roleTitles[role] || `${role} Specialists`}</h3>
                        {isExpanded ? <ChevronDownIcon className="w-3 h-3 text-slate-500"/> : <ChevronRightIcon className="w-3 h-3 text-slate-500"/>}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-2 space-y-2 animate-fade-in">
                          {experts.map(item => {
                             const isActiveOnField = nodesState.some(n => n.label === item.name);
                             return (
                                <div key={item.id} onClick={() => !isActiveOnField && handleAddExpert(item)} className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${isActiveOnField ? 'opacity-40 grayscale bg-black/20 border-slate-800' : 'bg-slate-800 border-white/10 hover:border-red-500 hover:shadow-xl'}`}>
                                   <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/20">
                                      <img src={item.img} className="w-full h-full object-cover" />
                                   </div>
                                   <div className="flex-1">
                                      <h3 className="text-[11px] font-black uppercase tracking-tight">{item.name}</h3>
                                      <span className="text-[8px] text-red-500 font-bold uppercase">{item.role}</span>
                                   </div>
                                   {!isActiveOnField && (
                                     <div className="text-right"><BoltIcon className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /></div>
                                   )}
                                </div>
                             );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
          
          <div className="p-6 bg-slate-950 shrink-0">
             <div className="bg-red-600/10 border border-red-500/20 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-red-500">
                   <ShieldCheckIcon className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase">Oversight Manager</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full border-2 border-red-600 overflow-hidden shrink-0">
                      <img src={ANDREW_BOWLER_IMG} className="w-full h-full object-cover" />
                   </div>
                   <span className="text-xs font-bold truncate">Andrew John Bowler</span>
                </div>
             </div>
          </div>
      </div>

      {/* 2. TACTICAL HUB CONTENT */}
      <div className="flex-1 flex flex-col relative">
          
          <div className="p-6 flex-1 flex flex-col gap-6">
            {/* HUD HEADER */}
            <div className="h-16 flex items-center justify-between z-40 px-8 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl shrink-0">
              <div className="flex items-center gap-6">
                  {!showBench && viewMode === 'strategy' && (
                    <button onClick={() => setShowBench(true)} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700">
                        <UserGroupIcon className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <button onClick={handleBackNavigation} className="p-2 bg-red-600 hover:bg-red-700 rounded-xl transition-all">
                      <ArrowLeftIcon className="w-5 h-5" />
                  </button>

                  <div>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                        {viewMode === 'strategy' ? (projectType === 'Arbitration' ? 'Case Strategy' : 'Skyline Tower') : (projectType === 'Arbitration' ? 'Tribunal Anatomy' : 'Project Anatomy')}
                        <span className={`text-white not-italic px-2 py-0.5 rounded text-[10px] font-bold ${viewMode === 'strategy' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {viewMode === 'strategy' ? 'STRATEGY HUB' : 'DEEP DIVE'}
                        </span>
                    </h1>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">
                        {viewMode === 'strategy' ? 'Parenting Mode Active' : (focusedNodeId ? 'FOCUSED CLUSTER ACTIVE' : 'Detailed Analysis View')}
                    </p>
                  </div>
              </div>

              <div className="flex items-center gap-4">
                  {focusedNodeId && (
                      <button onClick={resetFocus} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider animate-fade-in shadow-lg shadow-blue-900/50">
                          <MagnifyingGlassMinusIcon className="w-4 h-4" /> Reset View
                      </button>
                  )}
                  <div className="flex bg-white/10 rounded-xl p-1 border border-white/5">
                    <button onClick={() => setTransform(t => ({...t, k: Math.max(0.4, t.k - 0.1)}))} className="p-2 hover:bg-white/10 rounded-lg"><MinusIcon className="w-4 h-4"/></button>
                    <button onClick={() => setTransform(t => ({...t, k: Math.min(2.5, t.k + 0.1)}))} className="p-2 hover:bg-white/10 rounded-lg"><PlusIcon className="w-4 h-4"/></button>
                  </div>
                  <button onClick={onToggleLogicLog} className="p-3 bg-red-600 rounded-xl shadow-lg hover:rotate-12 transition-transform"><CpuChipIcon className="w-5 h-5" /></button>
              </div>
            </div>

            {/* MAIN FIELD AREA */}
            <div 
              ref={canvasRef}
              className={`flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)] rounded-2xl ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setIsDragging(false)}
              onClick={handleBackgroundClick}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              <div 
                className="absolute inset-0 origin-top-left"
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
                    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {currentConnections.map((conn, i) => {
                        const start = nodesState.find(n => n.id === conn.from);
                        const end = nodesState.find(n => n.id === conn.to);
                        
                        if (!start || !end) return null;
                        
                        // VISIBILITY CHECK: Only render connection if both nodes are visible
                        if (viewMode === 'detail' && (!isNodeVisible(start) || !isNodeVisible(end))) {
                            return null;
                        }
                        
                        // Check visibility of connection (Simplified Blur)
                        const opacity = (focusedNodeId && start.id !== focusedNodeId && end.id !== focusedNodeId) ? 0.1 : 1;

                        // Strategy Mode: Straight Lines
                        if (viewMode === 'strategy') {
                             return <path key={`c-${i}`} d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} stroke="#1e293b" strokeWidth="2" fill="none" opacity={opacity} className="transition-opacity duration-500" />;
                        }

                        // Detail Mode: Curved "Sag" Lines (Bezier)
                        const cp1X = start.x + (end.x - start.x) / 2;
                        const cp1Y = start.y;
                        const cp2X = end.x - (end.x - start.x) / 2;
                        const cp2Y = end.y;
                        
                        const isVertical = Math.abs(start.x - end.x) < 50;
                        const d = isVertical 
                            ? `M ${start.x} ${start.y} C ${start.x} ${start.y + (end.y - start.y)/2}, ${end.x} ${end.y - (end.y - start.y)/2}, ${end.x} ${end.y}`
                            : `M ${start.x} ${start.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${end.x} ${end.y}`;

                        return <path key={`c-${i}`} d={d} stroke="#334155" strokeWidth="2" fill="none" opacity={opacity} className="transition-opacity duration-500" />;
                      })}

                      {/* Parent-to-Category glowing link - Strategy Mode Only */}
                      {viewMode === 'strategy' && nodesState.filter(n => n.type === 'expert' && n.allocatedTo).map((expert, i) => {
                        const target = nodesState.find(n => n.id === expert.allocatedTo);
                        if (!target) return null;
                        
                        return (
                            <path 
                              key={`p-link-${i}`} 
                              d={`M ${expert.x} ${expert.y} L ${target.x} ${target.y}`} 
                              stroke="#3b82f6" 
                              strokeWidth="3" 
                              fill="none" 
                              opacity="0.6"
                              className="animate-pulse"
                            />
                        );
                      })}
                  </svg>

                  {nodesState.map(node => {
                      // VISIBILITY CHECK: Hide if parent is collapsed
                      if (viewMode === 'detail' && !isNodeVisible(node)) return null;

                      const isSelected = selectedNode === node.id;
                      const isAllocatedTarget = nodesState.some(n => n.allocatedTo === node.id);
                      // Simplified blur logic
                      const isBlurred = focusedNodeId && node.id !== focusedNodeId && !currentConnections.some(c => (c.from === focusedNodeId && c.to === node.id) || (c.to === focusedNodeId && c.from === node.id));
                      const isParentWithChildren = hasChildren(node.id) && viewMode === 'detail';
                      const isExpanded = expandedNodeIds.includes(node.id);
                      
                      // Differentiate styling for sub-nodes (items with parentId) vs Category/Root nodes
                      const isSubNode = !!node.parentId;

                      return (
                          <div 
                              key={node.id}
                              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-all duration-500 
                                  ${isSelected ? 'z-30' : ''}
                                  ${isBlurred ? 'opacity-20 blur-[2px] grayscale' : 'opacity-100'}
                              `}
                              style={{ left: node.x, top: node.y }}
                              onClick={(e) => handleNodeClick(e, node)}
                          >
                              {node.type === 'expert' ? (
                                  <div className="flex flex-col items-center group">
                                    <div className={`relative w-24 h-24 rounded-2xl border-4 shadow-2xl overflow-hidden transition-all duration-300 ${isSelected ? 'border-blue-500 scale-125' : (node.allocatedTo ? 'border-emerald-500' : 'border-white/10 group-hover:scale-110')}`}>
                                        <img src={node.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div className={`mt-4 bg-black/90 px-4 py-1.5 rounded-xl border transition-all ${isSelected ? 'border-blue-500' : 'border-white/10'} flex flex-col items-center`}>
                                        <span className="text-[10px] font-black uppercase italic whitespace-nowrap">{node.label}</span>
                                        <span className="text-[7px] text-red-500 font-black uppercase tracking-widest">{node.role}</span>
                                    </div>
                                  </div>
                              ) : (
                                  <div className={`
                                    group flex items-center relative transition-all duration-500 border-2 overflow-hidden shadow-2xl
                                    ${isSubNode 
                                        ? 'px-4 py-2 rounded-xl bg-slate-800/90 border-slate-700/50 hover:border-slate-500 gap-3' 
                                        : 'px-6 py-3 rounded-[1.5rem] gap-4 ' + (node.type === 'root' 
                                            ? (viewMode === 'strategy' ? 'bg-red-600 border-white text-white hover:scale-110 hover:shadow-red-500/50' : 'bg-blue-600 border-white text-white') 
                                            : 'bg-slate-900/80 backdrop-blur-md border-white/10 hover:border-white/40')
                                    }
                                    ${(isAllocatedTarget && viewMode === 'strategy') ? 'border-emerald-500 shadow-emerald-500/10' : ''}
                                    ${isSelected ? 'scale-110 border-blue-500' : ''}
                                    ${node.assignedExpert ? 'pr-2' : ''} 
                                  `}>
                                      {/* Side Arrow Expansion Button */}
                                      {isParentWithChildren && (
                                         <button 
                                            onClick={(e) => handleExpandClick(e, node.id)}
                                            className={`
                                                absolute -right-8 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 
                                                flex items-center justify-center hover:bg-slate-700 hover:border-slate-400
                                                transition-all shadow-lg z-50
                                                ${isExpanded ? 'bg-blue-600 border-blue-500' : ''}
                                            `}
                                         >
                                            <ChevronRightIcon className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                         </button>
                                      )}

                                      <div className={`rounded-xl shrink-0 ${isSubNode ? 'p-1.5 bg-white/5' : 'p-2 ' + (node.type === 'root' ? 'bg-black/20' : 'bg-white/5')}`}>
                                          {React.createElement(node.icon || DocumentTextIcon, { className: isSubNode ? "w-4 h-4 text-white" : "w-6 h-6 text-white" })}
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                          <span className={`${isSubNode ? 'font-bold uppercase tracking-tight text-[10px]' : 'font-black uppercase tracking-tight text-xs'} block truncate`}>{node.label}</span>
                                          {/* Hint for root node in Strategy mode */}
                                          {node.type === 'root' && viewMode === 'strategy' && (
                                              <span className="text-[8px] font-bold text-white/70 uppercase tracking-widest block mt-0.5 animate-pulse">Click to Enter</span>
                                          )}
                                      </div>

                                      {/* Embedded Expert Display */}
                                      {node.assignedExpert && (
                                        <div className="flex items-center gap-2 pl-3 border-l border-white/20 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <span className="block text-[8px] text-slate-300 font-bold leading-tight">{node.assignedExpert.name}</span>
                                                <span className="block text-[6px] text-emerald-400 uppercase tracking-wider">{node.assignedExpert.role}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 overflow-hidden shrink-0 shadow-lg relative">
                                                <img src={node.assignedExpert.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                      )}
                                  </div>
                              )}
                          </div>
                      );
                  })}
              </div>
            </div>
          </div>


          {/* DETAIL SIDEBAR (Updated with Status, Files, and Parent Aggregation) */}
          <div className={`
             absolute top-0 bottom-0 w-96 bg-black/60 backdrop-blur-3xl transition-transform duration-500 z-50 
             ${isRightSidebar ? 'right-0 border-l border-white/10' : 'left-0 border-r border-white/10'}
             ${selectedNode 
                 ? 'translate-x-0' 
                 : (isRightSidebar ? 'translate-x-full' : '-translate-x-full')
             }
             flex flex-col
          `}>
             {activeNodeData && (
                <div className="flex flex-col h-full animate-fade-in">
                   {/* 1. Sidebar Header */}
                   <div className="p-6 border-b border-white/10 flex justify-between items-start shrink-0">
                      <div>
                          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-1">
                            {activeNodeData.type === 'root' ? 'Project Intelligence' : 'Node Detail'}
                          </h2>
                          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{activeNodeData.label}</h1>
                          {activeNodeData.assignedExpert && (
                              <div className="flex items-center gap-2 mt-2">
                                <img src={activeNodeData.assignedExpert.imageUrl} className="w-6 h-6 rounded-full border border-emerald-500" />
                                <span className="text-[10px] text-emerald-400 font-bold">{activeNodeData.assignedExpert.name}</span>
                              </div>
                          )}
                      </div>
                      <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                   </div>

                   {/* 2. Tabs */}
                   <div className="flex border-b border-white/10 shrink-0">
                      <button 
                        onClick={() => setSidebarTab('status')} 
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${sidebarTab === 'status' ? 'bg-white/10 text-white border-b-2 border-red-500' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                      >
                         Status & Updates
                      </button>
                      <button 
                        onClick={() => setSidebarTab('files')} 
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${sidebarTab === 'files' ? 'bg-white/10 text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                      >
                         Documents
                      </button>
                   </div>

                   {/* 3. Content Area */}
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                       
                       {/* STATUS TAB */}
                       {sidebarTab === 'status' && activeSidebarData && (
                           <>
                               {/* Latest Update Card */}
                               <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-4 relative overflow-hidden group">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                                  <div className="flex justify-between items-start mb-3 pl-3">
                                      <div className="flex items-center gap-3">
                                          <img src={activeSidebarData.latestUpdate.fromImg} className="w-8 h-8 rounded-full border border-white/20" />
                                          <div>
                                              <p className="text-[10px] font-bold text-slate-300 uppercase">Latest Update</p>
                                              <p className="text-xs font-bold text-white">{activeSidebarData.latestUpdate.from}</p>
                                          </div>
                                      </div>
                                      <span className="text-[10px] text-slate-500 font-mono">{activeSidebarData.latestUpdate.date}</span>
                                  </div>
                                  <div className="pl-3 space-y-2">
                                      <p className="text-sm font-bold text-white">{activeSidebarData.latestUpdate.subject}</p>
                                      <p className="text-xs text-slate-400 leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">
                                          "{activeSidebarData.latestUpdate.preview}"
                                      </p>
                                  </div>
                               </div>

                               {/* Parent View: Child Workstream Overview */}
                               {activeSidebarData.subNodeUpdates && (
                                   <div>
                                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                                           <BuildingOfficeIcon className="w-3 h-3" /> Sub-Node Workstreams
                                       </h3>
                                       <div className="space-y-3">
                                           {activeSidebarData.subNodeUpdates.map((sub, idx) => (
                                               <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                                                   <div>
                                                       <p className="text-xs font-bold text-white mb-1">{sub.label}</p>
                                                       <div className="flex items-center gap-2">
                                                           <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                                                               <div className="h-full bg-blue-500" style={{ width: `${sub.completion}%` }}></div>
                                                           </div>
                                                           <span className="text-[9px] text-slate-400">{sub.completion}%</span>
                                                       </div>
                                                   </div>
                                                   <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${sub.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' : (sub.status === 'Flagged' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400')}`}>
                                                       {sub.status}
                                                   </span>
                                               </div>
                                           ))}
                                       </div>
                                   </div>
                               )}
                           </>
                       )}

                       {/* FILES TAB */}
                       {sidebarTab === 'files' && activeSidebarData && (
                           <div className="space-y-2">
                               {activeSidebarData.documents.map((file) => (
                                   <div key={file.id} className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl cursor-pointer transition-all">
                                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${file.type === 'pdf' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                           {file.type === 'pdf' ? <DocumentTextIcon className="w-6 h-6" /> : <BanknotesIcon className="w-6 h-6" />}
                                       </div>
                                       <div className="flex-1 min-w-0">
                                           <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{file.name}</p>
                                           <div className="flex items-center gap-2 mt-0.5">
                                               <span className="text-[10px] text-slate-500">{file.size}</span>
                                               <span className="w-0.5 h-0.5 rounded-full bg-slate-600"></span>
                                               <span className="text-[10px] text-slate-500">{file.date}</span>
                                           </div>
                                       </div>
                                       <button className="text-slate-500 hover:text-white p-2">
                                           <ArrowDownTrayIcon className="w-4 h-4" />
                                       </button>
                                   </div>
                               ))}
                               {activeSidebarData.documents.length === 0 && (
                                   <div className="text-center py-8 text-slate-500 text-xs italic">
                                       No documents attached to this node.
                                   </div>
                               )}
                           </div>
                       )}

                   </div>

                   {/* 4. Sidebar Footer */}
                   <div className="p-4 border-t border-white/10 bg-slate-900 shrink-0">
                        {activeNodeData.type === 'expert' && activeNodeData.role !== 'Oversight' ? (
                            <button onClick={() => removeExpert(activeNodeData.id)} className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors">Recall Expert to Bench</button>
                        ) : (
                            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all">
                                <EnvelopeIcon className="w-4 h-4" /> Contact Team
                            </button>
                        )}
                   </div>
                </div>
             )}
          </div>
      </div>
    </div>
  );
};