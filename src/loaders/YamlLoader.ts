import { JsonObject } from "type-fest";

import { tryRequire } from "@/utils";

import {
  defaultFileLoaderOptions,
  FileLoader,
  FileLoaderOptions,
} from "./FileLoader";

/**
 * Subclass of the FileLoader for loading .yaml files.
 * @requires yaml
 */
class YamlLoader extends FileLoader {
  constructor(options: FileLoaderOptions = {}) {
    super({
      ...defaultFileLoaderOptions,
      fileName: "config.yaml",
      ...options,
    });
  }

  /**
   * Returns the result of parsing file content using `yaml.parse`.
   */
  async parse(rawValue: string): Promise<JsonObject> {
    const yaml = tryRequire("yaml");
    return yaml.parse(rawValue) as JsonObject;
  }
}

export { YamlLoader };
