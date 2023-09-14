import { Menu, Tray } from 'electron';
import log from 'electron-log';

import { State } from '../types';

import getTrayQuitOption from './getTrayQuitOption';

/**
 * Add the Swivvel icon to the OS system tray.
 */
export default (state: State, logoTemplatePath: string): void => {
  log.info(`Creating tray...`);

  const tray = new Tray(logoTemplatePath);

  state.tray = tray;

  const contextMenu = Menu.buildFromTemplate([getTrayQuitOption(state)]);

  tray.setContextMenu(contextMenu);

  log.info(`Created tray`);
};
