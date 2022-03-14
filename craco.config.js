// noinspection NpmUsedModulesInstalled
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BugsnagSourceMapUploaderPlugin } = require("webpack-bugsnag-plugins");

const findSvgRule = (rules) => {
  for (const rule of rules) {
    const foundSubrule = (rule.oneOf || []).find((subrule) => {
      // Testing true equality of regex is difficult.
      // For our need, testing the toString() result is sufficient.
      return subrule.test.toString() === "/\\.svg$/";
    });
    if (foundSubrule) {
      return foundSubrule;
    }
  }
};

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
      // @see https://webpack.js.org/configuration/stats/
      webpackConfig.stats = {
        ...(webpackConfig.stats ?? {}),
        errorDetails: true,
      };

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

        // @debt was needed for uuidv4, since that library is replaced, this may not be needed
        util: require.resolve("util"),
      };

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
          overwrite: true,
        });
        webpackConfig.plugins.unshift(bugsnagPlugin);
      }

      // Use old style hashes as we have stored references to images from our
      // build in the database. The broader asset generation requires that
      // the name does NOT include a "." between the hash and the extension
      // tag. The SVG rule requires the "." to be there.
      const generatedAssetsNameWithoutExt = "static/media/[name].[hash:8]";
      webpackConfig.output.assetModuleFilename = `${generatedAssetsNameWithoutExt}[ext]`;

      // The SVG rule also needs to be updated separately.
      const svgRule = findSvgRule(webpackConfig.module.rules);
      if (svgRule) {
        for (const loaderDesc of svgRule.use) {
          if (loaderDesc.options?.name) {
            loaderDesc.options.name = `${generatedAssetsNameWithoutExt}.[ext]`;
          }
        }
      }

      return webpackConfig;
    },
  },
  style: {
    postOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
