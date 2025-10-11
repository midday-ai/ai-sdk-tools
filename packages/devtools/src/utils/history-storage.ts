"use client";

import { Redis } from "@upstash/redis";
import type { AIEvent, DevtoolsConfig } from "../types";

// Simple compression using JSON.stringify with size optimization
function compressEvents(events: AIEvent[]): string {
  try {
    // Remove unnecessary data to reduce size
    const compressedEvents = events.map(event => ({
      id: event.id,
      timestamp: event.timestamp,
      type: event.type,
      data: event.data,
      metadata: event.metadata
    }));
    
    return JSON.stringify(compressedEvents);
  } catch (error) {
    console.warn("[AI Devtools] Failed to compress events:", error);
    return JSON.stringify(events);
  }
}

function decompressEvents(compressedData: string): AIEvent[] {
  try {
    return JSON.parse(compressedData);
  } catch (error) {
    console.warn("[AI Devtools] Failed to decompress events:", error);
    return [];
  }
}

// Redis storage implementation
class RedisHistoryStorage {
  private redis: Redis | null = null;
  private config: DevtoolsConfig['history'];

  constructor(config: DevtoolsConfig['history']) {
    this.config = config;
    
    if (config?.redis?.url && config?.redis?.token) {
      try {
        this.redis = new Redis({
          url: config.redis.url,
          token: config.redis.token,
        });
      } catch (error) {
        console.warn("[AI Devtools] Failed to initialize Redis:", error);
        this.redis = null;
      }
    }
  }

  private getSessionKey(sessionId: string): string {
    return `ai-devtools:history:${sessionId}`;
  }

  private getSessionsKey(): string {
    return 'ai-devtools:sessions';
  }

  async saveEvents(sessionId: string, events: AIEvent[]): Promise<void> {
    if (!this.redis || !this.config) return;

    try {
      const key = this.getSessionKey(sessionId);
      const sessionsKey = this.getSessionsKey();
      
      // Save events
      await this.redis.set(key, compressEvents(events));
      
      // Add session to sessions list
      await this.redis.sadd(sessionsKey, sessionId);
      
      // Clean up old sessions if needed
      await this.cleanupOldSessions();
    } catch (error) {
      console.warn("[AI Devtools] Failed to save events to Redis:", error);
    }
  }

  async fetchEvents(sessionId: string): Promise<AIEvent[]> {
    if (!this.redis || !this.config) return [];

    try {
      const key = this.getSessionKey(sessionId);
      const data = await this.redis.get<string>(key);
      
      if (!data) return [];
      
      return decompressEvents(data);
    } catch (error) {
      console.warn("[AI Devtools] Failed to fetch events from Redis:", error);
      return [];
    }
  }

  async listSessions(): Promise<string[]> {
    if (!this.redis || !this.config) return [];

    try {
      const sessionsKey = this.getSessionsKey();
      return await this.redis.smembers(sessionsKey);
    } catch (error) {
      console.warn("[AI Devtools] Failed to list sessions from Redis:", error);
      return [];
    }
  }

  async clearSession(sessionId: string): Promise<void> {
    if (!this.redis || !this.config) return;

    try {
      const key = this.getSessionKey(sessionId);
      const sessionsKey = this.getSessionsKey();
      
      await this.redis.del(key);
      await this.redis.srem(sessionsKey, sessionId);
    } catch (error) {
      console.warn("[AI Devtools] Failed to clear session from Redis:", error);
    }
  }

  async clearAllSessions(): Promise<void> {
    if (!this.redis || !this.config) return;

    try {
      const sessions = await this.listSessions();
      const sessionsKey = this.getSessionsKey();
      
      // Delete all session data
      for (const sessionId of sessions) {
        const key = this.getSessionKey(sessionId);
        await this.redis.del(key);
      }
      
      // Clear sessions list
      await this.redis.del(sessionsKey);
    } catch (error) {
      console.warn("[AI Devtools] Failed to clear all sessions from Redis:", error);
    }
  }

  private async cleanupOldSessions(): Promise<void> {
    if (!this.redis || !this.config || !this.config.maxSessions) return;

    try {
      const sessions = await this.listSessions();
      
      if (sessions.length > this.config.maxSessions) {
        // Sort by session ID (assuming they contain timestamp)
        const sortedSessions = sessions.sort();
        const sessionsToDelete = sortedSessions.slice(0, sessions.length - this.config.maxSessions);
        
        for (const sessionId of sessionsToDelete) {
          await this.clearSession(sessionId);
        }
      }
    } catch (error) {
      console.warn("[AI Devtools] Failed to cleanup old sessions:", error);
    }
  }
}

// localStorage storage implementation
class LocalStorageHistoryStorage {
  private config: DevtoolsConfig['history'];

  constructor(config: DevtoolsConfig['history']) {
    this.config = config;
  }

  private getSessionKey(sessionId: string): string {
    return `ai-devtools-history-${sessionId}`;
  }

  private getMetaKey(): string {
    return 'ai-devtools-history-meta';
  }

  // Note: getStorageSize method kept for future use
  // private getStorageSize(): number {
  //   let totalSize = 0;
  //   for (let key in localStorage) {
  //     if (key.startsWith('ai-devtools-history-')) {
  //       totalSize += localStorage[key].length;
  //     }
  //   }
  //   return totalSize;
  // }

  private async compressData(data: string): Promise<string> {
    // Simple compression by removing whitespace and using shorter property names
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed);
    } catch {
      return data;
    }
  }

  async saveEvents(sessionId: string, events: AIEvent[]): Promise<void> {
    if (!this.config) return;

    try {
      const key = this.getSessionKey(sessionId);
      const metaKey = this.getMetaKey();
      
      // Compress and save events
      const compressedData = await this.compressData(compressEvents(events));
      localStorage.setItem(key, compressedData);
      
      // Update metadata
      const meta = this.getMetadata();
      if (!meta.sessions.includes(sessionId)) {
        meta.sessions.push(sessionId);
        meta.lastUpdated = Date.now();
        localStorage.setItem(metaKey, JSON.stringify(meta));
      }
      
      // Clean up old sessions if needed
      await this.cleanupOldSessions();
    } catch (error) {
      console.warn("[AI Devtools] Failed to save events to localStorage:", error);
    }
  }

  async fetchEvents(sessionId: string): Promise<AIEvent[]> {
    if (!this.config) return [];

    try {
      const key = this.getSessionKey(sessionId);
      const data = localStorage.getItem(key);
      
      if (!data) return [];
      
      return decompressEvents(data);
    } catch (error) {
      console.warn("[AI Devtools] Failed to fetch events from localStorage:", error);
      return [];
    }
  }

  async listSessions(): Promise<string[]> {
    if (!this.config) return [];

    try {
      const meta = this.getMetadata();
      return meta.sessions;
    } catch (error) {
      console.warn("[AI Devtools] Failed to list sessions from localStorage:", error);
      return [];
    }
  }

  async clearSession(sessionId: string): Promise<void> {
    if (!this.config) return;

    try {
      const key = this.getSessionKey(sessionId);
      const metaKey = this.getMetaKey();
      
      localStorage.removeItem(key);
      
      // Update metadata
      const meta = this.getMetadata();
      meta.sessions = meta.sessions.filter(id => id !== sessionId);
      meta.lastUpdated = Date.now();
      localStorage.setItem(metaKey, JSON.stringify(meta));
    } catch (error) {
      console.warn("[AI Devtools] Failed to clear session from localStorage:", error);
    }
  }

  async clearAllSessions(): Promise<void> {
    if (!this.config) return;

    try {
      const sessions = await this.listSessions();
      const metaKey = this.getMetaKey();
      
      // Delete all session data
      for (const sessionId of sessions) {
        const key = this.getSessionKey(sessionId);
        localStorage.removeItem(key);
      }
      
      // Clear metadata
      localStorage.removeItem(metaKey);
    } catch (error) {
      console.warn("[AI Devtools] Failed to clear all sessions from localStorage:", error);
    }
  }

  private getMetadata(): { sessions: string[]; lastUpdated: number } {
    try {
      const metaKey = this.getMetaKey();
      const data = localStorage.getItem(metaKey);
      return data ? JSON.parse(data) : { sessions: [], lastUpdated: Date.now() };
    } catch {
      return { sessions: [], lastUpdated: Date.now() };
    }
  }

  private async cleanupOldSessions(): Promise<void> {
    if (!this.config || !this.config.maxSessions) return;

    try {
      const sessions = await this.listSessions();
      
      if (sessions.length > this.config.maxSessions) {
        // Sort by session ID (assuming they contain timestamp)
        const sortedSessions = sessions.sort();
        const sessionsToDelete = sortedSessions.slice(0, sessions.length - this.config.maxSessions);
        
        for (const sessionId of sessionsToDelete) {
          await this.clearSession(sessionId);
        }
      }
    } catch (error) {
      console.warn("[AI Devtools] Failed to cleanup old sessions:", error);
    }
  }
}

// Main storage interface
export class HistoryStorage {
  private redisStorage: RedisHistoryStorage | null = null;
  private localStorageStorage: LocalStorageHistoryStorage | null = null;
  private config: DevtoolsConfig['history'];

  constructor(config: DevtoolsConfig['history']) {
    this.config = config;
    
    if (config) {
      // Initialize Redis storage if configured
      if (config.redis?.url && config.redis?.token) {
        this.redisStorage = new RedisHistoryStorage(config);
      }
      
      // Always initialize localStorage as fallback
      this.localStorageStorage = new LocalStorageHistoryStorage(config);
    }
  }

  async saveEvents(sessionId: string, events: AIEvent[]): Promise<void> {
    if (!this.config) return;

    // Try Redis first, fallback to localStorage
    if (this.redisStorage) {
      try {
        await this.redisStorage.saveEvents(sessionId, events);
        return;
      } catch (error) {
        console.warn("[AI Devtools] Redis save failed, falling back to localStorage:", error);
      }
    }
    
    if (this.localStorageStorage) {
      await this.localStorageStorage.saveEvents(sessionId, events);
    }
  }

  async fetchEvents(sessionId: string): Promise<AIEvent[]> {
    if (!this.config) return [];

    // Try Redis first, fallback to localStorage
    if (this.redisStorage) {
      try {
        const events = await this.redisStorage.fetchEvents(sessionId);
        if (events.length > 0) return events;
      } catch (error) {
        console.warn("[AI Devtools] Redis fetch failed, trying localStorage:", error);
      }
    }
    
    if (this.localStorageStorage) {
      return await this.localStorageStorage.fetchEvents(sessionId);
    }
    
    return [];
  }

  async listSessions(): Promise<string[]> {
    if (!this.config) return [];

    // Try Redis first, fallback to localStorage
    if (this.redisStorage) {
      try {
        const sessions = await this.redisStorage.listSessions();
        if (sessions.length > 0) return sessions;
      } catch (error) {
        console.warn("[AI Devtools] Redis list failed, trying localStorage:", error);
      }
    }
    
    if (this.localStorageStorage) {
      return await this.localStorageStorage.listSessions();
    }
    
    return [];
  }

  async clearSession(sessionId: string): Promise<void> {
    if (!this.config) return;

    // Clear from both storages
    if (this.redisStorage) {
      try {
        await this.redisStorage.clearSession(sessionId);
      } catch (error) {
        console.warn("[AI Devtools] Redis clear failed:", error);
      }
    }
    
    if (this.localStorageStorage) {
      await this.localStorageStorage.clearSession(sessionId);
    }
  }

  async clearAllSessions(): Promise<void> {
    if (!this.config) return;

    // Clear from both storages
    if (this.redisStorage) {
      try {
        await this.redisStorage.clearAllSessions();
      } catch (error) {
        console.warn("[AI Devtools] Redis clear all failed:", error);
      }
    }
    
    if (this.localStorageStorage) {
      await this.localStorageStorage.clearAllSessions();
    }
  }
}

// Convenience functions
export async function saveEventsToHistory(
  sessionId: string, 
  events: AIEvent[], 
  config: DevtoolsConfig
): Promise<void> {
  const storage = new HistoryStorage(config.history);
  await storage.saveEvents(sessionId, events);
}

export async function fetchHistoryEvents(
  sessionId: string, 
  config: DevtoolsConfig
): Promise<AIEvent[]> {
  const storage = new HistoryStorage(config.history);
  return await storage.fetchEvents(sessionId);
}

export async function clearHistory(
  sessionId: string | undefined, 
  config: DevtoolsConfig
): Promise<void> {
  const storage = new HistoryStorage(config.history);
  
  if (sessionId) {
    await storage.clearSession(sessionId);
  } else {
    await storage.clearAllSessions();
  }
}

export async function listHistorySessions(config: DevtoolsConfig): Promise<string[]> {
  const storage = new HistoryStorage(config.history);
  return await storage.listSessions();
}
