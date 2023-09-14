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
export default (
  state: State,
  preloadPath: string,
  siteUrl: string,
  trayService: TrayService
): WindowService => {
  const windowOpenRequestHandler = getWindowOpenRequestHandler(siteUrl, {
    onHqPageRequested: () => {
      openHqWindow({
        preloadPath,
        siteUrl,
        state,
        trayService,
        windowOpenRequestHandler,
      });
    },
    onLogInPageRequested: () => {
      openLogInWindow({
        preloadPath,
        siteUrl,
        state,
        trayService,
        windowOpenRequestHandler,
      });
    },
  });

  return {
    openHqWindow: async (): Promise<BrowserWindow> => {
      return openHqWindow({
        preloadPath,
        siteUrl,
        state,
        trayService,
        windowOpenRequestHandler,
      });
    },
    openLogInWindow: async (): Promise<BrowserWindow> => {
      return openLogInWindow({
        preloadPath,
        siteUrl,
        state,
        trayService,
        windowOpenRequestHandler,
      });
    },
    openTransparentWindow: async (): Promise<BrowserWindow> => {
      return openTransparentWindow({
        preloadPath,
        siteUrl,
        state,
        windowOpenRequestHandler,
      });
    },
  };
};
