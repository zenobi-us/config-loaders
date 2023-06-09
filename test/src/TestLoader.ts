import { JsonObject, JsonValue } from "type-fest";

import { Loader as AbstractLoader } from "@/loaders";

class TestLoader extends AbstractLoader {
  async load(): Promise<JsonValue> {
    return "test";
  }

  async parse(source: JsonValue): Promise<JsonObject> {
    return {
      test: source,
    };
  }
}

export { TestLoader };
