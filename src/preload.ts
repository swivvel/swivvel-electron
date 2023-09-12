import { contextBridge, ipcRenderer } from 'electron';

type IdleChangeCallback = (event: unknown, isIdle: boolean) => void;

contextBridge.exposeInMainWorld(`electron`, {
  isLinux: process.platform === `linux`,
  offIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.off(`isIdle`, callback);
  },
  onIdleChange: (callback: IdleChangeCallback) => {
    ipcRenderer.on(`isIdle`, callback);
  },
});
