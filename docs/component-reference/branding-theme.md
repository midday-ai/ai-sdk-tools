# Branding & Theme System

Complete guide to the AI SDK Tools branding, design system, and theme implementation.

## Overview

The branding system consists of:
- **Logo Components** - SVG logos and branding marks
- **Icon Library** - Custom icon system
- **Theme System** - Light/dark mode with OKLCH colors
- **Design Tokens** - CSS variables for consistent styling
- **Typography** - Font system

## Logo Components

### Main Logo
**File**: `apps/example/src/components/logo.tsx`

Geometric SVG logo with gradient styling.

**Specifications**:
- ViewBox: `0 0 95 83`
- Design: Geometric shape composition
- Colors: Gradient from `#737373` (gray) to current color
- Responsive: Scales with container

**Component Structure**:
```tsx
export function Logo({ className, ...props }: React.ComponentProps<"svg">)
```

**Usage**:
```tsx
import { Logo } from "@/components/logo"

<Logo className="h-6 w-6" />
<Logo className="h-12 w-12 text-blue-500" />
```

**Features**:
- Inherits text color for dynamic theming
- Supports all SVG props
- Gradient automatically adapts to color
- Used in header and devtools

**Visual Details**:
The logo consists of three geometric shapes:
1. Solid colored path (inherits currentColor)
2. Gradient path (gray to currentColor transition)
3. Additional solid path

---

### Icon Library
**File**: `apps/example/src/components/icons.tsx`

Custom icon system with reusable SVG wrapper.

**Base Component**: `SVGIcon`
```tsx
interface SVGIconProps extends React.ComponentProps<"svg"> {
  size?: number | string
  className?: string
}

export function SVGIcon({ size = 24, className, ...props }: SVGIconProps)
```

**Secondary Logo**: Complex spiral/circular design
- ViewBox: `0 0 28 28`
- Multiple paths creating circular pattern
- Uses OKLCH color system
- More decorative alternative logo

**Usage**:
```tsx
import { SVGIcon } from "@/components/icons"

// Custom icon
<SVGIcon size={32} className="text-primary">
  <path d="..." />
</SVGIcon>
```

**Features**:
- Configurable size (number or string like "2rem")
- Responsive
- Theme-aware coloring
- Consistent styling across icons

---

### Devtools Logo
**File**: `packages/devtools/src/components/devtools-button.tsx`

Branded floating button with AI SDK Tools logo.

**Specifications**:
- Size: 48px × 48px (circular)
- Background: Black (#000000)
- Logo Color: Light gray (#D9D9D9)
- Position: Fixed bottom-right
- Z-index: 999999

**Features**:
- Event counter badge
- Animation on new events
- Click to open devtools panel
- Hover effects

**Visual Design**:
- Circular button with drop shadow
- Logo centered inside
- Red badge for event count (when > 0)
- Smooth hover transition

---

## Theme System

### Theme Provider
**File**: `apps/example/src/components/theme-toggle.tsx`

Toggle component for switching between light and dark modes.

**Technologies**:
- `next-themes` - Theme management library
- `lucide-react` - Sun/Moon icons

**Usage**:
```tsx
import { ThemeToggle } from "@/components/theme-toggle"

<ThemeToggle />
```

**Features**:
- Persists theme preference
- System theme detection
- Smooth transition between themes
- Icon changes based on current theme

---

### Design Tokens

**File**: `apps/example/src/app/globals.css`

All design tokens are defined as CSS variables using the OKLCH color space.

#### Light Theme (`:root`)

```css
:root {
  /* Backgrounds */
  --background: oklch(1 0 0);           /* Pure white */
  --foreground: oklch(0.145 0 0);      /* Almost black */

  /* UI Elements */
  --card: oklch(1 0 0);                /* White */
  --card-foreground: oklch(0.145 0 0); /* Dark text */

  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* Primary Colors */
  --primary: oklch(0.205 0 0);         /* Dark gray */
  --primary-foreground: oklch(0.985 0 0); /* Almost white */

  /* Secondary Colors */
  --secondary: oklch(0.97 0 0);        /* Very light gray */
  --secondary-foreground: oklch(0.205 0 0);

  /* Muted Colors */
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.475 0 0); /* Medium gray */

  /* Accent Colors */
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);

  /* Destructive/Error */
  --destructive: oklch(0.568 0.195 27.849); /* Red */
  --destructive-foreground: oklch(0.985 0 0);

  /* Borders & Inputs */
  --border: oklch(0.925 0 0);          /* Light gray border */
  --input: oklch(0.925 0 0);
  --ring: oklch(0.145 0 0);            /* Focus ring */

  /* Chart Colors (Data Visualization) */
  --chart-1: oklch(0.205 0 0);
  --chart-2: oklch(0.661 0.133 249.03);
  --chart-3: oklch(0.608 0.15 35.239);
  --chart-4: oklch(0.694 0.16 138.846);
  --chart-5: oklch(0.787 0.109 74.706);

  /* Border Radius */
  --radius: 0.625rem;                  /* 10px base radius */
}
```

#### Dark Theme (`.dark`)

```css
.dark {
  /* Backgrounds */
  --background: oklch(0.145 0 0);      /* Almost black */
  --foreground: oklch(0.985 0 0);      /* Almost white */

  /* UI Elements */
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);

  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);

  /* Primary Colors */
  --primary: oklch(0.985 0 0);         /* Almost white */
  --primary-foreground: oklch(0.205 0 0); /* Dark gray */

  /* Secondary Colors */
  --secondary: oklch(0.24 0 0);        /* Dark gray */
  --secondary-foreground: oklch(0.985 0 0);

  /* Muted Colors */
  --muted: oklch(0.24 0 0);
  --muted-foreground: oklch(0.68 0 0); /* Light gray */

  /* Accent Colors */
  --accent: oklch(0.24 0 0);
  --accent-foreground: oklch(0.985 0 0);

  /* Destructive/Error */
  --destructive: oklch(0.622 0.241 28.042);
  --destructive-foreground: oklch(0.985 0 0);

  /* Borders & Inputs */
  --border: oklch(0.24 0 0);
  --input: oklch(0.24 0 0);
  --ring: oklch(0.844 0.022 247.831);

  /* Chart Colors remain the same for consistency */
}
```

#### Border Radius Variants

```css
:root {
  --radius: 0.625rem;      /* 10px - Base */
}

/* Additional variants via Tailwind */
.rounded-sm   /* 0.125rem - 2px */
.rounded      /* 0.25rem - 4px */
.rounded-md   /* 0.375rem - 6px */
.rounded-lg   /* 0.5rem - 8px */
.rounded-xl   /* 0.75rem - 12px */
```

---

## Typography System

### Font Families

**Defined in**: `apps/example/src/app/layout.tsx` and `globals.css`

#### Geist Sans (Primary)
- **Variable**: `--font-geist-sans`
- **Usage**: Body text, UI elements
- **Weight**: Variable font (multiple weights)
- **Features**: Clean, modern sans-serif

```tsx
import { GeistSans } from "geist/font/sans"

<body className={GeistSans.variable}>
```

#### Departure Mono (Code)
- **Variable**: `--font-departure-mono`
- **Usage**: Code blocks, monospace text, financial numbers
- **Features**: Tabular numbers, clear distinction

```css
.font-mono {
  font-family: var(--font-departure-mono);
}
```

#### Geist (Serif - Optional)
- **Variable**: `--font-geist-serif`
- **Usage**: Special headings, emphasis
- **Features**: Classical serif for contrast

### Typography Classes

```css
/* Defined in Tailwind config */
font-sans   /* Geist Sans */
font-mono   /* Departure Mono */
font-serif  /* Geist Serif */
```

---

## Color System (OKLCH)

### Why OKLCH?

OKLCH is a perceptually uniform color space that provides:
- **Better brightness perception** - Colors with same L value appear equally bright
- **Consistent saturation** - More predictable color behavior
- **Better for dark themes** - Easier to create matching light/dark pairs
- **CSS native** - Supported in modern browsers

### OKLCH Syntax

```css
oklch(L C H)
/* L = Lightness (0-1) */
/* C = Chroma/Saturation (0-0.4+) */
/* H = Hue (0-360 degrees) */
```

### Common Color Values

```css
/* Grays (C = 0, no saturation) */
oklch(1 0 0)         /* Pure white */
oklch(0.985 0 0)     /* Almost white */
oklch(0.97 0 0)      /* Very light gray */
oklch(0.68 0 0)      /* Medium gray */
oklch(0.475 0 0)     /* Dark gray */
oklch(0.24 0 0)      /* Very dark gray */
oklch(0.145 0 0)     /* Almost black */
oklch(0 0 0)         /* Pure black */

/* Colored values */
oklch(0.568 0.195 27.849)   /* Red (destructive) */
oklch(0.661 0.133 249.03)   /* Blue (chart) */
oklch(0.608 0.15 35.239)    /* Orange (chart) */
oklch(0.694 0.16 138.846)   /* Green (chart) */
```

---

## Using the Theme System

### Accessing Theme Colors in Components

```tsx
// Via Tailwind classes
<div className="bg-background text-foreground">
  <div className="border border-border">
    Content
  </div>
</div>

// In dark mode, these automatically switch
<div className="bg-primary text-primary-foreground">
  Primary content
</div>
```

### Custom CSS with Theme Variables

```css
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
```

### Chart Colors

```tsx
const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "hsl(var(--chart-1))",
      dark: "hsl(var(--chart-1))"
    }
  }
}
```

### Dynamic Theme Detection

```tsx
import { useTheme } from "next-themes"

function MyComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  )
}
```

---

## Header Component

**File**: `apps/example/src/components/header.tsx`

Main application header combining logo and theme toggle.

**Structure**:
```tsx
<header>
  <Logo /> {/* Brand identity */}
  <ThemeToggle /> {/* Theme switcher */}
</header>
```

**Usage**:
```tsx
import { Header } from "@/components/header"

<Header />
```

---

## Devtools Styling

**File**: `packages/devtools/src/styles.css`

Isolated styling system for devtools to prevent conflicts.

**Key Features**:
- **Style Isolation**: Uses `all: initial` to reset all styles
- **High Z-index**: Ensures visibility above app content
- **Pure black theme**: Consistent dark appearance
- **Geist Mono font**: Code-focused typography

**Button Styles**:
```css
.ai-devtools-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #000000;
  color: white;
  z-index: 999999;
}
```

**Panel Styles**:
```css
.ai-devtools-panel {
  background-color: #000000;
  color: white;
  font-family: 'Geist Mono', monospace;
  z-index: 2147483647; /* Maximum z-index */
}
```

---

## Public Assets

### Example App Assets
**Location**: `apps/example/public/`

- `file.svg` - File icon
- `globe.svg` - Globe/web icon
- `next.svg` - Next.js logo
- `vercel.svg` - Vercel logo
- `window.svg` - Window/layout icon

### Website Assets
**Location**: `apps/website/public/`

- `favicon-16x16.png` - Small favicon
- `favicon-32x32.png` - Standard favicon
- `favicon.svg` - Scalable favicon
- `icon.svg` - App icon
- `noise.png` - Texture overlay for backgrounds

---

## Tailwind Configuration

**File**: `apps/example/tailwind.config.ts`

Extended Tailwind config with custom theme.

**Key Additions**:
```typescript
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      // ... all design tokens
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    fontFamily: {
      sans: ["var(--font-geist-sans)"],
      mono: ["var(--font-departure-mono)"],
      serif: ["var(--font-geist-serif)"],
    }
  }
}
```

---

## Best Practices

### Theme Design

1. **Always use CSS variables** - Never hardcode colors
2. **Test both themes** - Verify components in light and dark mode
3. **Use semantic names** - `--primary`, not `--blue-500`
4. **Maintain contrast** - Ensure text is readable in both themes
5. **Use OKLCH** - For custom colors, use OKLCH for consistency

### Logo Usage

1. **Use the Logo component** - Don't duplicate SVG code
2. **Size appropriately** - h-6/h-8 for navbar, h-12+ for heroes
3. **Consider color inheritance** - Logo adapts to text color
4. **Maintain aspect ratio** - Don't distort with different h/w values

### Icons

1. **Use lucide-react first** - For standard icons
2. **Use custom SVGIcon** - For brand-specific icons
3. **Consistent sizing** - Use standard sizes (16, 20, 24, 32)
4. **Accessibility** - Add aria-label for icon-only buttons

### Typography

1. **Use font-mono for numbers** - Especially financial data
2. **Use font-sans for UI** - Body text and interfaces
3. **Respect hierarchy** - Use proper heading levels
4. **Tabular numbers** - Use font-mono for aligned columns

---

## See Also

- [UI Components](./ui-components.md) - All themed components
- [Dashboard Components](./dashboard-components.md) - Using theme in dashboards
- [Getting Started](../guides/getting-started.md) - Implementation guide
