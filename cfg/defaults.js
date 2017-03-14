'use strict';
const path = require('path');
const srcPath = path.join(__dirname, '/../src');
const dfltPort = 8000;
function getDefaultModules() {
  return {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: 'eslint-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader',
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded&indentedSyntax',
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded',
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader',
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader',
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192',
      },
      {
        test: /\.(mp4|ogg|svg)$/,
        loader: 'file-loader',
      },
    ],
  };
}
module.exports = {
  srcPath: srcPath,
  publicPath: '/',
  port: dfltPort,
  getDefaultModules: getDefaultModules,
  postcss: function () {
    return [
      require('postcss-cssnext')({
        browsers: ['last 2 versions', 'ie >= 8'],
      }),
    ];
  },
};
