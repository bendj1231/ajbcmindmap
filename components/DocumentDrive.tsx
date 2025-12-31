
import React, { useState, useEffect } from 'react';
import { UploadedDoc, DocCategory } from '../types';
import { 
  HomeIcon, 
  FolderIcon, 
  DocumentTextIcon, 
  TableCellsIcon, 
  PhotoIcon, 
  CloudIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  CommandLineIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { FolderOpenIcon, StarIcon } from '@heroicons/react/24/solid';

interface Project {
  id: string;
  name: string;
}

interface Props {
  files: UploadedDoc[];
  onUpload: (files: File[], category: DocCategory) => void;
  onBack: () => void;
  onOpenExcel: (file: UploadedDoc) => void;
  project: Project | null;
  onToggleLogicLog?: () => void;
}

// --- MOCK FILE SYSTEM TYPES ---
interface DriveItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: 'pdf' | 'xls' | 'img' | 'doc';
  size?: string;
  date: string;
  parentId: string | null;
  starred?: boolean;
}

// --- MOCK DATA ---
const BASE_MOCK_DATA: DriveItem[] = [
  // Root Folders (Generic)
  { id: 'f1', name: '01. Contract Documents', type: 'folder', date: '2023-10-01', parentId: 'root' },
  { id: 'f2', name: '02. Correspondence', type: 'folder', date: '2023-10-05', parentId: 'root' },
  { id: 'f3', name: '03. Site Records', type: 'folder', date: '2023-10-10', parentId: 'root' },
  { id: 'f4', name: '04. Financials', type: 'folder', date: '2023-10-12', parentId: 'root' },
  { id: 'f99', name: 'Linked: Google Drive Project X', type: 'folder', date: 'Synced Just Now', parentId: 'root', starred: true },

  // Inside 01. Contract
  { id: 'd1', name: 'Main Contract - FIDIC Red.pdf', type: 'file', fileType: 'pdf', size: '12.4 MB', date: '2023-09-15', parentId: 'f1' },
  { id: 'd2', name: 'Particular Conditions.pdf', type: 'file', fileType: 'pdf', size: '2.1 MB', date: '2023-09-15', parentId: 'f1' },
  { id: 'd3', name: 'Appendix A - Scope.pdf', type: 'file', fileType: 'pdf', size: '5.6 MB', date: '2023-09-15', parentId: 'f1' },

  // Inside 02. Correspondence
  { id: 'f2a', name: 'Incoming', type: 'folder', date: '2023-11-01', parentId: 'f2' },
  { id: 'f2b', name: 'Outgoing', type: 'folder', date: '2023-11-01', parentId: 'f2' },
  { id: 'd4', name: 'Notice of Delay 01.pdf', type: 'file', fileType: 'pdf', size: '450 KB', date: '2023-11-12', parentId: 'f2b' },

  // Inside 03. Site Records
  { id: 'd5', name: 'Daily_Diary_May_24.pdf', type: 'file', fileType: 'pdf', size: '1.2 MB', date: '2023-05-24', parentId: 'f3' },
  { id: 'd6', name: 'Site_Photos_May.zip', type: 'file', fileType: 'img', size: '145 MB', date: '2023-05-25', parentId: 'f3' },
  
  // Inside 04. Financials
  { id: 'd7', name: 'Master_Budget_Tracker.xlsx', type: 'file', fileType: 'xls', size: '45 KB', date: '2023-11-20', parentId: 'f4' },
  { id: 'd8', name: 'Valuation_05.xlsx', type: 'file', fileType: 'xls', size: '22 KB', date: '2023-11-22', parentId: 'f4' },

  // Inside Linked Google Drive
  { id: 'g1', name: 'Shared_Architect_Drawings', type: 'folder', date: 'Cloud', parentId: 'f99' },
  { id: 'g2', name: 'Meeting_Minutes_Cloud.gdoc', type: 'file', fileType: 'doc', size: 'Link', date: 'Cloud', parentId: 'f99' },
];

export const DocumentDrive: React.FC<Props> = ({ onBack, onOpenExcel, project, onToggleLogicLog }) => {
  // State
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  // Derived Data based on Project Context
  const getDriveData = () => {
     if (!project) return BASE_MOCK_DATA;
     // If project exists, we can inject a Root Folder specifically for it or rename the top level
     return BASE_MOCK_DATA.map(item => {
        if (item.parentId === 'root' && item.type === 'folder') {
            return { ...item, name: `${project.name} - ${item.name.substring(4)}` };
        }
        return item;
     });
  };

  const driveData = getDriveData();

  const currentItems = driveData.filter(item => {
    if (searchQuery) return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return item.parentId === currentFolder;
  });

  const currentFolderObj = driveData.find(f => f.id === currentFolder);

  // Handlers
  const handleNavigate = (folderId: string) => {
    setFolderHistory([...folderHistory, currentFolder]);
    setCurrentFolder(folderId);
    setSelectedItems([]);
  };

  const handleBack = () => {
    if (folderHistory.length === 0) return;
    const prev = folderHistory[folderHistory.length - 1];
    setFolderHistory(prevHistory => prevHistory.slice(0, -1));
    setCurrentFolder(prev);
    setSelectedItems([]);
  };

  const toggleSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSendToApp = (appName: string) => {
    setSendingTo(appName);
    // Simulate API call / State update
    setTimeout(() => {
        setSendingTo(null);
        setSelectedItems([]);
        alert(`Successfully sent ${selectedItems.length} document(s) to ${appName}`);
    }, 1500);
  };

  // Icons Helper
  const getFileIcon = (item: DriveItem) => {
    if (item.type === 'folder') {
        if (item.parentId === 'root' && item.name.includes('Linked')) return <CloudIcon className="w-10 h-10 text-blue-500" />;
        return <FolderIcon className="w-10 h-10 text-blue-400" />;
    }
    switch (item.fileType) {
        case 'xls': return <TableCellsIcon className="w-10 h-10 text-emerald-500" />;
        case 'pdf': return <DocumentTextIcon className="w-10 h-10 text-red-500" />;
        case 'img': return <PhotoIcon className="w-10 h-10 text-purple-500" />;
        default: return <DocumentTextIcon className="w-10 h-10 text-slate-400" />;
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-slate-700 overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
         {/* Branding Area */}
         <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
               <CloudIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800">QS Drive</span>
         </div>

         {/* Navigation Links */}
         <div className="p-4 space-y-1 overflow-y-auto flex-1">
            <div className="mb-4">
                {project ? (
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 mb-2">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        {project.name}
                    </div>
                ) : (
                    <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-lg text-xs font-bold mb-2">
                        Global View
                    </div>
                )}
            </div>

            <SidebarItem icon={HomeIcon} label="My Drive" active={currentFolder === 'root'} onClick={() => { setCurrentFolder('root'); setFolderHistory([]); }} />
            <SidebarItem icon={ClockIcon} label="Recent" />
            <SidebarItem icon={StarIcon} label="Starred" />
            
            <div className="pt-4 mt-4 border-t border-slate-200">
                <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Linked Clouds</p>
                <div 
                   onClick={() => handleNavigate('f99')}
                   className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentFolder === 'f99' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'}`}
                >
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-sm font-medium">Google Drive Proj X</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 text-slate-500">
                   <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                   <span className="text-sm font-medium">Dropbox Archive</span>
                </div>
            </div>
         </div>

         {/* Storage Usage */}
         <div className="p-6 border-t border-slate-200">
             <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-slate-600">Storage</span>
                <span className="text-slate-400">75% used</span>
             </div>
             <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                <div className="bg-blue-600 h-1.5 rounded-full w-3/4"></div>
             </div>
             <p className="text-[10px] text-slate-400">15 GB of 20 GB used</p>
         </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
         
         {/* Top Bar - Platform Red */}
         <header className="h-16 border-b border-red-700 bg-red-600 flex items-center justify-between px-6 shrink-0 shadow-lg text-white">
             <div className="flex items-center gap-4 flex-1">
                {folderHistory.length > 0 && (
                    <button onClick={handleBack} className="p-2 hover:bg-black/20 rounded-full text-white transition-colors">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                )}
                <h1 className="text-xl font-bold text-white truncate max-w-md">
                   {currentFolderObj ? currentFolderObj.name : 'My Drive'}
                </h1>
             </div>

             {/* Search */}
             <div className="flex-1 max-w-md mx-4 relative">
                 <MagnifyingGlassIcon className="w-5 h-5 text-red-200 absolute left-3 top-1/2 -translate-y-1/2" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search files, folders, content..." 
                   className="w-full pl-10 pr-4 py-2 bg-black/20 border-none rounded-xl text-sm focus:ring-2 focus:ring-white/50 text-white placeholder-red-200 focus:bg-black/30 transition-all"
                 />
             </div>

             <div className="flex items-center gap-4 flex-1 justify-end">
                 <div className="flex bg-black/20 rounded-lg p-1">
                     <button 
                       onClick={() => setViewMode('grid')}
                       className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-red-600' : 'text-red-200 hover:text-white'}`}
                     >
                        <Squares2X2Icon className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => setViewMode('list')}
                       className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-red-600' : 'text-red-200 hover:text-white'}`}
                     >
                        <ListBulletIcon className="w-5 h-5" />
                     </button>
                 </div>
                 
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
                    <HomeIcon className="w-3 h-3" /> Close Project
                 </button>
             </div>
         </header>

         {/* Context Action Bar (Send To...) */}
         <div className={`bg-indigo-600 text-white overflow-hidden transition-all duration-300 ease-in-out ${selectedItems.length > 0 ? 'h-16' : 'h-0'}`}>
             <div className="h-16 px-6 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-1.5 rounded-full">
                       <CheckCircleIcon className="w-5 h-5" />
                    </div>
                    <span className="font-bold">{selectedItems.length} selected</span>
                 </div>

                 <div className="flex items-center gap-3">
                    <span className="text-indigo-200 text-sm mr-2">Send to:</span>
                    
                    <button 
                      onClick={() => handleSendToApp('Command Center')}
                      disabled={!!sendingTo}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                       {sendingTo === 'Command Center' ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CommandLineIcon className="w-4 h-4" />}
                       Command Center
                    </button>

                    <button 
                      onClick={() => handleSendToApp('Claim Builder')}
                      disabled={!!sendingTo}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                       {sendingTo === 'Claim Builder' ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <WrenchScrewdriverIcon className="w-4 h-4" />}
                       Claim Builder
                    </button>

                    <div className="w-px h-6 bg-indigo-500 mx-2"></div>
                    
                    <button onClick={() => setSelectedItems([])} className="hover:bg-white/10 p-2 rounded-full">
                       <ArrowPathIcon className="w-5 h-5 rotate-45" /> {/* Close Icon Simulation */}
                    </button>
                 </div>
             </div>
         </div>

         {/* File List Area */}
         <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50" onClick={() => setSelectedItems([])}>
             
             {/* Breadcrumbs (Visual Only) */}
             <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <span className="hover:text-blue-600 cursor-pointer" onClick={() => {setCurrentFolder('root'); setFolderHistory([]);}}>My Drive</span>
                {folderHistory.length > 0 && <span className="text-slate-300">/</span>}
                {folderHistory.map(fid => {
                    const f = driveData.find(i => i.id === fid);
                    return f ? <span key={fid} className="hover:text-blue-600 cursor-pointer">{f.name} / </span> : null;
                })}
                <span className="text-slate-800 font-medium">{currentFolderObj ? currentFolderObj.name : 'Root'}</span>
             </div>

             {/* Grid View */}
             {viewMode === 'grid' && (
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {currentItems.map(item => (
                       <div 
                         key={item.id}
                         onClick={(e) => {
                            e.stopPropagation();
                            if (item.type === 'folder') handleNavigate(item.id);
                            else toggleSelection(item.id);
                         }}
                         className={`
                            group relative bg-white border rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-lg
                            ${selectedItems.includes(item.id) ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200 hover:border-blue-300'}
                         `}
                       >
                          {/* Selection Checkbox (Visible on hover or selected) */}
                          <div 
                             onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                             className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all z-10 
                                ${selectedItems.includes(item.id) ? 'bg-blue-500 border-blue-500 opacity-100' : 'border-slate-300 opacity-0 group-hover:opacity-100 bg-white'}
                             `}
                          >
                             {selectedItems.includes(item.id) && <CheckCircleIcon className="w-4 h-4 text-white" />}
                          </div>

                          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                             {getFileIcon(item)}
                          </div>
                          
                          <h3 className="text-sm font-medium text-slate-700 truncate w-full mb-1">{item.name}</h3>
                          <p className="text-xs text-slate-400">
                             {item.type === 'folder' ? item.date : item.size}
                          </p>

                          {item.starred && <StarIcon className="w-4 h-4 text-yellow-400 absolute top-3 right-3" />}
                       </div>
                    ))}
                 </div>
             )}

             {/* List View */}
             {viewMode === 'list' && (
                 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                          <tr>
                             <th className="px-4 py-3 w-10"></th>
                             <th className="px-4 py-3">Name</th>
                             <th className="px-4 py-3 w-32">Date Modified</th>
                             <th className="px-4 py-3 w-24">Size</th>
                             <th className="px-4 py-3 w-10"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {currentItems.map(item => (
                             <tr 
                               key={item.id} 
                               onClick={(e) => {
                                  e.stopPropagation();
                                  if (item.type === 'folder') handleNavigate(item.id);
                                  else toggleSelection(item.id);
                               }}
                               className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                             >
                                <td className="px-4 py-3">
                                   <div className="w-6 h-6">{getFileIcon(item)}</div>
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-700">
                                   {item.name}
                                </td>
                                <td className="px-4 py-3 text-slate-500">{item.date}</td>
                                <td className="px-4 py-3 text-slate-500">{item.size || '--'}</td>
                                <td className="px-4 py-3">
                                   <button className="text-slate-400 hover:text-slate-600"><EllipsisHorizontalIcon className="w-5 h-5"/></button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <div 
       onClick={onClick}
       className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
    >
       <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
       <span className="text-sm">{label}</span>
    </div>
);
