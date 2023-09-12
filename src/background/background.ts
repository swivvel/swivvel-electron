import path from 'path';

import { app, systemPreferences } from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureDeepLinking from './configureDeepLinking';
import createTransparentWindow from './createTransparentWindow';
import createTray from './createTray';
import { State } from './types';

const PRELOAD_PATH = path.join(__dirname, `..`, `preload.js`);
const LOGO_TEMPLATE_PATH = path.join(__dirname, `..`, `logoTemplate.png`);

const run = async (): Promise<void> => {
  log.info(`App starting...`);

  const state: State = {
    allowQuit: false,
    hqWindow: null,
    setupWindow: null,
    transparentWindow: null,
  };

  configureApp(state);
  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  const transparentWindow = await createTransparentWindow(state, PRELOAD_PATH);
  state.transparentWindow = transparentWindow;

  configureDeepLinking(transparentWindow);
  createTray(LOGO_TEMPLATE_PATH);
};

run();
