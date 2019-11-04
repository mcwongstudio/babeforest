const webpack = require('webpack');

const baseConfig = require('./webpack.base');

const config = require('./config');

module.exports = Object.assign({}, baseConfig, {
  entry: [
    'react-hot-loader/patch',
    ...baseConfig.entry,
  ],

  output: {
    path: config.distPath,
    publicPath: '/',
    filename: 'js/app.js',
  },

  module: {
    rules: [
      ...baseConfig.module.rules,

      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
      },

      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              module: true,
              camelCase: true,
              localIdentName: '[name]__[local]-[hash:base64:5]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: [/src/],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              camelCase: true,
            },
          },
        ],
      },

      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader',
        ],
      },

      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
        }],
      },
    ],
  },

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    // contentBase: ['/', 'public', 'node_modules'],
    disableHostCheck: true,
    historyApiFallback: true,
    // host: '10.10.10.112',
    stats: {
      assets: false,
      chunks: false,
      hash: false,
      version: false,
    },
    proxy: {
      '/reqxml': {
        target: config.proxyPath,
        changeOrigin: true,
        secure: false,
      },
      '/reqreadfile': {
        target: config.proxyPath,
        changeOrigin: true,
        secure: false,
      },
      '/reqsavefile': {
        target: config.proxyPath,
        changeOrigin: true,
        secure: false,
      },
      '/reqlocal': {
        target: config.proxyPath,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),

    ...baseConfig.plugins,
  ],
});
