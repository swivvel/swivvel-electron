import { BrowserWindow, powerMonitor } from 'electron';
import log from 'electron-log';

/**
 * Tell the web app when the user is idle.
 */
export default (transparentWindow: BrowserWindow): void => {
  log.info(`Configuring idle time polling...`);

  let isIdle: boolean | null = null;

  const interval = setInterval(async () => {
    if (transparentWindow.isDestroyed()) {
      clearInterval(interval);
      return;
    }

    const newIsIdle = powerMonitor.getSystemIdleTime() > 30;

    if (newIsIdle !== isIdle) {
      isIdle = newIsIdle;
      transparentWindow.webContents.send(`isIdle`, isIdle);
    }
  }, 1000);

  log.info(`Configured idle time polling`);
};
