import { JsonObject } from "type-fest";

import { FileLoader } from "@/loaders";

class TestFileLoader extends FileLoader {
  async parse(rawValue: string): Promise<JsonObject> {
    return {
      fileContent: rawValue.trim(),
    };
  }
}

export { TestFileLoader };
