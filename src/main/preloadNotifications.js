const { contextBridge } = require(`electron`);

contextBridge.exposeInMainWorld(`electron`, {
  isLinux: process.platform === `linux`,
});
