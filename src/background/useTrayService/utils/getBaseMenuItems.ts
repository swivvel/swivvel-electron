import { MenuItemConstructorOptions } from 'electron';

import { State } from '../../types';
import { isProduction, quitApp } from '../../utils';

export default (state: State): Array<MenuItemConstructorOptions> => {
  const menuItems: Array<MenuItemConstructorOptions> = [];

  if (!isProduction()) {
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
