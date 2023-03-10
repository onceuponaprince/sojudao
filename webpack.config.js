const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const devConfig = require('./webpack.dev.js')
const prodConfig = require('./webpack.prod.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = ({ mode } = { mode: 'development' }) => {
  console.log(`mode is: ${mode}`)
  const dev = mode !== 'production'
  const mergeConfig = dev ? devConfig : prodConfig
  const config = merge(mergeConfig, {
    mode: mode,
    entry: {
      main: path.resolve(__dirname, './src/js/index.js')
    },
    output: {
      filename: dev ? 'static/js/[name]_[hash:7].js' : 'static/js/[name].js',
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
      assetModuleFilename: 'assets/[hash][ext][query]'
    },
    module: {
      rules: [
        {
          test: /\.mp4$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'static/videos/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
          type: 'asset/resource',
        },
        {
          test: /\.txt(\?v=\d+\.\d+\.\d+)?$/i,
          type: 'asset/source',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            dev ? {
              loader: "style-loader"
            } : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: './'
              },
            },
            {
              loader: 'css-loader'
            }, 
            {
              loader: 'sass-loader',
              options: {
                implementation: require("sass"),
                sourceMap: true,
                sassOptions: {
                  includePaths: [path.resolve(__dirname, './node_modules'), path.resolve(__dirname, './dist/static')]
                }
              },
            },
          ]
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        title: "SojuDAO - Korea's First social DAO",
        template: 'index.html',
        inject: 'body'
      }),
    ]
  });
  return config
}