// 注册es模块
require('esbuild-register')
//  "rollup": "^2.78.0",2版本不需要'esbuild-register' ，不需要配置就能在rollup.config.js
// 文件中书写esmodule规范的代码。
//    "rollup": "^3.26.0", 3以后就不能直接写esmodule规范的代码。默认cjs，如果要写esm需要添加配置require('esbuild-register')
module.exports = require('./scripts/rollup.config.ts')
