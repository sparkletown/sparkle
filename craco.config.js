const path = require("path");
// noinspection NpmUsedModulesInstalled
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
      console.log(webpackConfig);
      webpackConfig.module.rules
        .find((i) => i.oneOf !== undefined)
        .oneOf.unshift({
          test: /\.(glsl)$/,
          loader: "ts-shader-loader",
        });

      webpackConfig.optimization.splitChunks = {
        chunks: "async",
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: "~",
        automaticNameMaxLength: 30,
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          initial: {
            test: /index.tsx/,
            priority: -30,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };

      const htmlWebpackPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof HtmlWebpackPlugin
      );
      htmlWebpackPlugin.options.scriptLoading = "defer";
      console.log(htmlWebpackPlugin.options);

      const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof MiniCssExtractPlugin
      );

      if (
        instanceOfMiniCssExtractPlugin &&
        instanceOfMiniCssExtractPlugin.options
      ) {
        instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;
      }

      return webpackConfig;
    },
  },
};
