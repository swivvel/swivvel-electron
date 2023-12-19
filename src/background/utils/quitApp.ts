import { RelaunchOptions, app } from 'electron';
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
    if (app.isPackaged && process.env.APPIMAGE) {
      log.info(`Using AppImage workaround to relaunch app`);
      const relaunchOptions: RelaunchOptions = {
        args: process.argv,
        execPath: process.env.APPIMAGE,
      };
      relaunchOptions.args?.unshift(`--appimage-extract-and-run`);
      log.info(`Relaunch options: ${JSON.stringify(relaunchOptions)}`);
      app.relaunch(relaunchOptions);
      app.exit(0);
      return;
    }
    app.relaunch();
    app.quit();
  } else {
    log.info(`Quitting app`);
    app.quit();
  }

  log.info(`App closed`);
};
