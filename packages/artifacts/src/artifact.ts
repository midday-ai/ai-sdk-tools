import type { UIMessageStreamWriter } from "ai";
import type { z } from "zod";
import { StreamingArtifact } from "./streaming";
import type { ArtifactConfig, ArtifactData } from "./types";
import { generateId, getDefaults } from "./utils";

export function artifact<T>(id: string, schema: z.ZodSchema<T>) {
  const config: ArtifactConfig<T> = { id, schema };

  return {
    id,
    schema,

    create(data: Partial<T> = {}): ArtifactData<T> {
      const defaults = getDefaults(schema);
      const validated = schema.parse({ ...defaults, ...data });

      return {
        id: generateId(),
        type: id,
        status: "idle",
        payload: validated,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    },

    stream(
      data: Partial<T>,
      writer: UIMessageStreamWriter,
    ): StreamingArtifact<T> {
      const instance = this.create(data);
      instance.status = "loading";
      return new StreamingArtifact(config, instance, writer);
    },

    validate(data: unknown): T {
      return schema.parse(data);
    },

    isValid(data: unknown): data is T {
      try {
        schema.parse(data);
        return true;
      } catch {
        return false;
      }
    },
  };
}
