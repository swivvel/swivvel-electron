'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const electron_updater_1 = require('electron-updater');
exports.default = () => {
  electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
  return setInterval(() => {
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
  }, 1000 * 60);
};
