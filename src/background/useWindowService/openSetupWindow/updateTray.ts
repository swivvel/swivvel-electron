import { TrayService } from '../../useTrayService';
import { Log } from '../utils';

import { OpenSetupWindow, OpenSetupWindowArgs } from './types';

export default (
  openSetupWindow: OpenSetupWindow,
  openSetupWindowArgs: OpenSetupWindowArgs,
  trayService: TrayService,
  log: Log
): void => {
  trayService.updateTray([
    {
      label: `Open Swivvel`,
      type: `normal`,
      click: async (): Promise<void> => {
        log(`Received "Open Swivvel" click from tray menu`);
        openSetupWindow(openSetupWindowArgs);
      },
    },
  ]);
};
