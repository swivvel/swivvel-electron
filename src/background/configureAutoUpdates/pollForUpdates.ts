import { autoUpdater } from 'electron-updater';
import ms from 'ms';

/**
 * Check if there are any updates available for the app. If so, download
 * the update and send an OS notification informing the user that a new
 * version is available and can be installed by restarting the app.
 */
export default (): NodeJS.Timeout => {
  autoUpdater.checkForUpdatesAndNotify();

  return setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, ms(`10 minutes`));
};
