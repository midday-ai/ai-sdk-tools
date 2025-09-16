"use client";
import { highlight } from "sugar-high";

export function ArtifactsContent() {
	return (
		<div className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-[95rem] mx-auto px-8 py-32 relative z-10">
				{/* Hero */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40">
					<div className="space-y-12">
						<h1 className="text-4xl font-normal leading-tight tracking-wide max-w-[600px]">
							Advanced streaming interfaces for AI applications.
						</h1>
						<p className="text-base text-secondary max-w-3xl leading-relaxed font-light">
							Create structured, type-safe artifacts that stream real-time
							updates from AI tools to React components. Perfect for dashboards,
							analytics, documents, and interactive experiences beyond simple
							chat interfaces.
						</p>

						{/* Terminal */}
						<div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md">
							<span className="text-[#d4d4d4] text-xs font-mono">
								npm i @ai-sdk-tools/artifacts @ai-sdk-tools/store
							</span>
							<button
								type="button"
								onClick={() =>
									navigator.clipboard.writeText(
										"npm i @ai-sdk-tools/artifacts @ai-sdk-tools/store",
									)
								}
								className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
								title={`Copy "npm i @ai-sdk-tools/artifacts @ai-sdk-tools/store" to clipboard`}
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-label="Copy command"
								>
									<title>Copy to clipboard</title>
									<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
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
										aria-label="Midday"
									>
										<title>Midday</title>
										<path
											d="M12.5 12.5h223v41h-223z"
											fill="#000"
											stroke="#fff"
											strokeWidth={1}
										/>
										<path d="M24.5 24.5h199v17h-199z" fill="#fff" />
										<text
											x={124}
											y={35}
											textAnchor="middle"
											fill="#000"
											fontSize={12}
											fontFamily="Arial, sans-serif"
											fontWeight="bold"
										>
											MIDDAY
										</text>
									</svg>
								</a>
							</div>
						</div>
					</div>

					{/* Artifacts Demo */}
					<div className="space-y-6">
						<div className="bg-[#0f0f0f] border border-[#2a2a2a] p-6 space-y-4 min-h-[420px]">
							<div className="text-xs text-secondary mb-4">
								◇ Live Burn Rate Analysis
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="text-sm text-[#d4d4d4]">Q4 2024 Analysis</div>
									<div className="text-xs text-green-400">✓ Complete</div>
								</div>
								<div className="bg-[#1a1a1a] border border-[#2a2a2a] p-3 space-y-3">
									<div className="grid grid-cols-3 gap-3 text-xs">
										<div className="text-center">
											<div className="text-secondary">Jan 2024</div>
											<div className="text-[#d4d4d4] font-mono">$45K</div>
										</div>
										<div className="text-center">
											<div className="text-secondary">Feb 2024</div>
											<div className="text-[#d4d4d4] font-mono">$42K</div>
										</div>
										<div className="text-center">
											<div className="text-secondary">Mar 2024</div>
											<div className="text-[#d4d4d4] font-mono">$38K</div>
										</div>
									</div>
									<div className="border-t border-[#2a2a2a] pt-3">
										<div className="flex justify-between text-xs">
											<span className="text-secondary">Avg Runway:</span>
											<span className="text-green-400">14.2 months</span>
										</div>
										<div className="flex justify-between text-xs">
											<span className="text-secondary">Trend:</span>
											<span className="text-green-400">Improving</span>
										</div>
									</div>
								</div>
								<div className="text-sm text-[#d4d4d4]">Artifact Features</div>
								<div className="grid grid-cols-2 gap-2">
									<div className="bg-[#1a1a1a] border border-[#2a2a2a] p-2 text-center">
										<div className="text-xs text-secondary">Real-time</div>
										<div className="text-xs text-[#d4d4d4]">Live updates</div>
									</div>
									<div className="bg-[#1a1a1a] border border-[#2a2a2a] p-2 text-center">
										<div className="text-xs text-secondary">Type-safe</div>
										<div className="text-xs text-[#d4d4d4]">Zod schemas</div>
									</div>
									<div className="bg-[#1a1a1a] border border-[#2a2a2a] p-2 text-center">
										<div className="text-xs text-secondary">Progress</div>
										<div className="text-xs text-[#d4d4d4]">Track status</div>
									</div>
									<div className="bg-[#1a1a1a] border border-[#2a2a2a] p-2 text-center">
										<div className="text-xs text-secondary">Context</div>
										<div className="text-xs text-[#d4d4d4]">Global state</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
					<div className="space-y-4">
						<div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-[#d4d4d4]"
							>
								<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
							</svg>
						</div>
						<div className="space-y-2">
							<h3 className="text-lg font-medium">Structured Artifacts</h3>
							<p className="text-sm text-secondary leading-relaxed">
								Define typed artifact schemas with Zod validation for
								consistent, type-safe data structures.
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-[#d4d4d4]"
							>
								<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
							</svg>
						</div>
						<div className="space-y-2">
							<h3 className="text-lg font-medium">Real-time Streaming</h3>
							<p className="text-sm text-secondary leading-relaxed">
								Stream live updates from AI tools to React components with
								progress tracking and error handling.
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-[#d4d4d4]"
							>
								<path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5Z" />
							</svg>
						</div>
						<div className="space-y-2">
							<h3 className="text-lg font-medium">Typed Context</h3>
							<p className="text-sm text-secondary leading-relaxed">
								Share typed context across all tools with validation and
								type-safe access patterns.
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-[#d4d4d4]"
							>
								<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
							</svg>
						</div>
						<div className="space-y-2">
							<h3 className="text-lg font-medium">React Integration</h3>
							<p className="text-sm text-secondary leading-relaxed">
								Simple useArtifact hook with callbacks for updates, completion,
								errors, and progress tracking.
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-[#d4d4d4]"
							>
								<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
							</svg>
						</div>
						<div className="space-y-2">
							<h3 className="text-lg font-medium">Error Handling</h3>
							<p className="text-sm text-secondary leading-relaxed">
								Built-in error handling with custom error types, timeout
								support, and cancellation methods.
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-[#d4d4d4]"
							>
								<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 12,8Z" />
							</svg>
						</div>
						<div className="space-y-2">
							<h3 className="text-lg font-medium">Global State</h3>
							<p className="text-sm text-secondary leading-relaxed">
								Built on @ai-sdk-tools/store for global state access - no prop
								drilling required.
							</p>
						</div>
					</div>
				</div>

				{/* Code Example */}
				<div className="space-y-8 mb-40">
					<div className="text-center space-y-4">
						<h2 className="text-2xl font-medium">Real Examples</h2>
						<p className="text-secondary max-w-2xl mx-auto">
							See how to create and consume structured artifacts with full type
							safety.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="space-y-4">
							<div className="text-sm font-medium">
								Define & Stream Artifacts
							</div>
							<div className="bg-[#0f0f0f] border border-[#2a2a2a] p-4 overflow-x-auto">
								<pre
									className="text-xs text-[#d4d4d4] font-mono"
									dangerouslySetInnerHTML={{
										__html:
											highlight(`import { artifact } from '@ai-sdk-tools/artifacts'
import { z } from 'zod'

// Define artifact schema
const BurnRate = artifact('burn-rate', z.object({
  title: z.string(),
  stage: z.enum(['loading', 'complete']),
  data: z.array(z.object({
    month: z.string(),
    burnRate: z.number()
  }))
}))

// Stream from AI tool
const analysis = BurnRate.stream({
  title: 'Q4 Analysis',
  stage: 'loading'
})

await analysis.update({ stage: 'processing' })
await analysis.complete({
  stage: 'complete',
  data: [{ month: '2024-01', burnRate: 50000 }]
})`),
									}}
									suppressHydrationWarning
								/>
							</div>
						</div>

						<div className="space-y-4">
							<div className="text-sm font-medium">React Component</div>
							<div className="bg-[#0f0f0f] border border-[#2a2a2a] p-4 overflow-x-auto">
								<pre
									className="text-xs text-[#d4d4d4] font-mono"
									dangerouslySetInnerHTML={{
										__html:
											highlight(`import { useArtifact } from '@ai-sdk-tools/artifacts'

function Dashboard() {
  const { data, status, progress } = useArtifact(BurnRate, {
    onUpdate: (newData, prevData) => {
      console.log('Data updated:', newData)
    },
    onComplete: (finalData) => {
      console.log('Analysis complete!', finalData)
    },
    onError: (error) => {
      console.error('Analysis failed:', error)
    }
  })

  if (!data) return <div>No data</div>

  return (
    <div>
      <h2>{data.title}</h2>
      {status === 'loading' && (
        <div>Loading... {Math.round((progress || 0) * 100)}%</div>
      )}
      {data.data.map(item => (
        <div key={item.month}>
          {item.month}: {item.burnRate.toLocaleString()}
        </div>
      ))}
    </div>
  )
}`),
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
						<div className="flex items-center justify-between">
							<span className="text-sm font-mono">
								npm i @ai-sdk-tools/artifacts
							</span>
							<button
								type="button"
								onClick={() =>
									navigator.clipboard.writeText("npm i @ai-sdk-tools/artifacts")
								}
								className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
								title="Copy to clipboard"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-label="Copy to clipboard"
								>
									<title>Copy to clipboard</title>
									<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
								</svg>
							</button>
						</div>
					</div>
					<p className="text-xs text-[#555555] font-light">
						Comprehensive artifact handling for AI applications.
					</p>
				</div>
			</div>
		</div>
	);
}
