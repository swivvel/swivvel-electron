import { Menu, Tray } from 'electron';
import log from 'electron-log';

/**
 * Add the Swivvel icon to the OS system tray.
 */
export default (logoTemplatePath: string): void => {
  log.info(`Creating tray...`);

  const tray = new Tray(logoTemplatePath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Quit`,
      type: `normal`,
      click: () => {
        quitApp(hqWindow, notificationsWindow);
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  log.info(`Created tray`);
};
