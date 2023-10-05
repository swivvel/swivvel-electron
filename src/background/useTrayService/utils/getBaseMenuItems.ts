import { MenuItemConstructorOptions } from 'electron';

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
    label: `Quit Swivvel`,
    type: `normal`,
    click: (): void => {
      quitApp(state);
    },
  });

  return menuItems;
};
