
import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  DocumentTextIcon, 
  TableCellsIcon, 
  ClockIcon, 
  ArrowPathIcon,
  CpuChipIcon,
  LockClosedIcon,
  CommandLineIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  Squares2X2Icon,
  ArchiveBoxIcon,
  MapIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { EmbeddedExcel } from './EmbeddedExcel';
import { LogicLog } from './LogicLog';
import { getProjectData } from '../utils/mindMapUtils';

interface Project {
  id: string;
  name: string;
}

interface Props {
  onBack: () => void;
  project: Project | null;
  onExitProject: () => void;
  onToggleLogicLog: () => void;
  onOpenApp?: (appId: string) => void;
}

interface TimesheetLog {
  id: string;
  resourceName: string;
  activityType: 'Reviewing' | 'Editing' | 'Analysis' | 'Forensic Check';
  startTime: number;
  endTime: number;
  durationSec: number;
}

export const CommandCenter: React.FC<Props> = ({ onBack, project, onExitProject, onToggleLogicLog, onOpenApp }) => {
  // --- STATE ---
  const [arbitrationMode, setArbitrationMode] = useState(false);
  const [activePopup, setActivePopup] = useState<'logic' | 'evidence' | 'mindmap' | 'arbitration' | null>(null);
  
  // Document Viewing State
  const [activeDocTitle, setActiveDocTitle] = useState("Expert Orion - Delay Analysis Report.pdf");
  const [activeExcelTitle, setActiveExcelTitle] = useState("Merged Project Contexts – Oast Analysis.xlsx");
  const [docContent, setDocContent] = useState<string>("default");

  // Timesheet Tracking State
  const [sessionLogs, setSessionLogs] = useState<TimesheetLog[]>([]);
  const [currentTaskStart, setCurrentTaskStart] = useState<number>(Date.now());
  const [currentResource, setCurrentResource] = useState<string>("Expert Orion - Delay Analysis Report.pdf");
  const [currentActivity, setCurrentActivity] = useState<'Reviewing' | 'Editing' | 'Analysis' | 'Forensic Check'>('Reviewing');
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // --- LOGIC ---

  // Helper to commit the current running task to the log
  const commitLog = (nextResource: string, nextActivity: typeof currentActivity) => {
    const now = Date.now();
    const duration = (now - currentTaskStart) / 1000; // seconds

    // Only log significant actions (> 2 seconds) to avoid noise
    if (duration > 2) {
      const newEntry: TimesheetLog = {
        id: Math.random().toString(36).substr(2, 9),
        resourceName: currentResource,
        activityType: currentActivity,
        startTime: currentTaskStart,
        endTime: now,
        durationSec: duration
      };
      setSessionLogs(prev => [...prev, newEntry]);
    }

    // Reset for new task
    setCurrentResource(nextResource);
    setCurrentActivity(nextActivity);
    setCurrentTaskStart(now);
  };

  const handleFileSelect = (name: string, type: string) => {
      if (type === 'xls') {
          setActiveExcelTitle(name);
          commitLog(name, "Editing");
      } else {
          setActiveDocTitle(name);
          setDocContent(name); // In a real app, this would load content
          commitLog(name, "Reviewing");
      }
      // Close popup on select for cleaner UX
      setActivePopup(null); 
  };

  const toggleArbitration = () => {
    const newMode = !arbitrationMode;
    setArbitrationMode(newMode);
    
    // Logic for AI Engine
    if (newMode) {
      commitLog(activeExcelTitle, "Forensic Check");
      setIsAnalyzing(true);
      setAnalysisResult(null);
      setActivePopup('arbitration'); // Auto-open the sidebar panel
      // Simulate AI Processing
      setTimeout(() => {
         setIsAnalyzing(false);
         setAnalysisResult("DISCREPANCY DETECTED: Clause 2.4 Notice Period vs. Cost Line Item #15 (Date Mismatch)");
      }, 2500);
    } else {
      commitLog(activeDocTitle, "Reviewing");
      setIsAnalyzing(false);
      setAnalysisResult(null);
      if (activePopup === 'arbitration') setActivePopup(null); // Auto-close if open
    }
  };

  const initiateClose = () => {
    // Commit the final open task before showing modal
    commitLog(currentResource, currentActivity);
    setShowTimesheetModal(true);
  };

  const confirmExit = () => {
      setShowTimesheetModal(false);
      onExitProject();
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // --- RENDER ---

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden relative">
      
      {/* -----------------------------
          TIMESHEET MODAL OVERLAY 
      ----------------------------- */}
      {showTimesheetModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                       <ClockIcon className="w-6 h-6" />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold text-slate-800">Session Timesheet</h2>
                       <p className="text-sm text-slate-500">Review generated billable activity before closing.</p>
                    </div>
                 </div>
                 <button onClick={() => setShowTimesheetModal(false)} className="text-slate-400 hover:text-slate-600">
                    <XMarkIcon className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                       <tr>
                          <th className="px-4 py-3 rounded-l-lg">Resource / File</th>
                          <th className="px-4 py-3">Activity</th>
                          <th className="px-4 py-3 text-right rounded-r-lg">Duration</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {sessionLogs.length === 0 ? (
                          <tr>
                             <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">
                                No significant activity recorded this session.
                             </td>
                          </tr>
                       ) : (
                          sessionLogs.map(log => (
                             <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-700 flex items-center gap-2">
                                   {log.resourceName.includes('xlsx') ? <TableCellsIcon className="w-4 h-4 text-green-600"/> : 
                                    log.resourceName.includes('pdf') ? <DocumentTextIcon className="w-4 h-4 text-red-500"/> :
                                    <CpuChipIcon className="w-4 h-4 text-blue-500"/>}
                                   {log.resourceName}
                                </td>
                                <td className="px-4 py-3">
                                   <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      log.activityType === 'Forensic Check' ? 'bg-red-100 text-red-700' :
                                      log.activityType === 'Editing' ? 'bg-blue-100 text-blue-700' :
                                      'bg-slate-100 text-slate-600'
                                   }`}>
                                      {log.activityType}
                                   </span>
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-slate-600">
                                   {formatDuration(log.durationSec)}
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-100">
                       <tr>
                          <td className="px-4 py-4 font-bold text-slate-800">Total Session Time</td>
                          <td></td>
                          <td className="px-4 py-4 text-right font-bold text-emerald-600 text-lg">
                             {formatDuration(sessionLogs.reduce((acc, curr) => acc + curr.durationSec, 0))}
                          </td>
                       </tr>
                    </tfoot>
                 </table>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                 <button 
                    onClick={() => setShowTimesheetModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                 >
                    Resume Work
                 </button>
                 <button 
                    onClick={confirmExit}
                    className="px-6 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                 >
                    <CheckCircleIcon className="w-5 h-5" />
                    Save Log & Exit
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 1. TOP BAR */}
      <header className="h-14 bg-red-600 border-b border-red-700 flex items-center justify-between px-4 shrink-0 shadow-lg z-20 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <CommandLineIcon className="w-6 h-6" />
            <div>
                <span className="font-bold text-lg tracking-tight text-white drop-shadow-md">QS Command Center</span>
                {project && <span className="text-xs text-red-100 block opacity-80">{project.name}</span>}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
             <button className="px-4 py-1.5 text-xs font-bold text-white bg-black hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-md transition-all hover:shadow-lg border border-slate-800">
                <LockClosedIcon className="w-3 h-3" /> Edit
             </button>
             <button className="px-4 py-1.5 text-xs font-bold text-white bg-black hover:bg-slate-800 rounded-lg shadow-md transition-all hover:shadow-lg border border-slate-800">
                View
             </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8 relative">
           <MagnifyingGlassIcon className="w-4 h-4 text-red-100 absolute left-3 top-1/2 -translate-y-1/2" />
           <input 
             type="text" 
             placeholder="Search contracts, clauses, or formula logic..." 
             className="w-full bg-black/20 border border-black/10 text-white text-sm rounded-lg py-1.5 pl-9 pr-4 focus:outline-none focus:bg-black/30 placeholder-red-100/70 shadow-inner"
           />
        </div>

        <div className="flex items-center gap-4">
           {/* Logic Log Button */}
           <button 
              onClick={onToggleLogicLog}
              className="p-2 rounded-lg bg-black/20 hover:bg-black/30 text-white border border-red-500/50 transition-colors"
              title="Open Global Logic Log"
           >
              <CpuChipIcon className="w-5 h-5" />
           </button>

           {/* Arbitration Toggle */}
           <div className="flex items-center gap-3 bg-black/20 rounded-full border border-black/10 p-1 pr-4 backdrop-blur-sm">
              <button 
                onClick={toggleArbitration}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${arbitrationMode ? 'bg-red-500' : 'bg-slate-800'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${arbitrationMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-xs font-bold tracking-wide ${arbitrationMode ? 'text-white animate-pulse' : 'text-red-100'}`}>
                {arbitrationMode ? 'ARBITRATION MODE' : 'STANDARD VIEW'}
              </span>
           </div>

           <div className="h-6 w-px bg-red-800 mx-2"></div>

           {/* Close Button */}
           <button 
              onClick={initiateClose}
              className="flex items-center gap-2 text-xs font-bold text-white bg-black border border-slate-800 px-4 py-1.5 rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all"
           >
              <ArrowLeftIcon className="w-3 h-3" /> Close Project
           </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex flex-1 overflow-hidden relative">
         
         {/* A. COMMAND CENTER TOOLBAR (Left Sidebar) */}
         <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-4 z-30 shrink-0">
             
             {/* Evidence / Documents */}
             <SidebarBtn 
                icon={FolderIcon} 
                label="Documents" 
                active={activePopup === 'evidence'}
                onClick={() => setActivePopup(activePopup === 'evidence' ? null : 'evidence')}
             />

             {/* Spreadsheet App (New) */}
             <SidebarBtn 
                icon={TableCellsIcon} 
                label="Spreadsheets" 
                onClick={() => onOpenApp && onOpenApp('excel-viewer')}
             />

            {/* Mind Map Search */}
             <SidebarBtn 
                icon={MapIcon} 
                label="Visual Search" 
                active={activePopup === 'mindmap'}
                onClick={() => setActivePopup(activePopup === 'mindmap' ? null : 'mindmap')}
             />

            {/* Arbitration Engine */}
            <SidebarBtn 
                icon={ScaleIcon} 
                label="Arbitration Engine" 
                active={activePopup === 'arbitration'}
                onClick={() => setActivePopup(activePopup === 'arbitration' ? null : 'arbitration')}
             />

             <div className="w-8 h-px bg-slate-800 my-2"></div>

             <SidebarBtn icon={Squares2X2Icon} label="Apps" />
             <SidebarBtn icon={ArchiveBoxIcon} label="Archive" />
             
             <div className="mt-auto">
                <SidebarBtn icon={Cog6ToothIcon} label="Settings" />
             </div>
         </div>

         {/* B. POPUP PANEL (Slides out from Left, next to toolbar) */}
         {activePopup && (
            <div className="absolute left-16 top-0 bottom-0 w-96 bg-slate-900 border-r border-slate-700 shadow-2xl z-40 animate-slide-in-left flex flex-col">
               <div className="h-14 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 bg-slate-800/50">
                  <h2 className="font-bold text-white flex items-center gap-2 text-sm">
                     {activePopup === 'logic' && (
                        <>
                           <CpuChipIcon className="w-5 h-5 text-emerald-400" /> Logic Log
                        </>
                     )}
                     {activePopup === 'evidence' && (
                        <>
                           <FolderIcon className="w-5 h-5 text-emerald-400" /> Evidence Bank
                        </>
                     )}
                     {activePopup === 'mindmap' && (
                        <>
                           <MapIcon className="w-5 h-5 text-orange-400" /> Visual Search (MindMap)
                        </>
                     )}
                     {activePopup === 'arbitration' && (
                        <>
                           <ScaleIcon className="w-5 h-5 text-red-500 animate-pulse" /> Arbitration Engine
                        </>
                     )}
                  </h2>
                  <button onClick={() => setActivePopup(null)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded-full">
                     <XMarkIcon className="w-6 h-6" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-2 bg-slate-900 relative">
                  {/* Note: Logic Log removed from local panel as it is now global */}
                  {activePopup === 'evidence' && (
                     <EvidenceList onSelect={handleFileSelect} />
                  )}
                  {activePopup === 'mindmap' && (
                     <MiniMindMap project={project} onSelect={(name) => handleFileSelect(name + ".pdf", 'pdf')} />
                  )}
                  {activePopup === 'arbitration' && (
                     <div className="p-4 space-y-6">
                         <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                             <span className={isAnalyzing ? "text-yellow-400 animate-pulse" : "text-green-500"}>
                                STATUS: {isAnalyzing ? 'SCANNING...' : 'READY'}
                             </span>
                             <span>LATENCY: 12ms</span>
                         </div>
                         
                         {/* Document Source Card */}
                         <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-2">
                               <DocumentTextIcon className="w-3 h-3" /> Document Source
                            </h4>
                            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/30 p-2 rounded">
                               "...clause 2.4 requires notice within <span className="text-red-400 font-bold">14 days</span> of the event..."
                            </p>
                         </div>

                         {/* Processor Icon */}
                         <div className="flex flex-col items-center justify-center">
                            {isAnalyzing ? (
                               <ArrowPathIcon className="w-8 h-8 text-yellow-500 animate-spin" />
                            ) : (
                               <ExclamationTriangleIcon className="w-10 h-10 text-red-500 animate-bounce" />
                            )}
                         </div>

                         {/* Ledger Source Card */}
                         <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-2">
                               <TableCellsIcon className="w-3 h-3" /> Ledger Source
                            </h4>
                            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/30 p-2 rounded">
                               Row 15: Notice Date <span className="text-red-400 font-bold">May 15</span><br/>(Calculated Delta: 19 Days)
                            </p>
                         </div>

                         {/* Result Footer */}
                         {analysisResult && (
                             <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl text-center shadow-lg shadow-red-900/10">
                                <p className="text-sm font-bold text-red-100 leading-snug">{analysisResult}</p>
                             </div>
                         )}

                         {!arbitrationMode && (
                            <div className="text-center p-4">
                                <p className="text-xs text-slate-500 italic">Toggle "Standard View" to "Arbitration Mode" in the header to activate the real-time scanner.</p>
                            </div>
                         )}
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* C. MAIN CONTENT AREA (Split View) */}
         <div className="flex flex-1 bg-slate-100 text-slate-900 relative">
            
            {/* Visual Link SVG Layer */}
            {arbitrationMode && (
               <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full">
                  <defs>
                     <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
                     </marker>
                  </defs>
                  {/* Curve connecting Doc Clause to Excel Row */}
                  <path d="M 450 350 C 550 350, 600 280, 720 280" fill="none" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5" className="animate-pulse" />
                  {/* Curve 2 */}
                  <path d="M 450 480 C 550 480, 600 400, 720 400" fill="none" stroke="#dc2626" strokeWidth="1" strokeOpacity="0.5" />
               </svg>
            )}

            {/* Document Viewer (Left Side) */}
            <div 
               className="w-1/2 border-r border-slate-300 flex flex-col bg-white relative"
               onClick={() => {
                  if (currentResource !== activeDocTitle) {
                     commitLog(activeDocTitle, "Reviewing");
                  }
               }}
            >
               {/* Loading/Scanning Overlay for Left Panel */}
               {isAnalyzing && (
                  <div className="absolute inset-0 z-20 bg-red-900/10 flex flex-col items-center justify-center backdrop-blur-[1px]">
                     <div className="w-full h-1 bg-red-600 absolute top-0 animate-progress-bar"></div>
                     <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg animate-pulse">SCANNING TEXT...</span>
                  </div>
               )}

               {/* Doc Header */}
               <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 justify-between">
                  <span className="font-bold text-xs text-slate-700 truncate max-w-md">{activeDocTitle}</span>
                  <div className="flex gap-2 text-slate-400">
                     <DocumentTextIcon className="w-4 h-4" />
                     <span className="text-xs">Page 1 of 45</span>
                  </div>
               </div>
               
               {/* Doc Body */}
               <div className="flex-1 overflow-y-auto p-8 font-serif text-sm leading-relaxed text-slate-800 bg-white">
                  {docContent === 'default' ? (
                      <>
                        <h1 className="text-xl font-bold mb-4 text-slate-900">1.0 Foundation Issues</h1>
                        <p className="mb-4">
                            1. The Issued For Construction drawings were dated 12 March 2023 but were not received by the Contractor until 14 April 2023.
                        </p>
                        <p className={`mb-4 p-2 rounded transition-colors duration-500 ${arbitrationMode ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
                            2. The Contractor has noted that <strong className={arbitrationMode ? 'text-red-700' : ''}>the delayed receipt of these drawings caused a direct critical path delay</strong> to the foundation works.
                        </p>
                        <p className={`mb-4 p-2 rounded transition-colors duration-500 ${arbitrationMode ? 'bg-yellow-50 border-l-4 border-yellow-500' : ''}`}>
                            3. Specifically, clause 2.4 of the Contract requires the Employer to provide design information within 14 days of request.
                            {arbitrationMode && <span className="ml-2 text-[10px] font-sans font-bold text-red-600 bg-white border border-red-200 px-1 rounded">CONFLICT DETECTED</span>}
                        </p>
                        <div className={`p-4 bg-slate-50 border-l-4 border-slate-300 mb-6 italic ${arbitrationMode ? 'border-red-500 bg-red-50' : ''}`}>
                            "The Coised Event Notice No. 4 was issued five days late. However, under common law, the notice provisions should not act as a condition precedent where the Employer caused the prevention."
                        </div>
                        <p className="mb-4">
                            4. We calculate the prolongation costs associated with this event to be $10,600 per week for a period of 4 weeks.
                        </p>
                      </>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                         <DocumentTextIcon className="w-12 h-12 mb-4 opacity-50" />
                         <h3 className="text-lg font-bold text-slate-600">{activeDocTitle}</h3>
                         <p className="text-sm">Document loaded for review.</p>
                      </div>
                  )}
               </div>
            </div>

            {/* Excel Viewer (Right Side) */}
            <div 
               className="w-1/2 flex flex-col bg-white relative"
               onClick={() => {
                  if (currentResource !== activeExcelTitle) {
                     commitLog(activeExcelTitle, "Editing");
                  }
               }}
            >
               {/* Loading/Scanning Overlay for Right Panel */}
               {isAnalyzing && (
                  <div className="absolute inset-0 z-20 bg-blue-900/10 flex flex-col items-center justify-center backdrop-blur-[1px]">
                     <div className="w-full h-1 bg-blue-600 absolute bottom-0 animate-progress-bar-reverse"></div>
                     <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg animate-pulse">VERIFYING VALUES...</span>
                  </div>
               )}

               <EmbeddedExcel arbitrationMode={arbitrationMode} title={activeExcelTitle} />
            </div>

            {/* Removed the floating bottom "Arbitration AI Console" as it is now in the sidebar */}

         </div>
      </div>

    </div>
  );
};

const SidebarBtn = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
   <button 
      onClick={onClick}
      className={`relative group w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
         active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
   >
      <Icon className="w-6 h-6" />
      {/* Tooltip */}
      <span className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
         {label}
      </span>
   </button>
);

const EvidenceList = ({ onSelect }: { onSelect: (name: string, type: string) => void }) => (
   <div className="p-4 space-y-4">
      <div className="relative">
         <MagnifyingGlassIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
         <input type="text" placeholder="Filter files..." className="w-full bg-slate-950 border border-slate-800 rounded py-1.5 pl-9 text-xs text-slate-300 focus:outline-none focus:border-emerald-500" />
      </div>

      <div className="space-y-1">
         <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Recent Invoices</h3>
         <FileItem name="SttE Invoice-May.pdf" type="pdf" onClick={() => onSelect("SttE Invoice-May.pdf", "pdf")} />
         <FileItem name="Stte Email Delay.msg" type="mail" onClick={() => onSelect("Stte Email Delay.msg", "mail")} />
      </div>

      <div className="space-y-1 pt-4 border-t border-slate-800">
         <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Site Records</h3>
         <FileItem name="Daily Diary 24-05.pdf" type="pdf" onClick={() => onSelect("Daily Diary 24-05.pdf", "pdf")} />
         <FileItem name="Site Photos.zip" type="zip" onClick={() => onSelect("Site Photos.zip", "zip")} />
         <FileItem name="Weather Report.xlsx" type="xls" onClick={() => onSelect("Weather Report.xlsx", "xls")} />
      </div>

      <div className="space-y-1 pt-4 border-t border-slate-800">
         <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Quantum & Cost</h3>
         <FileItem name="Quantum_Assessment_v3.xlsx" type="xls" onClick={() => onSelect("Quantum_Assessment_v3.xlsx", "xls")} />
      </div>
   </div>
);

const MiniMindMap = ({ project, onSelect }: { project: Project | null, onSelect: (name: string) => void }) => {
   // Use synchronized data source, defaulting to 'p1' if generic
   const { nodes, connections } = getProjectData(project?.id || 'p1');

   return (
      <div className="h-full relative overflow-hidden bg-slate-900 cursor-move">
         {/* Dot Pattern */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
         
         <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet">
            {connections.map((c, i) => {
               const start = nodes.find(n => n.id === c.from)!;
               const end = nodes.find(n => n.id === c.to)!;
               return (
                  <path 
                     key={i} 
                     d={`M ${start.x} ${start.y} C ${start.x} ${(start.y + end.y)/2} ${end.x} ${(start.y + end.y)/2} ${end.x} ${end.y}`} 
                     stroke="#475569" strokeWidth="4" fill="none" 
                  />
               )
            })}
         </svg>

         {/* Render Nodes with scaled positioning for viewBox */}
         <div className="absolute inset-0 w-full h-full pointer-events-none">
             {/* Note: In a real viewBox SVG implementation we would use <g> inside svg, 
                 but to reuse React components we can just rely on the viewBox scaling the SVG lines 
                 and map the nodes to percentage positions or standard positions if the container has a specific aspect ratio. 
                 Since the sidebar might be narrow, using pure SVG for everything is safer for scaling.
             */}
             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet">
                {nodes.map(node => (
                    <g 
                       key={node.id} 
                       transform={`translate(${node.x}, ${node.y})`}
                       onClick={() => { if (node.type === 'item') onSelect(node.label); }}
                       className="cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto"
                    >
                       <circle r={node.type === 'root' ? 40 : (node.type === 'category' ? 30 : 20)} fill={node.type === 'root' ? '#4f46e5' : '#1e293b'} stroke={node.color ? '#cbd5e1' : '#475569'} strokeWidth="2" />
                       <text y={node.type === 'root' ? 60 : 40} textAnchor="middle" fill="#cbd5e1" fontSize="24" fontWeight="bold">{node.label}</text>
                    </g>
                ))}
             </svg>
         </div>
         
         <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <span className="text-[10px] text-orange-400/80 bg-slate-900/80 px-2 py-1 rounded border border-orange-900/30">
               Tap a node to open file
            </span>
         </div>
      </div>
   );
};

const FileItem = ({ name, type, onClick }: { name: string, type: string, onClick: () => void }) => {
   let icon = DocumentTextIcon;
   let color = "text-slate-400";
   if (type === 'xls') { icon = TableCellsIcon; color = "text-green-500"; }
   if (type === 'mail') { icon = ChatBubbleLeftRightIcon; color = "text-yellow-500"; }
   
   const Icon = icon;

   return (
      <div onClick={onClick} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded cursor-pointer group transition-colors">
         <Icon className={`w-4 h-4 ${color}`} />
         <span className="text-xs text-slate-300 group-hover:text-white truncate">{name}</span>
      </div>
   )
}
