'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const electron_1 = require('electron');
const electron_log_1 = __importDefault(require('electron-log'));
const utils_1 = require('./utils');
/**
 * Configure the global app settings.
 */
exports.default = (state) => {
  electron_log_1.default.info(`Configuring app...`);
  // Electron stores everything related to the app (cache, local storage,
  // databases, logs, etc.) in a directory in the user's home directory.
  // Prevent dev from colliding with prod by adding a suffix.
  if (!(0, utils_1.isProduction)()) {
    electron_1.app.setPath(
      `userData`,
      `${electron_1.app.getPath(`userData`)}-development`
    );
  }
  // Transparent windows don't work in Linux without these settings
  // See: https://github.com/electron/electron/issues/15947
  if ((0, utils_1.isLinux)()) {
    electron_1.app.commandLine.appendSwitch(`enable-transparent-visuals`);
    electron_1.app.commandLine.appendSwitch(`disable-gpu`);
    electron_1.app.disableHardwareAcceleration();
  }
  // Configure the app to open automatically when the user logs in to their OS
  electron_1.app.setLoginItemSettings({ openAtLogin: true });
  electron_1.app.on(`window-all-closed`, () => {
    if (state.allowQuit) {
      electron_1.app.quit();
    }
  });
  // Make sure the app closes if someone clicks "Quit" from the OS top bar
  // or from the app icon in the dock
  electron_1.app.on(`before-quit`, () => {
    (0, utils_1.prepareToQuitApp)(state);
  });
  electron_log_1.default.info(`Configured app`);
};
