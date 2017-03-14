'use strict';

const OfflinePlugin = require('offline-plugin');

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        port: defaultSettings.port,
        postcss: defaultSettings.postcss
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new OfflinePlugin({
      publicPath: `${defaultSettings.publicPath}`,
      relativePaths: false,
      ServiceWorker: {
        navigateFallbackURL: '/index.html'
      },
      AppCache: false
    })
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.rules.push({
  test: /\.(js|jsx)$/,
  loader: 'babel-loader',
  include: [ path.join(__dirname, '/../src') ]
});

module.exports = config;
