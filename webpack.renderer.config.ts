import path from 'path';
import type {Configuration} from 'webpack';

import {plugins} from './webpack.plugins';
import {rules} from './webpack.rules';

rules.push({
  test: /\.css$/,
  use: [{loader: 'style-loader'}, {loader: 'css-loader'}]
});

rules.push({
  test: /\.less$/i,
  use: ['style-loader', 'css-loader', 'less-loader']
});

export const rendererConfig: Configuration = {
  module: {
    rules
  },
  plugins,
  resolve: {
    alias: {
      src: path.join(__dirname, 'src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  }
};
