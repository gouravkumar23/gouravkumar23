# AI Development Rules & Tech Stack

This document outlines the technical architecture and development guidelines for this portfolio application.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript for type-safe development.
- **Styling**: Tailwind CSS for utility-first styling and SCSS Modules for complex component-specific styles.
- **UI Components**: Shadcn UI (built on Radix UI) for accessible, unstyled primitives and Aceternity UI for high-end visual components.
- **Animations**: GSAP for complex scroll-triggered timelines and Framer Motion for declarative, state-based UI transitions.
- **3D Graphics**: Spline (@splinetool/react-spline) for interactive 3D scenes and keyboard interactions.
- **Smooth Scrolling**: Lenis for a consistent, buttery-smooth scrolling experience across all browsers.
- **Real-time**: Socket.io-client for live features like online user tracking and remote cursors.
- **Data Validation**: Zod for schema-based validation of forms and API responses.
- **Icons**: Lucide React for standard UI icons and React Icons for brand/tech-specific logos.

## 🛠 Library Usage Rules

### 1. Styling & Layout
- **Tailwind CSS**: Use for 90% of styling needs. Follow the mobile-first approach.
- **SCSS Modules**: Only use when complex nesting or specific animation keyframes are required that are cumbersome in Tailwind.
- **Shadcn UI**: Always check `src/components/ui` before building a new component. Customize existing ones rather than creating duplicates.

### 2. Animations
- **Framer Motion**: Use for simple entry/exit animations, hover states, and layout transitions.
- **GSAP**: Use exclusively for `ScrollTrigger` logic, complex sequences involving multiple elements, or when fine-grained timeline control is needed (e.g., `src/components/animated-background.tsx`).
- **Spline**: Reserved for the main interactive 3D elements. Keep scenes optimized to prevent performance bottlenecks.

### 3. State & Data
- **React Hooks**: Use `useState` and `useEffect` for local state.
- **Context API**: Use for global features like Socket.io or Theme management (see `src/contexts/socketio.tsx`).
- **Zod**: All form inputs and API route bodies must be validated using Zod schemas.

### 4. Components
- **Client Components**: Use `"use client"` only when necessary (interactivity, hooks, browser APIs).
- **Responsive Design**: Every new component must be fully responsive. Use Tailwind's `sm:`, `md:`, `lg:`, and `xl:` prefixes.
- **Icons**: Prefer `Lucide React` for consistency. Use `React Icons` only if a specific brand icon is missing.

### 5. Performance
- **Images**: Always use the Next.js `Image` component for optimization.
- **Dynamic Imports**: Use `React.lazy` or `next/dynamic` for heavy libraries like Spline to improve initial load times.