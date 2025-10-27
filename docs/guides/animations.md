# Animations Guide

Complete guide to implementing animations in AI SDK Tools using Framer Motion.

## Overview

AI SDK Tools uses Framer Motion for animations, providing:
- Smooth transitions
- Entrance/exit animations
- Gesture-based interactions
- Spring physics
- Scroll-based animations

**Library**: `framer-motion`

## Basic Animations

### Fade In

```tsx
import { motion } from "framer-motion"

export function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### Slide In

```tsx
// Slide from left
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Slide from right
<motion.div
  initial={{ x: 100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Slide from bottom
<motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Scale In

```tsx
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## Entrance/Exit Animations

### Using AnimatePresence

```tsx
import { motion, AnimatePresence } from "framer-motion"

export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="bg-background p-6 rounded-lg">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Progress Toast Animation

**Example from**: `components/ui/progress-toast.tsx`

```tsx
import { AnimatePresence, motion } from "framer-motion"

export function ProgressToast({ isVisible, message }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-background border border-border p-4">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## Canvas/Artifact Animations

### Sliding Canvas

**Example**: Artifact canvas sliding from right

```tsx
import { motion, AnimatePresence } from "framer-motion"

export function ArtifactCanvas({ artifact }) {
  return (
    <AnimatePresence>
      {artifact && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="fixed right-0 top-0 h-full w-1/2 bg-background border-l"
        >
          {/* Canvas content */}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Expanding Canvas

```tsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: "50%" }}
  exit={{ width: 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  className="h-full overflow-hidden"
>
  {/* Content */}
</motion.div>
```

## List Animations

### Staggered Children

```tsx
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function AnimatedList({ items }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={item}>
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### Message List Animation

```tsx
export function MessageList({ messages }) {
  return (
    <div>
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Message message={message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
```

## Loading Animations

### Spinner

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }}
  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
/>
```

### Pulse

```tsx
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="w-4 h-4 bg-primary rounded-full"
/>
```

### Skeleton

```tsx
<motion.div
  animate={{
    opacity: [0.5, 1, 0.5],
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="h-4 bg-muted rounded"
/>
```

### Shimmer Effect

```tsx
<motion.div
  className="relative overflow-hidden bg-muted h-20"
>
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    animate={{
      x: ["-100%", "100%"],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</motion.div>
```

## Button Interactions

### Hover & Tap

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
  className="px-4 py-2 bg-primary text-primary-foreground rounded"
>
  Click Me
</motion.button>
```

### Ripple Effect

```tsx
export function RippleButton({ children, onClick }) {
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number}>>([])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setRipples(prev => [...prev, { x, y, id: Date.now() }])

    setTimeout(() => {
      setRipples(prev => prev.slice(1))
    }, 600)

    onClick?.(e)
  }

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden px-4 py-2 bg-primary rounded"
    >
      {children}

      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{
              scale: 0,
              opacity: 0.5,
              x: ripple.x,
              y: ripple.y,
            }}
            animate={{
              scale: 4,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute w-10 h-10 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          />
        ))}
      </AnimatePresence>
    </button>
  )
}
```

## Progress Animations

### Progress Bar

```tsx
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full bg-primary"
      />
    </div>
  )
}
```

### Circular Progress

```tsx
export function CircularProgress({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 45 // radius = 45

  return (
    <svg width="100" height="100">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="10"
      />
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="10"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{
          strokeDashoffset: circumference - (value / 100) * circumference
        }}
        transition={{ duration: 0.5 }}
        transform="rotate(-90 50 50)"
      />
    </svg>
  )
}
```

## Scroll Animations

### Scroll Reveal

```tsx
import { useInView } from "framer-motion"
import { useRef } from "react"

export function ScrollReveal({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

### Parallax

```tsx
import { useScroll, useTransform } from "framer-motion"

export function Parallax({ children }) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  )
}
```

## Layout Animations

### Shared Layout

```tsx
import { motion, LayoutGroup } from "framer-motion"

export function ExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <LayoutGroup>
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer"
      >
        <motion.h2 layout="position">Title</motion.h2>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>Expanded content...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}
```

### Reordering Lists

```tsx
import { Reorder } from "framer-motion"

export function ReorderableList() {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"])

  return (
    <Reorder.Group values={items} onReorder={setItems}>
      {items.map((item) => (
        <Reorder.Item key={item} value={item}>
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
```

## Advanced Patterns

### Typewriter Effect

```tsx
export function Typewriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index])
        setIndex(prev => prev + 1)
      }, 50)

      return () => clearTimeout(timeout)
    }
  }, [index, text])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
      {index < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </motion.span>
  )
}
```

### Wave Animation

```tsx
export function Wave() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="w-2 h-8 bg-primary"
        />
      ))}
    </div>
  )
}
```

### Confetti

```tsx
export function Confetti() {
  const [particles, setParticles] = useState<Array<{x: number, id: number}>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      id: i,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: -20,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: 360,
          }}
          transition={{
            duration: 3,
            ease: "linear",
            delay: Math.random() * 0.5,
          }}
          className="absolute w-2 h-2 bg-primary"
        />
      ))}
    </div>
  )
}
```

## Performance Best Practices

### Use transform Properties

```tsx
// Good - Uses GPU acceleration
<motion.div
  animate={{ x: 100, scale: 1.5 }}
/>

// Bad - Causes reflow
<motion.div
  animate={{ left: "100px", width: "200px" }}
/>
```

### Will-Change Optimization

```tsx
<motion.div
  style={{ willChange: "transform" }}
  animate={{ x: 100 }}
/>
```

### Reduce Motion

```tsx
import { useReducedMotion } from "framer-motion"

export function AccessibleAnimation({ children }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

## Common Animation Values

### Transition Types

```tsx
// Spring (default)
{ type: "spring", stiffness: 300, damping: 30 }

// Tween
{ type: "tween", duration: 0.3, ease: "easeInOut" }

// Inertia
{ type: "inertia", velocity: 50 }
```

### Easing Functions

```tsx
ease: "linear"
ease: "easeIn"
ease: "easeOut"
ease: "easeInOut"
ease: [0.17, 0.67, 0.83, 0.67] // cubic-bezier
```

### Duration Standards

- **Instant**: 0.1s
- **Fast**: 0.2-0.3s (UI feedback)
- **Normal**: 0.3-0.5s (modals, slides)
- **Slow**: 0.5-1s (page transitions)

## See Also

- [Custom Chat Streaming](./custom-chat-streaming.md)
- [UI Components](../component-reference/ui-components.md)
- [Chat Components](../component-reference/chat-components.md)
