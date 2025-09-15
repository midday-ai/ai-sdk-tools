import Chat from "@/components/chat";
import { SelectorDemo } from "@/components/selector-demo";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            AI SDK Zustand
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Drop-in replacement for @ai-sdk/react with global state management. 
            No prop drilling, better performance, simplified architecture.
          </p>
          
          {/* Terminal-style install command */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-md mx-auto font-mono text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-500 text-xs">terminal</span>
            </div>
            <div>
              <span className="text-gray-500">$</span> <span className="text-green-400">bun add</span> <span className="text-white">@ai-sdk-tools/store</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex justify-center gap-6 text-sm flex-wrap">
            <span className="text-gray-300 flex items-center gap-2">
              <span className="text-green-400">◇</span> Custom Types
            </span>
            <span className="text-gray-300 flex items-center gap-2">
              <span className="text-green-400">◇</span> Tool Calls
            </span>
            <span className="text-gray-300 flex items-center gap-2">
              <span className="text-green-400">◇</span> Data Parts
            </span>
            <span className="text-gray-300 flex items-center gap-2">
              <span className="text-green-400">◇</span> Split Components
            </span>
          </div>
        </div>

        {/* Main Chat Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Interactive Chat Demo
          </h2>
          <Chat />
        </section>

        {/* Selector Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Live Selector Analytics
          </h2>
          <SelectorDemo />
        </section>

        {/* Migration Example */}
        <section className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Migration (30 seconds)
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before */}
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
                <span className="text-red-400">✗</span> Before
              </h3>
              <div className="bg-black border border-gray-700 rounded p-4 font-mono text-sm">
                <div className="text-gray-500">// State trapped in component</div>
                <div className="text-blue-400">import</div> <span className="text-white">{'{ useChat }'}</span> <div className="text-blue-400">from</div> <span className="text-green-400">'@ai-sdk/react'</span>
                <div className="mt-2 text-gray-500">// Props everywhere 😵</div>
              </div>
            </div>
            
            {/* After */}
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
                <span className="text-green-400">✓</span> After
              </h3>
              <div className="bg-black border border-gray-700 rounded p-4 font-mono text-sm">
                <div className="text-gray-500">// Global state access</div>
                <div className="text-blue-400">import</div> <span className="text-white">{'{ useChat }'}</span> <div className="text-blue-400">from</div> <span className="text-green-400">'@ai-sdk-tools/store'</span>
                <div className="mt-2 text-gray-500">// Access from anywhere! 🎉</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm border-t border-gray-800 pt-8">
          <p>
            Built with @ai-sdk-tools/store • Drop-in replacement for @ai-sdk/react with global state
          </p>
        </footer>
      </div>
    </div>
  );
}
