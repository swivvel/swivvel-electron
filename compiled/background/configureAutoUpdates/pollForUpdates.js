'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const electron_updater_1 = require('electron-updater');
/**
 * Check if there are any updates available for the app. If so, download
 * the update and send an OS notification informing the user that a new
 * version is available and can be installed by restarting the app.
 */
exports.default = () => {
  electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
  return setInterval(() => {
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
  }, 1000 * 60);
};
