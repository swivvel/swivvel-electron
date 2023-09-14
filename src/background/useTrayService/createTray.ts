import { Menu, Tray } from 'electron';
import log from 'electron-log';

import { State } from '../types';

import { getTrayQuitMenuItem } from './utils';

/**
 * Add Swivvel to the OS system tray.
 */
export default (state: State, logoTemplatePath: string): Tray => {
  log.info(`Creating tray...`);

  if (state.tray) {
    log.info(`Tray already exists; returning existing tray`);
    return state.tray;
  }

  const tray = new Tray(logoTemplatePath);

  state.tray = tray;

  const contextMenu = Menu.buildFromTemplate([getTrayQuitMenuItem(state)]);

  tray.setContextMenu(contextMenu);

  log.info(`Created tray`);

  return tray;
};
