import merge from "lodash.merge";
import { JsonObject, JsonValue } from "type-fest";

import { Loader } from "./Loader";

/**
 * Loader that takes an array of loaders and merges the
 * values loaded using them.
 */
class LoadersPack extends Loader {
  constructor(protected readonly loaders: Loader[]) {
    super();
  }

  /**
   * Iterates the loaders array and collects their values.
   */
  async load(): Promise<JsonValue> {
    return Promise.all(this.loaders.map((loader) => loader.getValue()));
  }

  /**
   * Deeply merges loaders results.
   */
  async parse(rawValue: JsonObject[]): Promise<JsonObject> {
    return merge({}, ...rawValue);
  }
}

export { LoadersPack };
