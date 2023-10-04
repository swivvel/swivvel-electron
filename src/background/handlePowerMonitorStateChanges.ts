import { powerMonitor } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { quitApp } from './utils';

export default (state: State): void => {
  powerMonitor.on(`resume`, () => {
    log.info(`!!!!!!!!!!!!! RESUME !!!!!!!!!!!!!`);
  });

  // Without this, Macs would hang when trying to shut down because the
  // Swivvel app would never quit
  powerMonitor.on(`shutdown`, () => {
    log.info(`System shutdown detected`);
    quitApp(state);
  });
};
