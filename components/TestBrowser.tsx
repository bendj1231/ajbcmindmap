
import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  GlobeAltIcon, 
  CpuChipIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
}

interface Props {
  onBack: () => void;
  project: Project | null;
  onToggleLogicLog?: () => void;
}

export const TestBrowser: React.FC<Props> = ({ onBack, project, onToggleLogicLog }) => {
  const [url, setUrl] = useState('https://browser.lol/vm');
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = document.getElementById('browser-frame') as HTMLIFrameElement;
    if (iframe) {
        iframe.src = iframe.src;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      
      {/* 1. GLOBAL PLATFORM HEADER (RED) */}
      <header className="h-16 bg-red-600 border-b border-red-700 flex items-center justify-between px-6 shrink-0 shadow-lg text-white z-20">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-black/30 rounded-lg backdrop-blur-sm">
                  <GlobeAltIcon className="w-5 h-5 text-white" />
               </div>
               <div>
                  <h1 className="font-bold text-lg leading-none">Test Browser</h1>
                  {project && <span className="text-xs text-red-100">Context: {project.name}</span>}
               </div>
            </div>
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

            <div className="h-6 w-px bg-red-800 mx-2"></div>

            <button 
               onClick={onBack} 
               className="flex items-center gap-2 text-xs font-bold text-white bg-black border border-slate-800 px-4 py-1.5 rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all"
            >
               <ArrowLeftIcon className="w-3 h-3" /> Close Project
            </button>
         </div>
      </header>

      {/* 2. BROWSER NAVIGATION BAR */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3 shadow-sm z-10">
          <div className="flex items-center text-slate-400">
              <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeftIcon className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"><ChevronRightIcon className="w-4 h-4" /></button>
              <button onClick={handleRefresh} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors ml-1"><ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></button>
          </div>

          <div className="flex-1 bg-slate-100 rounded-full border border-slate-300 px-4 py-1.5 flex items-center gap-2">
              <LockClosedIcon className="w-3 h-3 text-green-600" />
              <input 
                type="text" 
                value={url} 
                readOnly
                className="bg-transparent border-none text-xs text-slate-600 font-mono w-full focus:outline-none"
              />
          </div>
      </div>

      {/* 3. WEB VIEW CONTENT */}
      <div className="flex-1 relative bg-slate-50 overflow-hidden">
          {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                      <GlobeAltIcon className="w-12 h-12 animate-pulse" />
                      <span className="text-sm font-medium">Connecting to Virtual Machine...</span>
                  </div>
              </div>
          )}
          
          <iframe 
            id="browser-frame"
            src={url}
            className="w-full h-full border-none relative z-10"
            title="Browser VM"
            onLoad={() => setIsLoading(false)}
            allow="camera; microphone; display-capture; clipboard-write; clipboard-read"
          />
      </div>
    </div>
  );
};
