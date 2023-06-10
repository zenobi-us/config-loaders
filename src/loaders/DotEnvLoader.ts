import {
  jsonParseStringValues,
  JsonStringValuesParserOptions,
} from "json-string-values-parser";
import set from "lodash.set";
import { JsonObject } from "type-fest";

import { tryRequire } from "@/utils";

import {
  defaultFileLoaderOptions,
  FileLoader,
  FileLoaderOptions,
} from "./FileLoader";

interface DotEnvLoaderOptions extends FileLoaderOptions {
  /**
   * Whether to expand variables.
   * @default true
   */
  expandVariables?: boolean;

  /**
   * If set to non-zero length string, use it to parse
   * environment variables to objects.
   * @default ""
   */
  nestedKeyDelimiter?: string;

  /**
   * Parser options.
   * @see https://github.com/alxevvv/json-string-values-parser#options
   * @default {}
   */
  parserOptions?: JsonStringValuesParserOptions;
}

const defaultOptions: Required<DotEnvLoaderOptions> = {
  ...defaultFileLoaderOptions,
  fileName: ".env",
  expandVariables: true,
  nestedKeyDelimiter: "",
  parserOptions: {},
};

/**
 * Loader that utilizes `dotenv` library for parsing
 * files contain environment variables settings.
 * The default parser also converts string representations of primitive types
 * to their proper types.
 * @requires `dotenv` package
 * @requires `dotenv-expand` package (if there are expandable variables)
 */
class DotEnvLoader extends FileLoader {
  readonly options: Required<DotEnvLoaderOptions>;

  constructor(options: DotEnvLoaderOptions = {}) {
    const opts = {
      ...defaultOptions,
      ...options,
    };
    super(opts);
    this.options = opts;
  }

  /**
   * 1. Uses `dotenv` library for parsing raw string file content.
   * 1. Checks if there are expandable variables
   *    and expand them using `dotenv-expand` library.
   * 1. Converts string representations of primitive types.
   *    to their proper types.
   * @see https://github.com/alxevvv/json-string-values-parser
   */
  async parse(rawValue: string): Promise<JsonObject> {
    const dotenv = tryRequire("dotenv");

    let parsedValue = dotenv.parse(rawValue) as Record<string, string>;

    if (
      this.hasExpandableVariables(parsedValue) &&
      this.options.expandVariables
    ) {
      parsedValue = this.expandVariables(parsedValue);
    }

    return jsonParseStringValues(
      parsedValue,
      this.options.parserOptions,
    ) as JsonObject;
  }

  /**
   * If key delimiter given, search it in the config object keys and
   * build appropriate nested object structure.
   */
  async transform(parsedValue: JsonObject): Promise<JsonObject> {
    const { nestedKeyDelimiter } = this.options;
    if (nestedKeyDelimiter.length > 0) {
      const transformedValue = {} as JsonObject;
      Object.entries(parsedValue).forEach(([key, value]) => {
        set(transformedValue, key.split(nestedKeyDelimiter), value);
      });
      return transformedValue;
    }
    return parsedValue;
  }

  private hasExpandableVariables(source: Record<string, string>) {
    const regExp = /((?!(?<=\\))\${?([\w]+)(?::-([^}\\]*))?}?)/;
    return Object.values(source).some((v) => v && regExp.test(v));
  }

  private expandVariables(source: Record<string, string>) {
    const dotenvExpand = tryRequire("dotenv-expand");
    return dotenvExpand.expand({
      parsed: source,
      ignoreProcessEnv: true,
    }).parsed as Record<string, string>;
  }
}

export { DotEnvLoader };
export type { DotEnvLoaderOptions };
