import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../../types';

export default (logInWindow: BrowserWindow, state: State): void => {
  log.info(`Configuring window close handler...`);

  logInWindow.on(`close`, () => {
    log.info(`Create Google Meet window close event received`);
    log.info(`Closing Create Google Meet window...`);

    state.windows.createGoogleMeet = null;
  });
};
