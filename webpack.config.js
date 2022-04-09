const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyLogPlugin = require('./plugins')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: path.resolve('src/main.js'),
  },
  output: {
    path: path.resolve('dist'),
    filename: devMode ? 'static/js/[name].js' : 'static/js/[name].[contenthash:8].js',
    clean: true,
  },
  // 统计信息，资源、模块等信息的日志级别，可选'verbose'|'normal'|'minimal'|'errors-warnings'|'errors-only'|'none'等。
  stats: {
    preset: 'none',
    errors: true,
    warnings: true,
  },
  // 基础设施的日志，即webpack-dev-server的日志。
  infrastructureLogging: {
    // 日志级别，是devServer.client.logging的默认值，可选'verbose'|'log'|'info'|'warn'(错误和警告)|'error'|'none'。
    level: 'warn',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
        include: [path.resolve('src')],
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/i,
        type: 'asset',
        include: [path.resolve('src/assets')],
        parser: {
          dataUrlCondition: {
            maxSize: 0,
          },
        },
        generator: {
          filename: 'static/img/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset',
        include: [path.resolve('src/assets')],
        generator: {
          filename: devMode
            ? 'static/fonts/[name][ext]'
            : 'static/fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new FriendlyLogPlugin(),
    new HtmlWebpackPlugin({
      title: 'Friendly Log Webpack Plugin',
      template: path.resolve('public/index.html'),
      scriptLoading: 'blocking',
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('public'),
          to: path.resolve('dist'),
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
}
