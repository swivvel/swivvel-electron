/* eslint-env browser */

const { contextBridge } = require(`electron`);

const isLinux = process.platform === `linux`;

contextBridge.exposeInMainWorld(`electron`, {
  isLinux,
});
