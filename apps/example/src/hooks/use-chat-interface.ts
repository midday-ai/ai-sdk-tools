import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useChatInterface() {
  const pathname = usePathname();

  // Initialize state immediately from pathname to avoid blink on refresh
  const getInitialChatId = () => {
    const segments = pathname.split("/").filter(Boolean);
    // Only take the first segment as chatId
    return segments[0] || null;
  };

  const [chatId, setChatIdState] = useState<string | null>(getInitialChatId);

  // Extract chatId from pathname - only use first segment
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    // Only take the first segment as chatId, ignore deeper paths
    const potentialChatId = segments[0] || null;
    setChatIdState(potentialChatId || null);
  }, [pathname]);

  // Listen to popstate events for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split("/").filter(Boolean);
      // Only take the first segment as chatId
      setChatIdState(segments[0] || null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const isHome = !chatId;
  const isChatPage = Boolean(chatId);

  const setChatId = (id: string) => {
    // Always replace with just the chat ID - no nesting

    const newPath = `/${id}`;
    window.history.pushState({}, "", newPath);
    setChatIdState(id);
  };

  return {
    isHome,
    isChatPage,
    chatId,
    setChatId,
  };
}
