import { app, ipcMain } from 'electron';
import log from 'electron-log';

import { WindowService } from './useWindowService';
import { isProduction } from './utils';

export default (windowService: WindowService): void => {
  ipcMain.handle(`getDesktopAppVersion`, () => {
    return app.getVersion();
  });

  ipcMain.handle(`isProduction`, isProduction);

  ipcMain.on(`joinAudioRoomForPod`, async (event, podId): Promise<void> => {
    log.info(`Received joinAudioRoomForPod event, podId=${podId}`);

    const transparentWindow = await windowService.openTransparentWindow();

    log.info(`Sending joinAudioRoomForPod event to transparent window`);
    transparentWindow.webContents.send(`joinAudioRoomForPod`, podId);
  });

  ipcMain.on(`launchAudioRoomFromSetup`, async (): Promise<void> => {
    log.info(`Received launchAudioRoomFromSetup event`);

    const transparentWindow = await windowService.openTransparentWindow();

    log.info(`Sending launchAudioRoomFromSetup event to transparent window`);
    transparentWindow.webContents.send(`launchAudioRoomFromSetup`);
  });
};
