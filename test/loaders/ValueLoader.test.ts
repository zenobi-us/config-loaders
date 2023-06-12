import { describe, expect, it } from "vitest";

import { ValueLoader, valueLoader } from "@/loaders";

describe("class ValueLoader", () => {
  it("should return the values passed on initialization", async () => {
    const loader = new ValueLoader({
      value: {
        test: "TEST",
      },
    });

    expect(await loader.getValue()).toEqual({ test: "TEST" });
  });

  it("should work with value factory function", async () => {
    const loader = new ValueLoader({
      value: () => ({
        test: "TEST",
      }),
    });

    expect(await loader.getValue()).toEqual({ test: "TEST" });
  });

  it("should be albe to create loader by function call", async () => {
    const loader = valueLoader({ test: "loader_function" });

    expect(await loader.getValue()).toEqual({ test: "loader_function" });
  });
});
