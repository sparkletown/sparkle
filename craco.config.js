const path = require("path");
// noinspection NpmUsedModulesInstalled
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BugsnagSourceMapUploaderPlugin } = require("webpack-bugsnag-plugins");

// @see https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration
module.exports = {
  reactScriptsVersion: "react-scripts",

  babel: {
    plugins: [
      // @see https://github.com/lodash/babel-plugin-lodash
      ["lodash"],
    ],
  },

  webpack: {
    // @debt Temporarily disabled to allow complication on linux. Needs investigating
    // as to whether it is needed at all.
    // alias: {
    //   // De-duplicate lodash in our bundle by ensuring all versions resolve to the same dependency
    //   lodash:      path.resolve(__dirname, "node_modules/lodash"),
    //   "lodash-es": path.resolve(__dirname, "node_modules/lodash"),
    // },

    configure: (webpackConfig) => {
      // some dependencies don't export source maps in their dist directories
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      // @see https://webpack.js.org/configuration/resolve/#resolvefallback
      webpackConfig.resolve.fallback = {
        // because AnimateMap, and other places with setTimeout are deemed as using Node.js core module
        // should just be replaced with explicit window.setTimeout for TS purposes
        // @see src/components/templates/AnimateMap/game/commands
        // timers: require.resolve("timers-browserify"),

        // because ical-generator is using Node.js core module in the browser to do .save()
        // @see https://github.com/sebbo2002/ical-generator/issues/64
        fs: false,

        // because uuidv4 is using Node.js core module
        util: require.resolve("util"),
      };

      webpackConfig.module.rules
                   .find((i) => i.oneOf !== undefined)
                   .oneOf.unshift({
        test:   /\.(glsl)$/,
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
          apiKey:     process.env.REACT_APP_BUGSNAG_API_KEY,
          appVersion: process.env.REACT_APP_BUILD_SHA1,
        });
        webpackConfig.plugins.unshift(bugsnagPlugin);
      }
      webpackConfig.output.assetModuleFilename = 'static/media/[name].[hash:8][ext]';

      return webpackConfig;
    },
  },
};
