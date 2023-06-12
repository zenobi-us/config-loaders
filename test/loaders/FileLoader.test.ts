import { resolve } from "node:path";

import { afterAll, describe, expect, it, vi } from "vitest";

import { TestFileLoader } from "@/test/src/TestFileLoader";

describe("abstract class FileLoader", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should load the file from default location", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/"));

    const loader = new TestFileLoader();

    expect(await loader.getValue()).toEqual({
      fileContent: "TEST_CONTENT",
    });
  });

  it("should load the file from upper directory", async () => {
    const loader = new TestFileLoader({
      fileDir: () => resolve(__dirname, "../fixtures/dir/subdir/"),
    });

    expect(await loader.getValue()).toEqual({
      fileContent: "DIR_TEST_CONTENT",
    });
  });

  it("should load the file by its path", async () => {
    const loader = new TestFileLoader({
      fileName: resolve(__dirname, "../fixtures/dir/config"),
    });

    expect(await loader.getValue()).toEqual({
      fileContent: "DIR_TEST_CONTENT",
    });
  });

  it("should not go up if findUp option is false", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/dir/subdir/"));

    const loader = new TestFileLoader({
      findUp: false,
    });

    await expect(loader.getValue()).rejects.toThrowError();
  });

  it("should throw if file not found", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/dir/subdir/"));

    const loader = new TestFileLoader({
      fileName: "doesNotExist",
    });

    await expect(loader.getValue()).rejects.toThrowError();
  });

  it("should not throw if file not found and failSilently option is true", async () => {
    const cwdSpy = vi.spyOn(process, "cwd");
    cwdSpy.mockReturnValue(resolve(__dirname, "../fixtures/dir/subdir/"));

    const loader = new TestFileLoader({
      fileName: "doesNotExist",
      failSilently: true,
    });

    expect(await loader.getValue()).toEqual({ fileContent: "" });
  });

  it("should throw if stopAt is not upper dir of fileDir", () => {
    expect(
      () =>
        new TestFileLoader({
          fileDir: "/dir1/subdir/",
          stopAt: "/dir2",
        }),
    ).toThrowError();
  });
});
