/**
 * Webpack 生产环境配置
 * 用于生产环境下的代码打包，包含代码优化和压缩等配置
 */
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 输出配置
  output: {
    // 打包文件的输出目录
    path: join(__dirname, '../dist'),
    // 静态资源的公共路径，使用相对路径以支持部署到任意路径
    publicPath: './',
    // JS 文件输出路径和命名规则，使用 contenthash 实现长期缓存
    filename: 'scripts/[name].[contenthash:5].bundle.js',
    // 资源文件（如图片）的输出路径和命名规则
    assetModuleFilename: 'images/[name].[contenthash:5][ext]',
  },
  // 性能提示配置
  performance: {
    // 单个资源文件大小限制（字节），超过会发出警告
    maxAssetSize: 250000,
    // 入口文件大小限制（字节），超过会发出警告
    maxEntrypointSize: 250000,
    // 性能提示类型：warning 表示以警告形式提示
    hints: 'warning',
  },
  // 优化配置
  optimization: {
    // 启用代码压缩
    minimize: true,
    // 自定义压缩插件
    minimizer: [
      // CSS 压缩插件
      new CssMinimizerPlugin({
        // 启用多进程并行压缩以提高构建速度
        parallel: true,
      }),
      // JavaScript 压缩插件
      new TerserPlugin({
        // 启用多进程并行压缩以提高构建速度
        parallel: true,
      }),
    ],
  },
  // 外部依赖配置，这些库不会被打包，而是通过 CDN 引入
  externals: {
    // React 库使用全局变量 React
    react: 'React',
    // ReactDOM 库使用全局变量 ReactDOM
    'react-dom': 'ReactDOM',
  },
  // webpack 插件配置
  plugins: [
    // HTML 文件生成插件
    new HtmlWebpackPlugin({
      title: 'YueChu',
      // 生成的 HTML 文件名
      filename: 'index.html',
      // 网站图标路径
      favicon: './public/favicon.png',
      // HTML 模板文件路径
      template: resolve(__dirname, '../src/index-prod.html'),
    }),
  ],
};
