import React, { useState } from 'react';
import { CalculatorIcon, HomeIcon } from '@heroicons/react/24/outline';

interface Props {
  onBack: () => void;
}

export const QSCalculator: React.FC<Props> = ({ onBack }) => {
  const [area, setArea] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [waste, setWaste] = useState<number>(5);

  const total = area * rate * (1 + waste/100);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
       <button onClick={onBack} className="mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
          <HomeIcon className="w-5 h-5 mr-2" /> Back to Hub
       </button>

       <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-emerald-600 p-6 flex items-center gap-4">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CalculatorIcon className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-white">QS Estimator</h1>
                <p className="text-emerald-100 text-sm">Quick Material Cost Calc</p>
             </div>
          </div>

          <div className="p-8 space-y-6">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Total Area (m²)</label>
               <input 
                 type="number" 
                 className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                 value={area}
                 onChange={e => setArea(Number(e.target.value))}
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Unit Rate ($/m²)</label>
               <input 
                 type="number" 
                 className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                 value={rate}
                 onChange={e => setRate(Number(e.target.value))}
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Waste Margin (%)</label>
               <input 
                 type="range" 
                 min="0" max="20"
                 className="w-full accent-emerald-600"
                 value={waste}
                 onChange={e => setWaste(Number(e.target.value))}
               />
               <div className="text-right text-xs text-slate-500 mt-1">{waste}% waste</div>
             </div>

             <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-500">Subtotal</span>
                 <span className="font-mono text-slate-700">${(area * rate).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                 <span className="text-slate-500">Waste Cost</span>
                 <span className="font-mono text-slate-700">${(area * rate * (waste/100)).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                 <span className="font-bold text-slate-800 text-lg">Estimated Total</span>
                 <span className="font-bold text-emerald-600 text-2xl font-mono">${total.toFixed(2)}</span>
               </div>
             </div>
          </div>
       </div>
    </div>
  );
};
