import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { Log } from '../utils';

export default (window: BrowserWindow, state: State, log: Log): void => {
  log(`Configuring window close handler...`);

  if (window.isDestroyed()) {
    return;
  }

  window.on(`close`, () => {
    log(`Window close event received`);
    log(`Closing window...`);
    state.windows.googleMeet = null;
  });
};
