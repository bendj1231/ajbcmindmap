
import React, { useState, useEffect } from 'react';
import { 
  TableCellsIcon, 
  FunnelIcon, 
  EllipsisHorizontalIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Props {
  arbitrationMode: boolean;
  title?: string;
}

export const EmbeddedExcel: React.FC<Props> = ({ arbitrationMode, title = "Merged Project Contexts – Oast Analysis.xlsx" }) => {
  const [gridData, setGridData] = useState<any[]>([]);

  useEffect(() => {
      // Mock data representing "Merged Project Contexts"
      // MM = Month, Peeks = Description, Umt = Unit, Prails = Price, Part = Partial, Posid = Total
      const rawData = [
          { id: 1, desc: 'Clense 88', unit: '', price: 0, part: 60, total: 209.00, arbitration: false },
          { id: 2, desc: 'Classe 87', unit: '', price: 0, part: 40, total: 8.00, arbitration: false },
          { id: 3, desc: 'Claase 39', unit: '', price: 0, part: 40, total: 500.00, arbitration: false },
          { id: 7, desc: 'Chsasq 59', unit: '', price: 0, part: 69, total: 99.00, arbitration: false },
          { id: 8, desc: 'Cleese 36', unit: '2,800', price: 60, part: 46, total: 23.13, arbitration: false },
          { id: 9, desc: 'Caase 26', unit: '2,900', price: 60, part: 40, total: 117.00, arbitration: true }, // Targeted
          { id: 11, desc: 'Cleace 65', unit: '3,800', price: 69, part: 69, total: 9.09, arbitration: false },
          { id: 15, desc: 'Claase 80', unit: '2,600', price: 50, part: 50, total: 23.18, arbitration: true }, // Targeted
          { id: 16, desc: 'Claase 80', unit: '3.10', price: 30, part: 30, total: 350.00, arbitration: true },
          { id: 17, desc: 'Claase 50', unit: '49', price: 49, part: 49, total: 19.00, arbitration: false },
          { id: 18, desc: 'Claase 80', unit: '2,919', price: 59, part: 59, total: 31.86, arbitration: true },
          { id: 19, desc: 'Colase 360', unit: '09', price: 26, part: 26, total: 59.00, arbitration: false },
          { id: 63, desc: 'Mursea 969', unit: '10.600', price: 0, part: 0, total: 5808.00, totalHighlight: true, arbitration: true }
      ];
      setGridData(rawData);
  }, []);

  return (
    <div className="flex flex-col h-full">
       {/* Spreadsheet Toolbar */}
       <div className={`h-10 border-b flex items-center justify-between px-2 shrink-0 transition-colors ${arbitrationMode ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center gap-2">
             <div className={`p-1 rounded ${arbitrationMode ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <TableCellsIcon className="w-4 h-4" />
             </div>
             <span className={`text-xs font-bold ${arbitrationMode ? 'text-red-800' : 'text-emerald-800'}`}>
                {title}
             </span>
             {arbitrationMode && (
                <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold ml-2 animate-pulse">
                   AI ANALYSIS ACTIVE
                </span>
             )}
          </div>
          <div className="flex items-center gap-2">
             <button className="p-1 hover:bg-black/5 rounded"><FunnelIcon className="w-4 h-4 text-slate-500" /></button>
             <button className="p-1 hover:bg-black/5 rounded"><EllipsisHorizontalIcon className="w-4 h-4 text-slate-500" /></button>
          </div>
       </div>

       {/* Formula Bar */}
       <div className="h-8 bg-white border-b border-slate-200 flex items-center px-2 gap-2 shrink-0">
          <div className="w-8 h-5 bg-slate-100 border border-slate-300 rounded text-[10px] flex items-center justify-center text-slate-500 font-mono">
            {arbitrationMode ? <span className="text-red-600 font-bold">ERR</span> : 'D15'}
          </div>
          <div className="w-px h-4 bg-slate-300"></div>
          <div className={`font-mono text-[10px] truncate flex-1 ${arbitrationMode ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
             {arbitrationMode ? '>> CROSS_CHECK(SHEET_DATA, PDF_CLAUSES) >> CONFLICT_FOUND' : '=SUM(IF(ARBITRATION_SCOPE, PROLONGATION_COST, 0))'}
          </div>
       </div>

       {/* Grid */}
       <div className="flex-1 overflow-auto bg-slate-100 relative">
          <table className="w-full border-collapse bg-white text-[11px] font-mono">
             <thead className="sticky top-0 z-10 shadow-sm">
                <tr className="bg-slate-100 text-slate-500">
                   <th className="w-8 border border-slate-300 p-1 bg-slate-50"></th>
                   <th className="w-8 border border-slate-300 p-1 font-normal">A</th>
                   <th className="border border-slate-300 p-1 font-normal text-left pl-2">B</th>
                   <th className="w-20 border border-slate-300 p-1 font-normal text-right pr-2">C</th>
                   <th className="w-16 border border-slate-300 p-1 font-normal text-right pr-2">D</th>
                   <th className="w-16 border border-slate-300 p-1 font-normal text-right pr-2">E</th>
                   <th className="w-24 border border-slate-300 p-1 font-normal text-right pr-2">F</th>
                </tr>
             </thead>
             <tbody>
                {gridData.map((row, idx) => {
                   // Style Logic based on Arbitration Mode
                   const isDimmed = arbitrationMode && !row.arbitration;
                   const isHighlighted = arbitrationMode && row.arbitration;
                   const rowBg = isHighlighted ? 'bg-red-50' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50');
                   const textColor = isDimmed ? 'text-slate-300' : 'text-slate-700';

                   return (
                      <tr key={row.id} className={`${rowBg} ${isDimmed ? 'opacity-40 grayscale' : ''} transition-all duration-500`}>
                         <td className={`border border-slate-300 text-center font-medium ${isHighlighted ? 'bg-red-100 text-red-600 border-red-200' : 'bg-slate-50 text-slate-400'}`}>
                           {isHighlighted ? <ExclamationCircleIcon className="w-3 h-3 mx-auto" /> : row.id}
                         </td>
                         <td className="border border-slate-300 text-center text-slate-400">{row.id}</td>
                         <td className={`border border-slate-300 px-2 ${textColor} font-medium`}>
                             {row.desc}
                         </td>
                         <td className={`border border-slate-300 px-2 text-right ${textColor}`}>{row.unit && parseFloat(row.unit).toFixed(3)}</td>
                         <td className={`border border-slate-300 px-2 text-right ${textColor} ${isHighlighted ? 'bg-orange-100 text-orange-800' : 'bg-orange-50'}`}>{row.price > 0 && row.price}</td>
                         <td className={`border border-slate-300 px-2 text-right ${textColor} ${isHighlighted ? 'bg-red-100 text-red-800' : 'bg-red-50'}`}>{row.part}</td>
                         <td className={`border border-slate-300 px-2 text-right ${row.totalHighlight ? 'bg-yellow-200 font-bold text-slate-900 border-2 border-slate-800' : 'bg-yellow-50 text-slate-800'}`}>
                            {row.total.toFixed(2)}
                         </td>
                      </tr>
                   );
                })}
             </tbody>
          </table>
       </div>
    </div>
  );
};
