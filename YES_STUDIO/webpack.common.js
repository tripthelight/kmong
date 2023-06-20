const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production", // development | production
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          // {
          //   loader: "style-loader",
          // },
          {
            // 매우중요*** hash된 이미지 경로와 이미지명을 함께 번들링해줌
            loader: "css-loader",
            options: {
              url: true,
              esModule: false,
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // css에서 background-image svg를 줄 때, svg를 분해해서 번들링 해줌
      // {
      //   test: /\.svg/,
      //   type: "asset/inline",
      // },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader",
            options: {
              // plan3 일 경우
              name: "icon/[name].[ext]",
              // 파일의 경로를 그대로 bundleing 해줌
              // name(resourcePath, resourceQuery) {
              //   console.log("resourcePath >>>>>>> ", resourcePath);
              //   console.log("resourceQuery >>>>>> ", resourceQuery);
              //   return "[path][name].[ext]";
              // },
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
