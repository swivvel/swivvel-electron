import log from 'electron-log';

import { TrayService } from '../../useTrayService';

import { OpenSetupWindow, OpenSetupWindowArgs } from './types';

export default (
  openSetupWindow: OpenSetupWindow,
  openSetupWindowArgs: OpenSetupWindowArgs,
  trayService: TrayService
): void => {
  trayService.updateTray([
    {
      label: `Open Swivvel`,
      type: `normal`,
      click: async (): Promise<void> => {
        log.info(`Received "Open Swivvel" click from tray menu`);
        openSetupWindow(openSetupWindowArgs);
      },
    },
  ]);
};
