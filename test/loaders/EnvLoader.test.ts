import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { EnvLoader } from "@/loaders";

describe("class EnvLoader", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {};
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should load the vars", async () => {
    process.env.FOO = "bar";

    const envLoader = new EnvLoader();
    const value = await envLoader.getValue();

    expect(value).toEqual({
      FOO: "bar",
    });
  });

  it("should exclude undefined vars", async () => {
    process.env.FOO = "bar";
    process.env.BAR = undefined;

    const envConfigLoader = new EnvLoader();
    const value = await envConfigLoader.getValue();

    expect(value).toEqual({
      FOO: "bar",
    });
  });

  it("should transform string primitives to their proper types", async () => {
    process.env.FOO = "bar";
    process.env.BAR = "42";
    process.env.BAZ = "false";
    process.env.QUX = "null";

    const envConfigLoader = new EnvLoader();
    const value = await envConfigLoader.getValue();

    expect(value).toEqual({
      FOO: "bar",
      BAR: 42,
      BAZ: false,
      QUX: null,
    });
  });

  it("should be able to take the parser options", async () => {
    process.env.TRUE_1 = "TRUE";
    process.env.TRUE_2 = "1";
    process.env.FALSE_1 = "FALSE";
    process.env.FALSE_2 = "0";
    process.env.NULL = "NULL";

    const envConfigLoader = new EnvLoader({
      parserOptions: {
        nullValues: ["NULL"],
        falseValues: ["FALSE", "0"],
        trueValues: ["TRUE", "1"],
      },
    });
    const value = await envConfigLoader.getValue();

    expect(value).toEqual({
      TRUE_1: true,
      TRUE_2: true,
      FALSE_1: false,
      FALSE_2: false,
      NULL: null,
    });
  });

  it("should filter out vars using names array", async () => {
    process.env.FOO = "bar";
    process.env.BAR = "baz";

    const envLoader = new EnvLoader({
      filterNames: ["FOO"],
    });
    const value = await envLoader.getValue();

    expect(value).toEqual({
      FOO: "bar",
    });
  });

  it("should filter out vars using matcher function", async () => {
    process.env.FOO = "bar";
    process.env.BAR_1 = "1";
    process.env.BAR_2 = "2";

    const envLoader = new EnvLoader({
      filterNames: (name) => name.startsWith("BAR_"),
    });
    const value = await envLoader.getValue();

    expect(value).toEqual({
      BAR_1: 1,
      BAR_2: 2,
    });
  });
});
