const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config');

module.exports = {
  entry: [
    'babel-polyfill',
    'url-search-params-polyfill',
    'normalize.css',
    config.srcPath,
  ],

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: config.srcPath,
      },

      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: config.srcPath,
      },

      {
        test: /\.(ico|jpg|jpeg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[hash:6].[ext]',
        },
      },
    ],
  },

  resolve: {
    modules: [
      config.srcPath,
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: config.templatePath,
    }),
  ],

};
