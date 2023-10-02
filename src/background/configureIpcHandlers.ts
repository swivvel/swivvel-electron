import { app, desktopCapturer, ipcMain } from 'electron';
import log from 'electron-log';

import { WindowService } from './useWindowService';
import { isProduction } from './utils';

export default (windowService: WindowService): void => {

  console.log(`CONFIUGRING IPC HANDLERS`)

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

  ipcMain.handle(`getDesktopSources`, async (): Promise<Record<any, any>> => {
    log.info(`Received getDesktopSources event`);

    log.info(`Sending sharable sources`);
    return desktopCapturer
      .getSources({
        types: [`window`, `screen`],
      })
      .then((sources) =>
        {return sources.map((source) => {return {
          id: source.id,
          name: source.name,
          appIconUrl: source?.appIcon?.toDataURL(),
          thumbnailUrl: source?.thumbnail
            ?.resize({ height: 160 })
            .toDataURL(),
        }})}
      )
  });
};
