import React, { useState } from 'react';
import { 
  BuildingOfficeIcon,
  CommandLineIcon,
  Squares2X2Icon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ClockIcon,
  ShareIcon,
  FolderOpenIcon,
  UserGroupIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  PhoneIcon,
  MapPinIcon,
  XMarkIcon,
  CheckCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  BanknotesIcon,
  UserPlusIcon,
  WrenchScrewdriverIcon,
  IdentificationIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  BeakerIcon,
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassPlusIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  ArchiveBoxIcon,
  BuildingLibraryIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { ViewState } from '../types';
import { getProjectData, getCompanyOverviewData, ALAN_CLARKE_IMG, ZOHIB_HABIB_IMG, IAN_BARTLETT_IMG, ANDREW_BOWLER_IMG, CONTACT_DIRECTORY } from '../utils/mindMapUtils';

interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'On Hold' | 'Completed';
  engagementType: 'Claim' | 'Arbitration';
  progress: number;
  expertise?: string[];
}

interface Props {
  onNavigate: (view: ViewState) => void;
  onSelectProject: (id: string) => void;
  onAddProject?: (proj: Partial<Project>) => void;
  onUpdateProject: (id: string, data: Partial<Project>) => void;
  projects: Project[];
  activeProject: Project | null;
}

export const LandingPage: React.FC<Props> = ({ onNavigate, onSelectProject, onAddProject, onUpdateProject, projects, activeProject }) => {
  const [selectionStep, setSelectionStep] = useState<'initial' | 'project-list'>('initial');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const handleManageSquad = (pid: string) => {
     onSelectProject(pid);
     onNavigate('mind-map');
  };

  const handleEscalateToArbitration = (e: React.MouseEvent, pid: string) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to escalate this claim to Formal Arbitration? This will update the project workflow.')) {
          onUpdateProject(pid, { engagementType: 'Arbitration' });
      }
  };

  // Helper to map node ID to project ID for the SVG map interactions
  const getPidFromNodeId = (nodeId: string) => {
      if (nodeId === 'proj_skyline') return 'p1';
      if (nodeId === 'proj_metro') return 'p2';
      if (nodeId === 'proj_harbor') return 'p3';
      return 'p1';
  };

  // Get Data for the top-level Operations Map
  const companyMapData = getCompanyOverviewData();

  // Filter Projects by Type
  const arbitrationProjects = projects.filter(p => p.engagementType === 'Arbitration' && p.status !== 'Completed');
  const claimsProjects = projects.filter(p => p.engagementType === 'Claim' && p.status !== 'Completed');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  // --- ORGANIZE CONTACTS FOR INBOX VIEW ---
  // Flatten all contacts first
  const allContacts = [
    ...CONTACT_DIRECTORY.expertWitnesses.contacts,
    ...CONTACT_DIRECTORY.ajbStaff.contacts,
    ...CONTACT_DIRECTORY.externalContacts.contacts
  ];

  // Bucket them into the specific requested categories
  const contactGroups = {
    legal: allContacts.filter(c => c.title.includes('Lawyer') || c.title.includes('Counsel')),
    quantum: allContacts.filter(c => c.title.includes('Quantum')),
    delay: allContacts.filter(c => c.title.includes('Delay')),
    forensic: allContacts.filter(c => c.title.includes('Forensic') || c.title.includes('Disruption')),
    ajb: allContacts.filter(c => c.company === 'AJBowler Consult' && !c.title.includes('Quantum') && !c.title.includes('Delay') && !c.title.includes('Forensic')),
    previous: allContacts.filter(c => c.company !== 'AJBowler Consult' && !c.title.includes('Lawyer') && !c.title.includes('Counsel'))
  };

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans p-8 animate-fade-in relative">
        {selectionStep === 'initial' ? (
          <div className="flex flex-col items-center">
            <div className="mb-12 flex flex-col items-center animate-fade-in-down">
                <img src="https://lh3.googleusercontent.com/d/18XFnqkdZT_B2kUczglilONvEPXYy7daD" alt="Company Logo" className="w-64 md:w-80 object-contain drop-shadow-sm mb-4" />
                <p className="font-serif italic text-slate-600 text-lg md:text-xl tracking-wide">Adding Value Through Experience</p>
            </div>
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">
              <button onClick={() => setSelectionStep('project-list')} className="group relative w-80 h-96 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url("https://ajbowlerconsult.com/wp-content/uploads/2023/07/Pipes-red.png")' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-10">
                   <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/30 group-hover:scale-110 transition-transform">
                      <FolderOpenIcon className="w-8 h-8 text-white" />
                   </div>
                   <h2 className="text-3xl font-bold text-white tracking-tight">Select Project</h2>
                </div>
              </button>
              <button onClick={() => onSelectProject('global')} className="group relative w-80 h-96 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url("https://ajbowlerconsult.com/wp-content/uploads/2023/07/disputeresolution-600x400-1.png")' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-10">
                   <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/30 group-hover:scale-110 transition-transform">
                      <BuildingOfficeIcon className="w-8 h-8 text-white" />
                   </div>
                   <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full max-w-6xl animate-fade-in-up">
            <button onClick={() => setSelectionStep('initial')} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold transition-colors"><ChevronLeftIcon className="w-5 h-5" /> Back</button>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {projects.map(proj => (
                <button key={proj.id} onClick={() => onSelectProject(proj.id)} className="group w-64 h-64 border-[3px] border-slate-200 rounded-[2.5rem] bg-white flex flex-col items-center justify-center gap-4 hover:border-red-600 hover:scale-105 transition-all shadow-sm hover:shadow-2xl relative overflow-hidden">
                   {proj.engagementType === 'Arbitration' && (
                       <div className="absolute top-0 right-0 p-3">
                           <ScaleIcon className="w-6 h-6 text-red-100" />
                       </div>
                   )}
                   <span className="text-xl font-bold text-slate-700 group-hover:text-red-600 text-center px-4">{proj.name}</span>
                   <div className="flex flex-col items-center gap-1">
                       <span className="text-xs font-semibold text-slate-400 uppercase">{proj.status}</span>
                       <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${proj.engagementType === 'Arbitration' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{proj.engagementType}</span>
                   </div>
                   <div className="flex items-center gap-1 mt-1">
                       <MapPinIcon className="w-3 h-3 text-slate-400" />
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{proj.location}</span>
                   </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center font-sans p-8 relative animate-fade-in pb-20 overflow-x-hidden">
        <div className="w-full max-w-7xl mt-12 flex flex-col items-center">
             
             {/* HEADER */}
             <div className="text-center mb-16">
                <h1 className="text-6xl font-extrabold text-slate-900 tracking-tighter mb-4">Case Strategy Command</h1>
                <p className="text-xl text-slate-400 font-medium italic">Expert Allocation & Project Oversight</p>
             </div>

             {/* 0. NEW COMPANY OPERATIONS MINDMAP */}
             <div className="w-full mb-20">
                <div className="flex items-center gap-4 mb-8 px-4">
                   <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-200">
                      <GlobeAltIcon className="w-8 h-8" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Company Operations</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Portfolio Oversight</p>
                   </div>
                </div>

                <div className="w-full h-[600px] bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative border border-slate-800">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid meet">
                       {/* Connections */}
                       {companyMapData.connections.map((conn, i) => {
                          const start = companyMapData.nodes.find(n => n.id === conn.from);
                          const end = companyMapData.nodes.find(n => n.id === conn.to);
                          if (!start || !end) return null;
                          return (
                            <path 
                              key={i} 
                              d={`M ${start.x} ${start.y} C ${start.x} ${(start.y + end.y)/2} ${end.x} ${(start.y + end.y)/2} ${end.x} ${end.y}`} 
                              stroke="#334155" 
                              strokeWidth="2" 
                              fill="none" 
                              className="animate-pulse"
                            />
                          );
                       })}

                       {/* Nodes */}
                       {companyMapData.nodes.map(node => (
                          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                             {node.type === 'root' ? (
                                // HQ Root Node
                                <g className="cursor-pointer hover:scale-105 transition-transform">
                                   <circle r="60" fill="#dc2626" className="shadow-2xl drop-shadow-[0_10px_10px_rgba(220,38,38,0.5)]" />
                                   {node.imageUrl && (
                                     <>
                                      <clipPath id={`clip-root-${node.id}`}><circle r="55" /></clipPath>
                                      <image href={node.imageUrl} x="-55" y="-55" width="110" height="110" clipPath={`url(#clip-root-${node.id})`} preserveAspectRatio="xMidYMid slice" />
                                     </>
                                   )}
                                   <rect x="-80" y="70" width="160" height="24" rx="12" fill="#0f172a" stroke="#334155" />
                                   <text x="0" y="86" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" letterSpacing="1">{node.label.toUpperCase()}</text>
                                </g>
                             ) : node.type === 'project' ? (
                                // Project Nodes - Detailed with Description (NOW NAVIGATES ON CLICK)
                                <g className="cursor-pointer hover:scale-105 transition-transform" onClick={() => handleManageSquad(getPidFromNodeId(node.id))}>
                                   {/* Larger Container Rect */}
                                   <rect x="-100" y="-40" width="200" height="100" rx="15" className="fill-slate-800 stroke-slate-700 hover:stroke-white transition-colors" strokeWidth="2" />
                                   {/* Status Indicator */}
                                   <circle cx="-80" cy="-20" r="10" className={node.color?.replace('bg-', 'fill-') || 'fill-indigo-500'} />
                                   {/* Label */}
                                   <text x="-60" y="-15" textAnchor="start" fill="white" fontSize="12" fontWeight="bold" className="uppercase tracking-wide">{node.label}</text>
                                   {/* Description / Categories */}
                                   <foreignObject x="-90" y="5" width="180" height="50">
                                      <div xmlns="http://www.w3.org/1999/xhtml" className="text-[9px] text-slate-400 font-medium leading-snug flex items-center h-full text-left">
                                        <p style={{ whiteSpace: 'pre-wrap' }}>{node.description}</p>
                                      </div>
                                   </foreignObject>
                                </g>
                             ) : (
                                // Expert Nodes
                                <g className="cursor-pointer hover:scale-110 transition-transform">
                                   <circle r="30" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                                   {node.imageUrl && (
                                     <>
                                      <clipPath id={`clip-exp-${node.id}`}><circle r="26" /></clipPath>
                                      <image href={node.imageUrl} x="-26" y="-26" width="52" height="52" clipPath={`url(#clip-exp-${node.id})`} preserveAspectRatio="xMidYMid slice" />
                                     </>
                                   )}
                                   <rect x="-50" y="40" width="100" height="18" rx="9" fill="#0f172a" stroke="#334155" />
                                   <text x="0" y="52" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">{node.label}</text>
                                </g>
                             )}
                          </g>
                       ))}
                    </svg>
                    
                    {/* Legend/Info Overlay */}
                    <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-xs">
                        <h3 className="text-white text-sm font-bold mb-1">Portfolio Hierarchy</h3>
                        <p className="text-slate-400 text-xs">Visual representation of AJBowler Consult oversight across all active workstreams.</p>
                    </div>
                </div>

                {/* NEW HISTORICAL DATA BUTTON */}
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => onNavigate('timesheet-dashboard')} 
                        className="group relative flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-indigo-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                            <ChartBarIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <div className="text-left">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Archives & Analytics</span>
                            <span className="block text-sm font-black text-slate-800 group-hover:text-indigo-900">Historical Project Data</span>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 ml-4 transition-colors" />
                    </button>
                </div>
             </div>

             {/* 1. ARBITRATION PROCEEDINGS SECTION */}
             {arbitrationProjects.length > 0 && (
                 <div className="w-full mb-16">
                    <div className="flex items-center gap-4 mb-8 px-4">
                       <div className="p-3 bg-red-800 rounded-2xl text-white shadow-lg shadow-red-900/20">
                          <ScaleIcon className="w-8 h-8" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Arbitration Proceedings</h2>
                          <p className="text-xs text-red-600 font-bold uppercase tracking-widest">Active Tribunal Engagements</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {arbitrationProjects.map((proj) => {
                          const isHovered = hoveredProjectId === proj.id;
                          return (
                            <div 
                               key={proj.id} 
                               onClick={() => handleManageSquad(proj.id)} // Whole card is clickable
                               className={`relative bg-white border-2 rounded-3xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer ${isHovered ? 'shadow-xl border-red-800 -translate-y-1' : 'border-red-100 shadow-sm'}`}
                               onMouseEnter={() => setHoveredProjectId(proj.id)}
                               onMouseLeave={() => setHoveredProjectId(null)}
                            >
                               {/* Arbitration Header Strip */}
                               <div className="bg-red-800 text-white text-[9px] font-black uppercase tracking-[0.2em] py-1.5 text-center shrink-0">
                                   Formal Dispute Resolution
                               </div>

                               <div className="p-5 flex-1 flex flex-col">
                                  <div className="flex justify-between items-start mb-4">
                                     <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-0.5">{proj.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <MapPinIcon className="w-3 h-3 text-red-700" />
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]">{proj.location}</span>
                                        </div>
                                     </div>
                                     <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-red-50 text-red-800 border border-red-100">
                                        ACTIVE
                                     </span>
                                  </div>

                                  <div className="space-y-4 flex-1 flex flex-col">
                                     <div className="flex -space-x-3">
                                        <ContactAvatar img={ANDREW_BOWLER_IMG} role="LEAD EXPERT" color="bg-red-800" active={isHovered} size="w-10 h-10" />
                                        <ContactAvatar img={IAN_BARTLETT_IMG} role="DELAY" color="bg-slate-700" active={isHovered} size="w-10 h-10" />
                                        <ContactAvatar img={proj.id === 'p2' ? ZOHIB_HABIB_IMG : ALAN_CLARKE_IMG} role="QUANTUM" color="bg-slate-700" active={isHovered} size="w-10 h-10" />
                                     </div>
                                     
                                     <div className="flex flex-col gap-2 flex-1">
                                        {/* Detailed Expertise Tags from Project Data */}
                                        <div className="flex flex-wrap gap-1 content-start">
                                            {proj.expertise?.slice(0, 3).map((skill, idx) => (
                                                <RoleTag key={idx} label={skill} color="text-red-900 bg-red-100 border-red-200" />
                                            ))}
                                            {proj.expertise && proj.expertise.length > 3 && (
                                                <span className="text-[9px] text-slate-400 self-center">+{proj.expertise.length - 3}</span>
                                            )}
                                        </div>
                                     </div>

                                     <div className="flex justify-end mt-auto pt-2">
                                        <div className="p-2 bg-red-900 text-white rounded-xl shadow-lg transition-transform group-hover:scale-105">
                                           <ScaleIcon className="w-4 h-4" />
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                          );
                       })}
                    </div>
                 </div>
             )}

             {/* 2. DISPUTE & CLAIMS SECTION */}
             <div className="w-full mb-20">
                <div className="flex items-center gap-4 mb-8 px-4">
                   <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
                      <ExclamationTriangleIcon className="w-8 h-8" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Disputes & Claims</h2>
                      <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">Claims Management & Preparation</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {claimsProjects.map((proj) => {
                      const isHovered = hoveredProjectId === proj.id;
                      return (
                        <div 
                           key={proj.id} 
                           onClick={() => handleManageSquad(proj.id)} // Whole card is clickable
                           className={`relative bg-white border-2 rounded-3xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer ${isHovered ? 'shadow-xl border-orange-500 -translate-y-1' : 'border-slate-100 shadow-sm'}`}
                           onMouseEnter={() => setHoveredProjectId(proj.id)}
                           onMouseLeave={() => setHoveredProjectId(null)}
                        >
                           <div className="p-5 flex-1 flex flex-col">
                              <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-0.5">{proj.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <MapPinIcon className="w-3 h-3 text-orange-500" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]">{proj.location}</span>
                                    </div>
                                 </div>
                                 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest ${proj.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                                    {proj.status.toUpperCase()}
                                 </span>
                              </div>

                              <div className="space-y-4 flex-1 flex flex-col">
                                 <div className="flex -space-x-3">
                                    <ContactAvatar img={ANDREW_BOWLER_IMG} role="OVERSIGHT" color="bg-orange-500" active={isHovered} size="w-10 h-10" />
                                    <ContactAvatar img={IAN_BARTLETT_IMG} role="DELAY" color="bg-indigo-500" active={isHovered} size="w-10 h-10" />
                                    <ContactAvatar img={proj.id === 'p2' ? ZOHIB_HABIB_IMG : ALAN_CLARKE_IMG} role="QUANTUM" color="bg-emerald-600" active={isHovered} size="w-10 h-10" />
                                 </div>
                                 
                                 <div className="flex flex-col gap-2 flex-1">
                                     {/* Detailed Expertise Tags */}
                                     <div className="flex flex-wrap gap-1 content-start">
                                         {proj.expertise?.slice(0, 3).map((skill, idx) => (
                                             <RoleTag key={idx} label={skill} color="text-slate-700 bg-slate-50 border-slate-200" />
                                         ))}
                                         {proj.expertise && proj.expertise.length > 3 && (
                                              <span className="text-[9px] text-slate-400 self-center">+{proj.expertise.length - 3}</span>
                                         )}
                                     </div>
                                     
                                     {/* Escalation Button */}
                                     <div className="mt-auto pt-1">
                                        <button 
                                            onClick={(e) => handleEscalateToArbitration(e, proj.id)}
                                            className="text-[9px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors px-1"
                                        >
                                            <ArrowTrendingUpIcon className="w-3 h-3" /> Escalate
                                        </button>
                                     </div>
                                 </div>

                                 <div className="flex justify-end pt-1">
                                    <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg transition-transform group-hover:scale-105">
                                       <BoltIcon className="w-4 h-4" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </div>

             {/* 3. COMPLETED PROJECTS SECTION */}
             {completedProjects.length > 0 && (
                 <div className="w-full mb-20">
                    <div className="flex items-center gap-4 mb-8 px-4">
                       <div className="p-3 bg-emerald-700 rounded-2xl text-white shadow-lg shadow-emerald-200">
                          <CheckBadgeIcon className="w-8 h-8" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Previous Recent Projects Completions Data Base</h2>
                          <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest">Successful Settlements & Awards</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                       {completedProjects.map((proj) => {
                          const isHovered = hoveredProjectId === proj.id;
                          return (
                            <div 
                               key={proj.id} 
                               onClick={() => handleManageSquad(proj.id)} // Enabled navigation for completed projects
                               className={`relative bg-slate-50/50 border-2 border-slate-200 rounded-[3rem] p-8 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-emerald-300 cursor-pointer ${isHovered ? 'scale-[1.02]' : ''}`}
                               onMouseEnter={() => setHoveredProjectId(proj.id)}
                               onMouseLeave={() => setHoveredProjectId(null)}
                            >
                               <div className="flex justify-between items-start mb-6">
                                   <div>
                                       <h3 className="text-xl font-bold text-slate-700">{proj.name}</h3>
                                       <div className="flex items-center gap-2 mt-2">
                                           <MapPinIcon className="w-4 h-4 text-emerald-600" />
                                           <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">{proj.location}</span>
                                       </div>
                                   </div>
                                   <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                       Dec 2023
                                   </div>
                               </div>

                               <div className="space-y-4 flex-1">
                                   <div className="flex flex-wrap gap-2">
                                       {proj.expertise?.map((skill, idx) => (
                                           <span key={idx} className="px-2 py-1 rounded bg-white border border-slate-200 text-[9px] font-medium text-slate-500">
                                               {skill}
                                           </span>
                                       ))}
                                   </div>
                                   
                                   <div className="mt-auto pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                                       <span>Status: <span className="text-emerald-600 font-bold">COMPLETED</span></span>
                                       <span>Type: {proj.engagementType}</span>
                                   </div>
                               </div>
                            </div>
                          );
                       })}
                    </div>
                 </div>
             )}

             {/* 4. GLOBAL NETWORK & EXPERT DIRECTORY (UNIFIED INBOX STYLE) */}
             <div className="w-full mb-16">
                <div className="flex items-center gap-4 mb-8 px-4">
                    <div className="p-3 bg-indigo-900 rounded-2xl text-white shadow-lg shadow-slate-300">
                        <UserGroupIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Global Network & Expert Directory</h2>
                        <p className="text-xs text-indigo-900 font-bold uppercase tracking-widest">Unified Contact Network</p>
                    </div>
                </div>

                {/* Directory Component Inline */}
                <DirectoryComponent groups={contactGroups} />
             </div>

             <div className="w-full h-px bg-slate-200 my-16"></div>
        </div>
    </div>
  );
};

const DirectoryComponent = ({ groups }: { groups: any }) => {
    const [search, setSearch] = useState('');

    const categoryLabels: Record<string, string> = {
        legal: "Appointed Lawyers",
        quantum: "Quantum Experts",
        delay: "Delay Analysts",
        forensic: "Forensic & Disruption",
        ajb: "AJBowler Consult",
        previous: "Previous Engagements"
    };

    return (
        <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col">
            {/* Header / Search */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div>
                     <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Expert Registry</h2>
                </div>
                <div className="relative w-full md:w-96">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name, role, or company..." 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto max-h-[800px] p-8 bg-white">
                <div className="space-y-10">
                    {Object.entries(groups).map(([key, contacts]: [string, any[]]) => {
                        const filtered = contacts.filter((c: any) => 
                            c.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.title.toLowerCase().includes(search.toLowerCase()) ||
                            c.company.toLowerCase().includes(search.toLowerCase())
                        );

                        if (filtered.length === 0) return null;

                        return (
                            <div key={key}>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 flex items-center justify-between">
                                    <span>{categoryLabels[key] || key}</span>
                                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">{filtered.length}</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filtered.map((contact: any) => (
                                        <div key={contact.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group cursor-default">
                                            <img src={contact.img} alt={contact.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">{contact.name}</h4>
                                                <p className="text-xs text-slate-500 truncate font-medium">{contact.title}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate mt-0.5">{contact.company}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <a href={`mailto:${contact.email}`} className="p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm" title="Email"><EnvelopeIcon className="w-3.5 h-3.5"/></a>
                                                 <a href={`tel:${contact.phone}`} className="p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-green-600 hover:border-green-200 shadow-sm" title="Call"><PhoneIcon className="w-3.5 h-3.5"/></a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                     {/* Empty State */}
                     {Object.values(groups).every((g: any) => g.filter((c:any) => c.name.toLowerCase().includes(search.toLowerCase())).length === 0) && (
                         <div className="text-center py-16 text-slate-400">
                             <UserGroupIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                             <p>No contacts found matching "{search}"</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
}

const ContactAvatar: React.FC<{ img: string; role: string; color: string; active?: boolean; size?: string }> = ({ img, role, color, active, size = "w-14 h-14" }) => (
    <div className="group/av relative flex flex-col items-center">
        <div className={`${size} rounded-full border-[3px] border-white ${color} overflow-hidden shadow-xl transition-all duration-500 ${active ? 'scale-110 rotate-3 ring-4 ring-white' : ''}`}>
            <img src={img} alt={role} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-2 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg opacity-0 group-hover/av:opacity-100 transition-opacity z-10">
            {role}
        </div>
    </div>
);

const RoleTag: React.FC<{ label: string; color: string }> = ({ label, color }) => (
    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold border shadow-sm leading-tight ${color}`}>
        {label}
    </span>
);

const ProjectMindMapMini = ({ pid }: { pid: string }) => {
   const { nodes, crossLinks } = getProjectData(pid);
   return (
      <svg className="w-full h-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet">
         {crossLinks?.map((l, i) => {
            const start = nodes.find(n => n.id === l.from);
            const end = nodes.find(n => n.id === l.to);
            if (!start || !end) return null;
            return <path key={i} d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} stroke="#ffffff" strokeWidth="4" strokeDasharray="15,10" strokeOpacity="0.2" fill="none" />;
         })}
         {nodes.filter(n => n.type === 'expert' || n.type === 'root').map(node => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
               <circle r={node.type === 'root' ? 60 : 50} fill={node.type === 'root' ? '#dc2626' : '#ffffff'} stroke="#ffffff" strokeWidth="6" className="shadow-2xl" />
               {node.imageUrl && (
                  <clipPath id={`clip-mini-${node.id}`}><circle r="45" /></clipPath>
               )}
               {node.imageUrl && (
                  <image href={node.imageUrl} x="-45" y="-45" width="90" height="90" clipPath={`url(#clip-mini-${node.id})`} preserveAspectRatio="xMidYMid slice" />
               )}
            </g>
         ))}
      </svg>
   );
};