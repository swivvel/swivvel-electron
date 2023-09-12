import { app, powerMonitor } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { prepareToQuitApp, quitApp } from './utils';

/**
 * Configure all handlers to make sure the user can quit the app.
 */
export default (state: State): void => {
  log.info(`Configuring app quit handling...`);

  // Make sure the app quits when all windows are closed
  app.on(`window-all-closed`, () => {
    if (state.allowQuit) {
      app.quit();
    }
  });

  // Make sure the app closes if someone clicks "Quit" from the OS top bar
  // or from the app icon in the dock
  app.on(`before-quit`, () => {
    prepareToQuitApp(state);
  });

  // Make sure the app quits when the OS shuts down
  powerMonitor.on(`shutdown`, () => {
    log.info(`System shutdown detected`);
    quitApp(state);
  });

  log.info(`Configured app quit handling`);
};
