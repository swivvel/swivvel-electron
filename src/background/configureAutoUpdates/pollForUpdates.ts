import { autoUpdater } from 'electron-updater';
import ms from 'ms';

/**
 * Check if there are any updates available for the app. If so, download
 * the update and send an OS notification informing the user that a new
 * version is available and can be installed by restarting the app.
 */
export default async (): Promise<NodeJS.Timeout> => {
  // It is very common for the auto-updater to encounter an error when checking
  // for updates. It turns out that end users tend to have lots of sporadic
  // network issues which can cause problems for an app that is always running.
  // Examples of network errors we have seen include ERR_NETWORK_IO_SUSPENDED
  // (which happens when the user's machine goes to sleep), ERR_NETWORK_CHANGED
  // (which happens when the user's network settings have changed), and
  // ERR_INTERNET_DISCONNECTED (which happens when the user's network is
  // disconnected).
  //
  // Most (possibly all) of these errors are outside of our control. As such,
  // there is no need to send an error report. Each error is already logged
  // by the auto-updater, so we can safely ignore them.

  try {
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    // Ignore errors (see comment above)
  }

  return setInterval(
    async () => {
      try {
        await autoUpdater.checkForUpdatesAndNotify();
      } catch (err) {
        // Ignore errors (see comment above)
      }
    },
    // Some users have experienced issues when `checkForUpdatesAndNotify()` is
    // called while an update is already being downloaded. To avoid this, we
    // use a fairly long interval between checks for updates. A long interval
    // also reduces the number of network requests the user's machine does, and
    // it reduces noise in the logs.
    ms(`30 minutes`)
  );
};
