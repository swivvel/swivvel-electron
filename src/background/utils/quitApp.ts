import { app, autoUpdater } from 'electron';
import log from 'electron-log';

import { State } from '../types';

import prepareToQuitApp from './prepareToQuitApp';

export default (state: State, options?: { quitAndInstall: boolean }): void => {
  prepareToQuitApp(state);

  const quitAndInstall = Boolean(options && options.quitAndInstall);

  if (quitAndInstall) {
    log.info(`Quitting app and installing updates`);
    log.info(process.platform);
    autoUpdater.quitAndInstall();
  } else {
    log.info(`Quitting app`);
    app.quit();
  }

  log.info(`App closed`);
};
