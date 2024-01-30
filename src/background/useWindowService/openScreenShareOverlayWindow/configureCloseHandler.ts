import { BrowserWindow } from 'electron';

import { Log } from '../utils';

export default (window: BrowserWindow, log: Log): void => {
  log(`Configuring window close handler`);

  window.on(`close`, () => {
    log(`Close event received`);
  });
};
