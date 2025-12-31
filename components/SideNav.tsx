
import React from 'react';
import { ViewState } from '../types';
import { 
  HomeIcon,
  CommandLineIcon, 
  DocumentTextIcon, 
  BookOpenIcon, 
  FolderIcon, 
  TableCellsIcon, 
  EnvelopeIcon,
  Squares2X2Icon,
  ClockIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  MapIcon
} from '@heroicons/react/24/outline';

interface Props {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const SideNav: React.FC<Props> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: HomeIcon },
    { id: 'command-center', label: 'Command Center', icon: CommandLineIcon },
    { id: 'claim-builder', label: 'ClaimGen', icon: DocumentTextIcon },
    { id: 'drive', label: 'Documents', icon: FolderIcon },
    { id: 'mind-map', label: 'Mind Map', icon: MapIcon },
    { id: 'timesheet-dashboard', label: 'Progress', icon: ClockIcon },
    { id: 'notebook-lm', label: 'NotebookLM', icon: BookOpenIcon },
    { id: 'mail', label: 'Mail', icon: EnvelopeIcon },
    { id: 'excel-viewer', label: 'Excel', icon: TableCellsIcon },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-20 bg-slate-900 border-r border-slate-800 z-[55] flex flex-col items-center py-6 shadow-xl">
      {/* Brand Icon */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
           QS
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col gap-4 w-full px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`
                group relative w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-slate-700">
                {item.label}
                {/* Arrow */}
                <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-slate-800"></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-4 w-full px-3">
        <button className="w-full aspect-square rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
        <button className="w-full aspect-square rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <UserCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
