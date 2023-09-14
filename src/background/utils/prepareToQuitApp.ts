import { app } from 'electron';
import log from 'electron-log';

import { State } from '../types';

/**
 * Perform the necessary steps to quit the app.
 */
export default (state: State): void => {
  log.info(`Preparing to quit app...`);

  state.allowQuit = true;

  app.removeAllListeners(`window-all-closed`);

  const { windows } = state;

  Object.values(windows).forEach((window) => {
    if (window && !window.isDestroyed()) {
      window.removeAllListeners(`close`);
    }
  });

  // `close()` wasn't successfully closing the app on Mac so we're
  // using `destroy()` instead
  log.info(`Closing windows...`);

  Object.values(windows).forEach((window) => {
    if (window && !window.isDestroyed()) {
      window.destroy();
    }
  });
};
