import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 5000,
    coverage: {
      reporter: ["html"],
      include: ["src"],
    },
    include: ["./test/**/*.test.ts"],
    exclude: ["./test/_drafts/**"],
    alias: {
      "@/test": path.resolve(__dirname, "./test"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
