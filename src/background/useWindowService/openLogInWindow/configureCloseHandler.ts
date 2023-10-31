import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { Log } from '../utils';

export default (window: BrowserWindow, state: State, log: Log): void => {
  log(`Configuring window close handler...`);

  // Don't allow the user to close the log in window - they can open it again
  // from the tray icon menu
  window.on(`close`, (event) => {
    log(`Window close event received`);

    if (window.isDestroyed()) {
      log(`Window destroyed, not closing`);
    } else if (!state.allowQuit) {
      log(`allowQuit=false, preventing window from closing`);
      event.preventDefault();
      window.hide();
    } else {
      log(`Closing window...`);
    }
  });
};
