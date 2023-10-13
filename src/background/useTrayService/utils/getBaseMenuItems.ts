import * as Sentry from '@sentry/electron/main';
import { MenuItemConstructorOptions, dialog } from 'electron';
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
      log.info(
        `Detected click on Send Bug Report menu item; sending Sentry alert`
      );
      Sentry.withScope((scope) => {
        const userEmail = scope.getUser()?.email || `no user`;
        const now = new Date().toISOString();
        Sentry.captureException(
          // Use a unique error message to avoid grouping in Sentry so that we
          // don't accidentally miss an alert about a manual bug report
          new Error(`Manual bug report - ${userEmail} - ${now}`)
        );
      });
      dialog.showErrorBox(
        `Bug report submitted`,
        `Oh snap! Sorry about that. We'll look into this. Please send us a brief description and screenshot via your company's Slack Connect channel or email us at support@swivvel.io. We'll get back to you ASAP.`
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
