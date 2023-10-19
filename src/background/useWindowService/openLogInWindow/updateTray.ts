import { TrayService } from '../../useTrayService';
import { Log } from '../utils';

import { OpenLogInWindow, OpenLogInWindowArgs } from './types';

export default (
  openLogInWindow: OpenLogInWindow,
  openLogInWindowArgs: OpenLogInWindowArgs,
  trayService: TrayService,
  log: Log
): void => {
  trayService.updateTray([
    {
      label: `Open Swivvel`,
      type: `normal`,
      click: async (): Promise<void> => {
        log(`Received "Open Swivvel" click from tray menu`);
        openLogInWindow(openLogInWindowArgs);
      },
    },
  ]);
};
