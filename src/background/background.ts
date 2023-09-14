import path from 'path';

import { app, ipcMain, systemPreferences } from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import getDeepLinkHandler from './getDeepLinkHandler';
import getSiteUrl from './getSiteUrl';
import handleSystemShutdown from './handleSystemShutdown';
import listenForDeepLinks from './listenForDeepLinks';
import pollForIdleTime from './pollForIdleTime';
import { State } from './types';
import useTrayService from './useTrayService';
import useWindowService from './useWindowService';
import { isProduction } from './utils';

const PRELOAD_PATH = path.join(__dirname, `..`, `preload.js`);
const LOGO_TEMPLATE_PATH = path.join(__dirname, `..`, `logoTemplate.png`);
const SITE_URL = getSiteUrl();

const run = async (): Promise<void> => {
  log.info(`App starting...`);

  const state: State = {
    allowQuit: false,
    tray: null,
    windows: {
      hq: null,
      logIn: null,
      transparent: null,
    },
  };

  const trayService = useTrayService(state, LOGO_TEMPLATE_PATH);

  const windowService = useWindowService(
    state,
    PRELOAD_PATH,
    SITE_URL,
    trayService
  );

  configureApp();
  configureAppQuitHandling(state);
  listenForDeepLinks(state, getDeepLinkHandler(state, windowService));
  ipcMain.handle(`isProduction`, isProduction);

  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  const transparentWindow = await windowService.openTransparentWindow();

  trayService.createTray();
  configureAutoUpdates(state);
  pollForIdleTime(transparentWindow);
  handleSystemShutdown(state);

  log.info(`App started`);
};

run();
