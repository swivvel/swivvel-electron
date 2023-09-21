import { app, ipcMain, systemPreferences } from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import getDeepLinkHandler from './getDeepLinkHandler';
import handleSystemShutdown from './handleSystemShutdown';
import listenForDeepLinks from './listenForDeepLinks';
import pollForIdleTime from './pollForIdleTime';
import { State } from './types';
import useTrayService from './useTrayService';
import useWindowService from './useWindowService';
import { isProduction } from './utils';

const run = async (): Promise<void> => {
  log.info(`App starting...`);

  const state: State = {
    allowQuit: false,
    logInFlowCompleted: false,
    tray: null,
    windows: {
      hq: null,
      logIn: null,
      transparent: null,
    },
  };

  const trayService = useTrayService(state);
  const windowService = useWindowService(state, trayService);

  configureApp();
  configureAppQuitHandling(state);
  listenForDeepLinks(state, getDeepLinkHandler(state, windowService));
  ipcMain.handle(`isProduction`, isProduction);

  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  const transparentWindow = await windowService.openTransparentWindow();

  ipcMain.on(
    `joinAudioRoomForPod`,
    async (event, podId: string): Promise<void> => {
      const window = await windowService.openTransparentWindow();
      window.webContents.send(`joinAudioRoomForPod`, podId);
    }
  );

  trayService.createTray();
  configureAutoUpdates(state);
  pollForIdleTime(transparentWindow);
  handleSystemShutdown(state);

  log.info(`App started`);
};

run();
