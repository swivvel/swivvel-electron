import { ipcMain } from 'electron';
import log from 'electron-log';

import { WindowService } from './useWindowService';

export default (windowService: WindowService): void => {
  ipcMain.on(`launchAudioRoomFromSetup`, async (): Promise<void> => {
    log.info(`Received launchAudioRoomFromSetup event`);

    const transparentWindow = await windowService.openTransparentWindow();

    log.info(`Sending launchAudioRoomFromSetup event to transparent window`);
    transparentWindow.webContents.send(`launchAudioRoomFromSetup`);
  });
};
