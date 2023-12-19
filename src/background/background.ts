import { app } from 'electron';
import log from 'electron-log';

import askForMicrophoneAccess from './askForMicrophoneAccess';
import configureApp from './configureApp';
import configureAppQuitHandling from './configureAppQuitHandling';
import configureAutoUpdates from './configureAutoUpdates';
import configureGlobalKeyboardShortcuts from './configureGlobalKeyboardShortcuts';
import configureIpcHandlers from './configureIpcHandlers';
import configureMousePassThroughHandler from './configureMousePassThroughHandler';
import configureSentry from './configureSentry';
import configureTransparentWindowResizeHandler from './configureTransparentWindowResizeHandler';
import getDeepLinkHandler from './getDeepLinkHandler';
import handlePowerMonitorStateChanges from './handlePowerMonitorStateChanges';
import listenForDeepLinks from './listenForDeepLinks';
import logSystemInfo from './logSystemInfo';
import pollForIdleTime from './pollForIdleTime';
import setUserDataPath from './setUserDataPath';
import { State } from './types';
import useLogInService from './useLogInService';
import useTrayService from './useTrayService';
import useWindowService from './useWindowService';

// Call as early as possible since this changes the directory path where
// Electron stores everything related to the app
setUserDataPath();

const run = async (): Promise<void> => {
  log.info(`App v=${app.getVersion()} starting...`);
  logSystemInfo();

  // Call at the beginning so that all exceptions are captured
  configureSentry();

  const state: State = {
    allowQuit: false,
    loggedInUser: null,
    tray: null,
    trayContextMenu: null,
    windows: {
      googleMeet: null,
      hq: null,
      logIn: null,
      setup: null,
      transparent: null,
    },
  };

  const trayService = useTrayService(state);
  const windowService = useWindowService(state, trayService);
  const logInService = useLogInService(windowService);

  configureApp();
  configureAppQuitHandling(state);
  listenForDeepLinks(state, getDeepLinkHandler(logInService));

  await app.whenReady();
  await askForMicrophoneAccess();

  // These functions must be called before the transparent window opens because
  // they initialize listeners that must be registered
  configureIpcHandlers(windowService, logInService, state);
  pollForIdleTime(state);
  configureMousePassThroughHandler(state);
  configureTransparentWindowResizeHandler(state);

  await windowService.openTransparentWindow();

  trayService.createTray();
  handlePowerMonitorStateChanges(state, windowService);
  configureGlobalKeyboardShortcuts(state);
  await configureAutoUpdates(state);

  log.info(`App started`);
};

run();
