import { powerMonitor } from 'electron';
import log from 'electron-log';

import { State } from './types';

// Consider the user to be idle after this number of seconds
const IDLE_THRESHOLD_SECONDS = 30;

/**
 * Tell the web app when the user is idle.
 */
export default (state: State): void => {
  log.info(`Configuring idle time polling...`);

  let isIdle: boolean | null = null;

  setInterval(async () => {
    const newIsIdle = powerMonitor.getSystemIdleTime() > IDLE_THRESHOLD_SECONDS;

    if (newIsIdle !== isIdle) {
      log.info(`Idle changed: ${isIdle} -> ${newIsIdle}`);
      isIdle = newIsIdle;

      if (!state.windows.transparent) {
        log.info(`Failed to report idle change: no transparent window`);
      } else if (state.windows.transparent.isDestroyed()) {
        log.info(`Failed to report idle change: transparent window destroyed`);
      } else {
        state.windows.transparent.webContents.send(`isIdle`, isIdle);
      }
    }
  }, 1000);

  log.info(`Configured idle time polling`);
};
