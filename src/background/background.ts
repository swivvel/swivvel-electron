import path from 'path';

import { app, systemPreferences } from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import configureDeepLinking from './configureDeepLinking';
import createTransparentWindow from './createTransparentWindow';
import createTray from './createTray';
import pollForIdleTime from './pollForIdleTime';
import { State } from './types';

const PRELOAD_PATH = path.join(__dirname, `..`, `preload.js`);
const LOGO_TEMPLATE_PATH = path.join(__dirname, `..`, `logoTemplate.png`);

const run = async (): Promise<void> => {
  log.info(`App starting 2...`);

  const state: State = {
    allowQuit: false,
    hqWindow: null,
    setupWindow: null,
    transparentWindow: null,
  };

  configureApp();
  await configureDeepLinking();
  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  const transparentWindow = await createTransparentWindow(state, PRELOAD_PATH);
  state.transparentWindow = transparentWindow;

  configureAppQuitHandling(state);
  createTray(state, LOGO_TEMPLATE_PATH);
  configureAutoUpdates(state);
  pollForIdleTime(transparentWindow);

  log.info(`App started`);
};

run();
