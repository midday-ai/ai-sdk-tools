import { AIDevtools } from "@ai-sdk-tools/devtools";
import { Provider } from "ai-sdk-tools/client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider initialMessages={[]}>
        {children}
        <Toaster />
        {process.env.NODE_ENV === "development" && (
          <AIDevtools />
        )}
      </Provider>
    </ThemeProvider>
  );
}
