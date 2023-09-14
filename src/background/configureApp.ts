import { app } from 'electron';
import log from 'electron-log';

import { isLinux, isProduction } from '../utils';

/**
 * Configure the global app settings.
 */
export default (): void => {
  log.info(`Configuring app...`);

  // Electron stores everything related to the app (cache, local storage,
  // databases, logs, etc.) in a directory in the user's home directory.
  // Prevent dev from colliding with prod by adding a suffix.
  if (!isProduction()) {
    app.setPath(`userData`, `${app.getPath(`userData`)}-development`);
  }

  log.info(`User Data: ${app.getPath(`userData`)}`);

  // Transparent windows don't work in Linux without these settings
  // See: https://github.com/electron/electron/issues/15947
  if (isLinux()) {
    app.commandLine.appendSwitch(`enable-transparent-visuals`);
    app.commandLine.appendSwitch(`disable-gpu`);
    app.disableHardwareAcceleration();
  }

  // Configure the app to open automatically when the user logs in to their OS
  log.info(`Configuring app to open at login...`);
  app.setLoginItemSettings({ openAtLogin: true });

  log.info(`Configured app`);
};
