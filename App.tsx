import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ClaimBuilder } from './components/ClaimBuilder';
import { DocumentDrive } from './components/DocumentDrive';
import { ExcelViewer } from './components/ExcelViewer';
import { QSCalculator } from './components/QSCalculator';
import { NotebookEmbed } from './components/NotebookEmbed';
import { SplashScreen } from './components/SplashScreen';
import { CommandCenter } from './components/CommandCenter';
import { MailClient } from './components/MailClient'; 
import { BottomDock } from './components/BottomDock'; 
import { TimesheetDashboard } from './components/TimesheetDashboard'; 
import { MindMapOverview } from './components/MindMapOverview'; 
import { LogicLog } from './components/LogicLog';
import { TestBrowser } from './components/TestBrowser';
import { ViewState, UploadedDoc, DocCategory } from './types';
import { XMarkIcon, CpuChipIcon } from '@heroicons/react/24/outline';

export interface ProjectData {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'On Hold' | 'Completed';
  engagementType: 'Claim' | 'Arbitration';
  progress: number;
  expertise?: string[];
}

const INITIAL_PROJECTS: ProjectData[] = [
  { 
    id: 'p1', 
    name: 'Skyline Tower', 
    location: 'Doha, Qatar', 
    status: 'Active', 
    engagementType: 'Claim', 
    progress: 65, 
    expertise: [
      'Contract Management', 
      'Commercial Management', 
      'Claims Drafting (EOT/VO\'s)'
    ] 
  },
  { 
    id: 'p2', 
    name: 'Metro Phase 2', 
    location: 'Ho Chi Minh City, Vietnam', 
    status: 'Active', 
    engagementType: 'Arbitration', 
    progress: 32, 
    expertise: [
      'Dispute Resolution & Arbitration Management', 
      'Quantum/Engineering/Delay Experts', 
      'Disruption Analysis'
    ] 
  },
  { 
    id: 'p3', 
    name: 'Harbor Warehouse', 
    location: 'Salalah, Oman', 
    status: 'On Hold', 
    engagementType: 'Claim', 
    progress: 88, 
    expertise: [
      'Preparation and Audit of Programme Baseline', 
      'International Property/Risk Management', 
      'Fraud Investigation/Liquidation & Termination'
    ] 
  },
  { 
    id: 'p4', 
    name: 'Lotus Tower Fit-out', 
    location: 'Colombo, Sri Lanka', 
    status: 'Completed', 
    engagementType: 'Claim', 
    progress: 100, 
    expertise: [
      'Final Account Negotiation',
      'Defect Liability Management'
    ] 
  },
  { 
    id: 'p5', 
    name: 'Jumeirah Palm Infra', 
    location: 'Dubai, UAE', 
    status: 'Completed', 
    engagementType: 'Arbitration', 
    progress: 100, 
    expertise: [
      'Expert Witness Testimony',
      'Quantum Determination'
    ] 
  },
];

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [projects, setProjects] = useState<ProjectData[]>(INITIAL_PROJECTS);
  
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  const activeProject = activeProjectId === 'global' 
    ? { id: 'global', name: 'Global Overview', location: 'All Projects Portfolio', status: 'Active', engagementType: 'Claim', progress: 100 } as ProjectData
    : projects.find(p => p.id === activeProjectId) || null;
  
  const [showLogicLog, setShowLogicLog] = useState(false);
  const [globalFiles, setGlobalFiles] = useState<UploadedDoc[]>([]);
  const [activeExcelFile, setActiveExcelFile] = useState<UploadedDoc | null>(null);

  const handleAddProject = (newProj: Partial<ProjectData>) => {
    const project: ProjectData = {
      id: `p${Date.now()}`,
      name: newProj.name || 'Untitled Project',
      location: newProj.location || 'Unknown Location',
      status: 'Active',
      engagementType: 'Claim',
      progress: 0,
      expertise: newProj.expertise || []
    };
    setProjects(prev => [project, ...prev]);
    setActiveProjectId(project.id);
  };

  const handleUpdateProject = (id: string, updates: Partial<ProjectData>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleGlobalUpload = (files: File[], category: DocCategory) => {
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setGlobalFiles(prev => [...prev, {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          category,
          base64,
          mimeType: file.type,
          originalFile: file,
          size: file.size,
          date: new Date().toLocaleDateString()
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleOpenExcel = (file: UploadedDoc) => {
    setActiveExcelFile(file);
    setCurrentView('excel-viewer');
  };

  const handleExitProject = () => {
    setActiveProjectId(null);
    setCurrentView('landing');
  };

  const handleSelectProject = (id: string) => {
    if (!id) {
        setActiveProjectId(null);
    } else {
        setActiveProjectId(id);
    }
  };

  const toggleLogicLog = () => setShowLogicLog(!showLogicLog);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="bg-white min-h-screen relative pb-24">
      
      {showLogicLog && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-[100] animate-slide-in-left flex flex-col">
           <div className="h-14 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 bg-slate-800">
               <div className="flex items-center gap-2 text-white font-bold">
                  <CpuChipIcon className="w-5 h-5 text-red-500" />
                  <span>System Logic Log</span>
               </div>
               <button onClick={() => setShowLogicLog(false)} className="text-slate-400 hover:text-white">
                  <XMarkIcon className="w-6 h-6" />
               </button>
           </div>
           <div className="flex-1 overflow-y-auto">
              <LogicLog arbitrationMode={false} />
           </div>
        </div>
      )}

      <div className="w-full transition-all duration-300">
        
        {currentView === 'landing' && (
          <LandingPage 
            onNavigate={setCurrentView} 
            onSelectProject={handleSelectProject}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            projects={projects}
            activeProject={activeProject}
          />
        )}

        {currentView === 'command-center' && (
          <CommandCenter 
            onBack={() => setCurrentView('landing')} 
            project={activeProject}
            onExitProject={handleExitProject}
            onToggleLogicLog={toggleLogicLog}
            onOpenApp={(view) => setCurrentView(view as ViewState)}
          />
        )}
        
        {currentView === 'claim-builder' && (
          <ClaimBuilder 
            onBackToHome={() => setCurrentView('landing')} 
            onOpenNotebook={() => setCurrentView('notebook-lm')}
            project={activeProject}
            onToggleLogicLog={toggleLogicLog}
          />
        )}

        {currentView === 'drive' && (
          <DocumentDrive 
            files={globalFiles} 
            onUpload={handleGlobalUpload} 
            onBack={() => setCurrentView('landing')}
            onOpenExcel={handleOpenExcel}
            project={activeProject}
            onToggleLogicLog={toggleLogicLog}
          />
        )}

        {currentView === 'excel-viewer' && (
          <ExcelViewer 
            file={activeExcelFile} 
            project={activeProject}
            onBack={() => {
              setActiveExcelFile(null); 
              setCurrentView(activeExcelFile ? 'drive' : 'landing');
            }} 
          />
        )}

        {currentView === 'qs-calc' && (
          <QSCalculator onBack={() => setCurrentView('landing')} />
        )}

        {currentView === 'notebook-lm' && (
          <NotebookEmbed 
            onBack={() => setCurrentView('landing')} 
            project={activeProject}
            onExitProject={handleExitProject}
          />
        )}

        {currentView === 'mail' && (
          <MailClient />
        )}

        {currentView === 'timesheet-dashboard' && (
          <TimesheetDashboard onBack={() => setCurrentView('landing')} />
        )}

        {currentView === 'mind-map' && (
          <MindMapOverview 
            projectId={activeProjectId || 'p1'} 
            projectName={activeProject?.name}
            projectType={activeProject?.engagementType}
            onBack={() => setCurrentView('landing')} 
            onExitProject={handleExitProject}
            onToggleLogicLog={toggleLogicLog}
          />
        )}

        {currentView === 'test-browser' && (
          <TestBrowser 
            onBack={() => setCurrentView('landing')} 
            project={activeProject}
            onToggleLogicLog={toggleLogicLog}
          />
        )}
      </div>

      <BottomDock currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;