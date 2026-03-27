import Image from 'next/image';
import InteractiveCounter from '../components/InteractiveCounter';
import { formatDate } from '../lib/formatDate';

export default function Home() {
  const today = formatDate(new Date());

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 md:p-16 lg:p-24 bg-black text-white">
      
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm flex flex-col md:flex-row gap-6 md:gap-0">
        <p className="flex w-full justify-center md:justify-start border-b border-zinc-800 pb-6 pt-8 md:w-auto md:border-none md:p-0 text-zinc-300">
          Current workspace:&nbsp;
          <code className="font-mono font-bold text-white">src/app/page.tsx</code>
        </p>
        <div className="flex items-center justify-center md:justify-end w-full md:w-auto pt-4 md:pt-0">
          <span className="text-zinc-400 font-medium">{today}</span>
        </div>
      </div>

      <div className="relative flex place-items-center w-full justify-center mt-12 md:mt-20 lg:mt-0">
        <Image
          className="relative dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <InteractiveCounter />
      
      {/* Social Links Grid Section */}
      <div className="mb-16 md:mb-24 lg:mb-32 grid w-full max-w-5xl text-center grid-cols-1 md:grid-cols-3 md:text-left gap-6 md:gap-8">
        
        <a 
          href="https://kaminglo.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:border-zinc-800 hover:bg-zinc-900/50"
        >
          <h2 className="mb-3 text-xl md:text-2xl font-bold text-white">
            Portfolio <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-zinc-400 mx-auto md:mx-0">
            Check out my latest projects and development experience.
          </p>
        </a>
        
        <a 
          href="https://github.com/KamingLo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:border-zinc-800 hover:bg-zinc-900/50"
        >
          <h2 className="mb-3 text-xl md:text-2xl font-bold text-white">
            GitHub <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-zinc-400 mx-auto md:mx-0">
            Explore my code repositories and open-source contributions.
          </p>
        </a>

        <a 
          href="https://www.linkedin.com/in/kaming-lo/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:border-zinc-800 hover:bg-zinc-900/50"
        >
          <h2 className="mb-3 text-xl md:text-2xl font-bold text-white">
            LinkedIn <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-zinc-400 mx-auto md:mx-0">
            Let&apos;s connect and discuss software engineering and development.
          </p>
        </a>

      </div>

    </main>
  );
}