import { BrowserWindow } from 'electron';
import log from 'electron-log';

import { State } from '../types';
import { TrayService } from '../useTrayService';

import getWindowOpenRequestHandler from './getWindowOpenRequestHandler';
import openGoogleMeetWindow from './openGoogleMeetWindow';
import openHqWindow from './openHqWindow';
import openScreenShareWindow from './openScreenShareWindow';
import openSettingsPageInHqWindow from './openSettingsPageInHqWindow';
import openSetupWindow from './openSetupWindow';
import openTransparentWindow from './openTransparentWindow';
import { WindowService } from './types';
import { closeBrowserWindow } from './utils';

/**
 * Service for interacting with windows managed by the Swivvel app.
 */
export default (state: State, trayService: TrayService): WindowService => {
  const windowOpenRequestHandler = getWindowOpenRequestHandler({
    onGoogleMeetRequested: (podId, meetingUrl) => {
      openGoogleMeetWindow({
        podId,
        meetingUrl,
        state,
        windowOpenRequestHandler,
      });
    },
    onHqRequested: () => {
      openHqWindow({
        show: false,
        state,
        trayService,
        windowOpenRequestHandler,
      });
    },
    onScreenShareRequested: (companyId, employeeId, employeeName, podId) => {
      openScreenShareWindow({
        companyId,
        employeeId,
        employeeName,
        podId,
        state,
        windowOpenRequestHandler,
      });
    },
    onSetupRequested: () => {
      openSetupWindow({ state, trayService, windowOpenRequestHandler });
    },
    onSettingsRequested: async () => {
      openSettingsPageInHqWindow({
        state,
        trayService,
        windowOpenRequestHandler,
      });
    },
  });

  return {
    closeAllWindows: (): void => {
      log.info(`Closing all windows...`);
      Object.keys(state.windows).forEach((windowName) => {
        closeBrowserWindow(state, windowName as keyof State['windows']);
      });
    },
    openTransparentWindow: async (): Promise<BrowserWindow> => {
      return openTransparentWindow({ state, windowOpenRequestHandler });
    },
  };
};
