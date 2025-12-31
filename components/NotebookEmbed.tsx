
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  PaperAirplaneIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  TrashIcon,
  PlayCircleIcon,
  CheckBadgeIcon,
  ChatBubbleBottomCenterTextIcon,
  QuestionMarkCircleIcon,
  ListBulletIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  XMarkIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { UploadedDoc, ChatMessage } from '../types';
import { chatWithDocuments } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Project {
  id: string;
  name: string;
}

interface Props {
  onBack: () => void;
  project?: Project | null;
  onExitProject: () => void;
}

export const NotebookEmbed: React.FC<Props> = ({ onBack, project, onExitProject }) => {
  // State
  const [sources, setSources] = useState<UploadedDoc[]>([]);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      text: 'I am ready to help you research your documents.',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Document State
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [isDocGenerating, setIsDocGenerating] = useState(false);

  // Scroll Chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatTyping]);

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSources(prev => [...prev, {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            category: 'general',
            base64: event.target?.result as string,
            mimeType: file.type,
            originalFile: file
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  // ---------------------------------------------------------
  // ACTION HANDLERS
  // ---------------------------------------------------------

  // 1. Generate Document (Center Pane)
  const handleGenerateDocument = async (action: string) => {
    if (sources.length === 0) {
      alert("Please upload sources first.");
      return;
    }

    setIsDocGenerating(true);
    let prompt = "";
    
    switch(action) {
        case 'claim': prompt = "Draft a comprehensive Extension of Time (EOT) Claim based on these sources. Include: 1. Executive Summary, 2. Contract Particulars, 3. Event Chronology, 4. Delay Analysis, and 5. Conclusion. Use academic tone and cite documents."; break;
        case 'summary': prompt = "Summarize the key information from these documents in a structured report format."; break;
        case 'timeline': prompt = "Create a chronological timeline of events based on these documents."; break;
        case 'briefing': prompt = "Create a briefing doc for a stakeholder based on these sources."; break;
        case 'faq': prompt = "Generate a FAQ (Frequently Asked Questions) list from these documents."; break;
        default: prompt = action;
    }

    try {
      // We reuse the chat service but treat the output as a document
      // In a real app, we might use a distinct endpoint or system prompt
      const result = await chatWithDocuments(sources, [], `GENERATE DOCUMENT: ${prompt}`);
      setDocumentContent(result);
    } catch (error) {
      console.error(error);
      setDocumentContent("Error generating document. Please try again.");
    } finally {
      setIsDocGenerating(false);
    }
  };

  // 2. Chat (Right Pane)
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    if (sources.length === 0) {
       setMessages(prev => [...prev, {
         id: Date.now().toString(),
         role: 'user',
         text: chatInput,
         timestamp: new Date()
       }, {
         id: Date.now().toString() + 'err',
         role: 'model',
         text: 'Please add sources to the left panel first.',
         timestamp: new Date()
       }]);
       setChatInput('');
       return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setIsChatTyping(true);

    try {
      const responseText = await chatWithDocuments(sources, messages, newMessage.text);
      const botMessage: ChatMessage = {
        id: Date.now().toString() + 'bot',
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'err',
        role: 'model',
        text: 'Error processing request.',
        timestamp: new Date()
      }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFCFB] font-sans overflow-hidden">
      
      {/* GLOBAL HEADER */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shrink-0">
         <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500" title="Exit Project">
               <ArrowLeftIcon className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                    <SparklesIcon className="w-4 h-4" />
                </div>
                <div>
                   <h1 className="font-semibold text-gray-800 text-base leading-none">Notebook<span className="font-normal text-gray-500">LM</span></h1>
                   {project ? (
                       <div className="flex items-center gap-1 mt-0.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                           <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{project.name}</span>
                       </div>
                   ) : (
                       <span className="text-[10px] text-gray-400 block mt-0.5">Global Research</span>
                   )}
                </div>
             </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 border border-gray-100 rounded px-2 py-1">Gemini 1.5 Pro</span>
            <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xs">
                AJ
            </div>
         </div>
      </header>

      {/* 3-PANE LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* -----------------------------
            LEFT PANE: SOURCES 
        ----------------------------- */}
        <div className="w-72 border-r border-gray-200 bg-[#F8F9FA] flex flex-col shrink-0">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sources</h2>
                    <label className="cursor-pointer p-1 hover:bg-gray-200 rounded">
                        <PlusIcon className="w-4 h-4 text-gray-500" />
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.txt,.md,.csv,.json" />
                    </label>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
                    {sources.map(source => (
                        <div key={source.id} className="group flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-all">
                            <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                <DocumentTextIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-800 truncate" title={source.name}>{source.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                   <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                   <p className="text-[10px] text-gray-400">Synced</p>
                                </div>
                            </div>
                            <button onClick={() => handleRemoveSource(source.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    
                    {/* Add Button */}
                    <label className="flex items-center gap-3 p-2.5 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
                        <div className="w-8 h-8 rounded flex items-center justify-center border border-gray-200">
                            <PlusIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium">Add source</span>
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>
            <div className="mt-auto p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                   <CheckBadgeIcon className="w-4 h-4 text-green-600" />
                   <span>{sources.length} sources active</span>
                </div>
            </div>
        </div>

        {/* -----------------------------
            CENTER PANE: DOCUMENT VIEW
        ----------------------------- */}
        <div className="flex-1 bg-gray-100 flex flex-col relative overflow-hidden">
            
            {/* Toolbar */}
            <div className="h-12 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-gray-600">
                   <DocumentTextIcon className="w-4 h-4" />
                   <span className="text-sm font-semibold">Generated Document</span>
                </div>
                {documentContent && (
                   <button 
                     onClick={() => setDocumentContent(null)}
                     className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                   >
                     <TrashIcon className="w-3 h-3" /> Clear
                   </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                
                {isDocGenerating ? (
                   <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                       <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                       <p className="animate-pulse font-medium">Drafting your document...</p>
                   </div>
                ) : !documentContent ? (
                   /* EMPTY STATE / GUIDES */
                   <div className="max-w-2xl w-full pt-10 animate-fade-in">
                       <div className="text-center mb-10">
                          <h2 className="text-2xl font-serif text-gray-800 mb-2">What would you like to create?</h2>
                          <p className="text-gray-500">Select a template to generate a grounded document from your sources.</p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                            <ActionCard 
                               icon={ClipboardDocumentListIcon} 
                               title="Draft Full Claim" 
                               desc="Comprehensive EOT Claim with Executive Summary and Chronology."
                               color="indigo"
                               onClick={() => handleGenerateDocument('claim')}
                            />
                            <ActionCard 
                               icon={ListBulletIcon} 
                               title="Brief Summary" 
                               desc="Concise overview of all key points in the uploaded files."
                               color="purple"
                               onClick={() => handleGenerateDocument('summary')}
                            />
                            <ActionCard 
                               icon={ChatBubbleBottomCenterTextIcon} 
                               title="Timeline Analysis" 
                               desc="Extract dates and events into a chronological order."
                               color="orange"
                               onClick={() => handleGenerateDocument('timeline')}
                            />
                            <ActionCard 
                               icon={QuestionMarkCircleIcon} 
                               title="Briefing Note" 
                               desc="Executive briefing note for stakeholders."
                               color="blue"
                               onClick={() => handleGenerateDocument('briefing')}
                            />
                       </div>
                   </div>
                ) : (
                   /* DOCUMENT VIEW */
                   <div className="w-full max-w-[850px] bg-white shadow-sm border border-gray-200 min-h-[1000px] p-12 mb-8 animate-fade-in">
                       <MarkdownRenderer content={documentContent} />
                   </div>
                )}
            </div>
        </div>

        {/* -----------------------------
            RIGHT PANE: CHAT 
        ----------------------------- */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shrink-0">
            <div className="h-12 border-b border-gray-100 px-4 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Chat Companion</span>
                <button 
                  onClick={() => setMessages([])} 
                  className="text-gray-400 hover:text-gray-600"
                  title="Clear Chat"
                >
                   <ArrowPathIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                           msg.role === 'user' 
                              ? 'bg-blue-600 text-white rounded-tr-sm' 
                              : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                        }`}>
                           {msg.role === 'user' ? (
                              msg.text
                           ) : (
                              <div className="prose prose-sm prose-p:leading-tight max-w-none text-gray-800">
                                 <MarkdownRenderer content={msg.text} />
                              </div>
                           )}
                        </div>
                        <span className="text-[10px] text-gray-300 mt-1 px-1">
                           {msg.role === 'user' ? 'You' : 'Gemini'}
                        </span>
                    </div>
                ))}
                {isChatTyping && (
                   <div className="flex items-start">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                         <div className="flex gap-1 h-4 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                         </div>
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative">
                   <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleChatSend();
                         }
                      }}
                      placeholder="Ask about the document..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                      rows={1}
                      style={{ minHeight: '46px', maxHeight: '120px' }}
                   />
                   <button 
                      onClick={handleChatSend}
                      disabled={!chatInput.trim() || isChatTyping}
                      className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                   >
                      <PaperAirplaneIcon className="w-4 h-4" />
                   </button>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-[10px] text-gray-400">
                       Chat works alongside the editor.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component for the Guide Cards
const ActionCard = ({ icon: Icon, title, desc, color, onClick }: any) => {
   const colorClasses: any = {
      indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 border-indigo-100',
      purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100 border-purple-100',
      orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100 border-orange-100',
      blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 border-blue-100',
   };

   return (
      <div 
         onClick={onClick}
         className={`group p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md hover:border-${color}-200 transition-all cursor-pointer flex flex-col items-start text-left h-full`}
      >
         <div className={`p-2 rounded-lg mb-3 ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
         </div>
         <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
         <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
   );
};
