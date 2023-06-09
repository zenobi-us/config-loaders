import { describe, expect, it, vi } from "vitest";

import { TestLoader } from "@/test/src/TestLoader";

describe("abstract class Loader", () => {
  it("all the methods should return promises", () => {
    const loader = new TestLoader();

    expect(loader.load()).instanceOf(Promise);
    expect(loader.parse("test")).instanceOf(Promise);
    expect(loader.transform({ test: "test" })).instanceOf(Promise);
    expect(loader.getValue()).instanceOf(Promise);
  });

  it("should call methods chain appropriately", async () => {
    const loader = new TestLoader();

    const spyLoad = vi.spyOn(loader, "load");
    const spyParse = vi.spyOn(loader, "parse");
    const spyTransform = vi.spyOn(loader, "transform");

    await loader.getValue();

    expect(spyLoad).toBeCalledTimes(1);
    expect(spyParse).toBeCalledTimes(1);
    expect(spyParse).toBeCalledWith("test");
    expect(spyTransform).toBeCalledTimes(1);
    expect(spyTransform).toBeCalledWith({ test: "test" });
  });

  it("should return value", async () => {
    const loader = new TestLoader();

    expect(await loader.getValue()).toEqual({ test: "test" });
  });
});
