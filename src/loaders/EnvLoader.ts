import {
  jsonParseStringValues,
  JsonStringValuesParserOptions,
} from "json-string-values-parser";
import { JsonObject } from "type-fest";

import { Loader } from "./Loader";

interface EnvLoaderOptions {
  /**
   * Parser options.
   * @see https://github.com/alxevvv/json-string-values-parser#options
   * @default {}
   */
  parserOptions?: JsonStringValuesParserOptions;

  /**
   * Filter properties in the final object by its names.
   * @default false
   */
  filterNames?: string[] | ((name: string) => boolean) | false;
}

const defaultOptions: Required<EnvLoaderOptions> = {
  parserOptions: {},
  filterNames: false,
};

/**
 * Loader that reads `process.env` object.
 * The default parser converts string representations of primitive types
 * to their proper types.
 */
class EnvLoader extends Loader {
  readonly options: Required<EnvLoaderOptions>;

  constructor(options: EnvLoaderOptions = {}) {
    super();
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  /**
   * Returns the object with environments variables.
   */
  async load(): Promise<Record<string, string>> {
    const env = process.env;
    return Object.fromEntries(
      Object.entries(env).filter(([, value]) => value !== undefined) as [
        string,
        string,
      ][],
    );
  }

  /**
   * Converts string representations of primitive types
   * to their proper types.
   * @see https://github.com/alxevvv/json-string-values-parser
   */
  async parse(rawValue: Record<string, string>): Promise<JsonObject> {
    return jsonParseStringValues(
      rawValue,
      this.options.parserOptions,
    ) as JsonObject;
  }

  /**
   * Optional filtering according the condition provided in options object.
   */
  async transform(parsedValue: JsonObject): Promise<JsonObject> {
    const { filterNames } = this.options;

    if (filterNames) {
      if (Array.isArray(filterNames)) {
        return Object.fromEntries(
          Object.entries(parsedValue).filter(([name]) =>
            filterNames.includes(name),
          ),
        );
      } else {
        return Object.fromEntries(
          Object.entries(parsedValue).filter(([name]) => filterNames(name)),
        );
      }
    }
    return parsedValue;
  }
}

function envLoader(options?: EnvLoaderOptions) {
  return new EnvLoader(options);
}

export { EnvLoader, envLoader };
export type { EnvLoaderOptions };
