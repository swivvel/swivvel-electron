import { Menu, Tray } from 'electron';
import log from 'electron-log';

import { State } from '../types';
import { getLogoTemplatePath } from '../utils';

import { getTrayQuitMenuItem } from './utils';

/**
 * Add Swivvel to the OS system tray.
 */
export default (state: State): Tray => {
  log.info(`Creating tray...`);

  if (state.tray) {
    log.info(`Tray already exists; returning existing tray`);
    return state.tray;
  }

  const tray = new Tray(getLogoTemplatePath());

  state.tray = tray;

  const contextMenu = Menu.buildFromTemplate([getTrayQuitMenuItem(state)]);

  tray.setContextMenu(contextMenu);

  log.info(`Created tray`);

  return tray;
};
