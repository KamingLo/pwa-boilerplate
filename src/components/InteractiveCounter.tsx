'use client';

import { useCounter } from '../hooks/useCounter';

export default function InteractiveCounter() {
  const { count, increment, decrement } = useCounter(0);

  return (
    <div className="flex flex-col items-center justify-center w-full my-12 md:my-20 lg:my-24">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center text-white">
        Interactive State
      </h2>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 w-full sm:w-auto">
        <button 
          onClick={decrement}
          className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-transparent text-zinc-300 rounded-xl font-medium transition-colors hover:bg-zinc-800 border border-zinc-700"
        >
          Decrease
        </button>
        
        <span className="text-5xl md:text-6xl font-bold text-white w-24 md:w-32 text-center py-4 sm:py-0">
          {count}
        </span>
        
        <button 
          onClick={increment}
          className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-xl font-medium transition-colors hover:bg-zinc-200"
        >
          Increase
        </button>
      </div>
    </div>
  );
}