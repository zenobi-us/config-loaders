import { JsonObject } from "type-fest";

import { Loader } from "./Loader";

interface ValueLoaderOptions<T extends JsonObject> {
  /**
   * Value itself or a factory function returning the value
   */
  value: T | (() => T);
}

/**
 * Loader that takes a static value or a function returning the value.
 */
class ValueLoader<T extends JsonObject> extends Loader {
  constructor(readonly options: ValueLoaderOptions<T>) {
    super();
  }

  /**
   * Retruns value passed to options or calls the factory funciton.
   */
  async load(): Promise<T> {
    if (typeof this.options.value === "function") {
      return this.options.value();
    }
    return this.options.value;
  }

  /**
   * No additional parsing required, so just return the value as it is.
   */
  async parse(source: JsonObject): Promise<JsonObject> {
    return source;
  }
}

export { ValueLoader };
export type { ValueLoaderOptions };
