import * as Sentry from '@sentry/electron/main';
import { dialog, MenuItemConstructorOptions } from 'electron';
import log from 'electron-log';
import { v4 as uuidv4 } from 'uuid';

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
      log.info(
        `Detected click on Send Bug Report menu item; sending Sentry alert`
      );
      Sentry.withScope((scope) => {
        // Use a unique fingerprint to avoid grouping in Sentry so that we
        // don't accidentally miss an alert about a manual bug report
        scope.setFingerprint([uuidv4()]);

        const userEmail = scope.getUser()?.email || `no user`;
        const now = new Date().toISOString();
        const message = `Manual bug report - ${userEmail} - ${now}`;
        Sentry.captureException(new Error(message));
      });
      dialog.showErrorBox(
        `Bug Report Sent`,
        `Thanks for sending. If you haven't already, please use the Chat Support menu option to send us a screenshot and a quick description.`
      );
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
