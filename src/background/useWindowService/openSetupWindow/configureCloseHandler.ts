import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../../types';

export default (setupWindow: BrowserWindow, state: State): void => {
  log.info(`Configuring window close handler...`);

  // Don't allow the user to close the setup window - they can open it again
  // from the tray icon menu
  setupWindow.on(`close`, (event) => {
    log.info(`Setup window close event received`);

    if (setupWindow.isDestroyed()) {
      log.info(`Setup window destroyed, not closing`);
    } else if (!state.allowQuit) {
      log.info(`allowQuit=false, preventing setup window from closing`);
      event.preventDefault();
      setupWindow.hide();
    } else {
      log.info(`Closing setup window...`);
    }
  });
};
