'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
  title?: string
  className?: string
  size?: number
}

export function CopyButton({ text, title, className = "", size = 14 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Show check for 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`text-secondary hover:text-[#d4d4d4] transition-colors p-1 ${className}`}
      title={title || `Copy "${text}" to clipboard`}
    >
      {copied ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-label="Copied"
        >
          <title>Copied to clipboard</title>
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-label="Copy command"
        >
          <title>Copy to clipboard</title>
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
        </svg>
      )}
    </button>
  )
}
