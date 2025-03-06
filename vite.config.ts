import { resolve } from 'path'

import { defineConfig } from 'vite'
import rollupTs from 'rollup-plugin-typescript2'
import dts from "vite-plugin-dts"
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills(),
    dts({
      insertTypesEntry: true,
    }),
    // {
    //   ...rollupTs({
    //     check: true,
    //     tsconfig: './tsconfig.json'
    //   }),
    //   // run before build
    //   enforce: 'pre',
    // },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'quick-wallet',
      // the proper extensions will be added
      fileName: 'quick-wallet',
    }
  },
})