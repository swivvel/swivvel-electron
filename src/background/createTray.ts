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
      label: `Open Swivvel`,
      type: `normal`,
      click: (): void => {
        if (state.hqWindow && !state.hqWindow.isDestroyed()) {
          state.hqWindow.show();
        }
      },
    },
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
