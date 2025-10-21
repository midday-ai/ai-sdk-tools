import { AIDevtools } from "@ai-sdk-tools/devtools";
import { Provider as ChatProvider } from "@ai-sdk-tools/store";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat";
import { loadChatHistory } from "@/lib/data";

type Props = {
  params: Promise<{ chatId?: string[] }>;
};

export default async function Page({ params }: Props) {
  const { chatId } = await params;

  // Extract the first chatId if it exists
  const currentChatId = chatId?.at(0);

  try {
    // Load chat history if we have a chatId
    const initialMessages = currentChatId
      ? await loadChatHistory(currentChatId)
      : [];

    return (
      <ChatProvider
        key={currentChatId || "home"}
        initialMessages={initialMessages}
      >
        <ChatInterface />

        {process.env.NODE_ENV === "development" && <AIDevtools />}
      </ChatProvider>
    );
  } catch {
    // If there's an error loading the chat history, redirect to home
    redirect("/");
  }
}
