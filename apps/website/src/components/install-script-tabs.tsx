"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

interface InstallScriptTabsProps {
  packageName?: string;
}

export function InstallScriptTabs({
  packageName = "ai-sdk-tools",
}: InstallScriptTabsProps) {
  const [activeTab, setActiveTab] = useState<"npm" | "yarn" | "pnpm" | "bun">(
    "npm"
  );

  const installCommands = {
    npm: `npm install ${packageName}`,
    yarn: `yarn add ${packageName}`,
    pnpm: `pnpm add ${packageName}`,
    bun: `bun add ${packageName}`,
  };

  const activeCommand = installCommands[activeTab];

  return (
    <div className="not-prose w-full max-w-lg">
      <div className="flex">
        {(["npm", "yarn", "pnpm", "bun"] as const).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-[#d4d4d4] border-b-2 border-[#d4d4d4]"
                : "text-secondary hover:text-[#d4d4d4]"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between bg-[#0a0a0a] border border-dashed border-[#2a2a2a] p-4 rounded text-sm overflow-x-auto">
        <pre>
          <code>{activeCommand}</code>
        </pre>
        <CopyButton text={activeCommand} />
      </div>
    </div>
  );
}
