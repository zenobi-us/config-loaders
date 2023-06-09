import { JsonObject, JsonValue } from "type-fest";

/**
 * Class representing a loader.
 *
 * The process of obtaining a value is divided into three stages:
 *
 * 1) loading
 * 2) parsing
 * 3) transformation
 *
 * The derived class must implement methods for stages 1 and 2.
 *
 * Stage 3 method returns unchanged value by default and can be omitted.
 *
 * @abstract
 */
abstract class Loader {
  /**
   * The main method for getting the loader's value.
   *
   * @returns Promise of the final value in the form of JSON object.
   */
  async getValue() {
    let value = await this.load();
    value = await this.parse(value);
    value = await this.transform(value);
    return value;
  }

  /**
   * Should implement the logic for obtaining raw value.
   * For example reading a file or making network request.
   *
   * @abstract
   * @async
   * @returns Promise of the raw value.
   */
  abstract load(): Promise<JsonValue>;

  /**
   * Should implement the logic of parsing the raw value.
   * For example call `JSON.parse` passing a string with file content.
   *
   * @abstract
   * @async
   * @param {JsonValue} rawValue
   * @returns {Promise<JsonObject>}
   * Promise of the parsed value in the form of JSON object.
   */
  abstract parse(rawValue: JsonValue): Promise<JsonObject>;

  /**
   * May optionally describe the logic for converting a parsed value
   * to a final form.
   *
   * @async
   * @param {JsonObject} parsedValue
   * @returns {Promise<JsonObject>}
   * Promise of the final value in the form of JSON object.
   */
  async transform(parsedValue: JsonObject): Promise<JsonObject> {
    return parsedValue;
  }
}

export { Loader };
