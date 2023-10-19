import { TrayService } from '../../useTrayService';
import { Log } from '../utils';

import { OpenHqWindow, OpenHqWindowArgs } from './types';

export default (
  openHqWindow: OpenHqWindow,
  openHqWindowArgs: OpenHqWindowArgs,
  trayService: TrayService,
  log: Log
): void => {
  trayService.updateTray([
    {
      label: `Open Swivvel`,
      type: `normal`,
      click: async (): Promise<void> => {
        log(`Received "Open Swivvel" click from tray menu`);
        openHqWindow({ ...openHqWindowArgs, show: true });
      },
    },
  ]);
};
