import path from "node:path";
import fs from "node:fs";
import type { OutputOptions, RollupOptions } from "rollup";

const packageDir = path.resolve(__dirname, "../packages");
const packageFiles = fs.readdirSync(packageDir);
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import { uglify } from "rollup-plugin-uglify";
import nodeResolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";

const esbuildPlugin = esbuild({ target: "esnext" });
const terserPlugin = terser({
  compress: {
    drop_console: true, // 移除 console.log 语句
    drop_debugger: true, // 移除 debugger 语句
  },
});

console.log(packageDir);
console.log(packageFiles);
console.log("-------------uglify", uglify);

const options = (path: string) => {
  return [
    {
      input: [`./packages/${path}/index.ts`],
      output: [
        {
          file: `./packages/${path}/dist/index.cjs`,
          format: "cjs",
          sourcemap: true,
        },
        {
          file: `./packages/${path}/dist/index.mjs`,
          format: "esm",
          sourcemap: true,
        },
        {
          file: `./packages/${path}/dist/index.js`,
          format: "umd",
          name: "web-monitor",
          sourcemap: true,
        },
        {
          file: `./packages/${path}/dist/index.min.js`,
          format: "umd",
          name: "web-monitor",
          sourcemap: true,
          plugins: [uglify()],
        },
      ],
      plugins: [
        // typescript({
        //   tsconfigOverride: {
        //     compilerOptions: {
        //       module: "ESNext",
        //     },
        //   },
        //   useTsconfigDeclarationDir: true,
        // }),
        resolve(),
        commonjs(),
        nodeResolve(),
        json(),
        esbuildPlugin,
        // terserPlugin
      ],
    },
    {
      input: `./packages/${path}/index.ts`,
      output: [
        { file: `./packages/${path}/dist/index.cjs.d.ts`, format: "cjs" },
        { file: `./packages/${path}/dist/index.esm.d.ts`, format: "esm" },
        { file: `./packages/${path}/dist/index.d.ts`, format: "umd" },
        { file: `./packages/${path}/dist/index.min.d.ts`, format: "umd" },
      ],
      plugins: [dts()],
    },
  ];
};

let configs: any[] = [];
configs = packageFiles.map((pathName) => options(pathName)).flat();
console.log("查看----", configs);

export default configs;

// import esbuild from 'rollup-plugin-esbuild'
// import dts from 'rollup-plugin-dts'
// import json from '@rollup/plugin-json'
// import nodeResolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
// import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
// import type { OutputOptions, RollupOptions } from 'rollup'
// import { packages } from '../meta/packages'

// const configs: RollupOptions[] = []

// const esbuildPlugin = esbuild({ target: 'esnext' })
// const dtsPlugin = [dts()]

// const externals: never[] = []

// const esbuildMinifer = (options: ESBuildOptions) => {
//   const { renderChunk } = esbuild(options)
//   return { name: 'esbuild-minifer', renderChunk }
// }

// for (const {
//   globals,
//   name,
//   external,
//   iife,
//   build,
//   cjs,
//   mjs,
//   dts,
//   target
// } of packages) {
//   if (build === false) continue
//   console.log('打包了-------》', cjs, mjs, dts)

//   const iifeGlobals = {
//     '@web-monitor/code': 'WebMonitor',
//     ...(globals || {})
//   }
//   const iifeName = 'WebMonitor'

//   // 打包 hooks & utils
//   const fn = 'index'
//   const input = `packages/${name}/index.ts`
//   const output: OutputOptions[] = []

//   if (mjs !== false) {
//     console.log('mjs---')
//     output.push({
//       file: `packages/${name}/dist/${fn}.mjs`,
//       format: 'es'
//     })
//   }

//   if (cjs !== false) {
//     console.log('cjs---')
//     output.push({
//       file: `packages/${name}/dist/${fn}.cjs`,
//       format: 'cjs'
//     })
//   }

//   if (iife !== false) {
//     console.log('iife---')
//     output.push(
//       {
//         file: `packages/${name}/dist/${fn}.iife.js`,
//         format: 'iife',
//         name: iifeName,
//         extend: true,
//         globals: iifeGlobals
//       },
//       {
//         file: `packages/${name}/dist/${fn}.iife.min.js`,
//         format: 'iife',
//         name: iifeName,
//         extend: true,
//         globals: iifeGlobals,
//         plugins: [esbuildMinifer({ minify: true })]
//       }
//     )
//   }
//   console.log('不一样的项目-------》', configs)
//   console.log('不一样的项目output-------》', output)

//   configs.push({
//     input,
//     output,
//     plugins: [
//       commonjs(),
//       nodeResolve(),
//       json(),
//       target ? esbuild({ target }) : esbuildPlugin
//     ],
//     external: [...externals, ...(external || [])]
//   })

//   if (dts !== false) {
//     configs.push({
//       input,
//       output: {
//         file: `packages/${name}/dist/${fn}.d.ts`,
//         format: 'es'
//       },
//       plugins: dtsPlugin,
//       external: [...externals, ...(external || [])]
//     })
//   }
// }
// for (const obj of configs) {
//   // console.log('查看配置项目-------》', obj)
// }

// export default configs
