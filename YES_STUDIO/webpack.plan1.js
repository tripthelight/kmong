const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const COMMON_CONFIG = require("./webpack.common.js");

module.exports = Object.assign({}, COMMON_CONFIG, {
  name: "plan1",
  entry: {
    plan1: "./plan1/js/plan1.js",
  },
  output: {
    // path: path.join(__dirname, "/plan1/js"),
    path: path.join(__dirname, "dist"),
    filename: "[name]/js/[name].bundle.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "plan1/css/plan1.bundle.css",
    }),
    new HtmlWebpackPlugin({
      template: "./plan1/index.html",
      filename: "plan1/index.html",
      minify: false,
    }),
  ],
});
