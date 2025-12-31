
import React from 'react';
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  QuestionMarkCircleIcon, 
  Cog6ToothIcon, 
  PencilIcon,
  InboxIcon,
  StarIcon,
  ClockIcon,
  PaperAirplaneIcon,
  DocumentIcon,
  TrashIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

export const MailClient: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-white font-sans">
       {/* Header */}
       <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4 w-64">
             <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><Bars3Icon className="w-6 h-6" /></button>
             <div className="flex items-center gap-2">
                <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" className="h-6 opacity-80" />
             </div>
          </div>
          
          <div className="flex-1 max-w-2xl">
             <div className="bg-gray-100 rounded-lg flex items-center px-4 py-2.5">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 mr-3" />
                <input type="text" placeholder="Search mail" className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500" />
                <button className="ml-2"><Cog6ToothIcon className="w-5 h-5 text-gray-500" /></button>
             </div>
          </div>

          <div className="w-64 flex justify-end items-center gap-3">
             <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><QuestionMarkCircleIcon className="w-6 h-6" /></button>
             <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><Cog6ToothIcon className="w-6 h-6" /></button>
             <div className="w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center font-bold text-sm">A</div>
          </div>
       </header>

       <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 p-4 shrink-0 flex flex-col">
              <button className="flex items-center gap-3 bg-blue-100 text-blue-900 rounded-2xl px-6 py-4 font-semibold hover:shadow-md transition-shadow mb-6 w-fit">
                 <PencilIcon className="w-5 h-5" /> Compose
              </button>

              <nav className="space-y-1">
                 <SidebarItem icon={InboxIcon} label="Inbox" count={12} active />
                 <SidebarItem icon={StarIcon} label="Starred" />
                 <SidebarItem icon={ClockIcon} label="Snoozed" />
                 <SidebarItem icon={PaperAirplaneIcon} label="Sent" />
                 <SidebarItem icon={DocumentIcon} label="Drafts" count={2} />
                 <SidebarItem icon={ArchiveBoxIcon} label="All Mail" />
                 <SidebarItem icon={TrashIcon} label="Trash" />
              </nav>
          </div>

          {/* Email List */}
          <div className="flex-1 bg-white flex rounded-tl-2xl border-t border-l border-gray-200 overflow-hidden">
             <div className="w-full md:w-2/5 border-r border-gray-200 flex flex-col overflow-y-auto">
                 {/* Tabs */}
                 <div className="flex border-b border-gray-200 shrink-0">
                    <button className="flex-1 py-3 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 hover:bg-gray-50">Primary</button>
                    <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50">Promotions</button>
                    <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50">Social</button>
                 </div>
                 
                 {/* List */}
                 <div className="divide-y divide-gray-100">
                    <EmailItem sender="Project Manager" subject="Re: Extension of Time Claim - Urgent" time="10:42 AM" preview="Hi, Please see the attached comments regarding the EOT..." active />
                    <EmailItem sender="Contractor Admin" subject="Site Diary - Week 42" time="Yesterday" preview="Attached are the site diaries for the last week. Please review..." />
                    <EmailItem sender="Quantity Surveyor" subject="Valuation 05 - Certified" time="May 12" preview="The payment certificate has been issued for Valuation 05..." />
                    <EmailItem sender="Client Rep" subject="Meeting Minutes - Monthly Progress" time="May 10" preview="Minutes from Tuesday's meeting are attached for your records..." />
                 </div>
             </div>

             {/* Detail View */}
             <div className="hidden md:flex flex-1 flex-col bg-white">
                 <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                       <h2 className="text-xl font-normal text-gray-900">Re: Extension of Time Claim - Urgent</h2>
                       <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-xs px-2 py-1 rounded">Inbox</span>
                          <span className="text-xs text-gray-400">10:42 AM (2 hours ago)</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-green-600 rounded-full text-white flex items-center justify-center font-bold">P</div>
                       <div>
                          <p className="text-sm font-bold text-gray-900">Project Manager <span className="text-gray-500 font-normal">&lt;pm@construction.com&gt;</span></p>
                          <p className="text-xs text-gray-500">to me</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-6 text-sm text-gray-800 leading-relaxed overflow-y-auto flex-1">
                    <p className="mb-4">Hi,</p>
                    <p className="mb-4">Please see the attached comments regarding the EOT Claim No. 4 submitted last week.</p>
                    <p className="mb-4">We have reviewed the chronological events listed in section 3.0 and believe there is a discrepancy with the site records regarding the rain event on the 14th.</p>
                    <p className="mb-4">Can you please cross-reference this with the "Daily Diary 24-05.pdf" that is on the Project Drive?</p>
                    <p className="mb-8">Regards,<br/>Project Manager</p>

                    <div className="border border-gray-200 rounded-lg p-4 max-w-sm">
                       <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded">
                             <DocumentIcon className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="overflow-hidden">
                             <p className="text-sm font-bold truncate">Comments_EOT_Claim_04.pdf</p>
                             <p className="text-xs text-gray-500">1.2 MB</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-4 border-t border-gray-200 flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50">Reply</button>
                    <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50">Forward</button>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, count, active }: any) => (
   <div className={`flex items-center justify-between px-6 py-2 rounded-r-full cursor-pointer mr-2 ${active ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}>
      <div className="flex items-center gap-4">
         <Icon className={`w-5 h-5 ${active ? 'text-blue-700' : 'text-gray-500'}`} />
         <span className="text-sm">{label}</span>
      </div>
      {count && <span className="text-xs font-semibold">{count}</span>}
   </div>
);

const EmailItem = ({ sender, subject, time, preview, active }: any) => (
   <div className={`p-4 cursor-pointer hover:shadow-md border-b border-gray-50 ${active ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}>
      <div className="flex justify-between items-baseline mb-1">
         <h4 className={`text-sm truncate w-32 ${active ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{sender}</h4>
         <span className={`text-xs ${active ? 'font-bold text-blue-600' : 'text-gray-500'}`}>{time}</span>
      </div>
      <p className={`text-xs mb-1 truncate ${active ? 'font-bold text-gray-900' : 'text-gray-800'}`}>{subject}</p>
      <p className="text-xs text-gray-500 truncate">{preview}</p>
   </div>
);
