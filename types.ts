
export type DocCategory = 
  | 'contract' 
  | 'correspondence_pre' 
  | 'correspondence_post' 
  | 'emails' 
  | 'reports' 
  | 'minutes' 
  | 'programmes' 
  | 'notices'
  | 'quantum'
  | 'invoices'       // Added for Drive
  | 'appendices'     // Added for Drive
  | 'spreadsheets'   // Added for Drive
  | 'general';       // Added for Drive

export interface UploadedDoc {
  id: string;
  name: string;
  category: DocCategory;
  base64: string;
  mimeType: string;
  size?: number;     // Added for Drive display
  date?: string;     // Added for Drive display
  originalFile?: File; 
  source?: 'local' | 'cloud'; // Added for Google Drive integration
}

export type ViewState = 
  | 'landing' 
  | 'claim-builder' 
  | 'drive' 
  | 'excel-viewer' 
  | 'qs-calc'
  | 'notebook-lm'
  | 'command-center'
  | 'mail'
  | 'timesheet-dashboard'
  | 'mind-map'
  | 'test-browser'; // Added

export interface LogicEntry {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  relatedCell?: string;
  type: 'calc' | 'link' | 'note' | 'system';
}

export interface AppState {
  step: number;
  documents: UploadedDoc[];
  generatedReport: string | null;
  isGenerating: boolean;
  error: string | null;
  arbitrationMode: boolean; // Added for global state
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Step {
  UPLOAD = 1,
  PURPOSE = 2,
  PREVIEW = 3
}

// --- NEW TIMESHEET TYPES ---

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string for sorting
  resourceName: string; // The file or tab name
  activityType: 'Research' | 'Drafting' | 'Forensic Analysis' | 'Review' | 'Correspondence';
  durationMinutes: number;
  notes?: string;
}

export interface DailyTimesheet {
  date: string; // "YYYY-MM-DD"
  totalHours: number;
  itemsAccessed: number; // "Tabs opened"
  summary?: string; // AI Generated conclusion
  logs: ActivityLog[];
}
