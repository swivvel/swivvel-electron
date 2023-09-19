import { app } from 'electron';
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
      log.info(`Received 'window-all-closed' event`);
      quitApp(state);
    } else {
      log.info(`Received 'window-all-closed' event, quitting not allowed`);
    }
  });

  // Make sure the app closes if someone clicks "Quit" from the OS top bar
  // or from the app icon in the dock
  app.on(`before-quit`, () => {
    log.info(`Received 'before-quit' event`);
    prepareToQuitApp(state);
  });

  log.info(`Configured app quit handling`);
};
