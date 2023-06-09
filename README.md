# config-loaders

Collect and parse configuration from different sources

## Examples

### Load `.env` file from current working or upper directory:

```properties
# .env

STR=value
NUM=42
BOOL=true
```

```typescript
import { DotEnvLoader } from "config-loaders";

const loader = new DotEnvLoader();
const value = loader.getValue();

/* value is:
{
  STR: "value",
  NUM: 42,
  BOOL: true,
}
*/
```

### Load environment variables:

```typescript
import { EnvLoader } from "config-loaders";

const loader = new EnvLoader({
  filterNames: ["VAR1", "VAR2"],
});

const value = loader.getValue();

/*
value contains only VAR1 and VAR2 variables
(if they exist in the `process.env`)
*/
```

### Load from multiple sources:

```typescript
import {
  DotEnvLoader,
  EnvLoader,
  LoadersPack,
  ValueLoader,
} from "config-loaders";

const loader = new LoadersPack([
  new DotEnvLoader(),
  new EnvLoader(),
  new ValueLoader({ value: { TEST: true } }),
]);

const value = loader.getValue();

/*
value is values from .env file overriden by values
from process.env and { TEST: true } object.
*/
```

## **API**

## Abstract classes

### `abstract class Loader`

Class representing a loader.

The process of obtaining a value is divided into three stages:

1. Loading
1. Parsing
1. Transformation

The derived class _must_ implement methods of stages 1 and 2.

Stage 3 method returns unchanged value by default
and can be omitted.

#### **Methods**:

#### `async getValue(): Promise<JsonObject>`

The main method for getting the loader's value.
Should return a serializable object.

#### `abstract load(): Promise<JsonValue>`

Should implement the logic for obtaining raw value.

#### `abstract parse(rawValue: JsonValue): Promise<JsonObject>`

Should implement the logic for parsing the raw value.

#### `async transform(parsedValue: JsonObject): Promise<JsonObject>`

May optionally describe the logic for converting
a parsed value to its final form.

### `abstract class FileLoader`

Base class for implementing file loaders.
Includes logic for search the file by traversing directory tree up.

<a name="FileLoaderOptions"></a> #### **Options**:

#### `fileName?: string | (() => string)`

Name of the file to be loaded.

> default: `"config"`

#### `fileDir?: string | (() => string)`

Directory where the file search starts.

> default: `process.cwd()`

#### `findUp?: boolean`

Try to find the file in upper directories.

> default: `true`;

#### `stopAt?: string | (() => string)`

Directory where the file search stops.

> default: `path.parse(fileDir).root`

#### `fileEncoding?: BufferEncoding`

Encoding of the file.

> default: `"utf-8"`

#### `failSilently?: boolean`

Don't throw an error if the file isn't found.

> default: `false`

## Loaders

### `class DotEnvLoader`

Loader that utilizes [dotenv](https://github.com/motdotla/dotenv)
library for parsing files contain environment variables settings.
Checks if there are expandable variables and expand them using
[dotenv-expand](https://github.com/motdotla/dotenv-expand) library.
The default parser also converts string representations
of primitive types to their proper types.

Requires `dotenv` package to be installed.

Requires `dotenv-expand` package to be installed in the case
of expandable variables processing.

#### **Options:**

[FileLoader options](#FileLoaderOptions) with default fileName `.env`:

#### `expandVariables?: boolean`

Whether to expand variables.

> default: `true`;

#### `parserOptions?: JsonStringValuesParserOptions`

Parser options. See the list
[here](https://github.com/alxevvv/json-string-values-parser#options).

> default: `{}`

### `class EnvLoader`

Loader that reads `process.env` object.
The default parser converts string representations of primitive types
to their proper types.

#### **Options:**

#### `parserOptions?: JsonStringValuesParserOptions`

Parser options. See the list
[here](https://github.com/alxevvv/json-string-values-parser#options).

> default: `{}`

#### `filterNames?: string[] | ((name: string) => boolean) | false`

Filter properties in the final object by its names.

> default: `false`

### `class LoadersPack`

Loader that takes an array of loaders and
merges the values loaded using them.

#### **Constructor parameters:**

#### `loaders: Loader[]` &ndash; Required

Loaders list

### `class YamlLoader`

Loader for loading .yaml files.

See [FileLoader options](#FileLoaderOptions) for options list.
Default filename is `config.yaml`.

### `class ValueLoader`

Loader that takes a static value or a function returning the value.

#### **Options:**

#### `value: T | (() => T)` &ndash; Required

Value itself or a factory function returning the value.

## License

Licensed under the MIT license. Copyright (c) 2023-present Vladislav Alexeev
