
import React from 'react';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  // Simple parser to render common markdown elements for the report
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold text-slate-800 mt-6 mb-3 serif">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2 serif">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-slate-900 mt-4 mb-6 text-center serif">{line.replace('# ', '')}</h1>;
      }
      
      // Lists
      if (line.trim().startsWith('- ')) {
         // Clean formatting of bolding within list items
         const cleanLine = line.replace('- ', '');
         const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
         return (
            <li key={index} className="ml-6 list-disc mb-1 pl-1 text-slate-700">
                {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </li>
         );
      }
      
      // Numbered Lists (Simple detection)
      if (/^\d+\.\s/.test(line.trim())) {
          return <div key={index} className="ml-6 mb-1 text-slate-700 block font-serif">{line}</div>
      }

      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }

      // Check for Footnote definitions at the end
      if (/^\[\^(\d+)\]:/.test(line.trim())) {
         return (
            <div key={index} className="text-xs text-slate-500 mt-1 pl-4 border-l-2 border-slate-200">
               {line}
            </div>
         );
      }

      // Paragraphs with bold handling and footnote replacement
      // We split by bolding first, then check for footnotes? Or just regex replace footnotes in string.
      // Simplest way for React rendering without full parser:
      
      const parts = line.split(/(\*\*.*?\*\*|\[\^.*?\])/g);
      return (
        <p key={index} className="mb-3 leading-relaxed text-slate-700 text-justify font-serif">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('[^') && part.endsWith(']')) {
               return <sup key={i} className="text-indigo-600 font-bold text-xs ml-0.5">{part.replace(/[^0-9]/g, '')}</sup>
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="markdown-body font-serif text-sm md:text-base max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-slate-200">
      {renderContent(content)}
    </div>
  );
};
