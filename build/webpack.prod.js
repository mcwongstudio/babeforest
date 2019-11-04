const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.base');
const config = require('./config');

const arr = process.env.NODE_ENV === 'test' ? [] : [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  }),
];

module.exports = Object.assign({}, baseConfig, {
  output: {
    path: config.distPath,
    filename: 'js/app.[chunkhash].js',
  },

  module: {
    rules: [
      ...baseConfig.module.rules,

      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?minimize&importLoaders=1&module&camelCase&localIdentName=[hash:base64:5]',
            'postcss-loader',
          ],
          publicPath: '../',
        }),
      },

      {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          publicPath: '../',
        }),
      },
    ],
  },
  // devtool: 'source-map',

  plugins: [
    ...baseConfig.plugins,

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),

    ...arr,

    new ExtractTextPlugin('css/app.[contenthash].css'),
    new BundleAnalyzerPlugin(),
  ],
});
