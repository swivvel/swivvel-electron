import { BrowserWindow } from 'electron';

import { State } from '../types';
import { TrayService } from '../useTrayService';

import getWindowOpenRequestHandler from './getWindowOpenRequestHandler';
import openHqWindow from './openHqWindow';
import openLogInWindow from './openLogInWindow';
import openTransparentWindow from './openTransparentWindow';
import { WindowService } from './types';

/**
 * Service for interacting with windows managed by the Swivvel app.
 */
export default (state: State, trayService: TrayService): WindowService => {
  const windowOpenRequestHandler = getWindowOpenRequestHandler({
    onHqPageRequested: () => {
      openHqWindow({ state, trayService, windowOpenRequestHandler });
    },
    onLogInPageRequested: () => {
      openLogInWindow({ state, trayService, windowOpenRequestHandler });
    },
    onSettingsPageRequested: () => {
      // openSettingsWindow({ state, trayService, windowOpenRequestHandler });
    },
  });

  return {
    openHqWindow: async (): Promise<BrowserWindow> => {
      return openHqWindow({ state, trayService, windowOpenRequestHandler });
    },
    openLogInWindow: async (): Promise<BrowserWindow> => {
      return openLogInWindow({ state, trayService, windowOpenRequestHandler });
    },
    openTransparentWindow: async (): Promise<BrowserWindow> => {
      return openTransparentWindow({ state, windowOpenRequestHandler });
    },
  };
};
