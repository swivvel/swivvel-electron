import log from 'electron-log';

import { loadUrl } from '../../utils';
import { openBrowserWindow } from '../utils';

import configureCloseHandler from './configureCloseHandler';
import getCreateGoogleMeetWindowBrowserOptions from './getCreateGoogleMeetWindowBrowserOptions';
import patchGetDisplayMedia from './patchGetDisplayMedia';
import scrapeAndSaveMeetingUrl from './scrapeAndSaveMeetingUrl';
import triggerMeetingCreatedEvent from './triggerMeetingCreatedEvent';
import { OpenCreateGoogleMeetWindow } from './types';

const openCreateGoogleMeetWindow: OpenCreateGoogleMeetWindow = async (args) => {
  const { podId, meetingUrl, state, windowOpenRequestHandler } = args;

  const options = getCreateGoogleMeetWindowBrowserOptions();

  return openBrowserWindow(
    state,
    `createGoogleMeet`,
    options,
    async (window) => {
      window.webContents.setWindowOpenHandler(windowOpenRequestHandler);

      configureCloseHandler(window, state);

      let meetingUrlToOpen: string | null = meetingUrl;

      if (!meetingUrlToOpen) {
        await loadUrl(`https://meet.google.com/getalink`, window, state);

        meetingUrlToOpen = await scrapeAndSaveMeetingUrl(window);

        if (podId){
          triggerMeetingCreatedEvent(state, podId, meetingUrlToOpen);
        }
      }

      await loadUrl(
        meetingUrlToOpen,
        window,
        state
      );

      // The get a link window will try to resize itself to be small, so we
      // need to create the window with a minimum size equal to the desired
      // size. Once we've loaded the meeting we can lower the minimum size
      // to something reasonable
      window.setMinimumSize(200, 200);

      await patchGetDisplayMedia(window);

      return window;
    }
  );
};

export default openCreateGoogleMeetWindow;
