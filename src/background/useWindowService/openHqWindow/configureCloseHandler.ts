import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../../types';

export default (hqWindow: BrowserWindow, state: State): void => {
  log.info(`Configuring window close handler...`);

  // Don't allow the user to close the HQ window - they can open it again
  // from the tray icon menu
  hqWindow.on(`close`, (event) => {
    log.info(`HQ window close event received`);

    if (hqWindow.isDestroyed()) {
      log.info(`HQ window destroyed, not closing`);
    } else if (!state.allowQuit) {
      log.info(`allowQuit=false, preventing HQ window from closing`);
      event.preventDefault();
      hqWindow.hide();
    } else {
      log.info(`Closing HQ window...`);
    }
  });
};
