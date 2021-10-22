const path = require("path");
// noinspection NpmUsedModulesInstalled
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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

      webpackConfig.optimization.minimize = false;

      webpackConfig.optimization.minimizer.forEach((minimizer) => {
        if (minimizer && minimizer.options) {
          minimizer.options.parallel = 1;
        }
      });

      return webpackConfig;
    },
  },
};
