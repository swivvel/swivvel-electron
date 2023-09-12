import { BrowserWindow, powerMonitor } from 'electron';

/**
 * Tell the web app when the user is idle.
 */
export default (transparentWindow: BrowserWindow): void => {
  let isIdle = false;

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
};
