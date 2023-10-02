const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const mode = process.env.NODE_ENV || "production";
console.log("👉 MODE:", `\x1b[33m ${mode} \x1b[0m`);


if (mode === "production") {
  //console.log = function () { };
  module.exports = {
    stats: 'errors-warnings',
    mode: 'production',
    entry: './index.js',
    target: ["webworker", "es2021"],
    output: {
      filename: 'worker.js',
      path: path.join(__dirname, 'dist'),
      module: true,
      library: {
        type: "module",
      },
    },
    resolve: {
      extensions: [".ts", ".js"],
      modules: ['node_modules'],
    },
    experiments: {
      outputModule: true,
    },
    optimization: {
      mangleExports: 'size',
      chunkIds: 'size',
      removeEmptyChunks: true,
      sideEffects: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: true,
              unused: true,
              dead_code: true,
              conditionals: true,
              evaluate: true,
            }
          },
          extractComments: false,
        })
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
    ]
  }
} else {
  module.exports = {
    stats: 'minimal',
    mode: "development",
    entry: './index.js',
    target: "webworker",
    devtool: "source-map",
    output: {
      filename: mode + '_worker.js',
      path: path.join(__dirname, 'dist'),
      clean: true,
    }
  }
}
