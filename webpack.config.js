/**
 * ==========================================
 * Webpack 配置文件
 * ==========================================
 * 这个文件负责配置如何打包你的项目代码
 */

// ========== 1. 导入需要的工具包 ==========

// MiniCssExtractPlugin: 把 CSS 从 JS 中提取出来，生成单独的 CSS 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// resolve: 用于处理文件路径，确保在不同操作系统上都能正常工作
const { resolve } = require('path');

// merge: 用于合并多个 webpack 配置对象（基础配置 + 环境特定配置）
const merge = require('webpack-merge');

// yargs-parser: 用于解析命令行参数（比如 --mode development）
const argv = require('yargs-parser')(process.argv.slice(2));

// ========== 2. 读取构建模式（开发/生产） ==========

// 从命令行获取 mode 参数，默认为 'development'（开发模式）
// 运行 "yarn client:prod" 时会传入 --mode production
const _mode = argv.mode || 'development';

// 判断是否为生产模式，用于后续的条件判断
// true = 生产模式, false = 开发模式
const _modeflag = _mode === 'production' ? true : false;

// 根据当前模式加载对应的配置文件
// 开发模式: ./config/webpack.development.js
// 生产模式: ./config/webpack.production.js
const _mergeConfig = require(`./config/webpack.${_mode}.js`);

// 用于显示构建的进度条(美化终端输出)
const { ThemedProgressPlugin } = require('themed-progress-plugin');

// ========== 3. 基础配置对象 ==========
const webpackBaseConfig = {
  // ---------- 3.1 入口文件 ----------
  // webpack 从这个文件开始分析和打包整个项目
  entry: resolve('/src/index.tsx'),

  // ---------- 3.2 输出配置 ----------
  output: {
    // path: 打包后的文件输出到哪个目录（通常在环境配置文件中设置）
    // path: resolve(__dirname, 'dist'),

    // filename: 输出的 JS 文件名
    // [name]: 入口名称, [contenthash]: 文件内容的哈希值（用于缓存）
    // filename: '[name].[contenthash].js',

    // clean: 每次构建前自动清理输出目录，删除旧文件
    clean: true,

    // publicPath: 资源的公共路径（CDN 或服务器上的路径）
    // publicPath: '/',
  },

  // ---------- 3.3 统计信息配置 ----------
  // 控制构建时在控制台显示什么信息
  stats: 'errors-warnings', // 只显示错误和警告，隐藏详细的构建信息

  // ---------- 3.4 模块处理规则 ----------
  // 告诉 webpack 如何处理不同类型的文件
  module: {
    rules: [
      // 规则 1: 处理 TypeScript/React 文件
      {
        // test: 匹配文件扩展名（这里匹配 .ts 和 .tsx 文件）
        test: /\.(ts|tsx)$/,

        // exclude: 排除 node_modules 目录，不处理第三方库
        exclude: /(node_modules)/,

        // use: 使用什么 loader 来处理这些文件
        use: {
          // swc-loader: 超快的 TypeScript/JavaScript 编译器（比 babel 快很多）
          loader: 'swc-loader',
        },
      },

      // 规则 2: 处理 CSS 文件
      {
        // test: 匹配 .css 文件
        test: /\.css$/i,

        // use: 处理器链（从后往前执行）
        use: [
          // 3. MiniCssExtractPlugin.loader: 把 CSS 提取成单独的文件
          MiniCssExtractPlugin.loader,

          // 2. css-loader: 解析 CSS 中的 @import 和 url()
          {
            loader: 'css-loader',
            options: {
              // importLoaders: 1 表示在 css-loader 前还有 1 个 loader（postcss-loader）
              importLoaders: 1,
            },
          },

          // 1. postcss-loader: 处理 CSS（自动添加浏览器前缀、使用 Tailwind 等）
          'postcss-loader',
        ],
      },
      {
        // 规则 3: 处理图片和字体等静态资源文件
        test: /\.(png|jpe?g|gif|svg|webp|woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },

  // ---------- 3.5 模块解析配置 ----------
  resolve: {
    // alias: 路径别名，让你可以用简短的路径导入文件
    // 例如: import Button from '@components/Button'
    // 而不是: import Button from '../../components/Button'
    alias: {
      '@': resolve('/src'), // @ 代表 src 目录
      '@components': resolve('/src/components'), // 组件目录
      '@hooks': resolve('/src/hooks'), // React Hooks 目录
      '@pages': resolve('/src/pages'), // 页面目录
      '@layouts': resolve('/src/layouts'), // 布局目录
      '@routes': resolve('/src/routes'), // 路由配置目录
      '@assets': resolve('/src/assets'), // 静态资源目录
      '@states': resolve('/src/states'), // 状态管理目录
      '@services': resolve('/src/services'), // API 服务目录
      '@utils': resolve('/src/utils'), // 工具函数目录
      '@lib': resolve('/src/lib'), // 库文件目录
      '@constants': resolve('/src/constants'), // 常量定义目录
      '@connections': resolve('/src/connections'), // 连接配置目录
      '@stores': resolve('/src/stores'), // Jotai store 目录
      '@abis': resolve('/src/abis'), // 智能合约 ABI 目录
      '@types': resolve('/src/types'), // TypeScript 类型定义目录
    },

    // extensions: 自动解析这些扩展名，导入时可以省略扩展名
    // 例如: import Button from '@components/Button'
    // webpack 会自动尝试 .js, .ts, .tsx, .jsx, .css
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.css'],
  },

  // ---------- 3.6 插件配置 ----------
  plugins: [
    new ThemedProgressPlugin(),
    // MiniCssExtractPlugin: 将 CSS 提取到单独的文件中
    new MiniCssExtractPlugin({
      // filename: 提取出的 CSS 文件名
      // 生产模式: styles/[name].[contenthash].css（带哈希，利于缓存）
      // 开发模式: styles/[name].css（不带哈希，方便调试）
      filename: _modeflag ? 'styles/[name].[contenthash].css' : 'styles/[name].css',

      // chunkFilename: 异步加载的 CSS 块的文件名
      chunkFilename: _modeflag ? 'styles/[name].[contenthash].css' : 'styles/[name].css',

      // ignoreOrder: false 表示保持 CSS 的导入顺序（避免样式覆盖问题）
      ignoreOrder: false,
    }),
  ],
};

// ========== 4. 合并配置并导出 ==========

// 将基础配置和环境特定配置合并后导出
// 例如: 基础配置 + 开发环境配置 = 完整的开发环境 webpack 配置
module.exports = merge.default(webpackBaseConfig, _mergeConfig);

/**
 * ==========================================
 * 使用说明
 * ==========================================
 *
 * 开发模式构建:
 *   yarn client:dev
 *
 * 生产模式构建:
 *   yarn client:prod
 *
 * 开发服务器:
 *   yarn client:server
 *
 * ==========================================
 */
