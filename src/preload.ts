// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('api', {
  getTodoList: (...args) => ipcRenderer.invoke('api:getTodoList', ...args),
  createTodo: (...args) => ipcRenderer.invoke('api:createTodo', ...args),
  updateTodoPriority: (...args) =>
    ipcRenderer.invoke('api:updateTodoPriority', ...args),
  updateTodoProgress: (...args) =>
    ipcRenderer.invoke('api:updateTodoProgress', ...args),
  updateTodoDeadline: (...args) =>
    ipcRenderer.invoke('api:updateTodoDeadline', ...args),
  getTodoDetail: (...args) => ipcRenderer.invoke('api:getTodoDetail', ...args),
  updateTodoDetail: (...args) =>
    ipcRenderer.invoke('api:updateTodoDetail', ...args),
  batchFinishTodo: (...args) =>
    ipcRenderer.invoke('api:batchFinishTodo', ...args),
  batchDeleteTodo: (...args) =>
    ipcRenderer.invoke('api:batchDeleteTodo', ...args),
  createTodoGroup: (...args) =>
    ipcRenderer.invoke('api:createTodoGroup', ...args),
  updateTodoGroup: (...args) =>
    ipcRenderer.invoke('api:updateTodoGroup', ...args),
  deleteTodoGroup: (...args) =>
    ipcRenderer.invoke('api:deleteTodoGroup', ...args),
  getTodoGroupList: (...args) =>
    ipcRenderer.invoke('api:getTodoGroupList', ...args),
  batchRecoverTodo: (...args) =>
    ipcRenderer.invoke('api:batchRecoverTodo', ...args),
  batchRemoveGroup: (...args) =>
    ipcRenderer.invoke('api:batchRemoveGroup', ...args)
});
