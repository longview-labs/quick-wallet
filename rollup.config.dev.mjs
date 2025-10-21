import typescript from "rollup-plugin-typescript2";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import json from "rollup-plugin-json";

const tsPlugin = typescript({
  tsconfig: "./tsconfig.json",
  useTsconfigDeclarationDir: true,
});

const commonPlugins = [json(), tsPlugin, nodePolyfills()];

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/quick-wallet.cjs.js", format: "cjs", sourcemap: true },
      { file: "dist/quick-wallet.esm.js", format: "es", sourcemap: true },
    ],
    watch: { include: "src/**" },
    plugins: commonPlugins,
  },
];
