import { describe, expect, it } from "vitest";

import { ValueLoader } from "@/loaders";

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
});
