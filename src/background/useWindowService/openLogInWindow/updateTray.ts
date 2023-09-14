import log from 'electron-log';

import { TrayService } from '../../useTrayService';

import { OpenLogInWindow, OpenLogInWindowArgs } from './types';

export default (
  openLogInWindow: OpenLogInWindow,
  openLogInWindowArgs: OpenLogInWindowArgs,
  trayService: TrayService
): void => {
  trayService.updateTray([
    {
      label: `Open Swivvel`,
      type: `normal`,
      click: async (): Promise<void> => {
        log.info(`Received "Open Swivvel" click from tray menu`);
        openLogInWindow(openLogInWindowArgs);
      },
    },
  ]);
};
