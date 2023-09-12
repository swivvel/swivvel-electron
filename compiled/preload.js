"use strict";
/* eslint-env browser */
const { contextBridge, ipcRenderer } = require(`electron`);
const isLinux = process.platform === `linux`;
contextBridge.exposeInMainWorld(`electron`, {
    isLinux,
    offIdleChange: (callback) => {
        ipcRenderer.off(`isIdle`, callback);
    },
    onIdleChange: (callback) => {
        ipcRenderer.on(`isIdle`, callback);
    },
});
