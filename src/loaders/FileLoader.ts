import { existsSync, readFileSync } from "node:fs";
import { parse as pathParse, relative } from "node:path";

import { findUpSync } from "find-up";
import { JsonObject } from "type-fest";

import { Loader } from "./Loader";

interface FileLoaderOptions {
  /**
   * Name of the file to be loaded.
   * @default "config"
   */
  fileName?: string | (() => string);

  /**
   * Directory where the file search starts.
   * @default process.cwd()
   */
  fileDir?: string | (() => string);

  /**
   * Try to find the file in upper directories.
   * @default true;
   */
  findUp?: boolean;

  /**
   * Directory where the file search stops.
   * @default path.parse(fileDir).root
   */
  stopAt?: string | (() => string);

  /**
   * Encoding of the file.
   * @default "utf-8"
   */
  fileEncoding?: BufferEncoding;

  /**
   * Don't throw an error if the file isn't found.
   * @default false
   */
  failSilently?: boolean;
}

const defaultOptions: Required<FileLoaderOptions> = {
  fileName: "config",
  fileDir: "",
  findUp: true,
  stopAt: "",
  fileEncoding: "utf-8",
  failSilently: false,
};

/**
 * Base class for implementing file loaders.
 * Includes logic to search the file by traversing directory tree up.
 */
abstract class FileLoader extends Loader {
  readonly options: Required<FileLoaderOptions>;

  constructor(options: FileLoaderOptions = {}) {
    super();

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.options.fileDir ||= process.cwd();
    this.options.stopAt ||= this.options.findUp
      ? pathParse(this.fileDir).root
      : this.fileDir;

    this.validateOptions();
  }

  /**
   * Reads the file if found, otherwise throw an error
   * unless `failSilently` set to `true`.
   * @returns Promise of string content of the file.
   */
  async load(): Promise<string> {
    const filePath = this.findFile();
    if (!filePath) {
      if (this.options.failSilently) {
        return "";
      }
      throw new Error("Could not load the file");
    }
    return readFileSync(filePath, { encoding: this.options.fileEncoding });
  }

  /**
   * Parsing should be implemented in the derived class.
   */
  abstract parse(rawValue: string): Promise<JsonObject>;

  private validateOptions() {
    if (relative(this.stopAt, this.fileDir).includes("..")) {
      throw new Error(
        `"stopAt" (${this.stopAt}) must be an upper dir of "fileDir" (${this.fileDir})`,
      );
    }
  }

  private findFile() {
    const filePath = findUpSync(this.fileName, {
      cwd: this.fileDir,
      stopAt: this.stopAt,
    });

    if (filePath && existsSync(filePath)) {
      return filePath;
    }
  }

  private optionGetOrCall(option: string | (() => string)) {
    if (typeof option === "string") {
      return option;
    } else {
      return option();
    }
  }

  get fileName() {
    return this.optionGetOrCall(this.options.fileName);
  }

  get fileDir() {
    return this.optionGetOrCall(this.options.fileDir);
  }

  get stopAt() {
    return this.optionGetOrCall(this.options.stopAt);
  }
}

export { defaultOptions as defaultFileLoaderOptions, FileLoader };
export type { FileLoaderOptions };
