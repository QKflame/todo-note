import type {Configuration} from 'webpack';

import {rules} from './webpack.rules';
import {plugins} from './webpack.plugins';
import path from 'path';

rules.push({
  test: /\.css$/,
  use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      'src': path.join(__dirname, 'src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
