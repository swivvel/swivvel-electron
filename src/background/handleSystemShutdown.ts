import { powerMonitor } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { quitApp } from './utils';

/**
 * Make sure the app quits when the OS shuts down.
 */
export default (state: State): void => {
  powerMonitor.on(`shutdown`, () => {
    log.info(`System shutdown detected`);
    quitApp(state);
  });
};
