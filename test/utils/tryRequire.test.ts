import { afterAll, describe, expect, it, vi } from "vitest";

import { tryRequire } from "@/utils";

describe("function tryRequire", () => {
  const processExitStub = vi.fn();
  const consoleErrorStub = vi.fn();

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return the module if package is installed", () => {
    const typescript = tryRequire("typescript");
    expect(typescript).haveOwnProperty("version");
  });

  it("should throw if package isn't installed", () => {
    process.exit = processExitStub as any;
    console.error = consoleErrorStub as any; // eslint-disable-line no-console

    tryRequire("@alxevvv/does-not-exist");

    expect(processExitStub).toBeCalledTimes(1);
    expect(consoleErrorStub).toBeCalledTimes(1);
  });
});
