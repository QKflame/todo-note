import {MakerDeb} from '@electron-forge/maker-deb';
import {MakerDMG} from '@electron-forge/maker-dmg';
import {MakerRpm} from '@electron-forge/maker-rpm';
import {MakerSquirrel} from '@electron-forge/maker-squirrel';
// import {MakerZIP} from '@electron-forge/maker-zip';
import {WebpackPlugin} from '@electron-forge/plugin-webpack';
import type {ForgeConfig} from '@electron-forge/shared-types';
import path from 'path';

import {mainConfig} from './webpack.main.config';
import {rendererConfig} from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    icon: path.join(__dirname, './src/assets/logo')
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerDMG({}),
    // new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({})
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts'
            }
          }
        ]
      }
    })
  ]
};

export default config;
