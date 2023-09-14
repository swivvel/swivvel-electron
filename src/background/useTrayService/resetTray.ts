import { Menu } from 'electron';
import log from 'electron-log';

import { State } from '../types';

import createTray from './createTray';
import { getTrayQuitMenuItem } from './utils';

export default (state: State): void => {
  log.info(`Resetting tray...`);

  let tray = state.tray;

  if (!tray) {
    tray = createTray(state);
    state.tray = tray;
  }

  const contextMenu = Menu.buildFromTemplate([getTrayQuitMenuItem(state)]);

  tray.setContextMenu(contextMenu);

  log.info(`Reset tray`);
};