import { app } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { State } from '../types';

import prepareToQuitApp from './prepareToQuitApp';

export default (
  state: State,
  options?: { quitAndInstall?: boolean; relaunch?: boolean }
): void => {
  prepareToQuitApp(state);

  const quitAndInstall = Boolean(options && options.quitAndInstall);
  const relaunch = Boolean(options && options.relaunch);

  if (quitAndInstall) {
    log.info(`Quitting app and installing updates`);
    autoUpdater.quitAndInstall();
  } else if (relaunch) {
    log.info(`Relaunching app`);
    app.relaunch();
  } else {
    log.info(`Quitting app`);
    app.quit();
  }

  log.info(`App closed`);
};
