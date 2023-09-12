'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const electron_log_1 = __importDefault(require('electron-log'));
const electron_updater_1 = require('electron-updater');
const utils_1 = require('../utils');
const pollForUpdates_1 = __importDefault(require('./pollForUpdates'));
exports.default = (state) => {
  electron_log_1.default.info(`Configuring automatic updates...`);
  let checkForUpdatesInterval = null;
  electron_updater_1.autoUpdater.logger = electron_log_1.default;
  electron_updater_1.autoUpdater.on(`update-available`, () => {
    electron_log_1.default.info(`Update available`);
  });
  electron_updater_1.autoUpdater.on(`update-not-available`, () => {
    electron_log_1.default.info(`Update not available`);
  });
  electron_updater_1.autoUpdater.on(`error`, (err) => {
    electron_log_1.default.info(`Error in auto-updater: ${err}`);
  });
  electron_updater_1.autoUpdater.on(`download-progress`, (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
    electron_log_1.default.info(logMessage);
  });
  electron_updater_1.autoUpdater.on(`update-downloaded`, () => {
    electron_log_1.default.info(`Update downloaded`);
    if (checkForUpdatesInterval) {
      clearInterval(checkForUpdatesInterval);
    }
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    const msUntilMidnight = midnight.getTime() - now.getTime();
    electron_log_1.default.info(
      `Scheduling app relaunch for ${midnight.toISOString()}...`
    );
    setTimeout(() => {
      electron_log_1.default.info(
        `Installing new version and relaunching app...`
      );
      setImmediate(() => {
        (0, utils_1.quitApp)(state, { quitAndInstall: true });
      });
    }, msUntilMidnight);
  });
  checkForUpdatesInterval = (0, pollForUpdates_1.default)();
  electron_log_1.default.info(`Configured automatic updates`);
};
