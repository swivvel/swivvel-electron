import path from 'path';

import { app, systemPreferences } from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import getDeepLinkHandler from './getDeepLinkHandler';
import getSiteUrl from './getSiteUrl';
import getWindowOpenHandler from './getWindowOpenHandler';
import handleSystemShutdown from './handleSystemShutdown';
import listenForDeepLinks from './listenForDeepLinks';
import pollForIdleTime from './pollForIdleTime';
import { createTray } from './tray';
import { State } from './types';
import {
  getOrCreateHqWindow,
  getOrCreateLogInWindow,
  getOrCreateTransparentWindow,
} from './windows';

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

  const windowOpenHandler = getWindowOpenHandler(SITE_URL, {
    onLogInPageRequested: async () => {
      await getOrCreateLogInWindow(
        state,
        PRELOAD_PATH,
        SITE_URL,
        windowOpenHandler
      );
    },
    onHqPageRequested: async () => {
      await getOrCreateHqWindow(
        state,
        PRELOAD_PATH,
        SITE_URL,
        windowOpenHandler
      );
    },
  });

  const deepLinkHandler = getDeepLinkHandler(
    state,
    PRELOAD_PATH,
    SITE_URL,
    windowOpenHandler
  );

  configureApp();
  configureAppQuitHandling(state);
  listenForDeepLinks(state, deepLinkHandler);

  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  const transparentWindow = await getOrCreateTransparentWindow(
    state,
    PRELOAD_PATH,
    SITE_URL,
    windowOpenHandler
  );

  createTray(state, LOGO_TEMPLATE_PATH);
  configureAutoUpdates(state);
  pollForIdleTime(transparentWindow);
  handleSystemShutdown(state);

  log.info(`App started`);
};

run();
