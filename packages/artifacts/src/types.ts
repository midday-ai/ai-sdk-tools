import type { z } from "zod";

export type ArtifactStatus =
  | "idle"
  | "loading"
  | "streaming"
  | "complete"
  | "error";

export class ArtifactError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ArtifactError";
  }
}

export interface ArtifactData<T = unknown> {
  id: string;
  type: string;
  status: ArtifactStatus;
  payload: T;
  version: number;
  progress?: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ArtifactConfig<T = unknown> {
  id: string;
  schema: z.ZodSchema<T>;
}

export interface ArtifactStreamPart<T = unknown> {
  type: `data-artifact-${string}`;
  id: string;
  data: ArtifactData<T>;
}

export interface ArtifactCallbacks<T = unknown> {
  onUpdate?: (data: T, prevData: T | null) => void;
  onComplete?: (data: T) => void;
  onError?: (error: string, data: T | null) => void;
  onProgress?: (progress: number, data: T) => void;
  onStatusChange?: (status: ArtifactStatus, prevStatus: ArtifactStatus) => void;
}

export interface UseArtifactOptions<T = unknown> extends ArtifactCallbacks<T> {
  version?: number;
}

export interface UseArtifactReturn<T = unknown> {
  data: T | null;
  status: ArtifactStatus;
  progress?: number;
  error?: string;
  isActive: boolean;
  hasData: boolean;
  versions: ArtifactData<T>[];
  currentIndex?: number;
}

export interface UseArtifactActions {
  delete: (artifactId: string) => void;
}

export interface UseArtifactsOptions {
  onData?: (artifactType: string, data: ArtifactData<unknown>) => void;
  storeId?: string;
}

export interface UseArtifactsReturn {
  byType: Record<string, ArtifactData<unknown>[]>;
  latest: Record<string, ArtifactData<unknown>>;
  artifacts: ArtifactData<unknown>[];
  current: ArtifactData<unknown> | null;
}
