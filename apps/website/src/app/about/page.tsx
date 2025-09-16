import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AI SDK Tools - Built from Real-World Experience at Midday",
  description:
    "Learn about AI SDK Tools, created by Pontus Abrahamsson from experience building advanced AI interfaces at Midday. Production-tested tools for AI application development.",
  keywords: [
    "AI SDK tools about",
    "AI development tools creator",
    "Pontus Abrahamsson",
    "Midday AI tools",
    "AI SDK experience",
    "production AI tools",
    "AI state management",
    "AI debugging tools",
    "AI artifacts streaming",
    "AI SDK creator",
  ],
  openGraph: {
    title: "About AI SDK Tools - Built from Real-World Experience at Midday",
    description:
      "Learn about AI SDK Tools, created by Pontus Abrahamsson from experience building advanced AI interfaces at Midday. Production-tested tools for AI application development.",
    url: "https://ai-sdk-tools.dev/about",
  },
  twitter: {
    title: "About AI SDK Tools - Built from Real-World Experience at Midday",
    description:
      "Learn about AI SDK Tools, created by Pontus Abrahamsson from experience building advanced AI interfaces at Midday. Production-tested tools for AI application development.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function About() {
  return (
    <div className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[55rem] mx-auto px-4 py-32 relative">
        <div className="space-y-24">
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-normal leading-tight tracking-wide max-w-[600px] mx-auto">
              About AI SDK Tools
            </h1>
            <p className="text-base text-secondary max-w-3xl mx-auto leading-relaxed font-light">
              A comprehensive toolkit for building AI applications with modern
              state management, developer tools, and interactive artifacts.
            </p>
          </section>

          {/* Mission Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium">The Story</h2>
            <div className="space-y-3 text-secondary">
              <p className="text-xs font-light leading-relaxed">
                AI SDK Tools was born from the real-world experience of building
                advanced AI interfaces at{" "}
                <a
                  href="https://midday.ai"
                  target="_blank"
                  className="text-[#d4d4d4] hover:text-white transition-colors underline"
                  rel="noopener follow"
                >
                  Midday
                </a>
                . After months of developing complex AI-powered financial
                applications, we extracted our learnings into reusable packages
                that solve the common challenges every AI developer faces.
              </p>
              <p className="text-xs font-light leading-relaxed">
                We believe that building AI applications should be as
                straightforward as building any other modern web application.
                These tools represent our distilled knowledge from creating
                production-ready AI interfaces that handle real user data and
                complex workflows.
              </p>
            </div>
          </section>

          {/* Creator Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium">About the Creator</h2>
            <div className="space-y-3 text-secondary">
              <p className="text-xs font-light leading-relaxed">
                Hi, I'm{" "}
                <a
                  href="https://twitter.com/pontusab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4d4d4] hover:text-white transition-colors underline"
                >
                  Pontus Abrahamsson
                </a>
                , the creator of AI SDK Tools. As a developer at Midday, I've
                spent countless hours building AI-powered financial interfaces
                that need to be both powerful and user-friendly. The challenges
                of managing complex AI state, debugging tool calls, and creating
                smooth streaming experiences led me to develop these tools.
              </p>
              <p className="text-xs font-light leading-relaxed">
                Each package in this toolkit represents a specific problem I
                encountered while building Midday's AI features. From managing
                chat state across multiple components to debugging complex tool
                call chains, these tools are battle-tested in production and
                ready for your next AI project.
              </p>
            </div>
          </section>

          {/* What We Offer Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium">The Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <article>
                <h3 className="text-base font-medium mb-3">Store</h3>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Zustand-based state management specifically designed for AI
                  applications. Handle complex state with ease and optimize
                  performance with selective selectors.
                </p>
              </article>
              <article>
                <h3 className="text-base font-medium mb-3">Devtools</h3>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Powerful debugging tools for AI applications. Monitor tool
                  calls, track state changes, and debug your AI workflows in
                  real-time.
                </p>
              </article>
              <article>
                <h3 className="text-base font-medium mb-3">Artifacts</h3>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Create interactive, streaming UI components that update in
                  real-time as AI generates content. Perfect for dashboards,
                  reports, and dynamic interfaces.
                </p>
              </article>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article>
                <h3 className="text-base font-medium mb-3">TypeScript First</h3>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Built with TypeScript from the ground up, providing excellent
                  type safety and developer experience.
                </p>
              </article>
              <article>
                <h3 className="text-base font-medium mb-3">
                  Framework Agnostic
                </h3>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Works with React, Next.js, and other modern frameworks. Use
                  the tools that fit your stack.
                </p>
              </article>
              <article>
                <h3 className="text-base font-medium mb-3">
                  Performance Optimized
                </h3>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Selective selectors and efficient state management ensure your
                  AI applications run smoothly.
                </p>
              </article>
              <article>
                <h3 className="text-base font-medium mb-3">
                  Developer Experience
                </h3>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Comprehensive debugging tools and clear APIs make development
                  enjoyable and productive.
                </p>
              </article>
            </div>
          </section>

          {/* Community Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Join Our Community</h2>
            <div className="space-y-3 text-secondary">
              <p className="text-xs font-light leading-relaxed">
                AI SDK Tools is open source and community-driven. These packages
                are actively used in production at Midday and are constantly
                evolving based on real-world usage. We welcome contributions,
                feedback, and ideas from developers around the world.
              </p>
              <p className="text-xs font-light leading-relaxed">
                Follow the development journey and get updates on new features
                and improvements as we continue building better AI development
                tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/midday-ai/ai-sdk-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
                >
                  View on GitHub
                </a>
                <a
                  href="https://twitter.com/pontusab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
                >
                  Follow @pontusab
                </a>
                <a
                  href="https://github.com/midday-ai/ai-sdk-tools/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
                >
                  Report Issues
                </a>
                <a
                  href="https://github.com/midday-ai/ai-sdk-tools/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
                >
                  Join Discussions
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
