import { JsonObject, JsonValue } from "type-fest";

abstract class Loader {
  async getValue() {
    let values = await this.load();
    values = await this.parse(values);
    values = await this.transform(values);
    return values;
  }

  abstract load(): Promise<JsonValue>;

  abstract parse(source: JsonValue): Promise<JsonObject>;

  async transform(source: JsonObject): Promise<JsonObject> {
    return source;
  }
}

export { Loader };
