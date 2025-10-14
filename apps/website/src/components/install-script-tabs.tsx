"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "@/components/copy-button";

interface InstallScriptTabsProps {
  packageName?: string;
}

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

const STORAGE_KEY = "ai-sdk-tools-preferred-package-manager";

export function InstallScriptTabs({
  packageName = "ai-sdk-tools",
}: InstallScriptTabsProps) {
  const [activeTab, setActiveTab] = useState<PackageManager>("npm");

  // Load preferred package manager from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ["npm", "yarn", "pnpm", "bun"].includes(saved)) {
        setActiveTab(saved as PackageManager);
      }
    } catch (error) {
      // localStorage not available (SSR, private browsing, etc.)
      console.warn("localStorage not available:", error);
    }
  }, []);

  // Save preferred package manager to localStorage when changed
  const handleTabChange = (tab: PackageManager) => {
    setActiveTab(tab);
    try {
      localStorage.setItem(STORAGE_KEY, tab);
    } catch (error) {
      // localStorage not available (SSR, private browsing, etc.)
      console.warn("localStorage not available:", error);
    }
  };

  const installCommands = {
    npm: `npm install ${packageName}`,
    yarn: `yarn add ${packageName}`,
    pnpm: `pnpm add ${packageName}`,
    bun: `bun add ${packageName}`,
  };

  const activeCommand = installCommands[activeTab];

  return (
    <div className="not-prose w-full max-w-lg">
      <div className="flex gap-4">
        {(["npm", "yarn", "pnpm", "bun"] as const).map((tab) => (
          <button
            key={tab}
            className={`py-2 text-xs font-medium transition-colors ${
              activeTab === tab
                ? "text-[#d4d4d4]"
                : "text-secondary hover:text-[#d4d4d4]"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex mt-1 items-center justify-between bg-[#0a0a0a] border border-dashed border-[#2a2a2a] p-2 text-sm overflow-x-auto">
        <pre>
          <code>{activeCommand}</code>
        </pre>
        <CopyButton text={activeCommand} />
      </div>
    </div>
  );
}
