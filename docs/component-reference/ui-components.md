# UI Components Library Reference

Complete reference for all 25 base UI components in the AI SDK Tools project.

**Location**: `apps/example/src/components/ui/`

## Overview

The UI components library provides a comprehensive set of reusable, accessible components built on top of Radix UI primitives. All components support:
- Light/Dark theme modes
- Responsive design
- Accessibility (ARIA compliant)
- Tailwind CSS styling

## Component List

### Layout Components

#### Card
**File**: `ui/card.tsx`

Complete card component system for content containers.

**Components**:
- `Card` - Main container
- `CardHeader` - Header section with auto-grid layout
- `CardTitle` - Title text
- `CardDescription` - Subtitle/description
- `CardContent` - Main content area
- `CardFooter` - Footer section
- `CardAction` - Action buttons in header

**Usage**:
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Dashboard Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>
```

**Props**:
- All standard div props
- Supports Tailwind className overrides

---

#### Scroll Area
**File**: `ui/scroll-area.tsx`

Custom scrollable container with styled scrollbars.

**Usage**:
```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-[400px]">
  {/* Long content */}
</ScrollArea>
```

---

#### Collapsible
**File**: `ui/collapsible.tsx`

Expandable/collapsible content sections.

**Components**:
- `Collapsible` - Container
- `CollapsibleTrigger` - Toggle button
- `CollapsibleContent` - Collapsible content

**Usage**:
```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

<Collapsible>
  <CollapsibleTrigger>Show More</CollapsibleTrigger>
  <CollapsibleContent>
    Hidden content
  </CollapsibleContent>
</Collapsible>
```

---

### Form Components

#### Input
**File**: `ui/input.tsx`

Standard text input field.

**Usage**:
```tsx
import { Input } from "@/components/ui/input"

<Input
  type="text"
  placeholder="Enter text..."
  value={value}
  onChange={handleChange}
/>
```

**Props**:
- All standard input props
- Styled with border, focus states, disabled states

---

#### Textarea
**File**: `ui/textarea.tsx`

Multi-line text input.

**Usage**:
```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea
  placeholder="Enter description..."
  rows={5}
/>
```

---

#### Input Group
**File**: `ui/input-group.tsx`

Grouped input fields with labels and descriptions.

**Components**:
- `InputGroup` - Container
- `InputLabel` - Label text
- `InputDescription` - Helper text

---

#### Select
**File**: `ui/select.tsx`

Custom select dropdown built on Radix Select.

**Components**:
- `Select` - Container
- `SelectTrigger` - Toggle button
- `SelectContent` - Dropdown content
- `SelectItem` - Individual option
- `SelectGroup` - Option grouping
- `SelectLabel` - Group label
- `SelectSeparator` - Visual separator

**Usage**:
```tsx
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

#### Command
**File**: `ui/command.tsx`

Command palette / search component.

**Components**:
- `Command` - Container
- `CommandInput` - Search input
- `CommandList` - Results list
- `CommandItem` - Individual result
- `CommandGroup` - Result grouping
- `CommandSeparator` - Visual separator
- `CommandEmpty` - Empty state

**Usage**:
```tsx
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandItem>Result 1</CommandItem>
    <CommandItem>Result 2</CommandItem>
  </CommandList>
</Command>
```

---

### Action Components

#### Button
**File**: `ui/button.tsx`

Standard button component with variants.

**Variants**:
- `default` - Primary button
- `outline` - Outlined button
- `ghost` - Minimal button
- `link` - Link-styled button

**Sizes**:
- `default`
- `sm` - Small
- `lg` - Large
- `icon` - Icon-only

**Usage**:
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="default">
  Click Me
</Button>

<Button variant="outline" size="sm">
  Small Button
</Button>
```

---

#### Voice Button
**File**: `ui/voice-button.tsx`

Specialized button for voice input with recording states.

**Features**:
- Recording state animation
- Microphone icon
- Visual feedback

---

### Display Components

#### Badge
**File**: `ui/badge.tsx`

Small status/label badges.

**Variants**:
- `default` - Primary badge
- `secondary` - Secondary style
- `outline` - Outlined badge
- `destructive` - Error/warning badge

**Usage**:
```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="default">New</Badge>
<Badge variant="outline">Beta</Badge>
```

---

#### Avatar
**File**: `ui/avatar.tsx`

User avatar component with fallback.

**Components**:
- `Avatar` - Container
- `AvatarImage` - Image element
- `AvatarFallback` - Fallback text/icon

**Usage**:
```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
```

---

#### Tooltip
**File**: `ui/tooltip.tsx`

Hover tooltip built on Radix Tooltip.

**Components**:
- `TooltipProvider` - Root provider
- `Tooltip` - Container
- `TooltipTrigger` - Trigger element
- `TooltipContent` - Tooltip content

**Usage**:
```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      Tooltip text
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

#### Hover Card
**File**: `ui/hover-card.tsx`

Rich hover card with more detailed content.

**Components**:
- `HoverCard` - Container
- `HoverCardTrigger` - Trigger element
- `HoverCardContent` - Card content

---

### Feedback Components

#### Progress
**File**: `ui/progress.tsx`

Linear progress bar.

**Usage**:
```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={60} /> {/* 60% complete */}
```

**Props**:
- `value` - Progress value (0-100)

---

#### Progress Toast
**File**: `ui/progress-toast.tsx`

Animated toast notification for loading states.

**Features**:
- Stage-based messaging (loading, processing, analyzing, complete)
- Framer Motion animations
- Loading spinner
- Bottom-center positioning

**Usage**:
```tsx
import { ProgressToast } from "@/components/ui/progress-toast"

<ProgressToast
  isVisible={isLoading}
  stage="processing"
  message="Analyzing data..."
/>
```

**Props**:
- `isVisible` - Show/hide toast
- `stage` - Current stage (loading | processing | analyzing | complete)
- `message` - Optional custom message

---

#### Animated Status
**File**: `ui/animated-status.tsx`

Animated status indicator with icon.

**Usage**:
```tsx
import { AnimatedStatus } from "@/components/ui/animated-status"

<AnimatedStatus status="loading" />
<AnimatedStatus status="success" />
<AnimatedStatus status="error" />
```

---

#### Sonner (Toast)
**File**: `ui/sonner.tsx`

Toast notification system using Sonner library.

**Usage**:
```tsx
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

// In your layout
<Toaster />

// Trigger toast
toast.success("Operation successful!")
toast.error("Something went wrong")
toast.info("Information message")
```

---

### Interactive Components

#### Dialog
**File**: `ui/dialog.tsx`

Modal dialog component.

**Components**:
- `Dialog` - Container
- `DialogTrigger` - Trigger button
- `DialogContent` - Modal content
- `DialogHeader` - Header section
- `DialogTitle` - Title
- `DialogDescription` - Description
- `DialogFooter` - Footer section

**Usage**:
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

---

#### Dropdown Menu
**File**: `ui/dropdown-menu.tsx`

Context menu / dropdown menu component.

**Components**:
- `DropdownMenu` - Container
- `DropdownMenuTrigger` - Trigger button
- `DropdownMenuContent` - Menu content
- `DropdownMenuItem` - Individual item
- `DropdownMenuCheckboxItem` - Checkbox item
- `DropdownMenuRadioItem` - Radio item
- `DropdownMenuSeparator` - Separator
- `DropdownMenuLabel` - Label
- `DropdownMenuGroup` - Item grouping
- `DropdownMenuSub` - Submenu

**Usage**:
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger>Options</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

#### Popover
**File**: `ui/popover.tsx`

Floating popover component.

**Components**:
- `Popover` - Container
- `PopoverTrigger` - Trigger element
- `PopoverContent` - Popover content

**Usage**:
```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger>Click me</PopoverTrigger>
  <PopoverContent>
    Popover content
  </PopoverContent>
</Popover>
```

---

### Data Visualization

#### Chart
**File**: `ui/chart.tsx`

Wrapper for Recharts with theme integration.

**Components**:
- `ChartContainer` - Container with theme
- `ChartTooltip` - Tooltip wrapper
- `ChartTooltipContent` - Styled tooltip
- `ChartLegend` - Legend wrapper
- `ChartLegendContent` - Styled legend

**Features**:
- Automatic light/dark theme colors
- OKLCH color system integration
- Responsive container
- Customizable chart config

**Usage**:
```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis } from "recharts"

const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "hsl(0 0% 0%)",
      dark: "hsl(0 0% 100%)"
    }
  }
}

<ChartContainer config={chartConfig} className="h-[300px]">
  <BarChart data={data}>
    <XAxis dataKey="month" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="revenue" fill="var(--color-revenue)" />
  </BarChart>
</ChartContainer>
```

---

#### Carousel
**File**: `ui/carousel.tsx`

Carousel/slider component using Embla.

**Components**:
- `Carousel` - Container
- `CarouselContent` - Content wrapper
- `CarouselItem` - Individual item
- `CarouselPrevious` - Previous button
- `CarouselNext` - Next button

**Usage**:
```tsx
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

<Carousel>
  <CarouselContent>
    <CarouselItem>Item 1</CarouselItem>
    <CarouselItem>Item 2</CarouselItem>
    <CarouselItem>Item 3</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

---

### Specialized Components

#### Live Waveform
**File**: `ui/live-waveform.tsx`

Real-time audio waveform visualization.

**Features**:
- Canvas-based rendering
- Real-time audio analysis
- Smooth animation
- Responsive sizing

**Usage**:
```tsx
import { LiveWaveform } from "@/components/ui/live-waveform"

<LiveWaveform stream={audioStream} />
```

---

#### Shimmering Text
**File**: `ui/shimmering-text.tsx`

Text with animated shimmer effect.

**Usage**:
```tsx
import { ShimmeringText } from "@/components/ui/shimmering-text"

<ShimmeringText>Loading...</ShimmeringText>
```

---

## Styling Guidelines

### Theme Integration

All components automatically adapt to light/dark mode using CSS variables defined in `globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... more variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... more variables */
}
```

### Customizing Components

Override styles using Tailwind classes:

```tsx
<Card className="bg-red-500 dark:bg-blue-500">
  {/* Custom background colors */}
</Card>
```

### Utility Function

Use the `cn()` utility from `@/lib/utils` to merge classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", conditionalClass && "additional-class", className)}>
```

## Dependencies

- **@radix-ui/react-***: Accessible primitives
- **recharts**: Chart library
- **embla-carousel-react**: Carousel
- **framer-motion**: Animations
- **sonner**: Toast notifications
- **lucide-react**: Icons

## Best Practices

1. **Always use the UI components** instead of raw HTML elements
2. **Respect the theme system** - Use CSS variables instead of hardcoded colors
3. **Use composition** - Combine components to build complex UIs
4. **Add accessibility** - All components are accessible by default
5. **Test in both themes** - Verify components work in light and dark modes

## See Also

- [Branding & Theme System](./branding-theme.md) - Colors, typography, design tokens
- [AI Elements](./ai-elements.md) - AI-specific UI components
- [Chat Components](./chat-components.md) - Chat interface components
