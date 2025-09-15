import { artifacts } from "./context";
import type { ArtifactConfig, ArtifactData } from "./types";

export class StreamingArtifact<T> {
  private config: ArtifactConfig<T>;
  private instance: ArtifactData<T>;

  constructor(config: ArtifactConfig<T>, instance: ArtifactData<T>) {
    this.config = config;
    this.instance = instance;

    // Send initial state
    this.stream();
  }

  get data(): T {
    return this.instance.payload;
  }

  get id(): string {
    return this.instance.id;
  }

  get progress(): number | undefined {
    return this.instance.progress;
  }

  set progress(value: number | undefined) {
    this.instance.progress = value;
    this.instance.updatedAt = Date.now();
    this.stream();
  }

  async update(updates: Partial<T> & { progress?: number }): Promise<void> {
    if ("progress" in updates) {
      this.instance.progress = updates.progress;
      delete (updates as Record<string, unknown>).progress; // Remove progress from payload updates
    }

    this.instance.payload = { ...this.instance.payload, ...updates };
    this.instance.status = "streaming";
    this.instance.version++;
    this.instance.updatedAt = Date.now();
    this.stream();
  }

  async complete(finalData?: T): Promise<void> {
    if (finalData) {
      this.instance.payload = finalData;
    }
    this.instance.status = "complete";
    this.instance.progress = 1;
    this.instance.version++;
    this.instance.updatedAt = Date.now();
    this.stream();
  }

  async error(message: string): Promise<void> {
    this.instance.status = "error";
    this.instance.error = message;
    this.instance.version++;
    this.instance.updatedAt = Date.now();
    this.stream();
  }

  async cancel(): Promise<void> {
    this.instance.status = "error";
    this.instance.error = "Artifact was cancelled";
    this.instance.version++;
    this.instance.updatedAt = Date.now();
    this.stream();
  }

  timeout(ms: number): void {
    setTimeout(() => {
      if (
        this.instance.status === "loading" ||
        this.instance.status === "streaming"
      ) {
        this.error(`Artifact timed out after ${ms}ms`);
      }
    }, ms);
  }

  private stream(): void {
    const writer = artifacts.getWriter();
    writer.write({
      type: `data-artifact-${this.config.id}`,
      id: this.instance.id,
      data: this.instance,
    });
  }
}
