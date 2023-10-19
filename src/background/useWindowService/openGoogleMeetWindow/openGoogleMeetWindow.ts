import { systemPreferences } from 'electron';
import log from 'electron-log';

import { loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getGoogleMeetWindowBrowserOptions from './getGoogleMeetWindowBrowserOptions';
import loadMeetingUrl from './loadMeetingUrl';
import patchGetDisplayMediaOnUrlChange from './patchGetDisplayMediaOnUrlChange';
import pollForJoinAndLeaveEvents from './pollForJoinAndLeaveEvents';
import scrapeAndSaveMeetingUrl from './scrapeAndSaveMeetingUrl';
import triggerMeetingCreatedEvent from './triggerMeetingCreatedEvent';
import { OpenGoogleMeetWindow } from './types';

const openGoogleMeetWindow: OpenGoogleMeetWindow = async (args) => {
  const { podId, meetingUrl, state, windowOpenRequestHandler } = args;

  const options = getGoogleMeetWindowBrowserOptions();

  return openBrowserWindow(
    state,
    `createGoogleMeet`,
    options,
    async (window) => {
      window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

      configureCloseHandler(window, state);

      let meetingUrlToOpen: string | null = meetingUrl;

      if (systemPreferences.askForMediaAccess) {
        log.info(`Asking for camera access`);
        await systemPreferences.askForMediaAccess(`camera`);
      }

      if (!meetingUrlToOpen) {
        await loadUrl(`https://meet.google.com/getalink`, window, state, {
          // Since the Google Meet window is opened from a user action, we must
          // display an error message to inform the user that their action
          // failed. Since the Google Meet window is temporary and the user can
          // retry the action, we can just destroy the window so the user tries
          // again.
          onError: `warnAndDestroyWindow`,
        });

        meetingUrlToOpen = await scrapeAndSaveMeetingUrl(window);

        triggerMeetingCreatedEvent(state, podId, meetingUrlToOpen);
      }

      // We need to remove Swivvel and Electron from the user agent. Otherwise,
      // if the user doesn't have a valid google session, they won't be able to
      // join. This is likely because Google will infer that the user is a bot.
      window.webContents.userAgent = window.webContents.userAgent
        .replace(/Swivvel\/[0-9.]* /, ``)
        .replace(/Electron\/[0-9.]* /, ``);

      await loadMeetingUrl(meetingUrlToOpen, window, state);

      await patchGetDisplayMediaOnUrlChange(window);

      // The get-a-link window will try to resize itself to be small, so we
      // need to create the window with a minimum size equal to the desired
      // size. Once we've loaded the meeting we can lower the minimum size
      // to something reasonable
      window.setMinimumSize(200, 200);

      pollForJoinAndLeaveEvents(window, state);

      return window;
    },
    {
      shouldOpenUrlInBrowser: (url: string) => {
        // Prevent click of rejoin button from opening in new tab
        if (url.startsWith(`https://meet.google.com/`)) {
          log.info(`Detected navigation to Google Meet URL: ${url}`);
          return false;
        }

        return null;
      },
    }
  );
};

export default openGoogleMeetWindow;
