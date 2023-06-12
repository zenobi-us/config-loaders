import { JsonObject } from "type-fest";

import { tryRequire } from "@/utils";

import {
  defaultFileLoaderOptions,
  FileLoader,
  FileLoaderOptions,
} from "./FileLoader";

/**
 * Subclass of the FileLoader for loading .yaml files.
 * @requires `yaml` package
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

function yamlLoader(options?: FileLoaderOptions): YamlLoader;
function yamlLoader(fileName: string, options?: FileLoaderOptions): YamlLoader;
function yamlLoader(
  fileNameOrOptions?: string | FileLoaderOptions,
  options?: FileLoaderOptions,
) {
  if (typeof fileNameOrOptions === "undefined") {
    return new YamlLoader();
  } else if (typeof fileNameOrOptions === "string") {
    return new YamlLoader({
      fileName: fileNameOrOptions,
      ...(options ?? {}),
    });
  } else {
    return new YamlLoader(fileNameOrOptions);
  }
}

export { YamlLoader, yamlLoader };
