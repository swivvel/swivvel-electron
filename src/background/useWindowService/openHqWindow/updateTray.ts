import log from 'electron-log';

import { TrayService } from '../../useTrayService';

import { OpenHqWindow, OpenHqWindowArgs } from './types';

export default (
  openHqWindow: OpenHqWindow,
  openHqWindowArgs: OpenHqWindowArgs,
  trayService: TrayService
): void => {
  trayService.updateTray([
    {
      label: `Open Swivvel`,
      type: `normal`,
      click: async (): Promise<void> => {
        log.info(`Received "Open Swivvel" click from tray menu`);
        openHqWindow(openHqWindowArgs);
      },
    },
  ]);
};
