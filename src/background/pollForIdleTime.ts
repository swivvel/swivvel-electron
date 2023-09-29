import { BrowserWindow, powerMonitor } from 'electron';
import log from 'electron-log';

// Consider the user to be idle after this number of seconds
const IDLE_THRESHOLD_SECONDS = 30;

/**
 * Tell the web app when the user is idle.
 */
export default (transparentWindow: BrowserWindow): void => {
  log.info(`Configuring idle time polling...`);

  let isIdle: boolean | null = null;

  const interval = setInterval(async () => {
    if (transparentWindow.isDestroyed()) {
      log.info(`Transparent window destroyed; stopping idle time polling`);
      clearInterval(interval);
      return;
    }

    const newIsIdle = powerMonitor.getSystemIdleTime() > IDLE_THRESHOLD_SECONDS;

    if (newIsIdle !== isIdle) {
      log.info(`Idle changed: ${isIdle} -> ${newIsIdle}`);
      isIdle = newIsIdle;
      transparentWindow.webContents.send(`isIdle`, isIdle);
    }
  }, 1000);

  log.info(`Configured idle time polling`);
};
