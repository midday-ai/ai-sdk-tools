'use client'

import { highlight } from 'sugar-high'
import { LiveDemo } from './live-demo'

export function StoreContent() {
  return (
    <div className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relative z-10">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40">
          <div className="space-y-12">
            <h1 className="text-4xl font-normal leading-tight tracking-wide max-w-[600px]">
              AI chat state that
              scales with your application.
            </h1>
            
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light">
              AI SDK Zustand eliminates prop drilling within your chat components, 
              ensuring better performance and cleaner architecture.
            </p>
            
            {/* Terminal */}
            <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md">
              <span className="text-[#d4d4d4] text-xs font-mono">npm i ai-sdk-zustand</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText('npm i ai-sdk-zustand')}
                className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
                title={`Copy "npm i ai-sdk-zustand" to clipboard`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-label="Copy command">
                  <title>Copy to clipboard</title>
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>

            {/* Used by */}
            <div className="space-y-6 max-w-xl">
              <div className="text-xs text-secondary">Used by</div>
              <div className="flex items-center justify-start">
                <a 
                  href="https://midday.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={90}
                    height={24}
                    viewBox="0 0 248 66"
                    fill="none"
                    aria-label="Midday logo"
                  >
                  <title>Midday logo</title>
                  <path
                    fill="#d4d4d4"
                    d="M35.013 6.36a21.562 21.562 0 0 1 0 13.637l-1.278 3.826 4.742-4.202a17.39 17.39 0 0 0 5.5-9.522l1.343-6.57 4.087.837-1.344 6.57a21.563 21.563 0 0 1-6.819 11.81l-3.022 2.679 6.21-1.27a17.394 17.394 0 0 0 9.525-5.5l4.449-5.016 3.12 2.768-4.448 5.016a21.563 21.563 0 0 1-11.81 6.818l-3.96.81 6.014 2.004c3.57 1.19 7.43 1.19 10.998 0l6.36-2.12L66 32.893l-6.36 2.12a21.562 21.562 0 0 1-13.637 0l-3.829-1.278 4.205 4.742a17.386 17.386 0 0 0 9.522 5.497l6.57 1.346-.837 4.087-6.57-1.344a21.564 21.564 0 0 1-11.81-6.819l-2.676-3.02 1.27 6.208a17.387 17.387 0 0 0 5.496 9.522l5.017 4.449-2.768 3.12-5.016-4.448a21.559 21.559 0 0 1-6.818-11.807l-.81-3.955-2.002 6.01a17.392 17.392 0 0 0 0 10.998l2.12 6.36L33.107 66l-2.12-6.36a21.562 21.562 0 0 1 0-13.637l1.275-3.834-4.74 4.207a17.393 17.393 0 0 0-5.498 9.525l-1.344 6.57-4.087-.84 1.344-6.566a21.563 21.563 0 0 1 6.819-11.81l3.02-2.682-6.207 1.272a17.389 17.389 0 0 0-9.523 5.5L7.597 52.36l-3.12-2.768 4.448-5.016a21.558 21.558 0 0 1 11.807-6.818l3.958-.812-6.012-2.002a17.392 17.392 0 0 0-10.998 0l-6.36 2.12L0 33.107l6.36-2.12a21.562 21.562 0 0 1 13.637 0l3.826 1.275-4.202-4.74a17.387 17.387 0 0 0-9.522-5.498l-6.57-1.344.837-4.087 6.57 1.344a21.564 21.564 0 0 1 11.81 6.819l2.673 3.016-1.267-6.203a17.386 17.386 0 0 0-5.496-9.523l-5.017-4.449 2.768-3.124 5.016 4.449a21.563 21.563 0 0 1 6.818 11.81l.81 3.958 2.004-6.012a17.392 17.392 0 0 0 0-10.998l-2.12-6.36L32.893 0l2.12 6.36ZM33 26.48A6.522 6.522 0 0 0 26.48 33l.036.666a6.52 6.52 0 0 0 12.968 0l.033-.666-.033-.666a6.52 6.52 0 0 0-5.818-5.818L33 26.481Z"
                  />
                  <path
                    fill="#d4d4d4"
                    d="m226.953 59.728 5.856-12.72-9.168-24.096h4.56l6.864 19.344 7.824-19.344h4.464l-15.744 36.816h-4.656ZM207.608 48.352c-2.336 0-4.224-.64-5.664-1.92-1.44-1.28-2.16-2.96-2.16-5.04 0-2.528 1.216-4.512 3.648-5.952 2.464-1.44 6.432-2.48 11.904-3.12v-1.488c0-1.696-.496-2.96-1.488-3.792-.96-.832-2.288-1.248-3.984-1.248-1.76 0-3.168.432-4.224 1.296-1.024.832-1.568 1.92-1.632 3.264h-4.224c.064-1.536.512-2.896 1.344-4.08.832-1.184 1.984-2.112 3.456-2.784 1.504-.704 3.232-1.056 5.184-1.056 3.104 0 5.488.8 7.152 2.4 1.664 1.568 2.496 3.824 2.496 6.768v16.272h-3.888v-3.504c-.768 1.28-1.84 2.272-3.216 2.976-1.376.672-2.944 1.008-4.704 1.008Zm-3.6-7.152c0 1.184.416 2.112 1.248 2.784.832.672 1.984 1.008 3.456 1.008 2.048 0 3.664-.64 4.848-1.92 1.184-1.312 1.776-3.088 1.776-5.328v-2.4c-3.936.416-6.816 1.104-8.64 2.064-1.792.928-2.688 2.192-2.688 3.792ZM181.033 48.352c-2.24 0-4.144-.56-5.712-1.68-1.568-1.152-2.768-2.704-3.6-4.656-.8-1.984-1.2-4.208-1.2-6.672 0-2.432.4-4.608 1.2-6.528.832-1.952 2.032-3.504 3.6-4.656 1.568-1.152 3.472-1.728 5.712-1.728 3.488 0 6.08 1.28 7.776 3.84v-12h4.32v33.6h-4.08v-3.744c-1.664 2.816-4.336 4.224-8.016 4.224Zm1.008-3.36c2.048 0 3.728-.72 5.04-2.16 1.344-1.472 2.016-3.952 2.016-7.44 0-3.488-.672-5.952-2.016-7.392-1.312-1.472-2.992-2.208-5.04-2.208-2.496 0-4.304.896-5.424 2.688-1.088 1.792-1.632 4.08-1.632 6.864 0 3.04.576 5.408 1.728 7.104 1.184 1.696 2.96 2.544 5.328 2.544ZM152.345 48.352c-2.24 0-4.144-.56-5.712-1.68-1.568-1.152-2.768-2.704-3.6-4.656-.8-1.984-1.2-4.208-1.2-6.672 0-2.432.4-4.608 1.2-6.528.832-1.952 2.032-3.504 3.6-4.656 1.568-1.152 3.472-1.728 5.712-1.728 3.488 0 6.08 1.28 7.776 3.84v-12h4.32v33.6h-4.08v-3.744c-1.664 2.816-4.336 4.224-8.016 4.224Zm1.008-3.36c2.048 0 3.728-.72 5.04-2.16 1.344-1.472 2.016-3.952 2.016-7.44 0-3.488-.672-5.952-2.016-7.392-1.312-1.472-2.992-2.208-5.04-2.208-2.496 0-4.304.896-5.424 2.688-1.088 1.792-1.632 4.08-1.632 6.864 0 3.04.576 5.408 1.728 7.104 1.184 1.696 2.96 2.544 5.328 2.544ZM131.422 47.872v-24.96h4.32v24.96h-4.32Zm2.16-27.984c-.8 0-1.472-.256-2.016-.768-.544-.544-.816-1.232-.816-2.064 0-.832.272-1.504.816-2.016.544-.512 1.216-.768 2.016-.768.768 0 1.424.256 1.968.768s.816 1.184.816 2.016c0 .832-.272 1.52-.816 2.064-.544.512-1.2.768-1.968.768ZM89 47.872v-24.96h4.08v3.696c.864-1.504 1.968-2.576 3.312-3.216 1.376-.64 2.656-.96 3.84-.96 1.792 0 3.36.4 4.704 1.2 1.376.8 2.384 2.048 3.024 3.744.512-1.184 1.2-2.144 2.064-2.88.864-.736 1.776-1.264 2.736-1.584.96-.32 1.872-.48 2.736-.48 2.432 0 4.432.736 6 2.208 1.568 1.44 2.352 3.744 2.352 6.912v16.32h-4.32v-15.36c0-1.664-.224-2.976-.672-3.936-.448-.96-1.04-1.632-1.776-2.016a4.795 4.795 0 0 0-2.4-.624 6.55 6.55 0 0 0-2.88.672c-.928.448-1.696 1.216-2.304 2.304-.608 1.088-.912 2.592-.912 4.512v14.448h-4.32v-15.36c0-1.664-.224-2.976-.672-3.936-.448-.96-1.04-1.632-1.776-2.016a4.795 4.795 0 0 0-2.4-.624 6.55 6.55 0 0 0-2.88.672c-.928.448-1.696 1.216-2.304 2.304-.608 1.088-.912 2.592-.912 4.512v14.448H89Z"
                  />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Live Demo */}
          <div className="space-y-6">
            <LiveDemo />
          </div>
        </div>
          
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          <div>
            <h3 className="text-base font-medium mb-3">Access Chat from Any Component</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Say goodbye to prop drilling. Access chat state from any component in your app 
              without passing props through multiple layers.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">Optimized Re-renders</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Components only re-render when their specific data changes. Better performance 
              through selective subscriptions and state isolation.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">Custom Selectors</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Create custom selectors for any derived state with full TypeScript support 
              and complete type safety throughout your application.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">Zero Breaking Changes</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Drop-in replacement with the exact same API. Migrate in seconds without 
              changing any existing code or component structure.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">Tool Calls & Custom Types</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Full support for custom message types, tool calls, and metadata with 
              the same great developer experience you're used to.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">Global State Management</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Built on Zustand for reliable, performant global state that works 
              seamlessly with React's concurrent features and SSR.
            </p>
          </div>
        </div>
            
        {/* Code Example */}
        <div className="space-y-8 mb-40">
          <h2 className="text-lg font-medium">Implementation</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-xs text-secondary">◇ Before (@ai-sdk/react)</div>
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-6 h-[32rem] overflow-y-auto">
                <pre
                  className="text-xs text-[#d4d4d4] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Chat.tsx - Everything in one place
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

function Chat() {
  const { messages, sendMessage, isLoading } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    })
  })
  
  // Pass everything as props
  return (
    <div>
      <Header chatCount={messages.length} />
      <MessageList messages={messages} />
      <MessageInput 
        onSend={sendMessage} 
        disabled={isLoading} 
      />
      <StatusBar isLoading={isLoading} />
      <Sidebar messages={messages} />
    </div>
  )
}

// Props drilling nightmare!
// Every component needs props passed down`)
                  }}
                  suppressHydrationWarning
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-xs text-secondary">◇ After (ai-sdk-zustand)</div>
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-6 h-[32rem] overflow-y-auto">
                <pre
                  className="text-xs text-[#d4d4d4] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Chat.tsx - Clean initialization
import { useChat } from 'ai-sdk-zustand'
import { DefaultChatTransport } from 'ai'

function Chat() {
  useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    })
  })
  
  // No props needed!
  return (
    <div>
      <Header />
      <MessageList />
      <MessageInput />
      <StatusBar />
      <Sidebar />
    </div>
  )
}

// MessageList.tsx - Clean component
function MessageList() {
  const messages = useChatMessages()
  const status = useChatStatus()
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      {status === 'streaming' && <div>AI thinking...</div>}
    </div>
  )
}`)
                  }}
                  suppressHydrationWarning
                />
              </div>
            </div>
          </div>
        </div>
            
        {/* Bottom CTA */}
        <div className="text-center space-y-6">
          <div className="border border-dashed border-muted-foreground p-6 max-w-xl mx-auto">
            <div className="text-sm flex items-center justify-between">
              <div>
                <span className="text-secondary">git: (main)$ </span>
                <span className="text-white">npm i ai-sdk-zustand</span>
              </div>
              <button 
                type="button"
                onClick={() => navigator.clipboard.writeText('npm i ai-sdk-zustand')}
                className="text-secondary hover:text-white transition-colors ml-4"
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="Copy to clipboard">
                  <title>Copy to clipboard</title>
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <p className="text-xs text-[#555555] font-light">
            Drop-in replacement for @ai-sdk/react with global state management.
          </p>
        </div>
      </div>
    </div>
  )
}
