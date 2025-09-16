export function Footer() {
  return (
    <footer className="border-t border-[#333] py-12">
      <div className="max-w-[95rem] mx-auto px-8">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={24}
              fill="none"
              viewBox="0 0 95 83"
            >
              <title>AI SDK Tools</title>
              <path fill="url(#a)" d="m22 .5 16 52L31 83H0L22 .5Z" />
              <path fill="#D9D9D9" d="M62 .5H30l13 41.25L56 83h31L62 .5Z" />
              <defs>
                <linearGradient
                  id="a"
                  x1={21.5}
                  x2={21.5}
                  y1={0.5}
                  y2={83}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#737373" />
                  <stop offset={1} stopColor="#D9D9D9" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-base font-medium">AI SDK Tools</div>
          </div>

          {/* Description */}
          <p className="text-xs text-secondary font-light max-w-2xl mx-auto leading-relaxed">
            Essential utilities that extend and improve the Vercel AI SDK
            experience. State management, debugging tools, and structured
            artifact streaming for building advanced AI interfaces.
          </p>

          {/* Thank you */}
          <p className="text-xs text-secondary font-light">
            Built with the{" "}
            <a
              href="https://sdk.vercel.ai"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-[#d4d4d4] hover:text-white transition-colors underline"
            >
              Vercel AI SDK
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
