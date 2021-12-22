const path = require("path");
// noinspection NpmUsedModulesInstalled
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins')

module.exports = {
  reactScriptsVersion: "react-scripts",
  babel: {
    plugins: [
      // https://github.com/lodash/babel-plugin-lodash
      ["lodash"],
    ],
  },
  webpack: {
    alias: {
      // De-duplicate lodash in our bundle by ensuring all versions resolve to the same dependency
      lodash: path.resolve(__dirname, "node_modules/lodash"),
      "lodash-es": path.resolve(__dirname, "node_modules/lodash"),
    },
    configure: (webpackConfig) => {
      webpackConfig.module.rules
        .find((i) => i.oneOf !== undefined)
        .oneOf.unshift({
          test: /\.(glsl)$/,
          loader: "ts-shader-loader",
        });

      const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof MiniCssExtractPlugin
      );

      if (
        instanceOfMiniCssExtractPlugin &&
        instanceOfMiniCssExtractPlugin.options
      ) {
        instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;
      }

      const buildSha1 = process.env.REACT_APP_BUILD_SHA1;
      const bugsnagApiKey = process.env.REACT_APP_BUGSNAG_API_KEY;

      if (buildSha1 && bugsnagApiKey) {
        const bugsnagPlugin = new BugsnagSourceMapUploaderPlugin({
          apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
          appVersion: process.env.REACT_APP_BUILD_SHA1,
        });
        webpackConfig.plugins.unshift(bugsnagPlugin);
      }

      return webpackConfig;
    },
  },
};
