import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// 규칙 엔진은 순수함수라 DOM 없이 node 환경에서 그대로 돌린다. (§13.1)
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
