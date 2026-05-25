"use client";

import { useState, useEffect } from "react";
interface SessionLog {
  id: string;
  duration: number;
  type: "focus" | "break";
  timestamp: string;
  dateKey: string;
}

const ANIMATION_FRAMES = {
  focus: {
    stage4: `  (o___o)      [=======]\n  ( . . )       \\ * * /\n   ( - )         \\ * /\n  (_____)^        X\n  [__]_[__]      /   \\\n                /=====\\`,
    stage3: `  (o___o)      [=======]\n  ( . . )       \\   * /\n   ( - )         \\ * /\n  (_____)^        X\n  [__]_[__]      / . \\\n                /=====\\`,
    stage2: `  (o___o)      [=======]\n  ( . . )       \\     /\n   ( - )         \\ * /\n  (_____)^        X\n  [__]_[__]      / . . \\\n                /=====\\`,
    stage1: `  (o___o)      [=======]\n  ( . . )       \\     /\n   ( - )         \\   /\n  (_____)^        X\n  [__]_[__]      /* . .\\\n                /=====\\`,
  },
  break: `  (o___o)       [  ~  ]\n  ( =.= )       (  ~  )\n   ( o )         ) ~ (\n  (_____)^      (  ~  )\n  [__]_[__]     [_____]\n  *RESTING* *CHILLIN*`,
  done: `  (o___o)      [=======]\n  ( >.< )       \\     /\n   ( O )         \\   /\n  (_____)^        X\n  [__]_[__]      /*****\\\n  *RIBBIT!* *DONE!*`
};

export default function Home() {
  const [focusConfig, setFocusConfig] = useState(1500);
  const [breakConfig, setBreakConfig] = useState(300);
  const [currentMode, setCurrentMode] = useState<"focus" | "break">("focus");
  const [secondsLeft, setSecondsLeft] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  const [history, setHistory] = useState<SessionLog[]>([]);

  const getDateKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  useEffect(() => {
    const savedLogs = localStorage.getItem("ribbit_focus_history");
    if (savedLogs) {
      try {
        const parsed: SessionLog[] = JSON.parse(savedLogs);
        const todayKey = getDateKey();
        const filtered = parsed.filter(log => log.dateKey === todayKey);
        setHistory(filtered);
        localStorage.setItem("ribbit_focus_history", JSON.stringify(filtered));
      } catch (e) {
        console.error("Error reading history", e);
      }
    }
  }, []);

  useEffect(() => {
    let intervalId: any = null;

    if (isActive && secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      play8BitBeep();
      logSessionComplete();
      switchCycles();
    }

    return () => clearInterval(intervalId);
  }, [isActive, secondsLeft]);

  const play8BitBeep = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio context blocked or unsupported", e);
    }
  };

  const switchCycles = () => {
    if (currentMode === "focus") {
      setCurrentMode("break");
      setSecondsLeft(breakConfig);
    } else {
      setCurrentMode("focus");
      setSecondsLeft(focusConfig);
    }
    setIsActive(true);
  };

  const logSessionComplete = () => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    
    const newLog: SessionLog = {
      id: Math.random().toString(36).substr(2, 9),
      duration: currentMode === "focus" ? focusConfig : breakConfig,
      type: currentMode,
      timestamp: timestamp,
      dateKey: getDateKey()
    };

    const updatedHistory = [newLog, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("ribbit_focus_history", JSON.stringify(updatedHistory));
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(currentMode === "focus" ? focusConfig : breakConfig);
  };

  const getAnimationFrame = () => {
    if (secondsLeft === 0) return ANIMATION_FRAMES.done;
    if (currentMode === "break") return ANIMATION_FRAMES.break;
    
    const percentage = (secondsLeft / focusConfig) * 100;
    if (percentage >= 75) return ANIMATION_FRAMES.focus.stage4;
    if (percentage >= 50) return ANIMATION_FRAMES.focus.stage3;
    if (percentage >= 25) return ANIMATION_FRAMES.focus.stage2;
    return ANIMATION_FRAMES.focus.stage1;
  };

  const adjustConfig = (type: "focus" | "break", increment: boolean) => {
    setIsActive(false);
    if (type === "focus") {
      const newVal = Math.max(60, focusConfig + (increment ? 60 : -60));
      setFocusConfig(newVal);
      if (currentMode === "focus") setSecondsLeft(newVal);
    } else {
      const newVal = Math.max(60, breakConfig + (increment ? 60 : -60));
      setBreakConfig(newVal);
      if (currentMode === "break") setSecondsLeft(newVal);
    }
  };

  const displayMinutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const displaySeconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start bg-[#F9F9F9] p-4 text-black selection:bg-black selection:text-white">
      <div className="w-full max-w-sm sm:max-w-md bg-white border-4 border-black p-4 sm:p-6 flex flex-col items-center space-y-6 sm:space-y-8 shadow-[6px_6px_0px_#000000] my-4">
        
        <div className="w-full flex justify-between items-center border-b-4 border-black pb-2">
          <h1 className="text-2xl font-bold tracking-widest uppercase">RIBBIT_CLK</h1>
          <div className="px-2 py-0.5 border-2 border-black font-bold text-xs uppercase bg-black text-white">
            STATUS: {isActive ? currentMode : "PAUSED"}
          </div>
        </div>

        <div className={`w-full h-44 border-4 border-black flex items-center justify-center overflow-hidden transition-colors ${currentMode === 'break' && isActive ? 'bg-[#FAFAFA]' : 'bg-white'}`}>
          <pre className="font-mono text-[11px] sm:text-xs leading-none tracking-tight font-black text-black select-none text-left whitespace-pre">
            {getAnimationFrame()}
          </pre>
        </div>

        <div className="text-6xl sm:text-7xl font-bold tracking-widest font-mono text-center select-none my-1">
          {displayMinutes}:{displaySeconds}
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex gap-2">
            <button 
              onClick={() => setIsActive(!isActive)} 
              className={`flex-[2] border-4 border-black py-3 font-bold uppercase text-sm tracking-wider shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] transition-all ${isActive ? 'bg-black text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-black hover:text-white'}`}
            >
              {isActive ? "Pause" : "Start"}
            </button>
            <button 
              onClick={resetTimer} 
              className="flex-1 bg-white text-black border-4 border-black py-3 font-bold uppercase text-sm tracking-wider shadow-[3px_3px_0px_#000000] hover:bg-black hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="w-full border-t-4 border-black pt-4 grid grid-cols-2 gap-4 text-xs font-bold uppercase">
          <div className="flex flex-col items-center space-y-1.5 border-r-2 border-black pr-2">
            <span>Focus Block</span>
            <div className="flex items-center space-x-3 text-lg">
              <button onClick={() => adjustConfig("focus", false)} className="hover:underline text-xl px-1">[-]</button>
              <span className="font-mono">{focusConfig / 60}m</span>
              <button onClick={() => adjustConfig("focus", true)} className="hover:underline text-xl px-1">[+]</button>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1.5 pl-2">
            <span>Break Block</span>
            <div className="flex items-center space-x-3 text-lg">
              <button onClick={() => adjustConfig("break", false)} className="hover:underline text-xl px-1">[-]</button>
              <span className="font-mono">{breakConfig / 60}m</span>
              <button onClick={() => adjustConfig("break", true)} className="hover:underline text-xl px-1">[+]</button>
            </div>
          </div>
        </div>

        <div className="w-full border-t-4 border-black pt-4 flex flex-col space-y-2 max-h-40 overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
            — TODAY&apos;S LOGS ({history.length}) —
          </div>
          {history.length === 0 ? (
            <div className="text-xs uppercase italic text-gray-400 text-center py-2">
              No sessions finalized today. Ready when you are.
            </div>
          ) : (
            history.map((log) => (
              <div 
                key={log.id} 
                className="w-full flex justify-between items-center font-mono text-xs border-2 border-black p-2 bg-[#FAF4F4] shadow-[2px_2px_0px_#000000]"
              >
                <span className="font-bold">
                  ✓ {log.duration / 60}:00 {log.type.toUpperCase()}
                </span>
                <span className="text-gray-600 bg-white border border-black px-1 text-[10px]">
                  {log.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
        
      </div>
    </main>
  );
}