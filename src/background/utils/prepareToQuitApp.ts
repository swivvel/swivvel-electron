import { BrowserWindow, app } from 'electron';
import log from 'electron-log';

import { State } from '../types';

/**
 * Perform the necessary steps to quit the app.
 */
export default (state: State): void => {
  log.info(`Preparing to quit app...`);

  state.allowQuit = true;

  app.removeAllListeners(`window-all-closed`);

  Object.values(state).forEach((stateValue) => {
    if (stateValue && stateValue instanceof BrowserWindow) {
      stateValue.removeAllListeners(`close`);
    }
  });

  // `close()` wasn't successfully closing the app on Mac so we're
  // using `destroy()` instead
  log.info(`Closing windows...`);

  Object.values(state).forEach((stateValue) => {
    if (stateValue && stateValue instanceof BrowserWindow) {
      stateValue.destroy();
    }
  });
};
