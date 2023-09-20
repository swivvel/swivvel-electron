import { ipcMain } from 'electron';

import { WindowService } from './useWindowService';

export default (windowService: WindowService): void => {
  ipcMain.on(
    `joinAudioRoomForPod`,
    async (event, podId: string): Promise<void> => {
      const transparentWindow = await windowService.openTransparentWindow();
      transparentWindow.webContents.send(`joinAudioRoomForPod`, podId);
    }
  );
};
