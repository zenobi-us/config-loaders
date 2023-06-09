import { resolve } from "node:path";

import { Hook } from "require-in-the-middle";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { DotEnvLoader } from "@/loaders";

describe("class DotEnvLoader", () => {
  const processExitStub = vi.fn();
  const consoleErrorStub = vi.fn();

  afterEach(() => {
    vi.resetAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should be able to load and parse .env files", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/env/"));

    const loader = new DotEnvLoader();

    expect(await loader.getValue()).toEqual({
      STR: "value",
      NUM: 42,
      BOOL: true,
    });
  });

  it("should throw error when dotenv is not installed", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/env/"));

    const hook = new Hook(["dotenv"], () => {
      throw {
        message: "Cannot find module 'dotenv'",
        code: "MODULE_NOT_FOUND",
      };
    });

    process.exit = processExitStub as any;
    // eslint-disable-next-line no-console
    console.error = consoleErrorStub as any;

    const loader = new DotEnvLoader();

    await expect(loader.getValue()).rejects.toThrowError();

    expect(processExitStub).toBeCalledTimes(1);
    expect(consoleErrorStub).toBeCalledTimes(1);

    hook.unhook();
  });

  it("should be able to expand variables", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/env/"));

    const loader = new DotEnvLoader({
      fileName: ".expand.env",
    });

    expect(await loader.getValue()).toEqual({
      HOST: "localhost",
      PORT: 5432,
      DB_NAME: "test_db",
      DB_URI: "postgresql://localhost:5432/test_db",
    });
  });

  it("should throw error when there are variables to expand but no dotenv-expand installed", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/env/"));

    const hook = new Hook(["dotenv-expand"], () => {
      throw {
        message: "Cannot find module 'dotenv-expand'",
        code: "MODULE_NOT_FOUND",
      };
    });

    process.exit = processExitStub as any;
    // eslint-disable-next-line no-console
    console.error = consoleErrorStub as any;

    const loader = new DotEnvLoader({
      fileName: ".expand.env",
    });

    await expect(loader.getValue()).rejects.toThrowError();

    expect(processExitStub).toBeCalledTimes(1);
    expect(consoleErrorStub).toBeCalledTimes(1);

    hook.unhook();
  });
});
