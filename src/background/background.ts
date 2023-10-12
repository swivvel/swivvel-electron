import { app, systemPreferences } from 'electron';
import log from 'electron-log';

import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import configureIpcHandlers from './configureIpcHandlers';
import configureSentry from './configureSentry';
import getDeepLinkHandler from './getDeepLinkHandler';
import handlePowerMonitorStateChanges from './handlePowerMonitorStateChanges';
import listenForDeepLinks from './listenForDeepLinks';
import pollForIdleTime from './pollForIdleTime';
import setUserDataPath from './setUserDataPath';
import { State } from './types';
import useTrayService from './useTrayService';
import useWindowService from './useWindowService';

// Must be called before Sentry is configured
setUserDataPath();

// Call as early as possible to ensure that all exceptions are logged
configureSentry();

const run = async (): Promise<void> => {
  log.info(`App v=${app.getVersion()} starting...`);

  const state: State = {
    allowQuit: false,
    logInFlowCompleted: false,
    tray: null,
    windows: {
      createGoogleMeet: null,
      hq: null,
      logIn: null,
      setup: null,
      transparent: null,
    },
  };

  const trayService = useTrayService(state);
  const windowService = useWindowService(state, trayService);

  configureApp();
  configureAppQuitHandling(state);
  listenForDeepLinks(state, getDeepLinkHandler(state, windowService));

  await app.whenReady();

  if (systemPreferences.askForMediaAccess) {
    await systemPreferences.askForMediaAccess(`microphone`);
  }

  // These functions set up IPC handlers that must be registered before the
  // transparent window loads
  configureIpcHandlers(windowService);
  pollForIdleTime(state);

  await windowService.openTransparentWindow();

  trayService.createTray();
  configureAutoUpdates(state);
  handlePowerMonitorStateChanges(state, windowService);

  log.info(`App started`);
};

run();
