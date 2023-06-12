import { describe, expect, it, vi } from "vitest";

import { LoadersPack, loadersPack, ValueLoader, valueLoader } from "@/loaders";

describe("class LoadersPack", () => {
  it("should call getValue on each loader and merge results", async () => {
    const l1 = new ValueLoader({
      value: {
        a: 1,
        b: "foo",
        c: false,
      },
    });

    const l2 = new ValueLoader({
      value: {
        a: 42,
        b: "foo",
        d: true,
      },
    });

    const spy1 = vi.spyOn(l1, "getValue");
    const spy2 = vi.spyOn(l2, "getValue");

    const loader = new LoadersPack([l1, l2]);
    const result = await loader.getValue();

    expect(result).toEqual({
      a: 42,
      b: "foo",
      c: false,
      d: true,
    });

    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(1);
  });

  it("should be able to create loader by function call", async () => {
    const loader = loadersPack([
      valueLoader({ str: "foo" }),
      valueLoader({ num: 42 }),
      valueLoader({ bool: false }),
    ]);

    expect(await loader.getValue()).toEqual({
      str: "foo",
      num: 42,
      bool: false,
    });
  });
});
