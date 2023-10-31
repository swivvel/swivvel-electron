import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { State } from '../types';
import { quitApp } from '../utils';

import pollForUpdates from './pollForUpdates';

/**
 * Configure automatic updates of the app.
 */
export default async (state: State): Promise<void> => {
  log.info(`Configuring automatic updates...`);

  let checkForUpdatesInterval: NodeJS.Timeout | null = null;

  autoUpdater.logger = log;

  autoUpdater.on(`update-available`, () => {
    log.info(`Update available`);
  });

  autoUpdater.on(`error`, (err) => {
    log.info(`Error in auto-updater: ${err}`);
  });

  autoUpdater.on(`download-progress`, (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
    log.info(logMessage);
  });

  autoUpdater.on(`update-downloaded`, () => {
    log.info(`Update downloaded`);

    if (checkForUpdatesInterval) {
      clearInterval(checkForUpdatesInterval);
    }

    const now = new Date();

    const midnight = new Date(now);
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);

    const msUntilMidnight = midnight.getTime() - now.getTime();

    log.info(`Scheduling app relaunch for ${midnight.toISOString()}...`);

    setTimeout(() => {
      log.info(`Installing new version and relaunching app...`);
      // See: https://github.com/electron-userland/electron-builder/issues/1604
      setImmediate(() => {
        quitApp(state, { quitAndInstall: true });
      });
    }, msUntilMidnight);
  });

  checkForUpdatesInterval = await pollForUpdates();

  log.info(`Configured automatic updates`);
};
