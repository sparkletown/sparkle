const path = require("path");

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
  },
};
