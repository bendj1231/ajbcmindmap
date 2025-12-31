
import React from 'react';
import { 
  ChatBubbleLeftEllipsisIcon, 
  EnvelopeIcon, 
  BriefcaseIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Props {
  onClose?: () => void;
}

export const NotificationFeed: React.FC<Props> = ({ onClose }) => {
  // Mock Notification Data
  const notifications = [
    { id: 1, source: 'whatsapp', name: 'Site Manager', msg: 'Concrete pour delayed to 2pm due to rain. Please adjust the schedule.', time: '2m ago', color: 'bg-green-500', icon: ChatBubbleLeftEllipsisIcon },
    { id: 2, source: 'gmail', name: 'Client Representative', msg: 'Re: Valuation #5 Approval - Signed copy attached for your records.', time: '15m ago', color: 'bg-red-500', icon: EnvelopeIcon },
    { id: 3, source: 'linkedin', name: 'Recruiter', msg: 'New opportunity: Senior QS Role at Tier 1 Contractor.', time: '1h ago', color: 'bg-blue-600', icon: BriefcaseIcon },
    { id: 4, source: 'system', name: 'ClaimGen AI', msg: 'Analysis for "Claim_v2.docx" completed successfully. 3 Entitlement events found.', time: '2h ago', color: 'bg-indigo-500', icon: CheckCircleIcon },
    { id: 5, source: 'whatsapp', name: 'Logistics', msg: 'Trucks arriving at Gate 3. Need gate pass approval.', time: '3h ago', color: 'bg-green-500', icon: ChatBubbleLeftEllipsisIcon },
  ];

  return (
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-fade-in origin-top-right">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center shrink-0">
               <div>
                  <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
               </div>
               <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">5 New</span>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin">
               {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div key={notif.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group relative">
                        {/* Unread Dot */}
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        
                        <div className="flex items-start gap-3">
                            {/* Icon/Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-md ${notif.color} ring-2 ring-white`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            
                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="text-sm font-bold text-slate-800 truncate">{notif.name}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-snug group-hover:text-slate-900 transition-colors line-clamp-2">{notif.msg}</p>
                            </div>
                        </div>
                    </div>
                  );
               })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center shrink-0">
               <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 transition-colors w-full">
                  View All Activity
               </button>
            </div>
      </div>
  );
};
