"use client";

import { useState, useEffect } from "react";
const ANIMATION_FRAMES = {
  stage4: `
    (o___o)      [=======]
    ( . . )       \\ * * /
     ( - )         \\ * /
    (_____)^        X
    [__]_[__]      /   \\
                  /=====\\
  `,
  stage3: `
    (o___o)      [=======]
    ( . . )       \\   * /
     ( - )         \\ * /
    (_____)^        X
    [__]_[__]      / . \\
                  /=====\\
  `,
  stage2: `
    (o___o)      [=======]
    ( . . )       \\     /
     ( - )         \\ * /
    (_____)^        X
    [__]_[__]      / . . \\
                  /=====\\
  `,
  stage1: `
    (o___o)      [=======]
    ( . . )       \\     /
     ( - )         \\   /
    (_____)^        X
    [__]_[__]      /* . .\\
                  /=====\\
  `,
  stage0: `
    (o___o)      [=======]
    ( >.< )       \\     /
     ( O )         \\   /
    (_____)^        X
    [__]_[__]      /*****\\
    *RIBBIT!* [=======]
  `
};

export default function Home() {
  const [totalDuration, setTotalDuration] = useState(1500);
  const [secondsLeft, setSecondsLeft] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: any = null;
    if (isActive && secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isActive, secondsLeft]);

  function getAnimationFrame() {
    if (secondsLeft === 0) return ANIMATION_FRAMES.stage0;
    
    const percentage = (secondsLeft / totalDuration) * 100;
    
    if (percentage >= 75) return ANIMATION_FRAMES.stage4;
    if (percentage >= 50) return ANIMATION_FRAMES.stage3;
    if (percentage >= 25) return ANIMATION_FRAMES.stage2;
    return ANIMATION_FRAMES.stage1;
  }

  function changePreset(seconds: number) {
    setIsActive(false);
    setTotalDuration(seconds);
    setSecondsLeft(seconds);
  }

  function startTimer() { setIsActive(true); }
  function pauseTimer() { setIsActive(false); }
  function resetTimer() {
    setIsActive(false);
    setSecondsLeft(totalDuration);
  }

  const displayMinutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const displaySeconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9] p-6">
      <div className="w-full max-w-md bg-white border-4 border-black p-6 flex flex-col items-center space-y-8">
        
        <h1 className="text-4xl font-bold tracking-wider">RIBBIT FOCUS</h1>
        
        <div className="w-full h-44 bg-white border-4 border-black flex items-center justify-center overflow-hidden">
          <pre className="font-mono text-xs leading-none tracking-tight font-bold text-black text-left whitespace-pre">
            {getAnimationFrame()}
          </pre>
        </div>

        <div className="text-7xl font-bold tracking-widest">
          {displayMinutes}:{displaySeconds}
        </div>

        <div className="w-full flex gap-4">
          <button onClick={startTimer} className="flex-1 bg-white text-black border-4 border-black py-2 font-bold uppercase hover:bg-black hover:text-white">
            Start
          </button>
          <button onClick={pauseTimer} className="flex-1 bg-white text-black border-4 border-black py-2 font-bold uppercase hover:bg-black hover:text-white">
            Pause
          </button>
          <button onClick={resetTimer} className="flex-1 bg-white text-black border-4 border-black py-2 font-bold uppercase hover:bg-black hover:text-white">
            Reset
          </button>
        </div>

        <div className="w-full flex justify-around border-t-4 border-black pt-6">
          <button onClick={() => changePreset(1500)} className={`font-bold uppercase text-2xl tracking-wider transition-all ${totalDuration === 1500 ? "text-black underline decoration-4 underline-offset-4" : "text-gray-300 hover:text-black"}`}>
            25m
          </button>
          <button onClick={() => changePreset(900)} className={`font-bold uppercase text-2xl tracking-wider transition-all ${totalDuration === 900 ? "text-black underline decoration-4 underline-offset-4" : "text-gray-300 hover:text-black"}`}>
            15m
          </button>
          <button onClick={() => changePreset(300)} className={`font-bold uppercase text-2xl tracking-wider transition-all ${totalDuration === 300 ? "text-black underline decoration-4 underline-offset-4" : "text-gray-300 hover:text-black"}`}>
            5m
          </button>
        </div>
        
      </div>
    </main>
  );
}