import log from 'electron-log';

import { State } from '../types';
import { app } from 'electron';

/**
 * Perform the necessary steps to quit the app.
 */
export default (state: State): void => {
  log.info(`Preparing to quit app...`);

  state.allowQuit = true;

  app.removeAllListeners(`window-all-closed`);
  state.hqWindow?.removeAllListeners(`close`);
  state.setupWindow?.removeAllListeners(`close`);
  state.transparentWindow?.removeAllListeners(`close`);

  // `close()` wasn't successfully closing the app on Mac so we're
  // using `destroy()` instead
  log.info(`Closing windows...`);
  state.hqWindow?.destroy();
  state.setupWindow?.destroy();
  state.transparentWindow?.destroy();
};
