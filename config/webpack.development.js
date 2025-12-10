const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve, join } = require("path");
const port = 3000;

module.exports = {
  devServer: {
    // 单页的spa应用，任意的404请求都返回index.html
    historyApiFallback: true,
    static: {
      directory: join(__dirname, "../dist")
    },
    port,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      favicon: "./public/favicon.ico",
      template: resolve(__dirname, "../src/index-dev.html")
    })
  ]
};
