import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../types';
import { TrayService } from '../useTrayService';
import { getSiteUrl, loadUrl } from '../utils';

import getWindowOpenRequestHandler from './getWindowOpenRequestHandler';
import openCreateGoogleMeetWindow from './openCreateGoogleMeetWindow';
import openHqWindow from './openHqWindow';
import openLogInWindow from './openLogInWindow';
import openSetupWindow from './openSetupWindow';
import openTransparentWindow from './openTransparentWindow';
import { WindowService } from './types';
import { closeBrowserWindow } from './utils';

/**
 * Service for interacting with windows managed by the Swivvel app.
 */
export default (state: State, trayService: TrayService): WindowService => {
  const windowOpenRequestHandler = getWindowOpenRequestHandler({
    onCreateGoogleMeetRequested: (podId) => {
      openCreateGoogleMeetWindow({ podId, state, windowOpenRequestHandler });
    },
    onHqPageRequested: () => {
      openHqWindow({ state, trayService, windowOpenRequestHandler });
    },
    onLogInPageRequested: () => {
      openLogInWindow({ state, trayService, windowOpenRequestHandler });
    },
    onSetupPageRequested: () => {
      openSetupWindow({ state, trayService, windowOpenRequestHandler });
    },
    onSettingsPageRequested: async () => {
      const hqWindow = await openHqWindow({
        state,
        trayService,
        windowOpenRequestHandler,
      });

      await loadUrl(
        `${getSiteUrl()}/?p=/office/<companyId>/settings/users`,
        hqWindow,
        state
      );
    },
  });

  return {
    closeAllWindows: (): void => {
      log.info(`Closing all windows...`);
      Object.keys(state.windows).forEach((windowName) => {
        closeBrowserWindow(state, windowName as keyof State['windows']);
      });
    },
    openLogInWindow: async (): Promise<BrowserWindow> => {
      return openLogInWindow({
        state,
        trayService,
        windowOpenRequestHandler,
      });
    },
    openTransparentWindow: async (): Promise<BrowserWindow> => {
      return openTransparentWindow({ state, windowOpenRequestHandler });
    },
  };
};
