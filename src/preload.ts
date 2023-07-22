// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';

import {apiDefinitions} from './apis/api.definition';

type InvokeFunctionType = (...args: any) => void;

contextBridge.exposeInMainWorld(
  'api',
  apiDefinitions.reduce(
    (accumulator: { [key: string]: InvokeFunctionType }, key: string) => {
      return {
        ...accumulator,
        [key]: (...args) => ipcRenderer.invoke(`api:${key}`, ...args)
      };
    },
    {}
  )
);
