import React, { useEffect, useState } from 'react';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const [expandLine, setExpandLine] = useState(false);
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animation Sequence:
    // 0ms: Mount
    // 500ms: Red line starts drawing across
    // 1200ms: Text fades in
    // 4000ms: Screen fades out
    // 5000ms: Switch to main app
    
    const t1 = setTimeout(() => setExpandLine(true), 500);
    const t2 = setTimeout(() => setShowText(true), 1200);
    const t3 = setTimeout(() => setFadeOut(true), 4000);
    const t4 = setTimeout(() => onFinish(), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center p-8 max-w-2xl w-full">
        {/* Main Logo Image */}
        <div className={`transition-all duration-1000 transform ${fadeOut ? 'scale-95' : 'scale-100'}`}>
            <img 
            src="https://lh3.googleusercontent.com/d/18XFnqkdZT_B2kUczglilONvEPXYy7daD" 
            alt="AJBowler Consult" 
            className="w-64 md:w-96 object-contain mb-8 drop-shadow-sm"
            />
        </div>

        {/* Text and Underline Container */}
        <div className="relative flex flex-col items-center w-full max-w-md">
             {/* Text */}
             <p 
                className={`font-serif text-slate-800 text-xl md:text-2xl italic font-medium tracking-wide mb-3 text-center transition-all duration-1000 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
             >
                Adding Value Through Experience
             </p>
             
             {/* Red Drawing Line */}
             <div className="w-full h-1.5 rounded-full overflow-hidden flex justify-center">
                <div 
                    className={`h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)] transition-all duration-[1500ms] ease-out ${expandLine ? 'w-full' : 'w-0'}`}
                ></div>
             </div>
        </div>
      </div>
    </div>
  );
};