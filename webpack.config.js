// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js', // main file
  output: {
    filename: 'main.js', // output bundle name
    path: path.resolve(__dirname, 'dist'), // output folder
  },
  mode: 'development', // or 'production'
};
