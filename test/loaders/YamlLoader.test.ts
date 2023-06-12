import { resolve } from "node:path";

import { Hook } from "require-in-the-middle";
import { afterEach, describe, expect, it, vi } from "vitest";

import { YamlLoader, yamlLoader } from "@/loaders";

describe("class YamlLoader", () => {
  const processExitStub = vi.fn();
  const consoleErrorStub = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be able to read yaml file", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/yaml/"));

    const loader = new YamlLoader();

    expect(await loader.getValue()).toEqual({
      database: {
        port: 5432,
        host: "localhost",
      },
      auth: {
        password: true,
        providers: ["github", "google"],
      },
    });
  });

  it("should be able to create loader by function call", async () => {
    const loader = yamlLoader(
      resolve(__dirname, "../fixtures/yaml/simple.yaml"),
    );

    expect(await loader.getValue()).toEqual({ str: "foo", num: 42 });
  });

  it("should throw an error if yaml is not installed", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/yaml/"));

    const hook = new Hook(["yaml"], () => {
      throw {
        message: "Cannot find module 'yaml'",
        code: "MODULE_NOT_FOUND",
      };
    });

    process.exit = processExitStub as any;
    // eslint-disable-next-line no-console
    console.error = consoleErrorStub as any;

    const loader = new YamlLoader();

    await expect(loader.getValue()).rejects.toThrowError();

    expect(processExitStub).toBeCalledTimes(1);
    expect(consoleErrorStub).toBeCalledTimes(1);

    hook.unhook();
  });
});
