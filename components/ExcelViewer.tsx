
import React, { useState, useEffect } from 'react';
import { UploadedDoc } from '../types';
import { 
  ArrowLeftIcon, 
  TableCellsIcon, 
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
}

interface Props {
  file: UploadedDoc | null;
  onBack: () => void;
  project: Project | null;
}

export const ExcelViewer: React.FC<Props> = ({ file, onBack, project }) => {
  // Mock data generation or CSV parsing would go here. 
  // For the UI demo, we create a grid state.
  const [gridData, setGridData] = useState<string[][]>([]);
  const rows = 20;
  const cols = 10;

  useEffect(() => {
    // Initialize empty grid or load mock data
    const newGrid = Array(rows).fill(0).map(() => Array(cols).fill(''));
    
    // Simulate loading data from file
    if (file) {
      newGrid[0] = ['Item', 'Description', 'Unit', 'Qty', 'Rate', 'Total', 'Status', 'Notes', '', ''];
      newGrid[1] = ['1.0', 'Preliminaries', 'Sum', '1', '5000', '5000', 'Complete', '', '', ''];
      newGrid[2] = ['2.0', 'Substructure', 'm2', '150', '200', '30000', 'In Progress', '', '', ''];
    } else {
       newGrid[0] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    }
    setGridData(newGrid);
  }, [file]);

  const handleCellChange = (r: number, c: number, value: string) => {
    const newGrid = [...gridData];
    newGrid[r][c] = value;
    setGridData(newGrid);
  };

  const getColumnLabel = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Toolbar */}
      <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <TableCellsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
               <h1 className="font-bold text-slate-800 text-sm leading-none">{file ? file.name : 'Untitled Spreadsheet'}</h1>
               <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-xs text-slate-500">Last edited just now</span>
                   {project && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{project.name}</span>}
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors">File</button>
          <button className="px-3 py-1.5 text-xs font-medium hover:bg-slate-100 text-slate-700 rounded transition-colors">Edit</button>
          <button className="px-3 py-1.5 text-xs font-medium hover:bg-slate-100 text-slate-700 rounded transition-colors">View</button>
          <button className="px-3 py-1.5 text-xs font-medium hover:bg-slate-100 text-slate-700 rounded transition-colors">Insert</button>
          <div className="h-6 w-px bg-slate-300 mx-2"></div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded shadow-sm hover:bg-blue-700">
             <ArrowDownTrayIcon className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
         <span className="font-serif italic font-bold text-slate-400 text-xs">fx</span>
         <input className="flex-1 h-6 border border-slate-300 rounded px-2 text-xs focus:outline-none focus:border-blue-500" placeholder="" />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto bg-slate-100 p-1">
        <div className="inline-block bg-white shadow-sm">
           {/* Header Row */}
           <div className="flex">
              <div className="w-10 h-8 bg-slate-50 border-r border-b border-slate-300"></div>
              {Array(cols).fill(0).map((_, i) => (
                <div key={i} className="w-28 h-8 bg-slate-50 border-r border-b border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">
                  {getColumnLabel(i)}
                </div>
              ))}
           </div>
           
           {/* Rows */}
           {gridData.map((row, r) => (
             <div key={r} className="flex">
                <div className="w-10 h-8 bg-slate-50 border-r border-b border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">
                  {r + 1}
                </div>
                {row.map((cell, c) => (
                  <input 
                    key={`${r}-${c}`}
                    className="w-28 h-8 border-r border-b border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-800"
                    value={cell}
                    onChange={(e) => handleCellChange(r, c, e.target.value)}
                  />
                ))}
             </div>
           ))}
        </div>
        
        <div className="mt-4 ml-4">
             <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600">
                <PlusIcon className="w-3 h-3" /> Add 100 rows
             </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-4 text-xs text-slate-500">
         <div className="flex gap-4">
           <button className="font-bold text-blue-600 border-b-2 border-blue-600 px-1">Sheet1</button>
           <button className="hover:text-slate-800 px-1">Sheet2</button>
           <button className="hover:text-slate-800 px-1">+</button>
         </div>
         <div>Ready</div>
      </div>
    </div>
  );
};
