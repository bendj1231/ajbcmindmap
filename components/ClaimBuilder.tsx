
import React, { useState } from 'react';
import { Step, UploadedDoc, DocCategory } from '../types';
import { generateEOTClaim } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  CloudArrowUpIcon, 
  PaperClipIcon, 
  ArrowDownTrayIcon, 
  ExclamationTriangleIcon, 
  ClipboardDocumentCheckIcon, 
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  ArrowPathIcon,
  ServerStackIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  LinkIcon,
  XMarkIcon,
  PlusIcon,
  ChartBarIcon,
  ScaleIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

const purposeOptions = [
  { 
    title: "Interim EOT & Cost Claim", 
    value: "Interim Extension of time claim and associated cost (to be updated)",
    desc: "A preliminary claim to secure time and associated costs, to be updated later.", 
    icon: BriefcaseIcon 
  },
  { 
    title: "Consolidated Time & Cost Claim", 
    value: "Consolidated claim including for time and cost",
    desc: "A comprehensive, final submission detailing all delays and financial impacts.", 
    icon: ClipboardDocumentCheckIcon 
  },
  { 
    title: "Initial Case Strength Review",
    value: "An initial review of time and cost claims including strength of case",
    desc: "A high-level report analyzing the merits and potential risks of a claim.", 
    icon: ShieldCheckIcon
  },
  { 
    title: "Quantum Expert Report", 
    value: "Quantum expert report",
    desc: "A detailed financial assessment of damages, losses, and costs.", 
    icon: BanknotesIcon 
  },
  { 
    title: "Quantum Expert Report Reply", 
    value: "Quantum Expert Report Reply",
    desc: "A rebuttal or response to a quantum report submitted by the opposing party.", 
    icon: ChatBubbleBottomCenterTextIcon
  },
  { 
    title: "Forensic Disruption Analysis", 
    value: "Forensic Disruption Analysis & Productivity Loss Report",
    desc: "An expert report on productivity loss and disruption, applying forensic methodologies.", 
    icon: ChartBarIcon 
  }
];

const uploadCategories = [
  {
    id: 'contractual',
    title: "Core Contractual Evidence",
    icon: ScaleIcon,
    zones: [
      { category: 'contract', label: 'The Contract' },
      { category: 'notices', label: 'Official Notices' },
    ] as { category: DocCategory, label: string }[]
  },
  {
    id: 'chronology',
    title: "Chronology & Correspondence",
    icon: CalendarDaysIcon,
    zones: [
      { category: 'correspondence_pre', label: 'Pre-Contract Comms' },
      { category: 'correspondence_post', label: 'Post-Contract Comms' },
      { category: 'minutes', label: 'Meeting Minutes' },
      { category: 'programmes', label: 'Programme Updates' },
    ] as { category: DocCategory, label: string }[]
  },
  {
    id: 'substantiation',
    title: "Substantiation & Quantum",
    icon: BanknotesIcon,
    zones: [
      { category: 'reports', label: 'Monthly Reports' },
      { category: 'quantum', label: 'Quantum & Cost Evidence' },
      { category: 'emails', label: 'Supporting Emails' },
    ] as { category: DocCategory, label: string }[]
  }
];

const MAX_DOCUMENTS = 20;

interface Project {
  id: string;
  name: string;
  location: string;
}

interface Props {
  onBackToHome: () => void;
  onOpenNotebook: () => void;
  project: Project | null;
  onToggleLogicLog?: () => void;
}

export const ClaimBuilder: React.FC<Props> = ({ onBackToHome, onOpenNotebook, project, onToggleLogicLog }) => {
  const [step, setStep] = useState<Step>(Step.UPLOAD);
  const [claimPurpose, setClaimPurpose] = useState<string>(purposeOptions[1].value);
  const [useFileApi, setUseFileApi] = useState<boolean>(false);
  
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Link Modal State
  const [activeLinkCategory, setActiveLinkCategory] = useState<DocCategory | null>(null);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, category: DocCategory) => {
    const files = e.target.files;
    if (!files) return;

    if (documents.length + files.length > MAX_DOCUMENTS) {
      setError(`Upload limit reached. You can only upload a maximum of ${MAX_DOCUMENTS} documents to ensure processing stability.`);
      e.target.value = '';
      return;
    }
    setError(null);

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setDocuments(prev => [...prev, {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          category,
          base64,
          mimeType: file.type,
          originalFile: file,
          source: 'local'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLinkSubmit = () => {
    if (!linkName || !linkUrl || !activeLinkCategory) return;

    if (documents.length >= MAX_DOCUMENTS) {
        setError(`Upload limit reached.`);
        return;
    }

    const mockContent = `[SYSTEM: This is a placeholder for content linked from: ${linkUrl}. Treat this as a document named "${linkName}" containing relevant project information.]`;
    const base64 = btoa(mockContent);

    setDocuments(prev => [...prev, {
        id: Date.now().toString() + Math.random().toString(),
        name: linkName,
        category: activeLinkCategory,
        base64: base64,
        mimeType: 'text/plain', 
        source: 'cloud'
    }]);

    setLinkName('');
    setLinkUrl('');
    setActiveLinkCategory(null);
    setError(null);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setError(null); 
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateEOTClaim(documents, claimPurpose, project, useFileApi);
      setReport(result);
      setStep(Step.PREVIEW);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWord = () => {
    if (!report) return;
    const footnoteRegex = /\[\^(\d+)\]:\s*(.*)/g;
    const footnotes: { id: string; text: string }[] = [];
    let match;
    while ((match = footnoteRegex.exec(report)) !== null) {
      footnotes.push({ id: match[1], text: match[2] });
    }
    let cleanReport = report.replace(footnoteRegex, '');
    let htmlContent = cleanReport
      .replace(/^\s*\*\*(\d+\.0\s+.*?)\*\*\s*$/gim, '<h1 style="page-break-before: always;">$1</h1>')
      .replace(/^\s*(\d+\.0\s+.*?)\s*$/gim, '<h1 style="page-break-before: always;">$1</h1>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="page-break-before: always;">$1</h1>') 
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/\n/gim, '<br>');
    htmlContent = htmlContent.replace(/<\/ul><br><ul>/gim, '');
    htmlContent = htmlContent.replace(/\[\^(\d+)\]/g, (match, id) => {
       return `<a style='mso-footnote-id:ftn${id}' href="#_ftn${id}" name="_ftnref${id}" title=""><span class=MsoFootnoteReference><span style='mso-special-character:footnote'><![if !supportFootnotes]><sup style="font-size: 8pt;">[${id}]</sup><![endif]></span></span></a>`;
    });
    let footnoteListHTML = "";
    if (footnotes.length > 0) {
        footnoteListHTML = `<div style='mso-element:footnote-list'><![if !supportFootnotes]><br clear=all><hr align=left size=1 width="33%"><![endif]>`;
        footnotes.forEach(fn => {
            footnoteListHTML += `<div style='mso-element:footnote' id=ftn${fn.id}><p class=MsoFootnoteText><a style='mso-footnote-id:ftn${fn.id}' href="#_ftnref${fn.id}" name="_ftn${fn.id}" title=""><span class=MsoFootnoteReference><span style='mso-special-character:footnote'><![if !supportFootnotes]><sup style="font-size: 8pt;">[${fn.id}]</sup><![endif]></span></span></a> ${fn.text}</p></div>`;
        });
        footnoteListHTML += `</div>`;
    }
    const sourceHTML = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset="utf-8"><title>EOT Claim</title></head><body>${htmlContent}${footnoteListHTML}</body></html>`;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `EOT_Claim_${project?.name || 'Document'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, Step.PREVIEW));
  const prevStep = () => setStep(s => Math.max(s - 1, Step.UPLOAD));

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8 px-4 max-w-4xl mx-auto">
      {[
        { num: 1, label: 'Uploads', icon: CloudArrowUpIcon },
        { num: 2, label: 'Purpose', icon: ClipboardDocumentCheckIcon },
        { num: 3, label: 'Review', icon: CheckCircleIcon }
      ].map((s) => {
        const Icon = s.icon;
        const isActive = step >= s.num;
        const isCurrent = step === s.num;
        return (
          <div key={s.num} className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => step > s.num && setStep(s.num)}>
             <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}>
               <Icon className="w-5 h-5" />
             </div>
             <span className={`text-[10px] sm:text-xs font-semibold tracking-wide ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>{s.label}</span>
          </div>
        );
      })}
      <div className="absolute top-[132px] md:top-[148px] left-0 w-full h-0.5 bg-slate-200 -z-0 hidden md:block max-w-4xl mx-auto right-0" />
    </div>
  );

  // FIX: Using React.FC for UploadZone to ensure special props like 'key' are handled correctly in TypeScript when defined within another component's scope.
  const UploadZone: React.FC<{ category: DocCategory, label: string }> = ({ category, label }) => {
    const categoryDocs = documents.filter(d => d.category === category);
    return (
      <div className="mb-2 last:mb-0">
        <label htmlFor={`file-${category}`} className="group cursor-pointer block bg-slate-100 hover:bg-slate-200/70 p-3 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-800">{label}</span>
              {categoryDocs.length > 0 && <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full font-semibold">{categoryDocs.length}</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setActiveLinkCategory(category); }} className="text-slate-400 hover:text-blue-600" title="Link from cloud"><LinkIcon className="w-4 h-4" /></button>
              <CloudArrowUpIcon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
            </div>
          </div>
        </label>
        <input type="file" multiple className="hidden" id={`file-${category}`} onChange={(e) => handleFileUpload(e, category)} accept=".pdf,.doc,.docx,.txt,image/*" />
        
        {categoryDocs.length > 0 && (
          <div className="mt-2 space-y-1.5 px-2">
            {categoryDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between bg-white border border-slate-200 p-1.5 pl-2 rounded text-xs animate-fade-in-up">
                <div className="flex items-center truncate">
                  {doc.source === 'cloud' ? <LinkIcon className="w-3.5 h-3.5 text-blue-500 mr-2 flex-shrink-0" /> : <PaperClipIcon className="w-3.5 h-3.5 text-slate-500 mr-2 flex-shrink-0" />}
                  <span className="truncate text-slate-600 max-w-[200px]" title={doc.name}>{doc.name}</span>
                </div>
                <button onClick={() => removeDocument(doc.id)} className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 ml-2">
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      
      {activeLinkCategory && (
         <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setActiveLinkCategory(null)}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><LinkIcon className="w-5 h-5 text-blue-600" /> Link Cloud Document</h3>
                  <button onClick={() => setActiveLinkCategory(null)} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
               </div>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Document Name</label>
                     <input type="text" placeholder="e.g. Contract_Variation_04.pdf" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={linkName} onChange={e => setLinkName(e.target.value)} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Drive / Cloud URL</label>
                     <input type="url" placeholder="https://drive.google.com/file/d/..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} />
                  </div>
               </div>
               <div className="mt-8 flex justify-end gap-3">
                  <button onClick={() => setActiveLinkCategory(null)} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button onClick={handleLinkSubmit} disabled={!linkName || !linkUrl} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Add Link</button>
               </div>
            </div>
         </div>
      )}

      <header className="bg-red-600 border-b border-red-700 sticky top-0 z-50 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-black/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                 <DocumentTextIcon className="w-5 h-5 text-white" />
               </div>
               <div>
                  <h1 className="text-xl font-bold tracking-tight leading-none text-white">ClaimGen<span className="text-red-200">AI</span></h1>
                  {project && <span className="text-xs text-red-100 block">Context: {project.name}</span>}
               </div>
             </div>
             <div className="hidden sm:flex items-center border-l border-red-500 pl-4">
               <button onClick={onOpenNotebook} className="flex items-center gap-2 group cursor-pointer hover:bg-black/20 px-3 py-1.5 rounded-lg transition-colors text-left" title="Open Google NotebookLM">
                 <BookOpenIcon className="w-5 h-5 text-red-100 group-hover:text-white" />
                 <span className="text-sm font-semibold text-red-100 group-hover:text-white">NotebookLM</span>
               </button>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onToggleLogicLog} className="p-2 rounded-lg bg-black/20 hover:bg-black/30 text-white border border-red-500/50 transition-colors" title="Open Global Logic Log"><CpuChipIcon className="w-5 h-5" /></button>
             <div className="h-6 w-px bg-red-800 mx-2"></div>
             <button onClick={onBackToHome} className="flex items-center gap-2 text-xs font-bold text-white bg-black border border-slate-800 px-4 py-1.5 rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all" title="Close Project"><ArrowLeftIcon className="w-3 h-3" /> Close Project</button>
          </div>
        </div>
      </header>

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        {renderStepIndicator()}
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md animate-fade-in shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0"><ExclamationTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" /></div>
                <div className="ml-3"><h3 className="text-sm font-medium text-red-800">Notice</h3><p className="text-sm text-red-700 mt-1">{error}</p></div>
              </div>
            </div>
          )}
          {!project && (
             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <BuildingOfficeIcon className="w-6 h-6 text-yellow-600" />
                <div><h3 className="text-sm font-bold text-yellow-800">No Active Project Selected</h3><p className="text-xs text-yellow-700">You are generating a generic claim. To use project-specific context (dates, location), please select a project from the Landing Page.</p></div>
             </div>
          )}

          {step === Step.UPLOAD && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Document Database</h2>
                <p className="text-slate-500">Upload project records. The AI extracts details, contract data, and delay events.</p>
                <div className="flex justify-center items-center gap-4 mt-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                    <span className={`text-xs font-semibold ${documents.length >= MAX_DOCUMENTS ? 'text-red-600' : 'text-indigo-600'}`}>Files Uploaded: {documents.length} / {MAX_DOCUMENTS}</span>
                  </div>
                  <div onClick={() => setUseFileApi(!useFileApi)} className={`cursor-pointer inline-flex items-center px-3 py-1 rounded-full border transition-colors ${useFileApi ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`} title="Use Google AI File API for larger file processing">
                    <div className={`w-3 h-3 rounded-full mr-2 ${useFileApi ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <span className="text-xs font-medium text-slate-600">{useFileApi ? 'High Capacity Mode (File API)' : 'Standard Mode'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {uploadCategories.map(section => {
                  const Icon = section.icon;
                  return (
                    <div key={section.id} className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-base font-bold text-slate-700">{section.title}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {section.zones.map(zone => <UploadZone key={zone.category} category={zone.category} label={zone.label} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === Step.PURPOSE && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Document Purpose</h2>
                <p className="text-slate-500">Select the type of document you need. This determines the tone, structure, and level of detail.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purposeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value} onClick={() => setClaimPurpose(option.value)} className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${claimPurpose === option.value ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 mr-4"><Icon className="w-6 h-6 text-indigo-600" /></div>
                      <div>
                        <p className={`font-bold ${claimPurpose === option.value ? 'text-indigo-900' : 'text-slate-700'}`}>{option.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{option.desc}</p>
                      </div>
                      {claimPurpose === option.value && <CheckCircleIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 ml-2 mt-0.5" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === Step.PREVIEW && (
            <div className="animate-fade-in">
              {!report && !isGenerating && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                  <div className="max-w-lg mx-auto">
                    <div className="mb-6 flex justify-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-100 border border-indigo-200">
                        <BriefcaseIcon className="w-8 h-8 text-indigo-600" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Pre-flight Check</h2>
                    <p className="text-slate-500 mb-8">Confirm the details below, then proceed to generate your document.</p>
                    
                    <div className="space-y-4 text-left bg-slate-50 border border-slate-200 p-4 rounded-xl mb-8">
                       <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500 flex items-center gap-2"><PaperClipIcon className="w-4 h-4" /> Documents Ready</span><span className="font-bold text-indigo-600">{documents.length}</span></div>
                       <div className="flex items-start justify-between"><span className="text-sm font-medium text-slate-500 flex items-center gap-2"><ClipboardDocumentCheckIcon className="w-4 h-4" /> Selected Purpose</span><span className="font-bold text-indigo-600 text-right text-sm max-w-[60%]">{purposeOptions.find(p => p.value === claimPurpose)?.title}</span></div>
                       {project && <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500 flex items-center gap-2"><BuildingOfficeIcon className="w-4 h-4" /> Project Context</span><span className="font-bold text-indigo-600">{project.name}</span></div>}
                    </div>

                    <button onClick={generateReport} className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-transform transform hover:scale-105">
                      <ArrowPathIcon className="w-6 h-6 mr-2" /> Generate Document
                    </button>

                    {useFileApi && <p className="text-xs text-amber-600 mt-4 bg-amber-50 p-2 rounded inline-block"><ServerStackIcon className="w-3 h-3 inline mr-1"/>Using Google AI File API (High Capacity)</p>}
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-6"></div>
                  <h2 className="text-xl font-semibold text-slate-800">Consulting Gemini AI...</h2>
                  <p className="text-slate-500 mt-2">{useFileApi ? "Uploading files to Gemini & " : ""}Analyzing documents and drafting the <strong>{purposeOptions.find(p=>p.value === claimPurpose)?.title}</strong>.</p>
                </div>
              )}

              {report && (
                <div className="space-y-6">
                   <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                      <div className="mb-4 sm:mb-0">
                         <h2 className="font-bold text-slate-800">Generated Document</h2>
                         <p className="text-xs text-slate-500 truncate max-w-xs">{purposeOptions.find(p => p.value === claimPurpose)?.title}</p>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={generateReport} className="text-sm text-slate-500 hover:text-indigo-600 px-3 py-2 border rounded flex items-center"><ArrowPathIcon className="w-4 h-4 mr-1" /> Regenerate</button>
                         <button onClick={handleDownloadWord} className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center shadow-sm"><ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download Word</button>
                         <button onClick={() => window.print()} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center shadow-sm"><ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Print / PDF</button>
                      </div>
                   </div>
                   <MarkdownRenderer content={report} />
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
             <button onClick={prevStep} disabled={step === 1 || isGenerating} className={`flex items-center px-6 py-3 rounded-lg font-medium ${step === 1 ? 'invisible' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}><ChevronLeftIcon className="w-5 h-5 mr-2" /> Previous</button>
             {step < Step.PREVIEW && <button onClick={nextStep} className="flex items-center px-6 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">Next <ChevronRightIcon className="w-5 h-5 ml-2" /></button>}
          </div>
        </div>
      </main>
    </div>
  );
};
