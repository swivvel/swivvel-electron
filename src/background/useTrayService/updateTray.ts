import { Menu, MenuItemConstructorOptions } from 'electron';
import log from 'electron-log';

import { State } from '../types';

import createTray from './createTray';
import { getTrayQuitMenuItem } from './utils';

export default (
  state: State,
  menuItems: Array<MenuItemConstructorOptions>
): void => {
  log.info(`Updating tray...`);

  const trayMenuItemLabels = menuItems.map((item) => {
    return item.label;
  });

  log.info(`New tray menu items: ${trayMenuItemLabels.join(`, `)}`);

  let tray = state.tray;

  if (!tray) {
    tray = createTray(state);
    state.tray = tray;
  }

  const contextMenu = Menu.buildFromTemplate([
    ...menuItems,
    getTrayQuitMenuItem(state),
  ]);

  tray.setContextMenu(contextMenu);

  log.info(`Updated tray`);
};
