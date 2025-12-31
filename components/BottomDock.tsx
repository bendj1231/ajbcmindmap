
import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
  CommandLineIcon, 
  DocumentTextIcon, 
  BookOpenIcon, 
  FolderIcon, 
  TableCellsIcon, 
  CalculatorIcon,
  EnvelopeIcon,
  PlusCircleIcon,
  Squares2X2Icon,
  XMarkIcon,
  MapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface Props {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomDock: React.FC<Props> = ({ currentView, onNavigate }) => {
  const [showAppLibrary, setShowAppLibrary] = useState(false);

  // Configuration for the Dock Apps
  // Reordered to place Drive (Files) more centrally for easier access
  const dockApps = [
    { id: 'landing', label: 'Home', icon: Squares2X2Icon, color: 'text-gray-500' },
    { id: 'command-center', label: 'QS Command', icon: CommandLineIcon, color: 'text-emerald-400' },
    { id: 'mind-map', label: 'Mind Map', icon: MapIcon, color: 'text-orange-500' },
    { id: 'drive', label: 'Drive Access', icon: FolderIcon, color: 'text-blue-500' }, // Centered position
    { id: 'claim-builder', label: 'ClaimGen', icon: DocumentTextIcon, color: 'text-indigo-500' },
    { id: 'notebook-lm', label: 'NotebookLM', icon: BookOpenIcon, color: 'text-purple-500' },
    { id: 'mail', label: 'Gmail', icon: EnvelopeIcon, color: 'text-red-500' },
    { id: 'excel-viewer', label: 'Excel', icon: TableCellsIcon, color: 'text-green-600' },
    { id: 'test-browser', label: 'Test', icon: GlobeAltIcon, color: 'text-cyan-600' },
  ];

  return (
    <>
      {/* Dock Container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-end gap-2">
        
        {/* Main Dock Bar */}
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-2 px-3 transition-all duration-300 hover:scale-[1.02]">
          
          {dockApps.map((app) => {
            const isActive = currentView === app.id;
            const Icon = app.icon;
            
            return (
              <div key={app.id} className="group relative flex flex-col items-center">
                 {/* Tooltip */}
                 <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {app.label}
                 </span>

                 {/* Icon Button */}
                 <button 
                   onClick={() => onNavigate(app.id as ViewState)}
                   className={`
                      relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 
                      ${isActive ? 'bg-gray-100 shadow-inner' : 'hover:bg-gray-50 hover:-translate-y-2'}
                   `}
                 >
                    <Icon className={`w-6 h-6 ${app.color} transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                    
                    {/* Active Dot indicator */}
                    {isActive && (
                      <span className="absolute -bottom-1 w-1 h-1 bg-gray-400 rounded-full"></span>
                    )}
                 </button>
              </div>
            );
          })}

          {/* Separator */}
          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Add App Button */}
          <div className="group relative flex flex-col items-center">
             <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                App Library
             </span>
             <button 
                onClick={() => setShowAppLibrary(!showAppLibrary)}
                className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:-translate-y-1 transition-all"
             >
                <PlusCircleIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
             </button>
          </div>

        </div>
      </div>

      {/* App Library Modal (Simulation) */}
      {showAppLibrary && (
        <div className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowAppLibrary(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">App Library</h3>
                    <button onClick={() => setShowAppLibrary(false)}><XMarkIcon className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <CalculatorIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-[10px] text-gray-500">Calc</span>
                    </div>
                    {/* Add more placeholders as needed */}
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">More apps coming soon to the platform.</p>
            </div>
        </div>
      )}
    </>
  );
};
