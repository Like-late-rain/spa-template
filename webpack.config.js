const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
const merge = require('webpack-merge');
const argv = require('yargs-parser')(process.argv.slice(2));

const _mode = argv.mode || 'development';
const _modeflag = _mode === 'production' ? true : false;
const _mergeConfig = require(`./config/webpack.${_mode}.js`);

const webpackBaseConfig = {
  entry: resolve('/src/index.tsx'),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': resolve('/src'),
      '@components': resolve('/src/components'),
      '@hooks': resolve('/src/hooks'),
      '@pages': resolve('/src/pages'),
      '@layouts': resolve('/src/layouts'),
      '@routes': resolve('/src/routes'),
      '@assets': resolve('/src/assets'),
      '@states': resolve('/src/states'),
      '@services': resolve('/src/services'),
      '@utils': resolve('/src/utils'),
      '@lib': resolve('/src/lib'),
      '@constants': resolve('/src/constants'),
      '@connections': resolve('/src/connections'),
      '@store': resolve('/src/store'),
      '@abis': resolve('/src/abis'),
      '@types': resolve('/src/types'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.css'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: _modeflag ? 'styles/[name].[contenthash].css' : 'styles/[name].css',
      chunkFilename: _modeflag ? 'styles/[name].[contenthash].css' : 'styles/[name].css',
      ignoreOrder: false, // 启用以删除有关冲突顺序的警告
    }),
  ],
};

module.exports = merge.default(webpackBaseConfig, _mergeConfig);
