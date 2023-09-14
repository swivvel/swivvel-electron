import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../../types';

export default (transparentWindow: BrowserWindow, state: State): void => {
  log.info(`Configuring window close handler...`);

  // The transparent window should never be destroyed until the app quits
  transparentWindow.on(`close`, (event) => {
    log.info(`Transparent window close event received`);

    if (transparentWindow.isDestroyed()) {
      log.info(`Transparent window destroyed, not closing`);
    } else if (!state.allowQuit) {
      log.info(`allowQuit=false, preventing transparent window from closing`);
      event.preventDefault();
      transparentWindow.hide();
    } else {
      log.info(`Closing transparent window...`);
    }
  });
};
