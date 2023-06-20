const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const COMMON_CONFIG = require("./webpack.common.js");
const webpack = require("webpack");
// const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = Object.assign({}, COMMON_CONFIG, {
  name: "plan3",
  entry: {
    plan3: "./plan3/js/plan3.js",
    info: "./plan3/js/info.js",
  },
  output: {
    // path: path.join(__dirname, "/plan2/js"),
    path: path.join(__dirname, "dist"),
    filename: "js/[name].bundle.js",
    clean: true,
  },
  // externals: [nodeExternals()],
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].bundle.css",
    }),
    new HtmlWebpackPlugin({
      template: "./plan3/index.html",
      filename: "index.html",
      chunks: ["plan3"],
      minify: false,
    }),
    new HtmlWebpackPlugin({
      template: "./plan3/info.html",
      filename: "info.html",
      chunks: ["info"],
      minify: false,
    }),
    new CopyPlugin({
      patterns: [{ from: "plan3/images", to: "images" }],
    }),
  ],
  performance: {
    hints: false,
  },
});
