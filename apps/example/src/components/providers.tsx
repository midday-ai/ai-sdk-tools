import { Provider } from "@ai-sdk-tools/store";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/sonner";

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
      </Provider>
    </ThemeProvider>
  );
}
