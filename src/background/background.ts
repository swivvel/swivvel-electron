import { app, BrowserWindow, ipcMain, systemPreferences } from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import getDeepLinkHandler from './getDeepLinkHandler';
import handleSystemShutdown from './handleSystemShutdown';
import listenForDeepLinks from './listenForDeepLinks';
import pollForIdleTime from './pollForIdleTime';
import pollForTestContents from './pollForTestContents';
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
      test: null,
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
    // await systemPreferences.askForMediaAccess(`camera`);
    // await systemPreferences.askForMediaAccess(`screen`);
  }

  const transparentWindow = await windowService.openTransparentWindow();
  const testWindow = await windowService.openTestWindow();

  // const mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true, contextIsolation: false}});

  // mainWindow.loadURL('file://' + __dirname + '/desktop-capture/index.html');

  trayService.createTray();
  configureAutoUpdates(state);
  pollForIdleTime(transparentWindow);
  pollForTestContents(testWindow);
  handleSystemShutdown(state);

  log.info(`App started`);
};

run();
