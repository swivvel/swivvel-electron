import { app } from 'electron';
import log from 'electron-log';

import { isLinux } from './utils';

/**
 * Configure the global app settings.
 */
export default (): void => {
  log.info(`Configuring app...`);

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
