import { describe, expect, it, vi } from "vitest";

import { LoadersPack, ValueLoader } from "@/loaders";

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
});
