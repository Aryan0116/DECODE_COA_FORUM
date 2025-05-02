import React, { useEffect, useState } from 'react';
import { MessageSquare, Code, Server, Layout, MessageCircle, Users } from 'lucide-react';

// Add custom keyframes for animations
const keyframes = `
@keyframes moveUpDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-40px); }
}

@keyframes moveLeftRight {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(40px); }
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.5; }
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
`;

const Loader = ({ duration = 3500, onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);
  
  const loadingTexts = [
    "Connecting to discussion servers...",
    "Loading forum topics and threads...",
    "Preparing knowledge base access...",
    "Initializing code examples...",
    "Joining community conversations..."
  ];

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const calculatedProgress = (elapsed / duration) * 100;
      const newProgress = Math.min(100, calculatedProgress);
      
      setProgress(Math.round(newProgress));
      
      if (newProgress < 20) {
        setLoadingPhase(0);
      } else if (newProgress < 40) {
        setLoadingPhase(1);
      } else if (newProgress < 60) {
        setLoadingPhase(2);
      } else if (newProgress < 80) {
        setLoadingPhase(3);
      } else {
        setLoadingPhase(4);
      }
      
      if (now < endTime) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          if (onLoadComplete) {
            onLoadComplete();
          }
        }, 400);
      }
    };
    
    requestAnimationFrame(updateProgress);
    
    return () => {
      // Cleanup if needed
    };
  }, [duration, onLoadComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-800">
      {/* Add keyframes for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      {/* Animated message threads flowing in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-8 top-1/3 animate-[moveUpDown_6s_infinite] opacity-20">
          <div className="flex flex-col w-48 space-y-2">
            <div className="bg-blue-400 h-12 w-full rounded-lg"></div>
            <div className="bg-cyan-300 h-8 w-3/4 rounded-lg self-end"></div>
            <div className="bg-blue-400 h-10 w-full rounded-lg"></div>
          </div>
        </div>
        
        <div className="absolute right-8 top-2/3 animate-[moveUpDown_8s_infinite_reverse] opacity-20 delay-300">
          <div className="flex flex-col w-48 space-y-2">
            <div className="bg-cyan-300 h-8 w-3/4 rounded-lg"></div>
            <div className="bg-blue-400 h-12 w-full rounded-lg"></div>
            <div className="bg-cyan-300 h-8 w-3/4 rounded-lg self-end"></div>
          </div>
        </div>
      </div>
      
      {/* Animated messaging background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {/* Message bubbles animation */}
        <div className="absolute top-1/4 left-1/4 h-40 w-64 animate-pulse rounded-lg bg-blue-400"></div>
        <div className="absolute top-1/4 left-1/3 h-24 w-48 animate-pulse rounded-lg bg-cyan-400 delay-150"></div>
        <div className="absolute top-2/4 right-1/4 h-32 w-56 animate-pulse rounded-lg bg-indigo-400 delay-300"></div>
        <div className="absolute bottom-1/4 right-1/3 h-28 w-40 animate-pulse rounded-lg bg-blue-400 delay-500"></div>
        
        {/* Floating code snippets and threads */}
        <div className="absolute top-1/5 right-1/5 h-24 w-32 animate-pulse rounded-md bg-slate-500 opacity-30 delay-200"></div>
        <div className="absolute bottom-2/5 left-1/5 h-20 w-36 animate-pulse rounded-md bg-slate-500 opacity-30 delay-100"></div>
      </div>
      
      {/* Main loader container */}
      <div className="relative flex flex-col items-center justify-center px-8 py-10 backdrop-blur-sm bg-black/30 rounded-xl border border-slate-700 shadow-2xl max-w-md mx-4">
        {/* Logo and spinner with chat bubbles */}
        <div className="relative flex h-32 w-32 items-center justify-center mb-6">
          <div className="absolute h-32 w-32 animate-spin rounded-full border-4 border-t-blue-400 border-r-transparent border-b-cyan-300 border-l-transparent"></div>
          
          {/* Animated chat bubbles around the spinner */}
          <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-blue-400/40 animate-pulse"></div>
          <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-cyan-300/40 animate-pulse delay-300"></div>
          <div className="absolute -top-1 -right-4 h-5 w-5 rounded-full bg-indigo-400/40 animate-pulse delay-700"></div>
          
          <div className="absolute h-20 w-20 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 shadow-lg flex items-center justify-center">
            <MessageCircle size={32} className="text-cyan-300" />
          </div>
        </div>
        
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-blue-400">DECODE</span>
            <span className="text-white">COA</span>
            <span className="text-cyan-300">-FORUM</span>
          </h1>
          <p className="text-slate-300 mt-2 text-sm">Organization • Architecture • Discussion</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-xs mb-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-100 ease-out"
              style={{ width: `${Math.round(progress)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-center text-sm font-medium text-slate-300">
            {loadingTexts[loadingPhase]}
          </div>
        </div>
        
        {/* Loading indicators with animation */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex flex-col items-center">
            <Server className={`${progress > 20 ? 'text-cyan-400' : 'text-slate-500'} mb-2 ${progress > 20 && progress < 40 ? 'animate-pulse' : ''}`} size={20} />
            <span className={`text-xs ${progress > 20 ? 'text-cyan-400' : 'text-slate-500'}`}>Servers</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`h-px w-8 ${progress > 40 ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <MessageSquare className={`${progress > 40 ? 'text-cyan-400' : 'text-slate-500'} mb-2 ${progress > 40 && progress < 60 ? 'animate-pulse' : ''}`} size={20} />
            <span className={`text-xs ${progress > 40 ? 'text-cyan-400' : 'text-slate-500'}`}>Threads</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`h-px w-8 ${progress > 60 ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <Users className={`${progress > 60 ? 'text-cyan-400' : 'text-slate-500'} mb-2 ${progress > 60 && progress < 80 ? 'animate-pulse' : ''}`} size={20} />
            <span className={`text-xs ${progress > 60 ? 'text-cyan-400' : 'text-slate-500'}`}>Community</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`h-px w-8 ${progress > 80 ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <Code className={`${progress > 80 ? 'text-cyan-400' : 'text-slate-500'} mb-2 ${progress > 80 ? 'animate-pulse' : ''}`} size={20} />
            <span className={`text-xs ${progress > 80 ? 'text-cyan-400' : 'text-slate-500'}`}>Discussions</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 mt-8 flex items-center">
        <Code size={12} className="mr-2" /> {progress}% Complete
      </div>
    </div>
  );
};

export default Loader;