import path from 'path';

import { app, systemPreferences } from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import createLogInWindow from './createLogInWindow';
import createTransparentWindow from './createTransparentWindow';
import createTray from './createTray';
import getDeepLinkHandler from './getDeepLinkHandler';
import getSiteUrl from './getSiteUrl';
import handleSystemShutdown from './handleSystemShutdown';
import listenForDeepLinks from './listenForDeepLinks';
import pollForIdleTime from './pollForIdleTime';
import { State } from './types';

const PRELOAD_PATH = path.join(__dirname, `..`, `preload.js`);
const LOGO_TEMPLATE_PATH = path.join(__dirname, `..`, `logoTemplate.png`);
const SITE_URL = getSiteUrl();

const run = async (): Promise<void> => {
  log.info(`App starting...`);

  const state: State = {
    allowQuit: false,
    hqWindow: null,
    logInWindow: null,
    setupWindow: null,
    transparentWindow: null,
  };

  configureApp();
  configureAppQuitHandling(state);
  listenForDeepLinks(state, getDeepLinkHandler(state, PRELOAD_PATH, SITE_URL));

  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  const transparentWindow = await createTransparentWindow(
    state,
    PRELOAD_PATH,
    SITE_URL,
    {
      onLogInPageOpened: async () => {
        state.logInWindow = await createLogInWindow(
          state,
          PRELOAD_PATH,
          SITE_URL
        );
      },
    }
  );

  state.transparentWindow = transparentWindow;

  createTray(state, LOGO_TEMPLATE_PATH);
  configureAutoUpdates(state);
  pollForIdleTime(transparentWindow);
  handleSystemShutdown(state);

  log.info(`App started`);
};

run();
