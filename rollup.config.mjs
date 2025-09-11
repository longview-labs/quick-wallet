import typescript from "rollup-plugin-typescript2";
import nodePolyfills from "rollup-plugin-node-polyfills";
import json from "rollup-plugin-json";

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/quick-wallet.cjs.js", format: "cjs", sourcemap: true },
    { file: "dist/quick-wallet.esm.js", format: "es", sourcemap: true },
  ],
  watch: {
    include: "src/**",
  },
  plugins: [
    json(),
    nodePolyfills(),
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
    }),
  ],
};
