/**
 * Webpack 开发环境配置
 * 用于本地开发时的 webpack 配置，包含开发服务器和友好的错误提示
 */

// HTML 模板插件，用于生成 HTML 文件并自动注入打包后的资源
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Node.js 路径处理工具
const { resolve, join } = require('path');
// 友好的错误提示插件，美化 webpack 的错误和警告输出
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
// 系统通知工具，用于在编译出错时发送桌面通知
const notifier = require('node-notifier');

// 开发服务器端口号
const port = 3000;

module.exports = {
  // webpack-dev-server 开发服务器配置
  devServer: {
    // 单页应用路由配置：任意的 404 请求都返回 index.html
    // 这样可以支持前端路由（如 React Router）的 history 模式
    historyApiFallback: true,

    // 静态资源目录配置
    static: {
      // 指定静态资源的根目录
      directory: join(__dirname, '../dist'),
    },

    // 开发服务器监听的端口号
    port,

    // 启用热模块替换（HMR），代码修改后无需刷新页面即可更新
    hot: true,
  },
  // 输出配置
  output: {
    // 输出目录配置
    publicPath: '/',
    // 输出文件命名规则
    filename: 'scripts/[name].bundle.js',
    // 输出资源文件命名规则
    assetModuleFilename: 'images/[name].[ext]',
  },

  // webpack 插件配置
  plugins: [
    // HTML 文件生成插件
    new HtmlWebpackPlugin({
      // 生成的 HTML 文件名
      filename: 'index.html',
      // 网站图标路径
      favicon: './public/favicon.png',
      // HTML 模板文件路径
      template: resolve(__dirname, '../src/index-dev.html'),
    }),

    // 友好的错误提示插件配置
    new FriendlyErrorsWebpackPlugin({
      // 编译成功时显示的信息
      compilationSuccessInfo: {
        // 成功消息列表
        messages: [`Your application is running at http://localhost:${port}`],
        // 额外的提示信息（可选）
        notes: ['💊构建信息请及时关注窗口右上角'],
      },

      // 错误处理回调函数
      onErrors: (severity, errors) => {
        // 只处理错误级别的问题，忽略警告
        if (severity !== 'error') return;

        // 获取第一个错误信息
        const error = errors[0];

        // 发送系统桌面通知
        notifier.notify({
          // 通知标题
          title: '🙅webpack build error',
          // 通知内容：错误级别和错误名称
          message: `${severity}: ${error.name}`,
          // 副标题：出错的文件路径
          subtitle: error.file || '',
          // 通知图标
          icon: join(__dirname, '../public/favicon.png'),
        });
      },

      // 每次编译时清除控制台，保持输出整洁
      clearConsole: true,

      // 自定义错误格式化器（可以在这里添加自定义的错误格式化逻辑）
      //   additionalFormatters: [],

      // 自定义错误转换器（可以在这里添加自定义的错误转换逻辑）
      //   additionalTransformers: [],
    }),
  ],
};
