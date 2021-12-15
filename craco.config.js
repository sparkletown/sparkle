const path = require("path");
// noinspection NpmUsedModulesInstalled
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  reactScriptsVersion: "react-scripts",
  style: {
    modules: {
      // @see https://github.com/webpack-contrib/css-loader#localidentname
      localIdentName: "[local]--[hash:base64:5]",
      // localIdentName: "[folder]--[hash:base64:5]",
      // localIdentName: "[hash:base64:10]",
    },
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
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

      return webpackConfig;
    },
  },
};
