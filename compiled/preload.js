'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const electron_1 = require('electron');
electron_1.contextBridge.exposeInMainWorld(`electron`, {
  isLinux: process.platform === `linux`,
  offIdleChange: (callback) => {
    electron_1.ipcRenderer.off(`isIdle`, callback);
  },
  onIdleChange: (callback) => {
    electron_1.ipcRenderer.on(`isIdle`, callback);
  },
});
