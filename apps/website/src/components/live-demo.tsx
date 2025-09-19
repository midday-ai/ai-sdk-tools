'use client'

import { useChatMessages, useChatStatus, useMessageCount, useChatActions } from '@ai-sdk-tools/store'
import { useState } from 'react'

export function LiveDemo() {
  const [input, setInput] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  
  // Use selectors to access state from anywhere (no storeId needed!)
  const messages = useChatMessages()
  const status = useChatStatus()
  const messageCount = useMessageCount() // Built-in optimized count
  const actions = useChatActions()

  const simulateResponse = async (userMessage: string) => {
    // Add user message using actions
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      parts: [{ type: 'text' as const, text: userMessage }],
    }
    
    actions.pushMessage(userMsg)
    actions.setStatus('streaming')
    
    // Simulate loading
    setTimeout(() => {
      actions.setStatus('streaming')
    }, 100)
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I understand what you're looking for. Here's my take on it.",
        "Interesting point! This is how I'd approach that problem.",
        "Perfect! This is exactly the kind of use case @ai-sdk-tools/store excels at.",
        "Great example! You can see how the selectors update in real-time with O(1) lookups!"
      ]
      
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        parts: [{ type: 'text' as const, text: responses[Math.floor(Math.random() * responses.length)] }],
      }
      
      actions.pushMessage(assistantMsg)
      actions.setStatus('ready')
      
      setIsSimulating(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSimulating) return
    
    setIsSimulating(true)
    simulateResponse(input)
    setInput('')
  }

  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-6 space-y-4">
      {/* Live Stats */}
      <div className="space-y-2">
        <div className="text-xs text-secondary">◇ Live State Access</div>
        <div className="space-y-1 text-xs">
          <div>│ Messages: <span className="text-[#d4d4d4]">{messageCount}</span></div>
          <div>│ Status: <span className="text-[#d4d4d4]">{status}</span></div>
          <div>│ Loading: <span className="text-[#d4d4d4]">{status === 'streaming' || isSimulating ? "●" : "○"}</span></div>
        </div>
        <div className="text-xs text-secondary">└ State updated in real-time</div>
      </div>

      {/* Messages */}
      <div className="space-y-2">
        <div className="text-xs text-secondary">◇ Messages ({messages.length})</div>
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-3 h-32 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-xs text-secondary">No messages yet. Send one below to see live updates!</div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div key={message.id} className="text-xs">
                  <span className="text-[#d4d4d4]">{message.role}:</span> 
                  <span className="text-secondary ml-2">
                    {message.parts?.[0]?.type === 'text' ? message.parts[0].text : 'Message content'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="text-xs text-secondary">◇ Try it out</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] px-3 py-2 text-xs text-[#d4d4d4] placeholder-[#666666] focus:outline-none focus:border-[#666666]"
            disabled={isSimulating}
          />
          <button
            type="submit"
            disabled={isSimulating || !input.trim()}
            className="px-4 py-2 text-xs text-[#d4d4d4] border border-[#2a2a2a] hover:border-[#666666] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSimulating ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div className="text-xs text-secondary">└ Watch selectors update live</div>
      </form>
    </div>
  )
}
