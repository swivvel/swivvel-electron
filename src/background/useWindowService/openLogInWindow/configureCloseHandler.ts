import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../../types';

export default (logInWindow: BrowserWindow, state: State): void => {
  log.info(`Configuring window close handler...`);

  // Don't allow the user to close the log in window - they can open it again
  // from the tray icon menu
  logInWindow.on(`close`, (event) => {
    log.info(`Log in window close event received`);

    if (logInWindow.isDestroyed()) {
      log.info(`Log in window destroyed, not closing`);
    } else if (!state.allowQuit) {
      log.info(`allowQuit=false, preventing log in window from closing`);
      event.preventDefault();
      logInWindow.hide();
    } else {
      log.info(`Closing log in window...`);
    }
  });
};
