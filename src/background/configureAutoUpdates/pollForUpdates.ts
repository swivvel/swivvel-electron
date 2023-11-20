import { autoUpdater } from 'electron-updater';
import ms from 'ms';

/**
 * Check if there are any updates available for the app. If so, download
 * the update and send an OS notification informing the user that a new
 * version is available and can be installed by restarting the app.
 */
export default async (): Promise<NodeJS.Timeout> => {
  // We used to set `autoDownload=true`, but we ran into a bug where calling
  // `autoUpdater.checkForUpdatesAndNotify()` would fail to `await` somewhere
  // inside of the `electron-updater` code. This made it impossible to try/catch
  // any errors that occurred during the update check. Setting `autoDownload`
  // to `false` and manually calling `autoUpdater.downloadUpdate()` resolved
  // this issue and allowed us to try/catch auto-update errors so that we can
  // prevent them from reaching Sentry.
  autoUpdater.autoDownload = false;

  const checkForAndDownloadUpdates = async (): Promise<void> => {
    try {
      const result = await autoUpdater.checkForUpdates();

      if (result?.cancellationToken) {
        await autoUpdater.downloadUpdate(result.cancellationToken);
      }
    } catch (err) {
      // It is very common for the auto-updater to encounter an error when
      // checking for updates. It turns out that end users tend to have lots of
      // sporadic network issues which can cause problems for an app that is
      // always running. Examples of network errors we have seen include
      // ERR_NETWORK_IO_SUSPENDED (which happens when the user's machine goes
      // to sleep), ERR_NETWORK_CHANGED (which happens when the user's network
      // settings have changed), and ERR_INTERNET_DISCONNECTED (which happens
      // when the user's network is disconnected).
      //
      // Most of these errors are outside of our control, so we are willing to
      // swallow the error without sending an alert to Sentry. Some errors, such
      // as missing files in our release, are actionable, but would likely be
      // caught by someone on the team because we would notice that we're not
      // getting updated to the latest version. Also, even though the errors
      // aren't sent to Sentry, they are still logged, so we would be bound to
      // see the error at some point when reviewing log files.
    }
  };

  await checkForAndDownloadUpdates();

  return setInterval(
    async () => {
      await checkForAndDownloadUpdates();
    },
    // Some users have experienced issues when `checkForUpdatesAndNotify()` is
    // called while an update is already being downloaded. To avoid this, we
    // use a fairly long interval between checks for updates. A long interval
    // also reduces the number of network requests the user's machine does, and
    // it reduces noise in the logs.
    ms(`30 minutes`)
  );
};
