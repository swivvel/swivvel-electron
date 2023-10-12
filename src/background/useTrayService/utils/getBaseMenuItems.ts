import fs from 'fs';

import * as Sentry from '@sentry/electron/main';
import { MenuItemConstructorOptions } from 'electron';
import log from 'electron-log';

import { State } from '../../types';
import { isLinux, isProduction, quitApp } from '../../utils';

export default (state: State): Array<MenuItemConstructorOptions> => {
  const menuItems: Array<MenuItemConstructorOptions> = [];

  // It is highly unlikely that we will have any real Linux users and there is
  // currently no way to open the dev tools for the transparent window on prod,
  // so for now we're allowing the dev tools menu item to show in production
  // for Linux users.
  if (!isProduction() || isLinux()) {
    menuItems.push({
      label: `Dev Tools`,
      type: `normal`,
      click: (): void => {
        state.windows.transparent?.webContents.openDevTools({
          mode: `undocked`,
        });
      },
    });
  }

  menuItems.push({
    label: `Send Bug Report`,
    type: `normal`,
    click: (): void => {
      log.info(`Detected click on Send Bug Report menu item`);

      const logFilePath = log.transports.file.getFile().path;
      log.info(`logFilePath=${logFilePath}`);

      log.info(`Reading log file...`);
      const logFileContents = fs.readFileSync(logFilePath).toString();

      Sentry.configureScope((scope) => {
        log.info(`Sending log file via Sentry...`);
        scope.addAttachment({ filename: `main.log`, data: logFileContents });
        Sentry.captureException(new Error(`Manual bug report`));
        log.info(`Sent log file via Sentry`);
      });
    },
  });

  menuItems.push({
    label: `Quit Swivvel`,
    type: `normal`,
    click: (): void => {
      quitApp(state);
    },
  });

  return menuItems;
};
