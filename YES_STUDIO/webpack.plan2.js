const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const COMMON_CONFIG = require("./webpack.common.js");

module.exports = Object.assign({}, COMMON_CONFIG, {
  name: "plan2",
  entry: {
    plan2: "./plan2/js/plan2.js",
  },
  output: {
    // path: path.join(__dirname, "/plan2/js"),
    path: path.join(__dirname, "dist"),
    filename: "[name]/js/[name].bundle.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "plan2/css/plan2.bundle.css",
    }),
    new HtmlWebpackPlugin({
      template: "./plan2/index.html",
      filename: "plan2/index.html",
      minify: false,
    }),
  ],
});
