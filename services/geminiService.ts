
import { GoogleGenAI } from "@google/genai";
import { UploadedDoc, ChatMessage, ActivityLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/json',
  'text/plain', 'text/html', 'text/css', 'text/javascript', 'text/csv', 'text/markdown', 'text/xml', 'text/rtf', 'application/rtf',
  'image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif',
  'audio/wav', 'audio/mp3', 'audio/aiff', 'audio/aac', 'audio/ogg', 'audio/flac',
  'video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp'
];

export const generateEOTClaim = async (
  documents: UploadedDoc[],
  claimPurpose: string,
  projectData?: any,
  useFileApi: boolean = false
): Promise<string> => {
  const model = "gemini-3-pro-preview";
  const projectName = projectData?.name || "The Project";
  const projectLocation = projectData?.location || "Designated Site";

  const systemInstruction = `
    You are a world-class Senior Forensic Delay Analyst and Quantum Expert. 
    You are drafting a formal report under the oversight of Andrew John Bowler (Managing Director).
    Project: ${projectName} (${projectLocation}).

    REPORT STRUCTURE (MUST FOLLOW):
    1.0 EXECUTIVE SUMMARY: High-level overview of entitlement (Days & USD).
    2.0 PROJECT PARTICULARS: Key dates, parties, and scope.
    3.0 CONTRACTUAL BASIS: Specific clause analysis (e.g. FIDIC Cl 8.4, 20.1).
    4.0 DELAY CHRONOLOGY: Detailed cause-and-effect narrative.
    5.0 FORENSIC DISRUPTION ANALYSIS: Apply the Zohib Habib methodology (Productivity Loss vs Baseline).
    6.0 QUANTUM EVALUATION: Detailed prolongation cost and loss of opportunity assessment by Alan Clarke.
    7.0 STATEMENT OF CLAIM: Formal closing and signature placeholder.

    TONE: Forensic, objective, authoritative.
    CITATIONS: Every fact must be linked to a source document.
  `;

  const textPrompt = `
    Analyze the uploaded files and construct the "${claimPurpose}" using the 7-section structure defined.
    Focus heavily on sections 5.0 and 6.0 as these require the highest expert rigor.
  `;

  const parts: any[] = [{ text: textPrompt }];
  documents.forEach(doc => {
    if (doc.mimeType && SUPPORTED_MIME_TYPES.includes(doc.mimeType) && doc.base64) {
        const base64Data = doc.base64.includes('base64,') ? doc.base64.split('base64,')[1] : doc.base64;
        parts.push({ inlineData: { mimeType: doc.mimeType, data: base64Data } });
    }
  });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts }],
      config: { systemInstruction, temperature: 0.1 }
    });
    return response.text || "Report generation failed.";
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate report.");
  }
};

export const chatWithDocuments = async (
  documents: UploadedDoc[],
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  const model = "gemini-3-pro-preview";
  const systemInstruction = `Research assistant grounded in provided sources. Expert tone of AJBowler Consult.`;
  const parts: any[] = [];
  documents.forEach(doc => {
     if (doc.mimeType && SUPPORTED_MIME_TYPES.includes(doc.mimeType) && doc.base64) {
        const base64Data = doc.base64.includes('base64,') ? doc.base64.split('base64,')[1] : doc.base64;
        parts.push({ inlineData: { mimeType: doc.mimeType, data: base64Data } });
     }
  });
  let conversationContext = "## CONVERSATION HISTORY:\n";
  history.forEach(msg => { conversationContext += `${msg.role.toUpperCase()}: ${msg.text}\n`; });
  parts.push({ text: `${conversationContext}\n\n## CURRENT REQUEST:\n${newMessage}` });
  try {
    const response = await ai.models.generateContent({ model, contents: [{ parts }], config: { systemInstruction, temperature: 0.3 } });
    return response.text || "No response.";
  } catch (error) { return "Error communicating with Gemini."; }
}

export const generateTimesheetSummary = async (logs: ActivityLog[]): Promise<string> => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `Quantity Surveyor and Forensic Analyst writing a Professional Daily Work Summary.`;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: `Summarize logs: ${JSON.stringify(logs)}` }] }],
      config: { systemInstruction, temperature: 0.4 }
    });
    return response.text || "Summary failed.";
  } catch (error) { return "Unable to generate summary."; }
};
