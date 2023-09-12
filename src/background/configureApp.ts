import { app } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { isLinux, isProduction } from './utils';

/**
 * Configure the global app settings.
 */
export default (state: State): void => {
  log.info(`Configuring app...`);

  // Electron stores everything related to the app (cache, local storage,
  // databases, logs, etc.) in a directory in the user's home directory.
  // Prevent dev from colliding with prod by adding a suffix.
  if (!isProduction()) {
    app.setPath(`userData`, `${app.getPath(`userData`)}-development`);
  }

  // Transparent windows don't work in Linux without these settings
  // See: https://github.com/electron/electron/issues/15947
  if (isLinux()) {
    app.commandLine.appendSwitch(`enable-transparent-visuals`);
    app.commandLine.appendSwitch(`disable-gpu`);
    app.disableHardwareAcceleration();
  }

  // Configure the app to open automatically when the user logs in to their OS
  app.setLoginItemSettings({ openAtLogin: true });

  app.on(`window-all-closed`, () => {
    if (state.allowQuit) {
      app.quit();
    }
  });

  log.info(`Configured app`);
};
