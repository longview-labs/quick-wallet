import path from "path";
import typescript from "rollup-plugin-typescript2";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import terser from "@rollup/plugin-terser";
import json from "rollup-plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import license from "rollup-plugin-license";

const __dirname = path.resolve();

const tsPlugin = typescript({
  tsconfig: "./tsconfig.json",
  useTsconfigDeclarationDir: true,
});

const licensePlugin = license({
  thirdParty: {
    includeSelf: true,
    allow: "(MIT OR Apache-2.0)",
    output: path.join(__dirname, "dist", "dependencies.txt"),
    template(dependencies) {
      return dependencies
        .map(
          (dependency) =>
            `${dependency.name}:${dependency.version} -- ${dependency.license}`,
        )
        .join("\n");
    },
  },
  banner: {
    commentStyle: "ignored",
    content: {
      file: path.join(__dirname, "dist", "dependencies.txt"),
      encoding: "utf-8",
    },
  },
});

const commonPlugins = [json(), tsPlugin, nodePolyfills(), licensePlugin];

export default [
  // CommonJS & ESM build - externalize dependencies
  {
    input: "src/index.ts",
    output: [
      { file: "dist/quick-wallet.cjs.js", format: "cjs" },
      { file: "dist/quick-wallet.esm.js", format: "es" },
    ],
    watch: { include: "src/**" },
    plugins: commonPlugins,
  },

  // Browser build - bundle everything (include nodeResolve + commonjs + polyfills)
  {
    input: "src/index.ts",
    output: {
      file: "dist/quick-wallet.browser.js",
      format: "iife",
      name: "QuickWallet",
    },
    plugins: [
      ...commonPlugins,
      nodeResolve({ browser: true, preferBuiltins: false }),
      commonjs(),
      terser(),
    ],
  },
];
