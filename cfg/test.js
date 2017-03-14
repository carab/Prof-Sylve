'use strict';

let path = require('path');
let srcPath = path.join(__dirname, '/../src/');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

module.exports = {
  devtool: 'eval',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'istanbul-instrumenter-loader',
        include: [
          path.join(__dirname, '/../src')
        ]
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, '/../src'),
          path.join(__dirname, '/../test')
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      actions: srcPath + 'actions/',
      helpers: path.join(__dirname, '/../test/helpers'),
      components: srcPath + 'components/',
      sources: srcPath + 'sources/',
      stores: srcPath + 'stores/',
      styles: srcPath + 'styles/',
      config: srcPath + 'config/' + process.env.REACT_WEBPACK_ENV
    }
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        debug: true,
        port: defaultSettings.port,
        postcss: defaultSettings.postcss
      }
    })
  ]
};
