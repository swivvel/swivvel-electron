import { BrowserWindow } from 'electron';

import { State } from '../../types';
import { store } from '../../utils';
import { Log } from '../utils';

export default (window: BrowserWindow, state: State, log: Log): void => {
  log(`Configuring window close handler...`);

  // The transparent window should never be destroyed until the app quits
  window.on(`close`, (event) => {
    log(`Window close event received`);

    if (window.isDestroyed()) {
      log(`Window destroyed, not closing`);
    } else if (!state.allowQuit) {
      log(`allowQuit=false, preventing window from closing`);
      event.preventDefault();
      if (store.get(`windowedMode`)) {
        log(`In windowed mode; minimizing`);
        window.minimize();
      }
    } else {
      log(`Closing window...`);
    }
  });
};
