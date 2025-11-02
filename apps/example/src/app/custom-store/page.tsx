import { AIDevtools } from "@ai-sdk-tools/devtools";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat";
import { loadChatHistory } from "@/lib/data";
import { CustomStoreProvider } from "@/app/custom-store/custom-store-provider";

type Props = {
  params: Promise<{ chatId?: string[] }>;
};

export default async function Page({ params }: Props) {
  const { chatId } = await params;

  // Extract the first chatId if it exists
  const currentChatId = chatId?.at(0);

  const initialMessages = currentChatId
    ? await loadChatHistory(currentChatId)
    : [];

  try {
    // Load chat history if we have a chatId
    return (
      <CustomStoreProvider
        chatKey={currentChatId || "home"}
        initialMessages={initialMessages}
      >
        <ChatInterface />

        {process.env.NODE_ENV === "development" && <AIDevtools />}
      </CustomStoreProvider>
    );
  } catch {
    // If there's an error loading the chat history, redirect to home
    redirect("/");
  }
}
