import {app, BrowserWindow, ipcMain, shell} from 'electron';
import fs from 'fs';
import path from 'path';
import * as noteApis from 'src/apis/note.api';
import * as todoApis from 'src/apis/todo.api';
import Database = require('better-sqlite3');
import {DatabaseUpgrade} from './database/upgrade';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.join(__dirname, './assets/logo.ico'),
    webPreferences: {
      devTools: process.env.NODE_ENV === 'development',
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault(); // 阻止默认导航行为
    shell.openExternal(url); // 使用默认浏览器打开链接
  });

  mainWindow.maximize();

  mainWindow.webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    return {action: 'deny'};
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

app.on('ready', async () => {
  // 获取用户数据目录路径
  const userDataPath = app.getPath('userData');

  // 创建保存数据库文件的目录
  const dbDirectory = path.join(userDataPath, 'databases');
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory);
  }

  // 构造数据库文件路径
  const dbFilePath = path.join(dbDirectory, 'database.db');

  // 连接 sqlite 数据库
  const db = new Database(dbFilePath);

  // 进行数据库初始化
  new DatabaseUpgrade(db).exec();

  // 对 API 接口进行一层封装
  const apiWrapper = (fn) => {
    return (...args) => {
      args.unshift(db);
      return fn.apply(this, args);
    };
  };

  // 在主进程中使用 ipcMain.handle 监听 api 调用事件
  [todoApis, noteApis].forEach((item) => {
    Object.keys(item).forEach((key) => {
      ipcMain.handle(`api:${key}`, apiWrapper(item[key]));
    });
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
