import { Menu, Tray } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { quitApp } from './utils';

/**
 * Add the Swivvel icon to the OS system tray.
 */
export default (state: State, logoTemplatePath: string): void => {
  log.info(`Creating tray...`);

  const tray = new Tray(logoTemplatePath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Quit`,
      type: `normal`,
      click: (): void => {
        quitApp(state);
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  log.info(`Created tray`);
};
