import type { ChromaClient, Collection, EmbeddingFunction } from "chromadb";
import type {
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
  WorkingMemory,
} from "../types.js";

type WorkingMemoryMetadata = {
  scope: MemoryScope;
  chatId?: string;
  userId?: string;
  updatedAt: number;
};

type MessageMetadata = {
  chatId: string;
  userId?: string;
  role: "user" | "assistant" | "system";
  timestamp: number;
};

export interface ChromaMemoryProviderConfig {
  wmCollectionName: string;
  messagesPrefix: string;
}

/**
 * Chroma provider for memory storage
 *
 * Architecture:
 * - All working memory stored in ONE collection (e.g., "working_memory")
 * - Messages sharded by chatId - each chat gets its own collection (e.g., "messages_chat-123")
 *
 * @example
 * ```ts
 * import { CloudClient } from 'chromadb';
 * import { ChromaMemoryProvider } from '@ai-sdk-tools/memory';
 *
 * const client = new CloudClient();
 * const provider = new ChromaMemoryProvider(client);
 * ```
 */
export class ChromaMemoryProvider implements MemoryProvider {
  private wmCollectionName: string;

  constructor(
    private client: ChromaClient,
    private ef: EmbeddingFunction,
    options: ChromaMemoryProviderConfig = {
      wmCollectionName: "working_memory",
      messagesPrefix: "messages",
    },
  ) {
    this.wmCollectionName = options.wmCollectionName;
    this.messagesPrefix = options.messagesPrefix;
  }

  private messagesPrefix: string;

  async getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null> {
    const collection = await this.client.getOrCreateCollection({ 
      name: this.wmCollectionName,
      embeddingFunction: this.ef,
    });
    const id = this.getWMId(params.scope, params.chatId, params.userId);

    const result = await collection.get({
      ids: [id],
    });

    if (!result.documents.length || !result.documents[0]) return null;

    const metadata = result.metadatas[0] as WorkingMemoryMetadata | null;
    return {
      content: result.documents[0] as string,
      updatedAt: new Date(metadata?.updatedAt || Date.now()),
    };
  }

  async updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void> {
    const collection = await this.client.getOrCreateCollection({ 
      name: this.wmCollectionName,
      embeddingFunction: this.ef,
    });
    const id = this.getWMId(params.scope, params.chatId, params.userId);

    const metadata: WorkingMemoryMetadata = {
      scope: params.scope,
      chatId: params.chatId,
      userId: params.userId,
      updatedAt: Date.now(),
    };

    await collection.upsert({
      ids: [id],
      documents: [params.content],
      metadatas: [metadata],
    });
  }

  async saveMessage(message: ConversationMessage): Promise<void> {
    const collection = await this.getOrCreateMessagesCollection(
      message.chatId,
    );

    const messageId = `${message.timestamp.getTime()}-${Math.random().toString(36).substring(7)}`;

    const metadata: MessageMetadata = {
      chatId: message.chatId,
      userId: message.userId,
      role: message.role,
      timestamp: message.timestamp.getTime(),
    };

    await collection.add({
      ids: [messageId],
      documents: [message.content],
      metadatas: [metadata],
    });
  }

  async getMessages(params: {
    chatId: string;
    limit?: number;
  }): Promise<ConversationMessage[]> {
    const collection = await this.getOrCreateMessagesCollection(
      params.chatId,
    );

    const result = await collection.get({
      where: { chatId: params.chatId },
    });

    if (!result.documents.length) return [];

    const messages = result.documents
      .map((doc, i) => {
        const metadata = result.metadatas[i] as MessageMetadata | null;
        if (!metadata || !doc) return null;

        const message: ConversationMessage = {
          chatId: metadata.chatId,
          userId: metadata.userId,
          role: metadata.role,
          content: doc as string,
          timestamp: new Date(metadata.timestamp),
        };
        return message;
      })
      .filter((msg): msg is ConversationMessage => msg !== null)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return params.limit ? messages.slice(-params.limit) : messages;
  }

  private async getOrCreateMessagesCollection(
    chatId: string,
  ): Promise<Collection> {
    const collectionName = `${this.messagesPrefix}_${chatId}`;
    return await this.client.getOrCreateCollection({
      name: collectionName,
      embeddingFunction: this.ef,
    });
  }

  private getWMId(
    scope: MemoryScope,
    chatId?: string,
    userId?: string,
  ): string {
    const id = scope === "chat" ? chatId : userId;
    return `${scope}:${id}`;
  }
}