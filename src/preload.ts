// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('api', {
  getTodoList: (...args) => ipcRenderer.invoke('api:getTodoList', ...args),
  createTodo: (...args) => ipcRenderer.invoke('api:createTodo', ...args)
});
