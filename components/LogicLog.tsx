
import React from 'react';
import { LogicEntry } from '../types';
import { ClockIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

interface Props {
   arbitrationMode: boolean;
}

export const LogicLog: React.FC<Props> = ({ arbitrationMode }) => {
   // Mock Global Data simulation
   const logs: LogicEntry[] = [
      { id: '1', timestamp: '10:45 AM', action: 'Pinned Cell Lgis:', detail: 'Calculated from Sect 13.8, no force conditions.', type: 'note', relatedCell: 'E45' },
      { id: '2', timestamp: '20 May 2021', action: 'Opened Spreadsheets', detail: 'Accessed Valuation 05', type: 'system' },
      { id: '3', timestamp: '8 May 2021', action: 'Link Established', detail: 'Evidence #4 linked to Mind Map Node "Delay"', type: 'link' },
      { id: '4', timestamp: '8 May 2021', action: 'Claim Generation', detail: 'Drafted Interim EOT Claim', type: 'system' },
      { id: '5', timestamp: 'August 2021', action: 'Cost Calculation', detail: 'Run rate verified', type: 'calc' },
   ];

   return (
      <div className="p-4 text-slate-300">
         {arbitrationMode && (
            <div className="bg-red-500/10 border border-red-500/50 rounded p-3 mb-4">
               <h4 className="text-red-400 text-xs font-bold uppercase mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Arbitration Context Active
               </h4>
               <p className="text-red-200/70 text-[10px]">Filtering logic for Dispute #3 only.</p>
            </div>
         )}

         {/* Pinned Note (Hero) */}
         <div className="bg-slate-800 text-slate-200 p-3 rounded-lg shadow-sm mb-6 border-l-4 border-yellow-500">
            <div className="flex items-center gap-2 mb-1">
               <MapPinIcon className="w-4 h-4 text-yellow-500" />
               <span className="font-bold text-xs text-yellow-500">Last System Note</span>
            </div>
            <p className="text-xs font-medium leading-relaxed">
               Calculated from Section 13.8; note force majeure conditions do not apply here.
            </p>
         </div>

         {/* Timeline */}
         <div className="relative border-l border-slate-700 ml-2 space-y-6">
            {logs.map((log) => (
               <div key={log.id} className="relative pl-6">
                  <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                     log.type === 'note' ? 'bg-yellow-400' :
                     log.type === 'calc' ? 'bg-emerald-500' :
                     log.type === 'link' ? 'bg-blue-500' : 'bg-slate-600'
                  }`}></div>
                  
                  <div className="flex flex-col gap-0.5">
                     <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                     <p className="text-xs text-slate-300 font-medium hover:text-white cursor-pointer transition-colors">
                        {log.action}
                     </p>
                     {log.detail && (
                        <p className="text-[10px] text-slate-500 leading-tight mt-1">{log.detail}</p>
                     )}
                  </div>
               </div>
            ))}
         </div>
         
         <div className="mt-8 pt-4 border-t border-slate-800 text-center">
             <p className="text-[10px] text-slate-600 uppercase tracking-widest">End of Audit Trail</p>
         </div>
      </div>
   );
};
