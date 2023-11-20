import * as Sentry from '@sentry/electron/main';
import { autoUpdater } from 'electron-updater';
import ms from 'ms';

/**
 * Check if there are any updates available for the app. If so, download
 * the update and send an OS notification informing the user that a new
 * version is available and can be installed by restarting the app.
 */
export default async (): Promise<NodeJS.Timeout> => {
  const checkForUpdatesAndNotify = async (): Promise<void> => {
    Sentry.withScope(async (scope) => {
      // Tag the error so we can ignore it before sending to Sentry. There's a
      // bug where `checkForUpdatesAndNotify()` still throws an error even if
      // it's wrapped in a try/catch, so we have to filter the error manually.
      // See: https://github.com/electron-userland/electron-builder/issues/2451
      scope.setTag(`autoUpdateError`, true);
      await autoUpdater.checkForUpdatesAndNotify();
    });
  };

  await checkForUpdatesAndNotify();

  return setInterval(
    async () => {
      await checkForUpdatesAndNotify();
    },
    // Some users have experienced issues when `checkForUpdatesAndNotify()` is
    // called while an update is already being downloaded. To avoid this, we
    // use a fairly long interval between checks for updates. A long interval
    // also reduces the number of network requests the user's machine does, and
    // it reduces noise in the logs.
    ms(`30 minutes`)
  );
};
