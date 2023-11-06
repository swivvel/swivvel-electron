import { dialog, MenuItemConstructorOptions } from 'electron';
import log from 'electron-log';

import { State } from '../../types';
import { quitApp, triggerSentryError } from '../../utils';

export default (state: State): Array<MenuItemConstructorOptions> => {
  const menuItems: Array<MenuItemConstructorOptions> = [];

  // Normally we don't show debugging tools to end users, but it has been
  // difficult to debug some issues that have been reported, so we're showing
  // the dev tools menu item to everyone for now. This will allow us to have
  // users open the dev tools on a screen share so that we have more visibility
  // into what might be going wrong. Eventually we can hide this functionality
  // a bit better, e.g. via a global keyboard shortcut, but showing it in the
  // menu is simply the easiest thing to do right now.
  menuItems.push({
    label: `Dev Tools`,
    type: `normal`,
    click: (): void => {
      state.windows.transparent?.webContents.openDevTools({
        mode: `undocked`,
      });
    },
  });

  menuItems.push({
    label: `Send Bug Report`,
    type: `normal`,
    click: (): void => {
      log.info(
        `Detected click on Send Bug Report menu item; sending Sentry alert`
      );
      triggerSentryError(`Manual bug report`);
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
